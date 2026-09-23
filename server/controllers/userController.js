const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

exports.becomeHost = async (req, res) => {
  try {
    const userId = req.user.id; // set by protect middleware

    const result = await pool.query(
      `UPDATE users SET role = 'host' WHERE id = $1
       RETURNING id, name, email, role`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Issue a fresh token with the updated role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error('Become host error:', err.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
