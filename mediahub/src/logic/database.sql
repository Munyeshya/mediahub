-- 1. Admin Table
CREATE TABLE Admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- 2. Client Table
CREATE TABLE Client (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL
);

-- 3. Service_Giver Table (Creative Account)
CREATE TABLE Service_Giver (
    giver_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Service_Category Table (e.g., Photography, Videography)
CREATE TABLE Service_Category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- 5. Service_Type Table (e.g., Wedding Photography, Corporate Video)
CREATE TABLE Service_Type (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    service_name VARCHAR(150) UNIQUE NOT NULL,
    base_unit ENUM('Hour', 'Day', 'Project') NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Service_Category(category_id)
);

-- 6. Profile Table (The creative's public details)
CREATE TABLE Profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    giver_id INT NOT NULL UNIQUE, -- One profile per giver
    display_name VARCHAR(100) NOT NULL,
    bio TEXT,
    city VARCHAR(100),
    FOREIGN KEY (giver_id) REFERENCES Service_Giver(giver_id)
);


-- 7. Giver_Service_Price Table (Junction Table with Custom Pricing)
-- This allows givers to select services and set their own price/rate.
CREATE TABLE Giver_Service_Price (
    gs_price_id INT AUTO_INCREMENT PRIMARY KEY,
    giver_id INT NOT NULL,
    service_id INT NOT NULL,
    hourly_rate_rwf DECIMAL(10, 2) NOT NULL,
    min_rate_rwf DECIMAL(10, 2),
    description TEXT,
    
    -- Ensures a giver can only list a specific service once
    UNIQUE KEY unique_giver_service (giver_id, service_id),
    
    FOREIGN KEY (giver_id) REFERENCES Service_Giver(giver_id),
    FOREIGN KEY (service_id) REFERENCES Service_Type(service_id)
);

-- 8. Review Table
CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    giver_id INT NOT NULL,
    client_id INT NOT NULL,
    rating DECIMAL(2, 1) NOT NULL,
    CHECK (rating BETWEEN 1.0 AND 5.0),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (giver_id) REFERENCES Service_Giver(giver_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id)
);

-- 9. Tag Table (Lookup for skills, software, equipment)
CREATE TABLE Tag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE NOT NULL
);

-- 10. Profile_Tag Table (Many-to-Many link between Profile and Tag)
CREATE TABLE Profile_Tag (
    profile_tag_id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    tag_id INT NOT NULL,
    UNIQUE KEY unique_profile_tag (profile_id, tag_id),
    FOREIGN KEY (profile_id) REFERENCES Profile(profile_id),
    FOREIGN KEY (tag_id) REFERENCES Tag(tag_id)
);

-- 11. Booking Table (Tracks work done, used to calculate "Bookings Done")
CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    giver_id INT NOT NULL,
    client_id INT NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Canceled') NOT NULL,
    total_price_rwf DECIMAL(12, 2),
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (giver_id) REFERENCES Service_Giver(giver_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id)
);

CREATE TABLE Payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

ALTER TABLE Client
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
