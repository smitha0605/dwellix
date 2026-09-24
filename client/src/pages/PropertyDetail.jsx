import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingError, setBookingError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(res => setProperty(res.data.property))
      .catch(() => setError('Property not found'));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    setBookingError('');

    if (!user) {
      setBookingError('Please log in to book.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/bookings',
        { property_id: id, check_in: checkIn, check_out: checkOut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingMsg(`Booked! Total: ₹${res.data.booking.total_price}`);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed');
    }
  };

  if (error) return <p style={{ textAlign: 'center', marginTop: 60 }}>{error}</p>;
  if (!property) return <p style={{ textAlign: 'center', marginTop: 60 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>{property.title}</h2>
      <p>{property.location}</p>
      <p>₹{property.price_per_night} / night</p>
      <p>Up to {property.max_guests} guests</p>
      <p>{property.property_type}</p>
      <p>{property.description}</p>
      <p style={{ fontSize: 13, color: '#888' }}>Hosted by {property.host_name} ({property.host_email})</p>

      <hr style={{ margin: '24px 0' }} />

      <h3>Book this stay</h3>
      <form onSubmit={handleBook}>
        <label>Check-in: </label>
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
        <br /><br />
        <label>Check-out: </label>
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required />
        <br /><br />
        <button type="submit">Book Now</button>
      </form>
      {bookingMsg && <p style={{ color: 'green' }}>{bookingMsg}</p>}
      {bookingError && <p style={{ color: 'red' }}>{bookingError}</p>}
    </div>
  );
}

export default PropertyDetail;