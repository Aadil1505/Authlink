-- Type: role
CREATE TYPE user_role AS ENUM ('manufacturer', 'product_owner');

-- Table: public.users
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
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

-- Drop and Create the Sequence
CREATE SEQUENCE IF NOT EXISTS products_id_seq START WITH 1 INCREMENT BY 1;

-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products
(
    id INTEGER NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    product_id UUID DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manufacturer_id INTEGER NOT NULL,  -- Renamed from admin_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_manufacturer_id_fkey FOREIGN KEY (manufacturer_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

ALTER TABLE IF EXISTS public.products
    OWNER TO postgres;

-- Create the Trigger Function to Enforce Manufacturer Role
CREATE OR REPLACE FUNCTION check_manufacturer_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure that manufacturer_id corresponds to a user with the role 'manufacturer'
    IF NOT EXISTS (
        SELECT 1 FROM public.users WHERE id = NEW.manufacturer_id AND role = 'manufacturer'
    ) THEN
        RAISE EXCEPTION 'manufacturer_id must belong to a user with role ''manufacturer''';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the Trigger to Enforce Role on INSERT and UPDATE
CREATE TRIGGER enforce_manufacturer_role
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
WHEN (NEW.manufacturer_id IS NOT NULL) -- Only check if manufacturer_id is provided
EXECUTE FUNCTION check_manufacturer_role();

-- Create Transaction Type Enum
CREATE TYPE transaction_type AS ENUM ('verification', 'fraud_report');

-- Create Transaction Status Enum
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'rejected');

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions
(
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id INTEGER NOT NULL,
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    reported_by INTEGER NOT NULL, -- user who reported/verified
    details TEXT,
    evidence_url TEXT[], -- Array of URLs for any evidence (images, documents, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by INTEGER, -- admin/moderator who resolved the case
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

-- Create index for faster queries
CREATE INDEX idx_transactions_product_id ON public.transactions(product_id);
CREATE INDEX idx_transactions_type_status ON public.transactions(transaction_type, status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_transactions_timestamp
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_transactions_timestamp();

-- Create view for transaction statistics
CREATE OR REPLACE VIEW transaction_statistics AS
SELECT
    COUNT(*) FILTER (WHERE transaction_type = 'verification' AND status = 'confirmed') as verified_products,
    COUNT(*) FILTER (WHERE transaction_type = 'fraud_report' AND status = 'confirmed') as confirmed_frauds,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_cases
FROM public.transactions;
