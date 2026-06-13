-- Premier-seasons cache for the csstats.gg scrape.
-- One row per player; past seasons never change, current season refreshed via the
-- Leetify match-timestamp signal (or a time TTL for non-Leetify players).
CREATE TABLE IF NOT EXISTS premier_cache (
  steamid         TEXT PRIMARY KEY,
  seasons_json    TEXT NOT NULL,   -- JSON: [{ season, end, peak }]
  last_match_seen INTEGER,         -- ms epoch of latest Premier match when last scraped
  updated_at      INTEGER NOT NULL -- ms epoch of the last scrape
);
