const mysql = require('mysql2/promise');

let pool;

const ddlCategories = `
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  parent_id BIGINT UNSIGNED NULL,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_categories_parent (parent_id),
  INDEX idx_categories_name (name),
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);`;

const ddlProducts = `
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  image_url VARCHAR(900) NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2) NULL,
  review_count INT  NULL DEFAULT 0,
  rating DECIMAL(2,1)  NULL DEFAULT 0.0,
  purpose VARCHAR(255) NULL,
  bead VARCHAR(100) NOT NULL,
  mukhi VARCHAR(50) NOT NULL,
  plating ENUM('gold', 'silver', 'duotone') NOT NULL DEFAULT 'silver',
  is_active TINYINT(1) NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_products_category (category_id),
  INDEX idx_products_title (title),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
`;

const ddlTickets = `
-- Create the tickets table if it doesn't exist
CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  query TEXT NOT NULL,
  status ENUM('pending', 'progress', 'resolved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_id (ticket_id),
  INDEX idx_ticket_email (email),
  INDEX idx_ticket_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

// We'll create the trigger separately after the table is created
const createTicketTrigger = async (pool) => {
  try {
    // First, drop the trigger if it exists
    await pool.query('DROP TRIGGER IF EXISTS before_ticket_insert;');
    
    // Create the trigger
    await pool.query(`
      CREATE TRIGGER before_ticket_insert
      BEFORE INSERT ON tickets
      FOR EACH ROW
      BEGIN
        DECLARE next_id INT;
        SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_id, 5) AS UNSIGNED)), 0) + 1 INTO next_id FROM tickets;
        SET NEW.ticket_id = CONCAT('TKT-', LPAD(next_id, 4, '0'));
      END;
    `);
    console.log('Ticket trigger created successfully');
  } catch (error) {
    console.error('Error creating ticket trigger:', error);
    throw error;
  }
};

const ddlUsers = `
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, 
  phoneNumber VARCHAR(20) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_users_email (email)
);`;


const connectDB = async () => {
  try {
    if (!pool) {
      pool = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        multipleStatements: true // Allow multiple statements for trigger creation
      });
      
      // Create tables
      await pool.query(ddlCategories);
      await pool.query(ddlProducts);
      await pool.query(ddlUsers);
      await pool.query(ddlTickets);
      
      // Create the ticket trigger
      await createTicketTrigger(pool);
      
      console.log("MySQL Database connected and initialized");
    }
    return pool;
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    throw error;
  }
};

module.exports = connectDB;