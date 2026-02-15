-- Migration: Create tags table
-- Description: Creates the tags table for predefined tag categories

-- Create the tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined tags
INSERT INTO tags (name, description) VALUES
('учёба', 'Related to studying'),
('друзья', 'Related to friends'),
('семья', 'Related to family'),
('здоровье', 'Related to health'),
('хобби', 'Related to hobbies'),
('будущее', 'Related to future'),
('одиночество', 'Related to loneliness');

-- Create indexes
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_active ON tags(is_active);

-- Add comments
COMMENT ON TABLE tags IS 'Table for predefined tag categories for mood entries';
COMMENT ON COLUMN tags.is_active IS 'Indicates if this tag is available for selection';