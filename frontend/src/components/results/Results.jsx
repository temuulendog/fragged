import { useState } from 'react';
import { T, KEYFRAMES, getRankTier } from '../../theme';
import { Masthead, SearchBox, SectionLabel } from '../ui';
import PlayerHeader from './PlayerHeader';
import SteamCard from './SteamCard';
import LeetifyCard from './LeetifyCard';
import BackupCard from './BackupCard';
import WeaponStatsCard from './WeaponStatsCard';
import MedalsCard from './MedalsCard';
import WeaponAffinity from './WeaponAffinity';
import MatchHistory from './MatchHistory';
import FraggedAimCard from './FraggedAimCard';
import FaceitCard from './FaceitCard';
import AdSlot from '../AdSlot';
import useIsMobile from '../../useIsMobile';

export default function Results({ player, onSearch, onReset }) {
  const { name, avatarUrl, level, stats, leetify: L, backup_data: backupData, premierSeasons, faceit, fragged, affinity, weapons, medals, steam, steamId, statsAvailable = true } = player;
  const { totalKills, totalDeaths, totalKillsHeadshot, matchesWon, matchesPlayed, hoursPlayed } = stats;
  const officialKd = statsAvailable && totalDeaths > 0 ? totalKills / totalDeaths : null;
  const mobile = useIsMobile();

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
          matchesPlayed={matchesPlayed} winRate={winRate} premier={premier} premierSeasons={premierSeasons} faceit={faceit} kd={officialKd}
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

        {(() => {
          const cards = [];
          if (steam) cards.push(<SteamCard key="steam" steam={steam} name={name} />);
          if (hasLeetify) cards.push(<LeetifyCard key="leet" L={L} steamId={steamId} />);
          else if (backupData) cards.push(<BackupCard key="backup" data={backupData} />);
          if (faceit) cards.push(<FaceitCard key="face" faceit={faceit} />);
          // Premier seasons now live in the header (PlayerHeader), so Medals is a plain card.
          if (medals?.length) cards.push(<MedalsCard key="medals" medals={medals} />);
          if (!cards.length) return null;
          // Mobile: one column. Desktop: round-robin into two columns so short cards
          // (Steam) stack with the next card instead of gapping beside tall Leetify.
          if (mobile) {
            return (
              <div className="fr-sec" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cards}
              </div>
            );
          }
          const colA = cards.filter((_, i) => i % 2 === 0);
          const colB = cards.filter((_, i) => i % 2 === 1);
          const col = { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 };
          return (
            <div className="fr-sec" style={{ padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={col}>{colA}</div>
              {colB.length > 0 && <div style={col}>{colB}</div>}
            </div>
          );
        })()}

        {weapons?.length > 0 && (
          <div className="fr-sec" style={{ padding: '0 22px 18px' }}>
            <WeaponStatsCard weapons={weapons} />
          </div>
        )}
        {hasLeetify && matches.length > 0 && (
          <div className="fr-sec">
            <SectionLabel hint={`${Math.min(visibleMatches, matches.length)} / ${matches.length}`}>Match History</SectionLabel>
            <MatchHistory matches={matches} visible={visibleMatches} onLoadMore={() => setVisibleMatches(v => Math.min(v + 15, matches.length))} />
          </div>
        )}

        <AdSlot />

        {!hasLeetify && fragged && <FraggedAimCard aim={fragged.aim} confidence={fragged.confidence} />}

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
