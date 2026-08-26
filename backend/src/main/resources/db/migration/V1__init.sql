CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    created_at VARCHAR(40)
);
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(40),
    created_at VARCHAR(40)
);
CREATE UNIQUE INDEX ux_users_email ON users(email);

CREATE TABLE clients (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    name VARCHAR(255),
    gstin VARCHAR(255),
    phone VARCHAR(255),
    filing_type VARCHAR(255),
    status VARCHAR(255),
    created_at VARCHAR(40)
);

CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    client_id BIGINT,
    service_code VARCHAR(255),
    period VARCHAR(255),
    due_on VARCHAR(255),
    status VARCHAR(255),
    created_at VARCHAR(40)
);

CREATE TABLE work_files (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    task_id BIGINT,
    file_name VARCHAR(255),
    kind VARCHAR(255),
    created_at VARCHAR(40)
);
