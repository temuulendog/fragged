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

const safeGet = async (url) => {
  try {
    const res = await fetch(url);
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

  const [summaryData, statsData, levelData, hoursData, leetifyData] = await Promise.all([
    safeGet(buildUrl(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`, { key: KEY, steamids: steamId })),
    safeGet(buildUrl(`${STEAM_API}/ISteamUserStats/GetUserStatsForGame/v2/`, { key: KEY, steamid: steamId, appid: CS2_APP_ID })),
    safeGet(buildUrl(`${STEAM_API}/IPlayerService/GetSteamLevel/v1/`, { key: KEY, steamid: steamId })),
    safeGet(buildUrl(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/`, { key: KEY, steamid: steamId, include_played_free_games: 1, 'appids_filter[0]': CS2_APP_ID })),
    safeGet(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`),
  ]);

  const profile = summaryData?.response?.players?.[0];
  if (!profile) return json({ error: 'Player not found.' }, 404);

  if (!statsData?.playerstats?.stats) {
    return json({ error: 'Profile is private. Coward.' }, 403);
  }

  const steamLevel = levelData?.response?.player_level || 0;
  const playtimeMinutes = hoursData?.response?.games?.[0]?.playtime_forever || 0;
  const hoursPlayed = Math.round(playtimeMinutes / 60);

  const rawStats = statsData.playerstats.stats;
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

  const rating = leetifyData?.rating || null;
  const allMatches = leetifyData?.recent_matches || [];
  const premierMatches = allMatches
    .filter((m) => m.rank_type === 11 || m.rank_type === 12)
    .slice(0, 99);

  return json({
    name: profile.personaname,
    avatarUrl: profile.avatarmedium,
    level: steamLevel,
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
