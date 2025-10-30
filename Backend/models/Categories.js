const connectDB = require("../config/db")


exports.addCategory = async ({ name, slug, parent_id = null, sort_order = 0, is_active = 1 }) => {
    const pool = await connectDB();
    const [result] = await pool.query(
        'INSERT INTO categories(name, slug, parent_id, sort_order, is_active) VALUES(?, ?, ?, ?, ?)',
        [name, slug, parent_id, sort_order, is_active]
    );
    return { id: result.insertId };
};

// Get categories
// - By slug: { slug }
// - By parent: { parent_id } (use null for top-level)
// - All active: {}
exports.getCategory = async (filters = {}) => {
    const pool = await connectDB();

    if (filters.slug) {
        const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ? LIMIT 1', [filters.slug]);
        return rows[0] || null;
    }

    if (Object.prototype.hasOwnProperty.call(filters, 'parent_id')) {
        const [rows] = await pool.query(
            'SELECT * FROM categories WHERE (parent_id <=> ?) AND is_active = 1 ORDER BY sort_order, name',
            [filters.parent_id]
        );
        return rows;
    }

    const [rows] = await pool.query(
        'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order, name'
    );
    return rows;
};

exports.getAllCategories = async () => {
    const pool = await connectDB();
    const [rows] = await pool.query(
        'SELECT * FROM categories'
    );
    return rows;
};

exports.deleteCategory = async (id) => {
    const pool = await connectDB();
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

exports.updateCategory = async (id, { name, slug, parent_id = null, sort_order = 0, is_active = 1 }) => {
    const pool = await connectDB();
    const [result] = await pool.query(
        'UPDATE categories SET name = ?, slug = ?, parent_id = ?, sort_order = ?, is_active = ? WHERE id = ?',
        [name, slug, parent_id, sort_order, is_active, id]
    );
    return result.affectedRows > 0;
};