import { useState } from 'react';
import { T, KEYFRAMES, getRankTier } from '../../theme';
import { Masthead, SearchBox, SectionLabel } from '../ui';
import PlayerHeader from './PlayerHeader';
import LeetifyAttribution from './LeetifyAttribution';
import Performance from './Performance';
import TriangleGauges from './TriangleGauges';
import Roles from './Roles';
import WeaponAffinity from './WeaponAffinity';
import MatchHistory from './MatchHistory';
import FraggedAimCard from './FraggedAimCard';
import FaceitPanel from './FaceitPanel';
import AdSlot from '../AdSlot';

export default function Results({ player, onSearch, onReset }) {
  const { name, avatarUrl, level, stats, leetify: L, faceit, fragged, affinity, steamId, statsAvailable = true } = player;
  const { totalKills, totalKillsHeadshot, matchesWon, matchesPlayed, hoursPlayed } = stats;

  const hasLeetify = L && L.aim != null;
  const premier = L?.premier ?? null;
  const tier = getRankTier(premier);
  const [goalTier, setGoalTier] = useState(tier);
  const [visibleMatches, setVisibleMatches] = useState(15);

  const hsPercent = totalKills > 0 ? Math.round((totalKillsHeadshot / totalKills) * 100) : 0;
  const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;
  const ttdMs = L?.reactionTime ?? null;
  const preaimDeg = L?.preaim ?? null;

  const matches = L?.recentMatches ?? [];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.fg, fontFamily: T.display }}>
      <style>{KEYFRAMES}</style>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        <Masthead onReset={onReset} search={onSearch ? <SearchBox onSearch={onSearch} /> : null} />

        <PlayerHeader
          name={name} avatarUrl={avatarUrl} level={level}
          statsAvailable={statsAvailable} hoursPlayed={hoursPlayed}
          matchesPlayed={matchesPlayed} winRate={winRate} premier={premier} faceit={faceit}
        />

        {!statsAvailable && (
          <div className="fr-sec" style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '12px 22px', borderBottom: `1px solid ${T.line}`, background: T.surf, fontSize: 12, color: T.mut }}>
            <span style={{ color: T.acc, fontWeight: 800 }}>!</span>
            <span>
              <b style={{ color: T.fg }}>Steam game stats are private</b> for this player (CS2 Game Details is friends-only).
              {hasLeetify && faceit ? ' Showing Leetify + Faceit data only.' : hasLeetify ? ' Showing Leetify data only.' : faceit ? ' Showing Faceit data only.' : ''}
            </span>
          </div>
        )}

        {hasLeetify && <LeetifyAttribution steamId={steamId} />}
        {hasLeetify && <Performance L={L} tier={tier} faceit={faceit} />}
        {hasLeetify && <TriangleGauges L={L} hsPercent={hsPercent} ttdMs={ttdMs} preaimDeg={preaimDeg} goalTier={goalTier} setGoalTier={setGoalTier} />}
        {hasLeetify && <Roles L={L} />}

        {hasLeetify && matches.length > 0 && (
          <div className="fr-sec">
            <SectionLabel hint={`${Math.min(visibleMatches, matches.length)} / ${matches.length}`}>Match History</SectionLabel>
            <MatchHistory matches={matches} visible={visibleMatches} onLoadMore={() => setVisibleMatches(v => Math.min(v + 15, matches.length))} />
          </div>
        )}

        <AdSlot />

        {!hasLeetify && fragged && <FraggedAimCard aim={fragged.aim} confidence={fragged.confidence} />}

        {!hasLeetify && faceit && (
          <div className="fr-sec" style={{ borderTop: `1px solid ${T.line}` }}>
            <SectionLabel>Faceit</SectionLabel>
            <FaceitPanel faceit={faceit} />
          </div>
        )}

        {affinity && <WeaponAffinity affinity={affinity} />}

        {!hasLeetify && !faceit && (
          <div style={{ padding: '40px 22px', textAlign: 'center', color: T.mut, fontSize: 13, lineHeight: 1.6, borderTop: `1px solid ${T.line}` }}>
            No Leetify or Faceit data for this player.<br />
            <a href="https://leetify.com/" target="_blank" rel="noopener noreferrer" style={{ color: T.acc, fontWeight: 700 }}>Sign up for Leetify</a>{' '}
            to get aim, utility, and positioning ratings.
          </div>
        )}
      </div>
    </div>
  );
}
