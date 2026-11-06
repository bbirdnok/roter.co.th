-- Additive: old deployments continue to work if the website is rolled back.
-- Buckets contain peppered hashes, never raw IP addresses or credentials.
CREATE TABLE IF NOT EXISTS security_rate_limits (
  bucket TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  requests INTEGER NOT NULL CHECK (requests >= 1)
);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_window
  ON security_rate_limits (window_start);
