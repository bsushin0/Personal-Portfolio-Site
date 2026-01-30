-- Database schema for contact form submissions
-- Run this SQL in your Neon database console to create the table

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  
  -- Form data
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  
  -- Geolocation data
  ip_address VARCHAR(45) NOT NULL,
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- User agent and browser information
  user_agent TEXT,
  browser_name VARCHAR(100),
  os_name VARCHAR(100),
  device_type VARCHAR(50),
  
  -- Timestamps
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_submitted_at (submitted_at DESC),
  INDEX idx_email (email),
  INDEX idx_ip_address (ip_address),
  INDEX idx_country (country),
  INDEX idx_device_type (device_type)
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
  browser_name,
  device_type,
  submitted_at
FROM contact_submissions
ORDER BY submitted_at DESC;

-- Website visit tracking table
CREATE TABLE IF NOT EXISTS visit_logs (
  id SERIAL PRIMARY KEY,
  
  -- IP and Geolocation data
  ip_address VARCHAR(45) NOT NULL,
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone VARCHAR(50),
  isp VARCHAR(255),
  
  -- User agent and browser information
  user_agent TEXT,
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  device_type VARCHAR(50),
  
  -- Page and referrer information
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  
  -- Timestamps
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_visited_at (visited_at DESC),
  INDEX idx_ip_address (ip_address),
  INDEX idx_country (country),
  INDEX idx_device_type (device_type),
  INDEX idx_browser (browser_name),
  INDEX idx_os (os_name)
);

-- Optional: Create a view for visit analytics
CREATE OR REPLACE VIEW visit_logs_summary AS
SELECT 
  DATE(visited_at) as visit_date,
  COUNT(*) as total_visits,
  COUNT(DISTINCT ip_address) as unique_visitors,
  CONCAT(city, ', ', region, ', ', country) as location,
  browser_name,
  os_name,
  device_type,
  MAX(visited_at) as last_visit
FROM visit_logs
GROUP BY visit_date, location, browser_name, os_name, device_type
ORDER BY visit_date DESC;
