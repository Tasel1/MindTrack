-- Migration: Create entry_tags table
-- Description: Creates the entry_tags junction table for many-to-many relationship between entries and tags

-- Create the entry_tags table
CREATE TABLE entry_tags (
    entry_id INTEGER NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (entry_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_entry_tags_entry_id ON entry_tags(entry_id);
CREATE INDEX idx_entry_tags_tag_id ON entry_tags(tag_id);

-- Add comments
COMMENT ON TABLE entry_tags IS 'Junction table for many-to-many relationship between entries and tags';