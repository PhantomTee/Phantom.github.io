-- Run this once in your Neon SQL editor, then add DATABASE_URL to your env vars.

CREATE TABLE IF NOT EXISTS agents (
  id          TEXT PRIMARY KEY,
  address     TEXT NOT NULL,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_events (
  id          TEXT PRIMARY KEY,
  agent_id    TEXT NOT NULL,
  address     TEXT NOT NULL,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agents_address ON agents(address);
CREATE INDEX IF NOT EXISTS idx_events_address ON agent_events(address);
