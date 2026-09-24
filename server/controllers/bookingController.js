const pool = require('../db/pool');

exports.createBooking = async (req, res) => {
  try {
    const guestId = req.user.id;
    const { property_id, check_in, check_out } = req.body;

    if (!property_id || !check_in || !check_out) {
      return res.status(400).json({ message: 'Property, check-in and check-out dates are required' });
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    // 1. Confirm property exists, get its price
    const propertyResult = await pool.query(
      'SELECT id, price_per_night FROM properties WHERE id = $1',
      [property_id]
    );
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const property = propertyResult.rows[0];

    // 2. Check for overlapping bookings
    const overlapCheck = await pool.query(
      `SELECT id FROM bookings
       WHERE property_id = $1
       AND status != 'cancelled'
       AND check_in < $3
       AND check_out > $2`,
      [property_id, check_in, check_out]
    );
    if (overlapCheck.rows.length > 0) {
      return res.status(409).json({ message: 'These dates are not available for this property' });
    }

    // 3. Calculate total price
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    const totalPrice = nights * parseFloat(property.price_per_night);

    // 4. Insert booking
    const result = await pool.query(
      `INSERT INTO bookings (property_id, guest_id, check_in, check_out, total_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [property_id, guestId, check_in, check_out, totalPrice]
    );

    return res.status(201).json({ booking: result.rows[0] });
  } catch (err) {
    console.error('Create booking error:', err.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// GET /api/bookings/my — guest's own bookings
exports.getMyBookings = async (req, res) => {
  try {
    const guestId = req.user.id;
    const result = await pool.query(
      `SELECT bookings.*, properties.title, properties.location, properties.price_per_night
       FROM bookings
       JOIN properties ON bookings.property_id = properties.id
       WHERE bookings.guest_id = $1
       ORDER BY bookings.check_in DESC`,
      [guestId]
    );
    return res.status(200).json({ bookings: result.rows });
  } catch (err) {
    console.error('Get my bookings error:', err.message);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};