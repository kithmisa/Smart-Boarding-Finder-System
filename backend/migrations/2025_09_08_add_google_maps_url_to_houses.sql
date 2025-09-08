-- Add googleMapsUrl column to houses table (nullable)
ALTER TABLE houses
  ADD COLUMN IF NOT EXISTS googleMapsUrl VARCHAR(2048) NULL AFTER location;

-- Optional: basic index for searches/filters (nullable columns can still be indexed)
-- CREATE INDEX IF NOT EXISTS idx_houses_googleMapsUrl ON houses (googleMapsUrl(255));


