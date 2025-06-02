-- init-db.sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO products (name, description, price, stock) VALUES
  ('Laptop', 'High-performance laptop with 16GB RAM', 1299.99, 10),
  ('Smartphone', 'Latest model with 128GB storage', 799.99, 25),
  ('Headphones', 'Noise-cancelling Bluetooth headphones', 199.99, 50),
  ('Tablet', '10-inch screen with 64GB storage', 349.99, 15),
  ('Monitor', '27-inch 4K monitor', 399.99, 8);
