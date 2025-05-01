-- First, drop the existing generated column
ALTER TABLE products DROP COLUMN product_id;

-- Add the product_id column as a regular VARCHAR column
ALTER TABLE products ADD COLUMN product_id VARCHAR(32);

-- Update existing rows to have a default product_id
UPDATE products 
SET product_id = 'PRD-' || id::text;

-- Now we can safely add the NOT NULL constraint
ALTER TABLE products ALTER COLUMN product_id SET NOT NULL;

-- Add a unique constraint to ensure product_ids are unique
ALTER TABLE products ADD CONSTRAINT products_product_id_key UNIQUE (product_id); 
