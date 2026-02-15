-- Migration: Create entries table
-- Description: Creates the entries table for storing mood entries

-- Create the entries table
CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    emotion_id INTEGER NOT NULL REFERENCES emotions(id),
    intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_entries_user_id ON entries(user_id);
CREATE INDEX idx_entries_date ON entries(date);
CREATE INDEX idx_entries_emotion_id ON entries(emotion_id);
CREATE INDEX idx_entries_created_at ON entries(created_at);

-- Add comments
COMMENT ON TABLE entries IS 'Table for storing user mood entries';
COMMENT ON COLUMN entries.intensity IS 'Emotion intensity level from 1 (lowest) to 10 (highest)';
COMMENT ON COLUMN entries.note IS 'Optional text note about the mood entry';