-- KopiSusu Database Schema
-- Drop existing database if exists
DROP DATABASE IF EXISTS kopisusu;
CREATE DATABASE kopisusu;
USE kopisusu;

-- Table: users
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: coffees
CREATE TABLE coffees (
    id_coffee INT AUTO_INCREMENT PRIMARY KEY,
    nama_coffee VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(10, 2) NOT NULL,
    stok INT DEFAULT 0,
    kategori VARCHAR(50),
    gambar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_kategori (kategori),
    INDEX idx_nama (nama_coffee)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: orders
CREATE TABLE orders (
    id_order INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_coffee INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    ukuran ENUM('reguler', 'large') DEFAULT 'reguler',
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('menunggu', 'diproses', 'selesai', 'dibatalkan') DEFAULT 'menunggu',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_coffee) REFERENCES coffees(id_coffee) ON DELETE CASCADE,
    INDEX idx_user (id_user),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: api_keys
CREATE TABLE api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    key_name VARCHAR(100),
    tier ENUM('free', 'premium') DEFAULT 'free',
    is_active BOOLEAN DEFAULT TRUE,
    requests_today INT DEFAULT 0,
    last_request_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    INDEX idx_api_key (api_key),
    INDEX idx_user_active (id_user, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: api_usage_logs
CREATE TABLE api_usage_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_key_id INT NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
    INDEX idx_api_key_date (api_key_id, request_date),
    INDEX idx_endpoint (endpoint)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (nama, email, password, role) VALUES
('Admin BeanByte', 'admin@beanbyte.com', '$2a$10$XqZ8J0YvJ5YvJ5YvJ5YvJ.YvJ5YvJ5YvJ5YvJ5YvJ5YvJ5YvJ5Yv.', 'admin'),
('John Doe', 'john@example.com', '$2a$10$XqZ8J0YvJ5YvJ5YvJ5YvJ.YvJ5YvJ5YvJ5YvJ5YvJ5YvJ5YvJ5Yv.', 'user');

-- Insert sample coffees
INSERT INTO coffees (nama_coffee, deskripsi, harga, stok, kategori, gambar_url) VALUES
('Espresso', 'Classic Italian espresso with rich and bold flavor', 25000, 100, 'Espresso', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'),
('Cappuccino', 'Espresso with steamed milk and foam', 30000, 100, 'Espresso', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'),
('Latte', 'Smooth espresso with steamed milk', 32000, 100, 'Espresso', 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400'),
('Americano', 'Espresso diluted with hot water', 28000, 100, 'Espresso', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'),
('V60 Pour Over', 'Manual brew with clean and bright taste', 35000, 50, 'Manual Brew', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
('French Press', 'Full-bodied coffee with rich flavor', 33000, 50, 'Manual Brew', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),
('Cold Brew', 'Smooth and refreshing cold coffee', 38000, 75, 'Cold Brew', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'),
('Iced Latte', 'Chilled latte with ice', 35000, 75, 'Cold Brew', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),
('Mocha', 'Espresso with chocolate and steamed milk', 36000, 80, 'Espresso', 'https://images.unsplash.com/photo-1578374173703-16119a8f3fd3?w=400'),
('Affogato', 'Espresso poured over vanilla ice cream', 40000, 60, 'Espresso', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400');

-- Insert sample orders
INSERT INTO orders (id_user, id_coffee, quantity, ukuran, total_price, status) VALUES
(2, 1, 2, 'reguler', 50000, 'selesai'),
(2, 3, 1, 'large', 37000, 'diproses'),
(2, 7, 1, 'reguler', 38000, 'menunggu');

-- Note: To create a real admin user, you need to hash the password properly
-- Use this Node.js code to generate a hashed password:
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('admin123', 10);
-- console.log(hash);
