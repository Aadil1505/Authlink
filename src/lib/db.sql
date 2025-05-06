-- 1. Create custom ENUM types
CREATE TYPE user_role AS ENUM ('manufacturer', 'product_owner');
CREATE TYPE transaction_type AS ENUM ('verification', 'fraud_report');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE nfc_tag_status AS ENUM ('available', 'assigned', 'testing', 'defective');

-- 2. Create sequences
CREATE SEQUENCE IF NOT EXISTS products_id_seq START WITH 1 INCREMENT BY 1;

-- 3. Create trigger functions (can be defined before being used in triggers)
CREATE OR REPLACE FUNCTION check_manufacturer_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users WHERE id = NEW.manufacturer_id AND role = 'manufacturer'
    ) THEN
        RAISE EXCEPTION 'manufacturer_id must belong to a user with role ''manufacturer''';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_transactions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_nfc_tags_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create tables in dependency order

-- 4.1a Manufacturers table (company-level, referenced by users, products, templates)
CREATE TABLE IF NOT EXISTS public.manufacturers (
    code VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
    -- Add other manufacturer/company fields as needed
);

-- 4.1 Users table (no dependencies)
CREATE TABLE IF NOT EXISTS public.users (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    profile_picture VARCHAR(255) NOT NULL DEFAULT 'https://placehold.co/1080x1920?text=Hello+World',
    manufacturer_code VARCHAR(255),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_manufacturer_code_fkey FOREIGN KEY (manufacturer_code)
        REFERENCES public.manufacturers (code)
        ON DELETE SET NULL
);

-- 4.2 Products table (depends on manufacturers)
CREATE TABLE IF NOT EXISTS public.products (
    id INTEGER NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manufacturer_code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(100),
    features TEXT[],
    specifications JSONB,
    image_url TEXT,
    price NUMERIC(10,2),
    manufacture_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    product_id VARCHAR(32) NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_product_id_key UNIQUE (product_id),
    CONSTRAINT products_manufacturer_code_fkey FOREIGN KEY (manufacturer_code)
        REFERENCES public.manufacturers (code)
        ON DELETE SET NULL
);

-- 4.2a Templates table (product templates, not actual products)
CREATE TABLE IF NOT EXISTS public.templates (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manufacturer_code VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    features TEXT[],
    specifications JSONB,
    image_url TEXT,
    price NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT templates_pkey PRIMARY KEY (id),
    CONSTRAINT templates_name_key UNIQUE (name),
    CONSTRAINT templates_manufacturer_code_fkey FOREIGN KEY (manufacturer_code)
        REFERENCES public.manufacturers (code)
        ON DELETE SET NULL
);

-- 4.3 NFC tag locations (independent)
CREATE TABLE IF NOT EXISTS public.nfc_tag_locations (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    minimum_stock INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT nfc_tag_locations_pkey PRIMARY KEY (id),
    CONSTRAINT nfc_tag_locations_name_key UNIQUE (name)
);

-- 4.4 NFC tags (depends on products and nfc_tag_locations)
CREATE TABLE IF NOT EXISTS public.nfc_tags (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    type VARCHAR(50) NOT NULL,
    status nfc_tag_status NOT NULL DEFAULT 'available',
    last_tested TIMESTAMP WITH TIME ZONE,
    batch_number VARCHAR(20) NOT NULL,
    product_id INTEGER,
    location_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT nfc_tags_pkey PRIMARY KEY (id),
    CONSTRAINT nfc_tags_product_fkey FOREIGN KEY (product_id)
        REFERENCES public.products (id)
        ON DELETE SET NULL,
    CONSTRAINT nfc_tags_location_fkey FOREIGN KEY (location_id)
        REFERENCES public.nfc_tag_locations (id)
        ON DELETE RESTRICT
);

-- 4.5 Transactions (depends on products and users)
CREATE TABLE IF NOT EXISTS public.transactions (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id VARCHAR(32) NOT NULL,
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    reported_by INTEGER NOT NULL,
    details TEXT,
    evidence_url TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by INTEGER,
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_product_fkey FOREIGN KEY (product_id)
        REFERENCES public.products (product_id)
        ON DELETE CASCADE,
    CONSTRAINT transactions_reported_by_fkey FOREIGN KEY (reported_by)
        REFERENCES public.users (id)
        ON DELETE SET NULL,
    CONSTRAINT transactions_resolved_by_fkey FOREIGN KEY (resolved_by)
        REFERENCES public.users (id)
        ON DELETE SET NULL
);

-- Create the user_verifications table
CREATE TABLE IF NOT EXISTS public.user_verifications (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id VARCHAR(32) NOT NULL,
    user_id INTEGER NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_verifications_pkey PRIMARY KEY (id),
    CONSTRAINT user_verifications_product_fkey FOREIGN KEY (product_id)
        REFERENCES public.products (product_id)
        ON DELETE CASCADE,
    CONSTRAINT user_verifications_user_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_user_verifications_product_id ON public.user_verifications(product_id);
CREATE INDEX idx_user_verifications_user_id ON public.user_verifications(user_id);
CREATE INDEX idx_user_verifications_verified_at ON public.user_verifications(verified_at);

-- 5. Create indexes
CREATE INDEX idx_transactions_product_id ON public.transactions(product_id);
CREATE INDEX idx_transactions_type_status ON public.transactions(transaction_type, status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_nfc_tags_status ON public.nfc_tags(status);
CREATE INDEX idx_nfc_tags_location ON public.nfc_tags(location_id);
CREATE INDEX idx_nfc_tags_product ON public.nfc_tags(product_id);

-- 6. Create triggers (after tables and functions)
-- CREATE TRIGGER enforce_manufacturer_role
-- BEFORE INSERT OR UPDATE ON public.products
-- FOR EACH ROW
-- WHEN (NEW.manufacturer_id IS NOT NULL)
-- EXECUTE FUNCTION check_manufacturer_role();

CREATE TRIGGER update_transactions_timestamp
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_timestamp();

CREATE TRIGGER update_nfc_tags_timestamp
BEFORE UPDATE ON public.nfc_tags
FOR EACH ROW
EXECUTE FUNCTION update_nfc_tags_timestamp();

-- 7. Create views
CREATE OR REPLACE VIEW transaction_statistics AS
SELECT
    COUNT(*) FILTER (WHERE transaction_type = 'verification' AND status = 'confirmed') AS verified_products,
    COUNT(*) FILTER (WHERE transaction_type = 'fraud_report' AND status = 'confirmed') AS confirmed_frauds,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_cases
FROM public.transactions;

-- 8. Insert sample manufacturers
INSERT INTO manufacturers (code, name) VALUES
    ('MFR-001', 'Acme Corp'),
    ('MFR-002', 'Globex Inc'),
    ('MFR-003', 'Stark Industries')
ON CONFLICT (code) DO NOTHING;

-- 9. Insert sample users (must reference existing manufacturer_code)
INSERT INTO users (email, password_hash, first_name, last_name, role, manufacturer_code)
VALUES
    ('alice@acme.com', '$2b$10$R2Uf3PQdNZbX29880dlAXu1DX20RO.lIitVi1ltZTbXXkM2t15MHK', 'Alice', 'Smith', 'manufacturer', 'MFR-001'),
    ('bob@globex.com', '$2b$10$R2Uf3PQdNZbX29880dlAXu1DX20RO.lIitVi1ltZTbXXkM2t15MHK', 'Bob', 'Jones', 'manufacturer', 'MFR-002'),
    ('carol@stark.com', '$2b$10$R2Uf3PQdNZbX29880dlAXu1DX20RO.lIitVi1ltZTbXXkM2t15MHK', 'Carol', 'Danvers', 'manufacturer', 'MFR-003');

-- 10. Insert sample products (must reference existing manufacturer_code)
INSERT INTO products (name, description, manufacturer_code, category, features, specifications, image_url, price, manufacture_date, product_id)
VALUES
    ('Smart Watch', 'A high-end smart watch with health tracking.', 'MFR-001', 'Wearable', ARRAY['Heart Rate', 'GPS'], '{"battery":"24h","waterproof":"yes"}', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop', 199.99, NOW(), 'PRD-12345'),
    ('VR Headset', 'Immersive virtual reality headset.', 'MFR-002', 'Electronics', ARRAY['4K Display', 'Wireless'], '{"field_of_view":"110deg"}', 'https://static.vecteezy.com/system/resources/previews/024/724/528/non_2x/virtual-reality-or-vr-headset-isolated-on-transparent-background-vr-glasses-for-360-environment-games-or-simulation-training-generative-ai-free-png.png', 299.99, NOW(), 'PRD-1002');

-- 11. Insert sample templates (must reference existing manufacturer_code)
INSERT INTO templates (name, description, manufacturer_code, category, features, specifications, image_url, price)
VALUES
    ('Basic Watch Template', 'Template for basic smart watches.', 'MFR-001', 'Wearable', ARRAY['Step Counter'], '{"battery":"12h"}', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop', 99.99),
    ('Advanced VR Template', 'Template for advanced VR headsets.', 'MFR-002', 'Electronics', ARRAY['Eye Tracking'], '{"resolution":"4K"}', 'https://static.vecteezy.com/system/resources/previews/024/724/528/non_2x/virtual-reality-or-vr-headset-isolated-on-transparent-background-vr-glasses-for-360-environment-games-or-simulation-training-generative-ai-free-png.png', 399.99);

-- 9. Insert initial data
INSERT INTO nfc_tag_locations (name, description, minimum_stock)
VALUES 
    ('Warehouse A', 'Main storage facility', 200),
    ('Production Floor', 'Manufacturing area', 100),
    ('QA Lab', 'Quality assurance testing area', 50)
ON CONFLICT (name) DO NOTHING;

-- 9. Insert sample NFC tags
WITH locations AS (
    SELECT id, name FROM nfc_tag_locations
)
INSERT INTO nfc_tags (type, status, last_tested, batch_number, location_id)
SELECT
    'NTAG 424 DNA',
    CASE random()::int % 4
        WHEN 0 THEN 'available'::nfc_tag_status
        WHEN 1 THEN 'assigned'::nfc_tag_status
        WHEN 2 THEN 'testing'::nfc_tag_status
        ELSE 'defective'::nfc_tag_status
    END,
    NOW() - (random() * interval '30 days'),
    'B2024-01',
    (SELECT id FROM locations ORDER BY random() LIMIT 1)
FROM generate_series(1, 1000);
-- Create the 'verifications' table
CREATE TABLE IF NOT EXISTS verifications (
  id SERIAL PRIMARY KEY,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'overview_metrics' table
CREATE TABLE IF NOT EXISTS overview_metrics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(100) NOT NULL
);

-- Create the 'fraud_reports' table
CREATE TABLE IF NOT EXISTS fraud_reports (
  id SERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'reports' table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for verifications
INSERT INTO verifications (status, created_at) VALUES
  ('pending', NOW() - INTERVAL '2 days'),
  ('confirmed', NOW() - INTERVAL '1 day'),
  ('rejected', NOW());

-- Sample data for overview_metrics
INSERT INTO overview_metrics (name, value) VALUES
  ('total_products', '100'),
  ('total_verifications', '75'),
  ('total_frauds', '5');

-- Sample data for fraud_reports
INSERT INTO fraud_reports (type, reported_at) VALUES
  ('counterfeit', NOW() - INTERVAL '3 days'),
  ('tampering', NOW() - INTERVAL '1 day');

-- Sample data for reports
INSERT INTO reports (title, description, created_at) VALUES
  ('Monthly Verification Report', 'Summary of all verifications for the month.', NOW() - INTERVAL '10 days'),
  ('Fraud Analysis', 'Detailed analysis of reported fraud cases.', NOW() - INTERVAL '5 days');

-- Sample data for user_verifications
INSERT INTO user_verifications (product_id, user_id, verified_at)
VALUES ('PRD-12356', 1, NOW());
