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

  const [summaryData, statsData, levelData, hoursData, leetifyData, faceitPlayerData] = await Promise.all([
    safeGet(buildUrl(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`, { key: KEY, steamids: steamId })),
    safeGet(buildUrl(`${STEAM_API}/ISteamUserStats/GetUserStatsForGame/v2/`, { key: KEY, steamid: steamId, appid: CS2_APP_ID })),
    safeGet(buildUrl(`${STEAM_API}/IPlayerService/GetSteamLevel/v1/`, { key: KEY, steamid: steamId })),
    safeGet(buildUrl(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/`, { key: KEY, steamid: steamId, include_played_free_games: 1, 'appids_filter[0]': CS2_APP_ID })),
    safeGet(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`, leetifyHeaders),
    env.FACEIT_API_KEY
      ? safeGet(`https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${steamId}`, faceitHeaders)
      : Promise.resolve(null),
  ]);

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
  const playtimeMinutes = hoursData?.response?.games?.[0]?.playtime_forever || 0;
  const hoursPlayed = Math.round(playtimeMinutes / 60);

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

  const weaponKills = WEAPONS.map((w) => ({
    name: w.toUpperCase().replace('_SILENCER', '').replace('CZ75A', 'CZ75'),
    kills: stat(`total_kills_${w}`),
  }))
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
  const allMatches = leetifyData?.recent_matches || [];
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
    faceit,
    fragged,
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
