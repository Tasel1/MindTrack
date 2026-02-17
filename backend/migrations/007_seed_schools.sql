-- Migration: Seed schools data
-- Description: Adds sample schools for testing

-- Insert sample schools
INSERT INTO schools (name, address, contact_email, contact_phone) VALUES
('Central High School', '123 Education Street, Springfield, IL 62701', 'admin@centralhigh.edu', '(555) 123-4567'),
('Eastside Academy', '456 Learning Avenue, Springfield, IL 62702', 'info@eastsideacademy.edu', '(555) 234-5678'),
('Westfield Secondary School', '789 Knowledge Boulevard, Springfield, IL 62703', 'office@westfieldsec.edu', '(555) 345-6789'),
('Northview Middle School', '321 Scholar Lane, Springfield, IL 62704', 'contact@northviewmiddle.edu', '(555) 456-7890'),
('Southport High School', '654 Student Drive, Springfield, IL 62705', 'info@southporthigh.edu', '(555) 567-8901')
ON CONFLICT (name) DO NOTHING;