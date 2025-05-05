-- Insert sample manufacturers
INSERT INTO public.users (email, password_hash, first_name, last_name, role, manufacturer_code)
VALUES 
    ('luxury.watches@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.Vm', 'John', 'Smith', 'manufacturer', 'LUX-001'),
    ('premium.jewelry@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.Vm', 'Sarah', 'Johnson', 'manufacturer', 'JEW-001'),
    ('designer.bags@example.com', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu.Vm', 'Michael', 'Williams', 'manufacturer', 'BAG-001')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (product_id, name, description, manufacturer_id, image_url, price, category, specifications, manufacture_date)
SELECT 
    'PRD-' || LPAD(ROW_NUMBER() OVER ()::text, 5, '0'),
    CASE 
        WHEN ROW_NUMBER() OVER () % 3 = 0 THEN 'Luxury Watch Series X'
        WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 'Diamond Necklace Collection'
        ELSE 'Designer Handbag Limited Edition'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER () % 3 = 0 THEN 'Premium luxury watch with advanced features and elegant design'
        WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 'Exquisite diamond necklace crafted by master jewelers'
        ELSE 'Limited edition designer handbag made with premium materials'
    END,
    (SELECT id FROM public.users WHERE role = 'manufacturer' ORDER BY random() LIMIT 1),
    CASE 
        WHEN ROW_NUMBER() OVER () % 3 = 0 THEN 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
        WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f'
        ELSE 'https://images.unsplash.com/photo-1584917865442-de89df76afd3'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER () % 3 = 0 THEN 2999.99
        WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 4999.99
        ELSE 1999.99
    END,
    CASE 
        WHEN ROW_NUMBER() OVER () % 3 = 0 THEN 'Watches'
        WHEN ROW_NUMBER() OVER () % 3 = 1 THEN 'Jewelry'
        ELSE 'Accessories'
    END,
    CASE 
        WHEN ROW_NUMBER() OVER () % 3 = 0 THEN '{"Material": "Stainless Steel", "Movement": "Automatic", "Water Resistance": "100m", "Case Size": "42mm"}'
        WHEN ROW_NUMBER() OVER () % 3 = 1 THEN '{"Material": "18K Gold", "Stone": "Diamond", "Carat": "2.5", "Clarity": "VS1"}'
        ELSE '{"Material": "Leather", "Color": "Black", "Dimensions": "30x20x10cm", "Style": "Tote"}'
    END::jsonb,
    CURRENT_DATE - (random() * 365)::integer
FROM generate_series(1, 50);

-- Insert sample NFC tags and link them to products
WITH product_ids AS (
    SELECT id, product_id FROM public.products
),
location_ids AS (
    SELECT id FROM public.nfc_tag_locations
)
INSERT INTO public.nfc_tags (type, status, last_tested, batch_number, product_id, location_id)
SELECT 
    'NTAG 424 DNA',
    CASE 
        WHEN random() < 0.8 THEN 'assigned'::nfc_tag_status
        ELSE 'available'::nfc_tag_status
    END,
    CURRENT_TIMESTAMP - (random() * 30)::integer * interval '1 day',
    'BATCH-' || LPAD(FLOOR(random() * 1000)::text, 3, '0'),
    CASE 
        WHEN random() < 0.8 THEN (SELECT id FROM product_ids ORDER BY random() LIMIT 1)
        ELSE NULL
    END,
    (SELECT id FROM location_ids ORDER BY random() LIMIT 1)
FROM generate_series(1, 200);

-- Insert sample transactions
WITH product_ids AS (
    SELECT id FROM public.products
),
user_ids AS (
    SELECT id FROM public.users
)
INSERT INTO public.transactions (product_id, transaction_type, status, reported_by, details)
SELECT 
    (SELECT id FROM product_ids ORDER BY random() LIMIT 1),
    CASE WHEN random() < 0.9 THEN 'verification'::transaction_type ELSE 'fraud_report'::transaction_type END,
    CASE 
        WHEN random() < 0.7 THEN 'confirmed'::transaction_status
        WHEN random() < 0.8 THEN 'rejected'::transaction_status
        ELSE 'pending'::transaction_status
    END,
    (SELECT id FROM user_ids ORDER BY random() LIMIT 1),
    CASE 
        WHEN random() < 0.9 THEN 'Product verification completed successfully'
        ELSE 'Suspected counterfeit product reported'
    END
FROM generate_series(1, 100); 
