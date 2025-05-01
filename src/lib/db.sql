-- First create all custom types
CREATE TYPE user_role AS ENUM ('manufacturer', 'product_owner');
CREATE TYPE transaction_type AS ENUM ('verification', 'fraud_report');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE nfc_tag_status AS ENUM ('available', 'assigned', 'testing', 'defective');

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS products_id_seq START WITH 1 INCREMENT BY 1;

-- Create function to generate product ID
CREATE OR REPLACE FUNCTION generate_product_id(product_name VARCHAR, product_sequence_id INTEGER)
RETURNS VARCHAR AS $$
BEGIN
    
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                product_name,
                '[^a-zA-Z0-9\s]', 
                '', 
                'g'
            ),
            '\s+', 
            '-',
            'g'
        )
    ) || '-' || product_sequence_id::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create tables in dependency order
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password_hash character varying(255) COLLATE pg_catalog."default",
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    role user_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    profile_picture character varying(255) COLLATE pg_catalog."default" NOT NULL DEFAULT 'https://placehold.co/1080x1920?text=Hello+World'::character varying,
    manufacturer_code character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.products
(
    id INTEGER NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    product_id VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manufacturer_id INTEGER NOT NULL,
    image_url VARCHAR(255),
    price DECIMAL(10,2),
    category VARCHAR(100),
    specifications JSONB,
    manufacture_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_product_id_key UNIQUE (product_id),
    CONSTRAINT products_manufacturer_id_fkey FOREIGN KEY (manufacturer_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.nfc_tag_locations (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    minimum_stock INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT nfc_tag_locations_pkey PRIMARY KEY (id),
    CONSTRAINT nfc_tag_locations_name_key UNIQUE (name)
);

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

CREATE TABLE IF NOT EXISTS public.transactions
(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id INTEGER NOT NULL,
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
        REFERENCES public.products (id)
        ON DELETE CASCADE,
    CONSTRAINT transactions_reported_by_fkey FOREIGN KEY (reported_by)
        REFERENCES public.users (id)
        ON DELETE SET NULL,
    CONSTRAINT transactions_resolved_by_fkey FOREIGN KEY (resolved_by)
        REFERENCES public.users (id)
        ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_transactions_product_id ON public.transactions(product_id);
CREATE INDEX idx_transactions_type_status ON public.transactions(transaction_type, status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_nfc_tags_status ON public.nfc_tags(status);
CREATE INDEX idx_nfc_tags_location ON public.nfc_tags(location_id);
CREATE INDEX idx_nfc_tags_product ON public.nfc_tags(product_id);

-- Create trigger functions
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

-- Create triggers
CREATE TRIGGER enforce_manufacturer_role
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
WHEN (NEW.manufacturer_id IS NOT NULL)
EXECUTE FUNCTION check_manufacturer_role();

CREATE TRIGGER update_transactions_timestamp
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_transactions_timestamp();

CREATE TRIGGER update_nfc_tags_timestamp
    BEFORE UPDATE ON public.nfc_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_nfc_tags_timestamp();

-- Create views
CREATE OR REPLACE VIEW transaction_statistics AS
SELECT
    COUNT(*) FILTER (WHERE transaction_type = 'verification' AND status = 'confirmed') as verified_products,
    COUNT(*) FILTER (WHERE transaction_type = 'fraud_report' AND status = 'confirmed') as confirmed_frauds,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_cases
FROM public.transactions;

-- Insert initial data
INSERT INTO nfc_tag_locations (name, description, minimum_stock)
VALUES 
    ('Warehouse A', 'Main storage facility', 200),
    ('Production Floor', 'Manufacturing area', 100),
    ('QA Lab', 'Quality assurance testing area', 50)
ON CONFLICT (name) DO NOTHING;

-- Insert sample NFC tags
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
