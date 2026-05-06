-- Seed Data for PetShop
-- Admin user: admin / admin123 (BCrypt encoded)
INSERT INTO users (username, password, email, nickname, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5Eh', 'admin@petshop.com', 'Admin', 'ADMIN'),
('testuser', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5Eh', 'test@petshop.com', 'Test User', 'USER');

-- Categories
INSERT INTO categories (id, parent_id, name, icon, sort_order) VALUES
(1, 0, 'Dogs', '🐕', 1),
(2, 0, 'Cats', '🐈', 2),
(3, 0, 'Fish', '🐟', 3),
(4, 0, 'Birds', '🐦', 4),
(5, 0, 'Small Pets', '🐹', 5);

-- Products (Dogs category)
INSERT INTO products (category_id, name, description, price, stock, main_image, sales_count) VALUES
(1, 'Premium Dog Food - Chicken & Rice', 'High-quality dry dog food with real chicken and brown rice. Rich in protein and essential nutrients for adult dogs of all breeds.', 45.99, 200, 'https://images.unsplash.com/photo-1589924691995-df2e8a7d38a2?w=400', 156),
(1, 'Orthopedic Dog Bed - Large', 'Memory foam dog bed with removable washable cover. Provides superior comfort and joint support for large breeds.', 89.99, 50, 'https://images.unsplash.com/photo-1541188495357-ad2f894a060b?w=400', 89),
(1, 'Adjustable Dog Harness & Leash Set', 'No-pull dog harness with reflective strips. Breathable mesh material, perfect for daily walks.', 29.99, 150, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', 234),
(1, 'Interactive Dog Puzzle Toy', 'Mental stimulation toy with hidden treat compartments. Keeps your dog engaged and entertained for hours.', 19.99, 120, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400', 178);

-- Products (Cats category)
INSERT INTO products (category_id, name, description, price, stock, main_image, sales_count) VALUES
(2, 'Premium Cat Food - Salmon Recipe', 'Grain-free cat food with wild-caught salmon. Packed with omega-3 fatty acids for healthy skin and shiny coat.', 39.99, 180, 'https://images.unsplash.com/photo-1589924691995-df2e8a7d38a2?w=400', 210),
(2, 'Multi-Level Cat Tree with Scratching Posts', 'Floor-to-ceiling cat tower with multiple platforms, cozy condo, and sisal-wrapped scratching posts.', 79.99, 35, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400', 145),
(2, 'Automatic Cat Litter Box', 'Self-cleaning litter box with odor control system. Compatible with most clumping litters.', 149.99, 25, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', 67),
(2, 'Catnip-Filled Plush Toy Set (4 Pack)', 'Set of 4 plush toys filled with organic catnip. Includes mouse, fish, bird, and ball shapes.', 12.99, 300, 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400', 320);

-- Products (Fish category)
INSERT INTO products (category_id, name, description, price, stock, main_image, sales_count) VALUES
(3, 'Aquarium Starter Kit - 20 Gallon', 'Complete aquarium kit with LED lighting, filtration system, heater, and decorative plants.', 119.99, 30, 'https://images.unsplash.com/photo-1520366498724-709889c41071?w=400', 78),
(3, 'Tropical Fish Food Flakes', 'Color-enhancing tropical fish food flakes. Provides balanced nutrition for all tropical fish species.', 8.99, 500, 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400', 450);

-- Products (Birds category)
INSERT INTO products (category_id, name, description, price, stock, main_image, sales_count) VALUES
(4, 'Deluxe Bird Cage - Large', 'Spacious bird cage with multiple perches, feeding stations, and easy-clean removable tray.', 99.99, 20, 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400', 56),
(4, 'Premium Parrot Seed Mix - 5lb', 'Nutritious seed mix formulated for parrots and large birds. Contains sunflower seeds, peanuts, dried fruits, and pellets.', 24.99, 150, 'https://images.unsplash.com/photo-1606567595334-d39972c85eea?w=400', 123);

-- Products (Small Pets category)
INSERT INTO products (category_id, name, description, price, stock, main_image, sales_count) VALUES
(5, 'Small Animal Cage - 3 Levels', 'Multi-level cage perfect for hamsters, gerbils, or mice. Includes exercise wheel, tunnel, and food dish.', 59.99, 40, 'https://images.unsplash.com/photo-1585110396000-c9ffdc4bd145?w=400', 89),
(5, 'Timothy Hay for Rabbits - 10lb', 'Premium first-cut Timothy hay for rabbits and guinea pigs. High in fiber for optimal digestive health.', 18.99, 200, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', 167);

-- Product Images (sample - using Unsplash placeholders)
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1589924691995-df2e8a7d38a2?w=400', 0),
(1, 'https://images.unsplash.com/photo-1589924691995-df2e8a7d38a2?w=400', 1),
(2, 'https://images.unsplash.com/photo-1541188495357-ad2f894a060b?w=400', 0),
(3, 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', 0),
(4, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400', 0),
(5, 'https://images.unsplash.com/photo-1589924691995-df2e8a7d38a2?w=400', 0),
(6, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400', 0),
(7, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', 0);

-- Update sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('product_images_id_seq', (SELECT MAX(id) FROM product_images));
