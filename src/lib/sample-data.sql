-- Insert sample manufacturers
INSERT INTO users (email, password_hash, first_name, last_name, role, manufacturer_code)
VALUES 
    ('techwear@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Tech', 'Wear', 'manufacturer', 'TECH-001'),
    ('luxurygoods@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Luxury', 'Goods', 'manufacturer', 'LUX-001')
ON CONFLICT (email) DO NOTHING;

-- Insert sample product owners
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES 
    ('owner1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', 'product_owner'),
    ('owner2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', 'product_owner')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
WITH manufacturers AS (
    SELECT id FROM users WHERE role = 'manufacturer'
)
INSERT INTO products (
    name, 
    description, 
    manufacturer_id, 
    image_url, 
    price, 
    category, 
    specifications, 
    manufacture_date
)
SELECT 
    p.name,
    p.description,
    m.id,
    p.image_url,
    p.price,
    p.category,
    p.specifications,
    p.manufacture_date
FROM (
    VALUES 
        (
            'Premium Smart Watch X1',
            'The X1 Smart Watch is the perfect blend of style and technology. With advanced health tracking, long battery life, and a sleek design, it''s the ideal companion for your active lifestyle.',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000',
            299.99,
            'Wearable Technology',
            '{"Display": "1.4\" AMOLED (450x450)", "Battery": "410mAh Li-ion", "Connectivity": "Bluetooth 5.2, Wi-Fi", "Sensors": "Accelerometer, Gyroscope, Optical HR, SpO2", "Dimensions": "42 x 42 x 10.9mm", "Weight": "32g (without strap)", "Compatibility": "iOS 12.0+, Android 6.0+", "Water Resistance": "5 ATM"}'::jsonb,
            '2024-02-15'::timestamptz
        ),
        (
            'Luxury Leather Wallet',
            'Handcrafted from premium Italian leather, this wallet combines timeless elegance with modern functionality. Features RFID protection and multiple card slots.',
            'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000',
            199.99,
            'Accessories',
            '{"Material": "Italian Full-Grain Leather", "Dimensions": "4.5\" x 3.5\" x 0.5\"", "Color": "Dark Brown", "Features": "RFID Protection, 8 Card Slots, 2 Bill Compartments", "Care Instructions": "Clean with damp cloth, condition with leather cream"}'::jsonb,
            '2024-01-20'::timestamptz
        ),
        (
            'Wireless Noise-Cancelling Headphones',
            'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and touch controls.',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
            349.99,
            'Audio',
            '{"Driver": "40mm Dynamic", "Frequency Response": "20Hz-20kHz", "Battery Life": "30 hours", "Charging Time": "2 hours", "Bluetooth Version": "5.0", "Weight": "250g", "Noise Cancellation": "Active", "Microphone": "Built-in with noise reduction"}'::jsonb,
            '2024-03-01'::timestamptz
        )
) AS p(name, description, image_url, price, category, specifications, manufacture_date)
CROSS JOIN manufacturers m;

-- Insert NFC tag locations
INSERT INTO nfc_tag_locations (name, description, minimum_stock)
VALUES 
    ('Warehouse A', 'Main storage facility', 200),
    ('Production Floor', 'Manufacturing area', 100),
    ('QA Lab', 'Quality assurance testing area', 50)
ON CONFLICT (name) DO NOTHING;

-- Insert NFC tags for the products
WITH products AS (
    SELECT id FROM products
),
locations AS (
    SELECT id FROM nfc_tag_locations
)
INSERT INTO nfc_tags (
    id,
    type,
    status,
    last_tested,
    batch_number,
    product_id,
    location_id
)
SELECT 
    'NFC-' || p.id || '-' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY p.id) AS TEXT), 3, '0'),
    'NTAG 424 DNA',
    'assigned',
    NOW() - (random() * interval '30 days'),
    'B2024-01',
    p.id,
    (SELECT id FROM locations ORDER BY random() LIMIT 1)
FROM products p
CROSS JOIN generate_series(1, 5)  -- Create 5 tags per product
ON CONFLICT (id) DO NOTHING;

-- Insert verification transactions
WITH products AS (
    SELECT id FROM products
),
owners AS (
    SELECT id FROM users WHERE role = 'product_owner'
)
INSERT INTO transactions (
    product_id,
    transaction_type,
    status,
    reported_by,
    details,
    evidence_url,
    created_at
)
SELECT 
    p.id,
    'verification',
    'confirmed',
    (SELECT id FROM owners ORDER BY random() LIMIT 1),
    'Initial product verification',
    ARRAY['https://example.com/evidence/1.jpg'],
    NOW() - (random() * interval '30 days')
FROM products p
ON CONFLICT DO NOTHING;

-- Insert some fraud reports
WITH products AS (
    SELECT id FROM products
),
owners AS (
    SELECT id FROM users WHERE role = 'product_owner'
)
INSERT INTO transactions (
    product_id,
    transaction_type,
    status,
    reported_by,
    details,
    evidence_url,
    created_at
)
SELECT 
    p.id,
    'fraud_report',
    'pending',
    (SELECT id FROM owners ORDER BY random() LIMIT 1),
    'Suspected counterfeit product',
    ARRAY['https://example.com/evidence/fraud1.jpg'],
    NOW() - (random() * interval '15 days')
FROM products p
WHERE random() < 0.3  -- 30% chance of fraud report per product
ON CONFLICT DO NOTHING; 
