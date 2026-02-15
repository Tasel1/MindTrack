-- Migration: Create emotions table
-- Description: Creates the emotions table for predefined emotion types

-- Create the emotions table
CREATE TABLE emotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color_code VARCHAR(7), -- Hex color code like #FF0000
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined emotions
INSERT INTO emotions (name, description, color_code) VALUES
('радость', 'Feeling of happiness and joy', '#FFD700'),
('грусть', 'Feeling of sadness', '#4682B4'),
('гнев', 'Feeling of anger', '#DC143C'),
('страх', 'Feeling of fear', '#9370DB'),
('спокойствие', 'Feeling of calmness', '#32CD32'),
('удивление', 'Feeling of surprise', '#FFA500'),
('вина', 'Feeling of guilt', '#808080'),
('стыд', 'Feeling of shame', '#4B0082');

-- Create indexes
CREATE INDEX idx_emotions_name ON emotions(name);
CREATE INDEX idx_emotions_active ON emotions(is_active);

-- Add comments
COMMENT ON TABLE emotions IS 'Table for predefined emotion types';
COMMENT ON COLUMN emotions.color_code IS 'Hex color code for UI representation';
COMMENT ON COLUMN emotions.is_active IS 'Indicates if this emotion is available for selection';