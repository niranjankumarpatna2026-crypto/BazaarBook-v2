CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mobile VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT NOT NULL,
  owner_name VARCHAR(120) NOT NULL,
  shop_name VARCHAR(180) NOT NULL,
  business_type VARCHAR(60) DEFAULT 'Kirana',
  city VARCHAR(80),
  address TEXT,
  plan_code VARCHAR(20) DEFAULT 'free',
  plan_status VARCHAR(20) DEFAULT 'inactive',
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(180) NOT NULL,
  barcode VARCHAR(60),
  category VARCHAR(60) DEFAULT 'General',
  brand VARCHAR(80),
  unit VARCHAR(20) DEFAULT 'pcs',
  price INT NOT NULL DEFAULT 0,
  purchase_price INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 5,
  tax_rate INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  address TEXT,
  city VARCHAR(80),
  group_type VARCHAR(20) DEFAULT 'regular',
  balance INT NOT NULL DEFAULT 0,
  total_billing INT NOT NULL DEFAULT 0,
  total_paid INT NOT NULL DEFAULT 0,
  last_transaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bill_number VARCHAR(30) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(120),
  customer_mobile VARCHAR(15),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal INT NOT NULL DEFAULT 0,
  item_discounts INT NOT NULL DEFAULT 0,
  bill_discount INT NOT NULL DEFAULT 0,
  discount_type VARCHAR(10) DEFAULT 'flat',
  discount_value INT DEFAULT 0,
  gst_enabled BOOLEAN DEFAULT false,
  gst_rate INT DEFAULT 0,
  gst_amount INT DEFAULT 0,
  round_off INT DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  payment_mode VARCHAR(20) NOT NULL DEFAULT 'cash',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'paid',
  paid_amount INT NOT NULL DEFAULT 0,
  due_amount INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_code VARCHAR(20) NOT NULL,
  billing_cycle VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  amount INT NOT NULL,
  currency VARCHAR(5) DEFAULT 'INR',
  plan_code VARCHAR(20) NOT NULL,
  billing_cycle VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bill_prefix VARCHAR(10) DEFAULT 'INV',
  bill_next_number INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin (password: Admin@123456)
INSERT INTO admins (email, password_hash, name, role)
VALUES ('admin@bazaar-book.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eRoI6vJe.Zbe',
  'Super Admin', 'super')
ON CONFLICT (email) DO NOTHING;
