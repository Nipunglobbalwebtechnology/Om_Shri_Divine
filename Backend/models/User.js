const connectDB = require("../config/db");

exports.registerUser = async ({
  name,
  email,
  password,
  role = 'user',
  phoneNumber,
  is_active = 1,
}) => {
  const pool = await connectDB();
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, phoneNumber, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password, role, phoneNumber, is_active]
  );
  return { id: result.insertId };
};

exports.loginUser = async (email, password) => {
  const pool = await connectDB();
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password]
  );
  return rows[0] || null;
};

exports.getUserDetails = async () => {
  const pool = await connectDB();
  const [rows] = await pool.query(
    `SELECT * FROM users`
  );
  return rows;
};

exports.deleteUser = async (id) => {
  const pool = await connectDB();
  const [result] = await pool.query(
    `DELETE FROM users WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};




