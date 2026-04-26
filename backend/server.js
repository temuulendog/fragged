import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const STEAM_API = 'http://api.steampowered.com';
const CS2_APP_ID = 730;
const KEY = () => process.env.STEAM_API_KEY;

const WEAPONS = [
  'ak47', 'awp', 'm4a1', 'm4a4', 'deagle', 'usp_silencer', 'glock',
  'famas', 'galil', 'aug', 'sg556', 'ssg08', 'mp9', 'mac10', 'p90',
  'mp5sd', 'ump45', 'bizon', 'mp7', 'negev', 'm249', 'nova', 'xm1014',
  'sawedoff', 'mag7', 'knife', 'tec9', 'fiveseven', 'p250', 'cz75a',
];

const safeGet = async (url, params = {}, headers = {}) => {
  try {
    const res = await axios.get(url, { params, headers });
    return res.data;
  } catch (e) {
    console.error(`safeGet failed: ${url}`, e.response?.status, e.response?.data);
    return null;
  }
};

app.get('/api/player/:steamId', async (req, res) => {
  let { steamId } = req.params;
  const { type } = req.query;

  if (!steamId || steamId.length > 64 || /[^a-zA-Z0-9_-]/.test(steamId)) {
    return res.status(400).json({ error: 'Invalid Steam ID or URL.' });
  }

  try {
    if (type === 'vanity') {
      const vanityData = await safeGet(`${STEAM_API}/ISteamUser/ResolveVanityURL/v1/`, { key: KEY(), vanityurl: steamId });
      if (vanityData?.response?.success !== 1) {
        return res.status(404).json({ error: 'Could not find a Steam account with that URL.' });
      }
      steamId = vanityData.response.steamid;
    }

    const [summaryData, statsData, levelData, hoursData, leetifyData] = await Promise.all([
      safeGet(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`, { key: KEY(), steamids: steamId }),
      safeGet(`${STEAM_API}/ISteamUserStats/GetUserStatsForGame/v2/`, { key: KEY(), steamid: steamId, appid: CS2_APP_ID }),
      safeGet(`${STEAM_API}/IPlayerService/GetSteamLevel/v1/`, { key: KEY(), steamid: steamId }),
      safeGet(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/?key=${KEY()}&steamid=${steamId}&include_played_free_games=1&appids_filter[0]=${CS2_APP_ID}`),
      safeGet(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`),
    ]);

    const profile = summaryData?.response?.players?.[0];
    if (!profile) return res.status(404).json({ error: 'Player not found.' });

    if (!statsData?.playerstats?.stats) {
      return res.status(403).json({ error: 'Profile is private. Coward.' });
    }

    const steamLevel = levelData?.response?.player_level || 0;
    const playtimeMinutes = hoursData?.response?.games?.[0]?.playtime_forever || 0;
    const hoursPlayed = Math.round(playtimeMinutes / 60);

    const rawStats = statsData.playerstats.stats;
    const stat = (name) => rawStats.find(s => s.name === name)?.value || 0;

    const totalKills = stat('total_kills');
    const totalDeaths = stat('total_deaths');
    const totalKillsHeadshot = stat('total_kills_headshot');
    const matchesPlayed = stat('total_matches_played');
    const matchesWon = stat('total_matches_won');
    const shotsFired = stat('total_shots_fired');
    const shotsHit = stat('total_shots_hit');
    const timePlayed = stat('total_time_played');

    const weaponKills = WEAPONS.map(w => ({
      name: w.toUpperCase().replace('_SILENCER', '').replace('CZ75A', 'CZ75'),
      kills: stat(`total_kills_${w}`),
    })).filter(w => w.kills > 0).sort((a, b) => b.kills - a.kills);

    const favoriteWeapon = weaponKills[0]?.name || 'KNIFE';
    const favoriteWeaponKills = weaponKills[0]?.kills || 0;

    const fallbackHours = Math.round(timePlayed / 3600);

    const rating = leetifyData?.rating || null;
    // Grab enough matches to compute rank changes — only keep Premier (rank_type 11)
    const allMatches = leetifyData?.recent_matches || [];
    const premierMatches = allMatches.filter(m => m.rank_type === 11 || m.rank_type === 12).slice(0, 99);

    res.json({
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
      leetify: rating ? {
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
      } : null,
    });

  } catch (err) {
    console.error('ERROR:', err.message);
    res.status(500).json({ error: 'Steam said no.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
