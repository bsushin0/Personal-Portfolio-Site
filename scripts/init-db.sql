-- Database schema for contact form submissions
-- Run this SQL in your Neon database console to create the table

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_submitted_at (submitted_at DESC),
  INDEX idx_email (email),
  INDEX idx_ip_address (ip_address)
);

-- Optional: Create a view for easier querying
CREATE OR REPLACE VIEW contact_submissions_summary AS
SELECT 
  id,
  name,
  email,
  subject,
  LEFT(message, 100) || '...' as message_preview,
  ip_address,
  CONCAT(city, ', ', region, ', ', country) as location,
  submitted_at
FROM contact_submissions
ORDER BY submitted_at DESC;
