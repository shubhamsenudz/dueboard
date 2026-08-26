ALTER TABLE tenants ADD COLUMN IF NOT EXISTS upi_vpa VARCHAR(80);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS reminder_template TEXT;
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    actor VARCHAR(120),
    action VARCHAR(80),
    detail TEXT,
    created_at VARCHAR(40)
);
CREATE TABLE IF NOT EXISTS notes (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    kind VARCHAR(40),
    ref_id BIGINT,
    body TEXT,
    follow_up_on VARCHAR(20),
    created_at VARCHAR(40)
);
