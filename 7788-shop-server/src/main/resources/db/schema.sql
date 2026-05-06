-- PetShop Database Schema
-- Run this in PostgreSQL: psql -U petshop -d petshop -f schema.sql

-- Users
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL       PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,
    email           VARCHAR(100),
    phone           VARCHAR(20),
    nickname        VARCHAR(50),
    avatar          VARCHAR(500),
    role            VARCHAR(20)     NOT NULL DEFAULT 'USER',
    is_deleted      SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id              BIGSERIAL       PRIMARY KEY,
    parent_id       BIGINT          DEFAULT 0,
    name            VARCHAR(50)     NOT NULL,
    icon            VARCHAR(500),
    sort_order      INT             NOT NULL DEFAULT 0,
    is_deleted      SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id              BIGSERIAL       PRIMARY KEY,
    category_id     BIGINT          NOT NULL REFERENCES categories(id),
    name            VARCHAR(200)    NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2)   NOT NULL CHECK (price >= 0),
    stock           INT             NOT NULL DEFAULT 0 CHECK (stock >= 0),
    main_image      VARCHAR(500),
    sales_count     INT             NOT NULL DEFAULT 0,
    is_on_sale      SMALLINT        NOT NULL DEFAULT 1,
    is_deleted      SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
    id              BIGSERIAL       PRIMARY KEY,
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    image_url       VARCHAR(500)    NOT NULL,
    sort_order      INT             NOT NULL DEFAULT 0,
    is_deleted      SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id),
    receiver_name   VARCHAR(50)     NOT NULL,
    phone           VARCHAR(20)     NOT NULL,
    province        VARCHAR(50)     NOT NULL,
    city            VARCHAR(50)     NOT NULL,
    district        VARCHAR(50)     NOT NULL,
    detail          VARCHAR(200)    NOT NULL,
    is_default      SMALLINT        NOT NULL DEFAULT 0,
    is_deleted      SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id),
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    quantity        INT             NOT NULL DEFAULT 1 CHECK (quantity > 0),
    is_deleted      SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id              BIGSERIAL       PRIMARY KEY,
    order_no        VARCHAR(32)     NOT NULL UNIQUE,
    user_id         BIGINT          NOT NULL REFERENCES users(id),
    address_snapshot TEXT           NOT NULL,
    total_amount    DECIMAL(10,2)   NOT NULL CHECK (total_amount >= 0),
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING_PAYMENT',
    payment_time    TIMESTAMP,
    is_deleted      SMALLINT        NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id              BIGSERIAL       PRIMARY KEY,
    order_id        BIGINT          NOT NULL REFERENCES orders(id),
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    product_name    VARCHAR(200)    NOT NULL,
    product_image   VARCHAR(500),
    price           DECIMAL(10,2)   NOT NULL,
    quantity        INT             NOT NULL CHECK (quantity > 0),
    subtotal        DECIMAL(10,2)   NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE is_deleted = 0;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id) WHERE is_deleted = 0;
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name) WHERE is_deleted = 0;
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id) WHERE is_deleted = 0;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status) WHERE is_deleted = 0;
