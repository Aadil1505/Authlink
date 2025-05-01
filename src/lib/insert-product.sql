-- First, let's insert a manufacturer if not exists
INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    manufacturer_code
)
VALUES (
    'manufacturer@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- password is 'password123'
    'Test',
    'Manufacturer',
    'manufacturer',
    'MFR-001'
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Now insert the product
WITH manufacturer AS (
    SELECT id FROM users WHERE email = 'manufacturer@example.com'
)
INSERT INTO products (
    name,
    description,
    manufacturer_id,
    created_at,
    product_id,
    category,
    features,
    specifications,
    image_url,
    price,
    manufacture_date
)
VALUES (
    'Premium Smart Watch PRD-12345',
    'High-end smartwatch with advanced health tracking features and premium build quality. Features a titanium case, sapphire crystal display, and comprehensive health monitoring capabilities.',
    (SELECT id FROM manufacturer),
    CURRENT_TIMESTAMP,
    'PRD-12345',
    'Wearable Technology',
    ARRAY[
        'Heart Rate Monitoring',
        'Blood Oxygen Tracking',
        'ECG Function',
        'Sleep Analysis',
        'GPS Navigation',
        'Water Resistant 5 ATM',
        'Wireless Charging',
        'Always-On Display'
    ],
    '{
        "Display": "1.4\" AMOLED (450x450)",
        "Battery": "410mAh Li-ion",
        "Battery Life": "Up to 7 days",
        "Connectivity": "Bluetooth 5.2, Wi-Fi",
        "Water Resistance": "5 ATM",
        "Sensors": "Heart Rate, SpO2, ECG, Accelerometer, Gyroscope",
        "Materials": "Titanium case, Sapphire glass",
        "Dimensions": "45 x 45 x 10.9mm",
        "Weight": "41g (without strap)",
        "Compatibility": "iOS 12.0+, Android 8.0+"
    }'::jsonb,
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop',
    499.99,
    CURRENT_DATE
)
RETURNING id;

-- Insert a tag location if not exists
INSERT INTO nfc_tag_locations (name, description, minimum_stock)
VALUES ('Production Line A', 'Main production line for premium watches', 100)
ON CONFLICT (name) DO NOTHING;

-- Insert an NFC tag for this product
WITH product AS (
    SELECT id FROM products WHERE name = 'Premium Smart Watch PRD-12345'
),
location AS (
    SELECT id FROM nfc_tag_locations WHERE name = 'Production Line A'
)
INSERT INTO nfc_tags (
    type,
    status,
    last_tested,
    batch_number,
    product_id,
    location_id
)
SELECT
    'NTAG 424 DNA',
    'assigned',
    CURRENT_TIMESTAMP,
    'BATCH-2024-001',
    product.id,
    location.id
FROM product, location; 
