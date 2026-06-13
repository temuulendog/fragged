const STEAM_API = 'https://api.steampowered.com';
const CS2_APP_ID = 730;

const WEAPONS = [
  'ak47', 'awp', 'm4a1', 'm4a4', 'deagle', 'usp_silencer', 'glock',
  'famas', 'galil', 'aug', 'sg556', 'ssg08', 'mp9', 'mac10', 'p90',
  'mp5sd', 'ump45', 'bizon', 'mp7', 'negev', 'm249', 'nova', 'xm1014',
  'sawedoff', 'mag7', 'knife', 'tec9', 'fiveseven', 'p250', 'cz75a',
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });

const safeGet = async (url, headers = {}) => {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`safeGet ${url} → ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`safeGet failed: ${url}`, e.message);
    return null;
  }
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v) => {
  if (v == null) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

const buildUrl = (base, params) => {
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
};

// CS2 friend code (e.g. AANR4-QQQJ) — a deterministic encoding of the steamID64,
// no API/scraping needed. Ported from the csgo-friendcode algorithm; MD5 via the
// Workers runtime crypto.subtle. Verified against AANR4-QQQJ for 76561198874291712.
const FC_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const fcToLE = (big) => {
  const r = new Uint8Array(8);
  for (let i = 0; big > 0n && i < 8; i++) { r[i] = Number(big % 256n); big /= 256n; }
  return r;
};
const fcFromLE = (bytes) => {
  let result = 0n, base = 1n;
  for (const b of bytes) { result += base * BigInt(b); base *= 256n; }
  return result;
};
const fcSwap = (big) => fcFromLE([...fcToLE(big)].reverse());
async function fcHashSteamId(id) {
  const strange = (id & 0xFFFFFFFFn) | 0x4353474F00000000n;
  const digest = new Uint8Array(await crypto.subtle.digest('MD5', fcToLE(strange)));
  return fcFromLE(digest.slice(0, 4));
}
async function makeFriendCode(steamId64) {
  try {
    let steamid = BigInt(steamId64);
    const h = await fcHashSteamId(steamid);
    let r = 0n;
    for (let i = 0; i < 8; i++) {
      const idNibble = steamid & 0xFn;
      steamid >>= 4n;
      const hashNibble = (h >> BigInt(i)) & 1n;
      const a = (r << 4n) | idNibble;
      r = ((r >> 28n) << 32n) | a;
      r = ((r >> 31n) << 32n) | ((a << 1n) | hashNibble);
    }
    let input = fcSwap(r), res = '';
    for (let i = 0; i < 13; i++) {
      if (i === 4 || i === 9) res += '-';
      res += FC_ALPHABET[Number(input & 0x1Fn)];
      input >>= 5n;
    }
    return res.slice(0, 4) === 'AAAA' ? res.slice(5) : res;
  } catch {
    return null;
  }
}

// Backup performance numbers — used ONLY when a player has no Leetify profile.
// Scrapes csst.at (third-party CS2 aggregator) for the headline stats and returns
// them in a plain shape. NOT presented as Leetify data on the frontend (see
// BackupCard — no Leetify logo/badge/link). Returns null on any failure or timeout
// so the box simply doesn't render. The HTMX headers tell csst.at which player's
// fragment we want; without them it returns arbitrary queued data.
async function fetchBackupData(steamId) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://csst.at/${steamId}/leetify-extra`, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        Referer: `https://csst.at/profile/${steamId}`,
        'HX-Request': 'true',
        'HX-Current-URL': `https://csst.at/profile/${steamId}`,
        'HX-Target': `section-leetify-${steamId}`,
        'HX-Trigger': `section-leetify-${steamId}`,
        Accept: 'text/html,*/*',
      },
    }).finally(() => clearTimeout(timer));
    if (!res.ok) return null;
    const html = await res.text();

    const grab = (id) => {
      const m = html.match(new RegExp(`id="${id}"[^>]*>[\\s\\S]*?([+\\-]?[\\d]+\\.?[\\d]*)\\s*<`));
      return m ? parseFloat(m[1]) : null;
    };

    const aim = grab(`leetify-aim-${steamId}`);
    if (aim == null) return null; // wrong player's data or empty response

    const opening = grab(`leetify-opening-${steamId}`);
    const clutch = grab(`leetify-clutch-${steamId}`);
    const ratingTip = html.match(new RegExp(`id="leetify-rating-${steamId}"[^>]*data-tip="([^"]+)"`));
    const ctMatch = ratingTip ? ratingTip[1].match(/CT:\s*([+\-]?[\d.]+)/) : null;
    // \bT: so we don't match the "T:" inside "CT:" (tooltip is "CT: x / T: y").
    const tMatch = ratingTip ? ratingTip[1].match(/\bT:\s*([+\-]?[\d.]+)/) : null;
    const winrateMatch = html.match(new RegExp(`id="leetify-winrate-${steamId}"[\\s\\S]*?data-tip="All-time"[\\s\\S]*?<span[^>]*>\\s*(\\d+)%`));
    const matchesMatch = html.match(new RegExp(`id="leetify-games-${steamId}"[^>]*>[\\s]*([\\d]+)[\\s]*<`));

    return {
      aim: Math.round(aim),
      utility: Math.round(grab(`leetify-utility-${steamId}`) ?? 0),
      positioning: Math.round(grab(`leetify-positioning-${steamId}`) ?? 0),
      leetifyRating: grab(`leetify-rating-${steamId}`),
      opening: opening != null ? opening / 100 : null,
      clutch: clutch != null ? clutch / 100 : null,
      ctRating: ctMatch ? parseFloat(ctMatch[1]) / 100 : null,
      tRating: tMatch ? parseFloat(tMatch[1]) / 100 : null,
      winrate: winrateMatch ? parseInt(winrateMatch[1]) / 100 : null,
      totalMatches: matchesMatch ? parseInt(matchesMatch[1]) : null,
    };
  } catch {
    return null;
  }
}

// Per-season Premier ranks from csstats.gg — the only source for past seasons and
// season peaks (Steam/Leetify don't expose them). Each season renders as an
// <img alt="Premier - Season N"> followed by a <div class="rank"> (end-of-season)
// and <div class="best"> (season peak), each holding a cs2rating span whose number
// is split as 24<small>,763</small>. Returns [{season,end,peak}] sorted, or null.
async function fetchPremierSeasons(steamId) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://csstats.gg/player/${steamId}`, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    }).finally(() => clearTimeout(timer));
    if (!res.ok) return null;
    const html = await res.text();

    const ratingFrom = (segment) => {
      if (!segment) return null;
      const m = segment.match(/cs2rating[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/);
      if (!m) return null;
      const digits = m[1].replace(/\D/g, '');
      return digits ? parseInt(digits, 10) : null;
    };

    // The bare alt="Premier" tile is Season 1; "Premier - Season N" gives the rest.
    const markers = [...html.matchAll(/alt="Premier(?: - Season (\d))?"/g)];
    if (!markers.length) return null;

    const seasons = [];
    for (let i = 0; i < markers.length; i++) {
      const season = markers[i][1] ? parseInt(markers[i][1], 10) : 1;
      const start = markers[i].index;
      const end = i + 1 < markers.length ? markers[i + 1].index : start + 1400;
      const block = html.slice(start, end);
      const rankSeg = block.match(/class="rank">([\s\S]*?)<\/div>\s*<\/div>/);
      const bestSeg = block.match(/class="best">([\s\S]*?)<\/div>\s*<\/div>/);
      const endRank = ratingFrom(rankSeg && rankSeg[1]);
      const peak = ratingFrom(bestSeg && bestSeg[1]);
      if (endRank == null && peak == null) continue;
      seasons.push({ season, end: endRank, peak });
    }
    if (!seasons.length) return null;
    seasons.sort((a, b) => a.season - b.season);
    return seasons;
  } catch {
    return null;
  }
}

// Premier seasons with a D1-backed cache. Past seasons never change, so we only
// re-scrape csstats.gg when the data is "stale":
//   - Leetify users: stale only if a newer Premier match exists than when we last
//     scraped (free signal — Leetify is already fetched; zero extra requests).
//   - Everyone else: time-based TTL fallback.
// Falls back to a live scrape (no cache) if no D1 binding is configured.
const PREMIER_TTL_MS = 2 * 60 * 60 * 1000; // 2h — only used when there's no match feed

// Create the cache table on first use, so no manual schema push is needed (the deploy
// token can't run remote `d1 execute`). schema.sql mirrors this DDL. Memoized per isolate.
let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db
    .prepare('CREATE TABLE IF NOT EXISTS premier_cache (steamid TEXT PRIMARY KEY, seasons_json TEXT NOT NULL, last_match_seen INTEGER, updated_at INTEGER NOT NULL)')
    .run();
  schemaReady = true;
}

async function getPremierSeasons(steamId, latestMatchMs, db) {
  if (!db) return await fetchPremierSeasons(steamId);

  try {
    await ensureSchema(db);
  } catch (e) {
    console.error('D1 schema init failed:', e.message);
    return await fetchPremierSeasons(steamId);
  }

  let row = null;
  try {
    row = await db
      .prepare('SELECT seasons_json, last_match_seen, updated_at FROM premier_cache WHERE steamid = ?')
      .bind(steamId)
      .first();
  } catch (e) {
    console.error('D1 read failed:', e.message);
    return await fetchPremierSeasons(steamId); // degrade to live scrape
  }

  const now = Date.now();
  let stale;
  if (!row) stale = true;
  else if (latestMatchMs != null) stale = latestMatchMs > (row.last_match_seen ?? 0);
  else stale = now - (row.updated_at ?? 0) > PREMIER_TTL_MS;

  if (!stale) {
    try { return JSON.parse(row.seasons_json); } catch { /* fall through to scrape */ }
  }

  const fresh = await fetchPremierSeasons(steamId);
  if (!fresh) {
    // Scrape failed/blocked → serve the last good copy if we have one.
    if (row) { try { return JSON.parse(row.seasons_json); } catch { return null; } }
    return null;
  }
  try {
    await db
      .prepare(
        'INSERT INTO premier_cache (steamid, seasons_json, last_match_seen, updated_at) VALUES (?, ?, ?, ?) ' +
        'ON CONFLICT(steamid) DO UPDATE SET seasons_json=excluded.seasons_json, last_match_seen=excluded.last_match_seen, updated_at=excluded.updated_at'
      )
      .bind(steamId, JSON.stringify(fresh), latestMatchMs, now)
      .run();
  } catch (e) {
    console.error('D1 write failed:', e.message);
  }
  return fresh;
}

async function handlePlayer(steamId, type, env) {
  if (!steamId || steamId.length > 64 || /[^a-zA-Z0-9_-]/.test(steamId)) {
    return json({ error: 'Invalid Steam ID or URL.' }, 400);
  }

  const KEY = env.STEAM_API_KEY;

  if (type === 'vanity') {
    const vanityData = await safeGet(
      buildUrl(`${STEAM_API}/ISteamUser/ResolveVanityURL/v1/`, { key: KEY, vanityurl: steamId })
    );
    if (vanityData?.response?.success !== 1) {
      return json({ error: 'Could not find a Steam account with that URL.' }, 404);
    }
    steamId = vanityData.response.steamid;
  }

  const leetifyHeaders = env.LEETIFY_API_KEY ? { _leetify_key: env.LEETIFY_API_KEY } : {};
  const faceitHeaders = env.FACEIT_API_KEY ? { Authorization: `Bearer ${env.FACEIT_API_KEY}` } : {};

  const [summaryData, statsData, levelData, hoursData, leetifyData, faceitPlayerData, inventoryData] = await Promise.all([
    safeGet(buildUrl(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`, { key: KEY, steamids: steamId })),
    safeGet(buildUrl(`${STEAM_API}/ISteamUserStats/GetUserStatsForGame/v2/`, { key: KEY, steamid: steamId, appid: CS2_APP_ID })),
    safeGet(buildUrl(`${STEAM_API}/IPlayerService/GetSteamLevel/v1/`, { key: KEY, steamid: steamId })),
    safeGet(buildUrl(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/`, { key: KEY, steamid: steamId, include_played_free_games: 1, 'appids_filter[0]': CS2_APP_ID })),
    safeGet(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`, leetifyHeaders),
    env.FACEIT_API_KEY
      ? safeGet(`https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${steamId}`, faceitHeaders)
      : Promise.resolve(null),
    // Public CS2 inventory — used only for the medals/coins (collectibles). Best-effort:
    // Steam rate-limits this from datacenter IPs, so it may return null in production.
    safeGet(`https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=2000`, { 'User-Agent': 'Mozilla/5.0' }),
  ]);

  // Medals/coins from the inventory collectibles (icons hosted by Steam's CDN).
  const medals = [];
  const seenMedals = new Set();
  for (const x of inventoryData?.descriptions || []) {
    const isCollectible = (x.type || '').includes('Collectible') ||
      (x.tags || []).some((t) => t.category === 'Type' && /collectible/i.test(t.internal_name || ''));
    if (!isCollectible || !x.icon_url) continue;
    const name = x.name || x.market_name || 'Medal';
    if (seenMedals.has(name)) continue;
    seenMedals.add(name);
    medals.push({ name, icon: `https://community.cloudflare.steamstatic.com/economy/image/${x.icon_url}` });
  }

  const faceitPlayerId = faceitPlayerData?.player_id;
  const faceitStatsData = faceitPlayerId
    ? await safeGet(`https://open.faceit.com/data/v4/players/${faceitPlayerId}/stats/cs2`, faceitHeaders)
    : null;

  const profile = summaryData?.response?.players?.[0];
  if (!profile) return json({ error: 'Player not found.' }, 404);

  const statsAvailable = !!statsData?.playerstats?.stats;

  // If profile itself is private (communityvisibilitystate !== 3) AND we got nothing useful
  // from Leetify or Faceit either, fail with the classic "set profile public" error.
  // Otherwise, render whatever data we can (Leetify + Faceit can carry the experience).
  const profileIsPrivate = profile.communityvisibilitystate !== 3;
  if (profileIsPrivate && !leetifyData && !faceitPlayerData) {
    return json({ error: 'Profile is private. Coward.' }, 403);
  }

  const steamLevel = levelData?.response?.player_level || 0;
  const ownedGame = hoursData?.response?.games?.[0];
  const playtimeMinutes = ownedGame?.playtime_forever || 0;
  const hoursPlayed = Math.round(playtimeMinutes / 60);
  const hours2Weeks = Math.round((ownedGame?.playtime_2weeks || 0) / 60);
  const vanityMatch = profile.profileurl?.match(/\/id\/([^/]+)/);
  const vanity = vanityMatch ? decodeURIComponent(vanityMatch[1]) : null;
  const friendCode = await makeFriendCode(steamId);

  const rawStats = statsAvailable ? statsData.playerstats.stats : [];
  const stat = (name) => rawStats.find((s) => s.name === name)?.value || 0;

  const totalKills = stat('total_kills');
  const totalDeaths = stat('total_deaths');
  const totalKillsHeadshot = stat('total_kills_headshot');
  const matchesPlayed = stat('total_matches_played');
  const matchesWon = stat('total_matches_won');
  const shotsFired = stat('total_shots_fired');
  const shotsHit = stat('total_shots_hit');
  const timePlayed = stat('total_time_played');

  const weaponKills = WEAPONS.map((w) => {
    const shots = stat(`total_shots_${w}`);
    const hits = stat(`total_hits_${w}`);
    return {
      key: w,
      name: w.toUpperCase().replace('_SILENCER', '').replace('CZ75A', 'CZ75'),
      kills: stat(`total_kills_${w}`),
      accuracy: shots > 0 ? Math.round((hits / shots) * 100) : null,
    };
  })
    .filter((w) => w.kills > 0)
    .sort((a, b) => b.kills - a.kills);

  const favoriteWeapon = weaponKills[0]?.name || 'KNIFE';
  const favoriteWeaponKills = weaponKills[0]?.kills || 0;
  const fallbackHours = Math.round(timePlayed / 3600);

  const sniperKills = stat('total_kills_awp') + stat('total_kills_ssg08');
  const rifleKills =
    stat('total_kills_ak47') + stat('total_kills_m4a1') + stat('total_kills_aug') +
    stat('total_kills_sg556') + stat('total_kills_galilar') + stat('total_kills_famas');
  const pistolKills =
    stat('total_kills_glock') + stat('total_kills_hkp2000') + stat('total_kills_usp_silencer') +
    stat('total_kills_p250') + stat('total_kills_fiveseven') + stat('total_kills_tec9') +
    stat('total_kills_deagle') + stat('total_kills_cz75a') + stat('total_kills_elite') +
    stat('total_kills_revolver');
  const smgKills =
    stat('total_kills_bizon') + stat('total_kills_mac10') + stat('total_kills_mp5sd') +
    stat('total_kills_mp7') + stat('total_kills_mp9') + stat('total_kills_p90') + stat('total_kills_ump45');
  const affinityTotal = sniperKills + rifleKills + pistolKills + smgKills;
  const affinity = affinityTotal > 0 ? {
    sniper: Math.round((sniperKills / affinityTotal) * 100),
    rifle: Math.round((rifleKills / affinityTotal) * 100),
    pistol: Math.round((pistolKills / affinityTotal) * 100),
    smg: Math.round((smgKills / affinityTotal) * 100),
  } : null;

  const rating = leetifyData?.rating || null;

  // No Leetify profile → fetch backup numbers from csst.at. Skipped entirely
  // (no request at all) when the player already has a Leetify rating.
  const backupData = !rating ? await fetchBackupData(steamId) : null;

  const allMatches = leetifyData?.recent_matches || [];

  // Premier seasons (csstats.gg, D1-cached). The latest Premier-match timestamp from
  // Leetify is the cache-invalidation signal — if it hasn't advanced, the rank can't
  // have changed, so we skip the scrape entirely.
  const latestPremierMatchMs = allMatches
    .filter((m) => m.rank_type === 11 && m.finished_at)
    .reduce((max, m) => Math.max(max, Date.parse(m.finished_at) || 0), 0) || null;
  const premierSeasons = await getPremierSeasons(steamId, latestPremierMatchMs, env.DB);
  const premierMatches = allMatches
    .filter((m) => m.rank_type === 11 || m.rank_type === 12)
    .slice(0, 99);

  let faceit = null;
  if (faceitPlayerData?.games?.cs2) {
    const cs2 = faceitPlayerData.games.cs2;
    const lt = faceitStatsData?.lifetime || {};
    const segs = (faceitStatsData?.segments || []).filter((s) => s.type === 'Map');
    const bestMap = segs
      .filter((s) => num(s.stats?.Matches) >= 10)
      .sort((a, b) => num(b.stats?.['Win Rate %']) - num(a.stats?.['Win Rate %']))[0] || null;
    const worstMap = segs
      .filter((s) => num(s.stats?.Matches) >= 10)
      .sort((a, b) => num(a.stats?.['Win Rate %']) - num(b.stats?.['Win Rate %']))[0] || null;
    faceit = {
      nickname: faceitPlayerData.nickname,
      country: faceitPlayerData.country,
      region: cs2.region,
      level: cs2.skill_level,
      elo: cs2.faceit_elo,
      playerId: faceitPlayerData.player_id,
      kdAvg: num(lt['Average K/D Ratio']),
      hsAvg: num(lt['Average Headshots %']),
      adr: num(lt.ADR),
      winRate: num(lt['Win Rate %']),
      totalMatches: num(lt['Total Matches']) || num(lt.Matches),
      currentStreak: num(lt['Current Win Streak']),
      longestStreak: num(lt['Longest Win Streak']),
      entrySuccessRate: num(lt['Entry Success Rate']),
      utilDmgPerRound: num(lt['Utility Damage per Round']),
      flashSuccessRate: num(lt['Flash Success Rate']),
      sniperKillRate: num(lt['Sniper Kill Rate']),
      clutch1v1: num(lt['1v1 Win Rate']),
      clutch1v2: num(lt['1v2 Win Rate']),
      recentResults: lt['Recent Results'] || null,
      bestMap: bestMap ? { name: bestMap.label, winRate: num(bestMap.stats?.['Win Rate %']), matches: num(bestMap.stats?.Matches) } : null,
      worstMap: worstMap ? { name: worstMap.label, winRate: num(worstMap.stats?.['Win Rate %']), matches: num(worstMap.stats?.Matches) } : null,
    };
  }

  const hasLeetifyRating = !!rating;
  let fragged = null;
  // Don't compute FRAGGED Aim when Steam stats are unavailable — every Steam-derived input would be 0
  // and the score would be misleadingly low.
  if (!hasLeetifyRating && statsAvailable) {
    const hsPercent = totalKills > 0 ? (totalKillsHeadshot / totalKills) * 100 : 0;
    const accuracy = shotsFired > 0 ? (shotsHit / shotsFired) * 100 : 0;
    const kd = totalDeaths > 0 ? totalKills / totalDeaths : 0;

    const hsScore = clamp(((hsPercent - 25) / 35) * 100, 0, 100);
    const accScore = clamp(((accuracy - 12) / 13) * 100, 0, 100);
    const kdScore = clamp(((kd - 0.6) / 0.9) * 100, 0, 100);

    let aim, confidence;
    if (faceit && faceit.kdAvg != null && faceit.adr != null) {
      const fHs = clamp(((faceit.hsAvg - 30) / 30) * 100, 0, 100);
      const fKd = clamp(((faceit.kdAvg - 0.7) / 0.8) * 100, 0, 100);
      const fAdr = clamp(((faceit.adr - 50) / 50) * 100, 0, 100);
      aim = Math.round(hsScore * 0.10 + accScore * 0.10 + kdScore * 0.10 + fHs * 0.20 + fKd * 0.25 + fAdr * 0.25);
      confidence = 'faceit';
    } else {
      aim = Math.round(hsScore * 0.40 + accScore * 0.30 + kdScore * 0.30);
      confidence = 'steam';
    }
    fragged = { aim, confidence };
  }

  return json({
    name: profile.personaname,
    avatarUrl: profile.avatarmedium,
    level: steamLevel,
    steamId,
    statsAvailable,
    stats: {
      totalKills,
      totalDeaths,
      totalKillsHeadshot,
      matchesWon,
      matchesPlayed,
      hoursPlayed: hoursPlayed || fallbackHours,
      shotsFired,
      shotsHit,
      favoriteWeapon,
      favoriteWeaponKills,
    },
    affinity,
    weapons: weaponKills,
    medals,
    faceit,
    fragged,
    // Steam profile box. Legit Web-API + computed fields are filled here;
    // commendations and inventoryValue are scrape slots (not in the Web API).
    steam: {
      steamId64: steamId,
      vanity,
      friendCode,
      registered: profile.timecreated ?? null,
      playtimeTotal: hoursPlayed || fallbackHours,
      playtime2Weeks: hours2Weeks,
      // Scrape slots — game-coordinator data, not exposed by the Steam Web API:
      commendations: null,   // { friendly, leader, teacher }
      inventoryValue: null,  // priced CS2 inventory, USD
      xpLevel: null,         // CS2 profile XP rank (e.g. 362) — not the community level
    },
    leetify: rating
      ? {
          aim: rating.aim ?? null,
          positioning: rating.positioning ?? null,
          utility: rating.utility ?? null,
          clutch: rating.clutch ?? null,
          opening: rating.opening ?? null,
          ctRating: rating.ct_leetify ?? null,
          tRating: rating.t_leetify ?? null,
          reactionTime: leetifyData.stats?.reaction_time_ms ?? null,
          sprayAccuracy: leetifyData.stats?.spray_accuracy ?? null,
          preaim: leetifyData.stats?.preaim ?? null,
          premier: leetifyData.ranks?.premier ?? null,
          leetifyRating: leetifyData.ranks?.leetify ?? null,
          winrate: leetifyData.winrate ?? null,
          totalMatches: leetifyData.total_matches ?? null,
          firstMatch: leetifyData.first_match_date ?? null,
          recentMatches: premierMatches,
          counterStrafing: leetifyData.stats?.counter_strafing_good_shots_ratio ?? null,
          ctOpeningAggression: leetifyData.stats?.ct_opening_aggression_success_rate ?? null,
          tOpeningAggression: leetifyData.stats?.t_opening_aggression_success_rate ?? null,
          ctOpeningDuel: leetifyData.stats?.ct_opening_duel_success_percentage ?? null,
          tOpeningDuel: leetifyData.stats?.t_opening_duel_success_percentage ?? null,
          flashThrown: leetifyData.stats?.flashbang_thrown ?? null,
          flashHitFoePerFlash: leetifyData.stats?.flashbang_hit_foe_per_flashbang ?? null,
          flashHitFoeDuration: leetifyData.stats?.flashbang_hit_foe_avg_duration ?? null,
          flashHitFriendPerFlash: leetifyData.stats?.flashbang_hit_friend_per_flashbang ?? null,
          flashLeadToKill: leetifyData.stats?.flashbang_leading_to_kill ?? null,
          heFoesDmg: leetifyData.stats?.he_foes_damage_avg ?? null,
          heFriendsDmg: leetifyData.stats?.he_friends_damage_avg ?? null,
          tradedDeathsSuccess: leetifyData.stats?.traded_deaths_success_percentage ?? null,
          tradeKillOpps: leetifyData.stats?.trade_kill_opportunities_per_round ?? null,
          tradeKillsSuccess: leetifyData.stats?.trade_kills_success_percentage ?? null,
          utilityOnDeath: leetifyData.stats?.utility_on_death_avg ?? null,
        }
      : null,
    backup_data: backupData,
    premierSeasons,
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/api\/player\/([^/]+)$/);

    if (match) {
      try {
        const steamId = decodeURIComponent(match[1]);
        const type = url.searchParams.get('type');
        return await handlePlayer(steamId, type, env);
      } catch (err) {
        console.error('ERROR:', err.message);
        return json({ error: 'Steam said no.' }, 500);
      }
    }

    return json({ error: 'Not found.' }, 404);
  },
};
