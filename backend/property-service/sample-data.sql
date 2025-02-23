-- Clear existing data (optional - use carefully in production)
DELETE FROM property_images;
DELETE FROM properties;

-- Insert 30 sample properties
INSERT INTO properties (id, title, description, type, status, price, bedrooms, bathrooms, area, address, city, state, zip_code, created_at, updated_at)
VALUES
(1, 'Modern Downtown Apartment', 'Beautiful modern apartment in downtown area', 'APARTMENT', 'AVAILABLE', 250000, 2, 2, 1200.5, '123 Main St', 'New York', 'NY', '10001', NOW(), NOW()),
(2, 'Suburban Family Home', 'Spacious family home with garden', 'HOUSE', 'AVAILABLE', 450000, 4, 3, 2500, '456 Oak Ave', 'Los Angeles', 'CA', '90001', NOW(), NOW()),
(3, 'Modern Apartment in Downtown', 'Beautiful modern apartment with stunning city views', 'APARTMENT', 'AVAILABLE', 450000, 2, 2, 1200, '123 Main Street', 'New York', 'NY', '10001', NOW(), NOW()),
(4, 'Luxury Beach House', 'Stunning beachfront property with ocean views', 'HOUSE', 'AVAILABLE', 1250000, 5, 4, 3500, '789 Ocean Dr', 'Miami', 'FL', '33139', NOW(), NOW()),
(5, 'Cozy Mountain Cabin', 'Rustic cabin with beautiful mountain views', 'HOUSE', 'AVAILABLE', 320000, 3, 2, 1800, '567 Pine Rd', 'Aspen', 'CO', '81611', NOW(), NOW()),
(6, 'Renovated Historic Townhouse', 'Beautifully renovated townhouse in historic district', 'TOWNHOUSE', 'AVAILABLE', 575000, 3, 2.5, 2100, '345 Heritage Ln', 'Boston', 'MA', '02108', NOW(), NOW()),
(7, 'Modern Smart Home', 'Contemporary home with latest smart technology', 'HOUSE', 'AVAILABLE', 695000, 4, 3, 2800, '234 Tech Blvd', 'San Jose', 'CA', '95112', NOW(), NOW()),
(8, 'Downtown Loft', 'Spacious loft in converted warehouse', 'APARTMENT', 'AVAILABLE', 395000, 1, 1, 1100, '567 Industrial Ave', 'Chicago', 'IL', '60607', NOW(), NOW()),
(9, 'Garden Apartment', 'First floor apartment with private garden', 'APARTMENT', 'AVAILABLE', 325000, 2, 1, 950, '789 Ivy St', 'Seattle', 'WA', '98101', NOW(), NOW()),
(10, 'Luxury Penthouse', 'Spectacular penthouse with panoramic city views', 'APARTMENT', 'AVAILABLE', 1750000, 3, 3, 2600, '100 Skyline Dr', 'New York', 'NY', '10023', NOW(), NOW()),
(11, 'Waterfront Condo', 'Elegant condo with waterfront views', 'CONDO', 'AVAILABLE', 525000, 2, 2, 1350, '345 Harbor Dr', 'San Diego', 'CA', '92101', NOW(), NOW()),
(12, 'Ranch Style Home', 'Spacious single-level ranch on large lot', 'HOUSE', 'AVAILABLE', 389000, 3, 2, 2200, '567 Prairie Ln', 'Dallas', 'TX', '75201', NOW(), NOW()),
(13, 'Urban Micro Loft', 'Efficiently designed micro loft in urban center', 'APARTMENT', 'AVAILABLE', 199000, 0, 1, 450, '123 Compact St', 'Portland', 'OR', '97201', NOW(), NOW()),
(14, 'Victorian Bed & Breakfast', 'Charming Victorian with 6 guest rooms, currently operating as B&B', 'COMMERCIAL', 'AVAILABLE', 875000, 8, 6, 4500, '890 Historic Ave', 'Charleston', 'SC', '29401', NOW(), NOW()),
(15, 'Golf Course Villa', 'Luxury villa overlooking 18th hole', 'HOUSE', 'AVAILABLE', 950000, 4, 3.5, 3200, '10 Fairway Dr', 'Scottsdale', 'AZ', '85255', NOW(), NOW()),
(16, 'Converted Firehouse', 'Unique living space in historic converted firehouse', 'SPECIAL', 'AVAILABLE', 720000, 2, 2, 2800, '789 Dalmatian St', 'Philadelphia', 'PA', '19107', NOW(), NOW()),
(17, 'Forest Retreat', 'Secluded home surrounded by protected forest', 'HOUSE', 'AVAILABLE', 575000, 3, 2, 1950, '123 Wilderness Way', 'Asheville', 'NC', '28801', NOW(), NOW()),
(18, 'City Center Studio', 'Compact studio in prime downtown location', 'APARTMENT', 'AVAILABLE', 210000, 0, 1, 500, '555 Urban St', 'Austin', 'TX', '78701', NOW(), NOW()),
(19, 'Lakefront Property', 'Custom home with private dock and lake access', 'HOUSE', 'AVAILABLE', 890000, 4, 3, 3100, '333 Shoreline Dr', 'Minneapolis', 'MN', '55401', NOW(), NOW()),
(20, 'Desert Modern Home', 'Contemporary design harmonizing with desert landscape', 'HOUSE', 'AVAILABLE', 685000, 3, 2.5, 2400, '789 Cactus Rd', 'Phoenix', 'AZ', '85004', NOW(), NOW()),
(21, 'Historical Brownstone', 'Preserved 19th century brownstone with original details', 'TOWNHOUSE', 'AVAILABLE', 1250000, 4, 3, 3000, '456 Heritage Row', 'Brooklyn', 'NY', '11201', NOW(), NOW()),
(22, 'High-Rise Condo', 'Corner unit with floor-to-ceiling windows', 'CONDO', 'AVAILABLE', 495000, 2, 2, 1200, '1000 Skyview Ave', 'Denver', 'CO', '80202', NOW(), NOW()),
(23, 'Converted Barn', 'Rustic barn conversion with modern amenities', 'HOUSE', 'AVAILABLE', 675000, 3, 2.5, 2800, '555 Rural Route', 'Burlington', 'VT', '05401', NOW(), NOW()),
(24, 'French Quarter Apartment', 'Charming apartment with classic New Orleans style', 'APARTMENT', 'AVAILABLE', 375000, 1, 1, 850, '123 Bourbon St', 'New Orleans', 'LA', '70116', NOW(), NOW()),
(25, 'Converted Schoolhouse', 'Historic schoolhouse transformed into unique living space', 'SPECIAL', 'AVAILABLE', 595000, 2, 2, 2200, '123 Education Ln', 'Savannah', 'GA', '31401', NOW(), NOW()),
(26, 'Island Cottage', 'Quaint cottage with private beach access', 'HOUSE', 'AVAILABLE', 520000, 2, 1, 1100, '15 Island Ave', 'Key West', 'FL', '33040', NOW(), NOW()),
(27, 'Industrial Conversion', 'Former factory converted into luxury apartments', 'APARTMENT', 'AVAILABLE', 425000, 2, 2, 1600, '567 Factory Ln', 'Pittsburgh', 'PA', '15222', NOW(), NOW()),
(28, 'Mid-Century Modern', 'Preserved 1950s architectural gem', 'HOUSE', 'AVAILABLE', 775000, 3, 2, 1800, '1955 Retro Rd', 'Palm Springs', 'CA', '92262', NOW(), NOW()),
(29, 'Urban Penthouse', 'Two-story penthouse with rooftop terrace', 'APARTMENT', 'AVAILABLE', 1600000, 3, 3.5, 2850, '1001 Highrise Blvd', 'Chicago', 'IL', '60601', NOW(), NOW()),
(30, 'Countryside Mansion', 'Elegant estate on 5 acres with pool and guest house', 'HOUSE', 'AVAILABLE', 2250000, 6, 5.5, 6500, '1 Manor Way', 'Greenwich', 'CT', '06830', NOW(), NOW());

-- Set the sequence to continue from the highest ID
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));

-- Insert sample property images (at least one image per property)
INSERT INTO property_images (id, property_id, name, type, url, is_main, display_order, file_size, created_at, updated_at)
VALUES
-- Property 1 images
(1, 1, '754c2db0-ab02-4615-9978-5585d13f9076.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+1', true, 0, NULL, NOW(), NOW()),
(2, 1, 'modern-apartment-living.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+1+Interior', false, 1, NULL, NOW(), NOW()),

-- Property 2-30 images (one main image per property)
(3, 2, 'suburban-home.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+2', true, 0, NULL, NOW(), NOW()),
(4, 3, 'downtown-apartment.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+3', true, 0, NULL, NOW(), NOW()),
(5, 4, 'beach-house.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+4', true, 0, NULL, NOW(), NOW()),
(6, 5, 'mountain-cabin.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+5', true, 0, NULL, NOW(), NOW()),
(7, 6, 'townhouse.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+6', true, 0, NULL, NOW(), NOW()),
(8, 7, 'smart-home.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+7', true, 0, NULL, NOW(), NOW()),
(9, 8, 'loft.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+8', true, 0, NULL, NOW(), NOW()),
(10, 9, 'garden-apt.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+9', true, 0, NULL, NOW(), NOW()),
(11, 10, 'penthouse.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+10', true, 0, NULL, NOW(), NOW()),
(12, 11, 'waterfront.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+11', true, 0, NULL, NOW(), NOW()),
(13, 12, 'ranch.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+12', true, 0, NULL, NOW(), NOW()),
(14, 13, 'micro-loft.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+13', true, 0, NULL, NOW(), NOW()),
(15, 14, 'victorian.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+14', true, 0, NULL, NOW(), NOW()),
(16, 15, 'golf-villa.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+15', true, 0, NULL, NOW(), NOW()),
(17, 16, 'firehouse.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+16', true, 0, NULL, NOW(), NOW()),
(18, 17, 'forest-home.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+17', true, 0, NULL, NOW(), NOW()),
(19, 18, 'studio.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+18', true, 0, NULL, NOW(), NOW()),
(20, 19, 'lakefront.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+19', true, 0, NULL, NOW(), NOW()),
(21, 20, 'desert-home.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+20', true, 0, NULL, NOW(), NOW()),
(22, 21, 'brownstone.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+21', true, 0, NULL, NOW(), NOW()),
(23, 22, 'highrise.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+22', true, 0, NULL, NOW(), NOW()),
(24, 23, 'barn.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+23', true, 0, NULL, NOW(), NOW()),
(25, 24, 'french-quarter.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+24', true, 0, NULL, NOW(), NOW()),
(26, 25, 'schoolhouse.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+25', true, 0, NULL, NOW(), NOW()),
(27, 26, 'island-cottage.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+26', true, 0, NULL, NOW(), NOW()),
(28, 27, 'industrial.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+27', true, 0, NULL, NOW(), NOW()),
(29, 28, 'mid-century.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+28', true, 0, NULL, NOW(), NOW()),
(30, 29, 'urban-penthouse.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+29', true, 0, NULL, NOW(), NOW()),
(31, 30, 'mansion.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+30', true, 0, NULL, NOW(), NOW()),

-- Add a few extra images to some properties
(32, 1, 'modern-kitchen.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+1+Kitchen', false, 2, NULL, NOW(), NOW()),
(33, 4, 'beach-view.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+4+View', false, 1, NULL, NOW(), NOW()),
(34, 4, 'beach-interior.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+4+Interior', false, 2, NULL, NOW(), NOW()),
(35, 10, 'penthouse-view.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+10+View', false, 1, NULL, NOW(), NOW()),
(36, 15, 'golf-view.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+15+View', false, 1, NULL, NOW(), NOW()),
(37, 19, 'lake-view.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+19+View', false, 1, NULL, NOW(), NOW()),
(38, 21, 'brownstone-interior.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+21+Interior', false, 1, NULL, NOW(), NOW()),
(39, 28, 'mid-century-interior.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+28+Interior', false, 1, NULL, NOW(), NOW()),
(40, 30, 'mansion-garden.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+30+Garden', false, 1, NULL, NOW(), NOW()),
(41, 30, 'mansion-pool.jpg', 'image/jpeg', 'https://placehold.co/600x400/png?text=Property+30+Pool', false, 2, NULL, NOW(), NOW());

-- Set the sequence to continue from the highest ID
SELECT setval('property_images_id_seq', (SELECT MAX(id) FROM property_images));