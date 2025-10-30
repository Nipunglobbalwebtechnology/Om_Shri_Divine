const connectDB = require('../config/db');

// Add a product
// Required: title, slug, image_url, category_id, price
// Optional: old_price, review_count, rating, is_active
exports.addProduct = async ({
  title,
  slug,
  image_url,
  category_id,
  price,
  bead,
  mukhi,
  old_price,
  purpose,
  plating,
  review_count,
  rating,
  is_active
}) => {
  const pool = await connectDB();
  const [result] = await pool.query(
    `INSERT INTO products (title, slug, image_url, category_id, price, old_price, purpose, bead, mukhi, plating, review_count, rating, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      image_url,
      category_id,
      price,
      old_price,
      purpose,
      bead,
      mukhi,
      plating,
      review_count,
      rating,
      is_active,
    ]
  );
  return { id: result.insertId };
};

// Get a single product by slug
exports.getProductBySlug = async (slug) => {
  const pool = await connectDB();
  const [rows] = await pool.query(
    `SELECT p.*,
            c.name AS category_name,
            c.slug AS category_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ? LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
};

// List products with optional filters: { category_id, category_slug }
exports.listProducts = async (filters = {}) => {
  const pool = await connectDB();

  if (filters.category_slug) {
    const [rows] = await pool.query(
      `SELECT p.*
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE c.slug = ? AND p.is_active = 1
       ORDER BY p.created_at DESC`,
      [filters.category_slug]
    );
    return rows;
  }

  if (filters.category_id) {
    const [rows] = await pool.query(
      `SELECT * FROM products WHERE category_id = ? AND is_active = 1 ORDER BY created_at DESC`,
      [filters.category_id]
    );
    return rows;
  }

  const [rows] = await pool.query(
    `SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC`
  );
  return rows;
};

exports.getProductByCategory = async (category_id) => {
  const pool = await connectDB();
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE category_id = ? AND is_active = 1 ORDER BY created_at DESC`,
    [category_id]
  );
  return rows;
};

exports.getAllProducts = async () => {
  const pool = await connectDB();
  const [rows] = await pool.query(
    `SELECT * FROM products`
  );
  return rows;
};

exports.deleteProduct = async (product_id) => {
  const pool = await connectDB();
  const [result] = await pool.query(
    `DELETE FROM products WHERE id = ?`,
    [product_id]
  );
  return result;
};

exports.updateProduct = async (product_id, data) => {
  const pool = await connectDB();
  const [result] = await pool.query(
    `UPDATE products SET ? WHERE id = ?`,
    [data, product_id]
  );
  return result;
};

// Search products by title and optionally by category
// Parameters: { searchTerm: string, categoryId: number (optional) }
exports.searchProduct = async ({ searchTerm, categoryId }) => {
  const pool = await connectDB();
  
  let query = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug 
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = 1 AND p.title LIKE ?
  `;
  
  const params = [`%${searchTerm}%`];
  
  if (categoryId) {
    query += ' AND p.category_id = ?';
    params.push(categoryId);
  }
  
  query += ' ORDER BY p.created_at DESC';
  
  const [rows] = await pool.query(query, params);
  return rows;
};

