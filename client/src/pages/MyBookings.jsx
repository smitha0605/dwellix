import { useEffect, useState } from 'react';
import api from '../api/axios';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/bookings/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBookings(res.data.bookings))
      .catch(() => setError('Could not load bookings'));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>My Bookings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {bookings.length === 0 && !error && <p>No bookings yet.</p>}
      {bookings.map(b => (
        <div key={b.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <h3>{b.title}</h3>
          <p>{b.location}</p>
          <p>{new Date(b.check_in).toLocaleDateString()} → {new Date(b.check_out).toLocaleDateString()}</p>
          <p>Total: ₹{b.total_price}</p>
          <p style={{ fontSize: 12, color: '#888' }}>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;