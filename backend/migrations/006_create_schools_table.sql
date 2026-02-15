-- Migration: Create schools table
-- Description: Creates the schools table for educational institutions

-- Create the schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_schools_name ON schools(name);

-- Add comments
COMMENT ON TABLE schools IS 'Table for storing school information';
COMMENT ON COLUMN schools.contact_email IS 'Administrative contact email for the school';
COMMENT ON COLUMN schools.contact_phone IS 'Administrative contact phone for the school';