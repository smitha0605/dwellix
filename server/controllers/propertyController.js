const pool = require('../db/pool');

// POST /api/properties — host only
exports.createProperty = async (req, res) => {
  try {
    const hostId = req.user.id;
    const { title, description, location, price_per_night, max_guests, property_type } = req.body;

    if (!title || !location || !price_per_night) {
      return res.status(400).json({ message: 'Title, location and price are required' });
    }

    const result = await pool.query(
      `INSERT INTO properties (host_id, title, description, location, price_per_night, max_guests, property_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [hostId, title, description || null, location, price_per_night, max_guests || 1, property_type || null]
    );

    return res.status(201).json({ property: result.rows[0] });
  } catch (err) {
    console.error('Create property error:', err.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/properties — public
exports.getAllProperties = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT properties.*, users.name AS host_name
       FROM properties
       JOIN users ON properties.host_id = users.id
       ORDER BY properties.created_at DESC`
    );
    return res.status(200).json({ properties: result.rows });
  } catch (err) {
    console.error('Get properties error:', err.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/properties/:id — public
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT properties.*, users.name AS host_name, users.email AS host_email
       FROM properties
       JOIN users ON properties.host_id = users.id
       WHERE properties.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.status(200).json({ property: result.rows[0] });
  } catch (err) {
    console.error('Get property error:', err.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
// GET /api/properties/my/listings — host's own properties
exports.getMyProperties = async (req, res) => {
  try {
    const hostId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM properties WHERE host_id = $1 ORDER BY created_at DESC`,
      [hostId]
    );
    return res.status(200).json({ properties: result.rows });
  } catch (err) {
    console.error('Get my properties error:', err.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};