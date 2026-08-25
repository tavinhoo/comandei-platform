-- Add 'active' column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

-- Add 'customer_name' column to commands table
ALTER TABLE commands ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

-- Adjust price column type from DOUBLE PRECISION to NUMERIC for precision
ALTER TABLE menu_items ALTER COLUMN price TYPE NUMERIC(10, 2);

-- Adjust total_value column type from DOUBLE PRECISION to NUMERIC for precision
ALTER TABLE commands ALTER COLUMN total_value TYPE NUMERIC(12, 2);

-- Drop the user_role enum type constraint and use VARCHAR for role
-- This is needed because JPA @Enumerated(STRING) stores as VARCHAR, not as a PG enum
ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(32) USING role::text;

-- Drop the enum type if no longer used
DROP TYPE IF EXISTS user_role;
