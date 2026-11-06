-- Additive: preserve existing submissions and all earlier columns.
ALTER TABLE leads ADD COLUMN job_title TEXT;
ALTER TABLE leads ADD COLUMN document_volume TEXT;
ALTER TABLE leads ADD COLUMN timeline TEXT;
ALTER TABLE leads ADD COLUMN submission_key TEXT;
ALTER TABLE leads ADD COLUMN content_hash TEXT;
-- SQLite allows multiple NULLs, so existing submissions remain valid.
CREATE UNIQUE INDEX idx_leads_submission_key ON leads (submission_key);
