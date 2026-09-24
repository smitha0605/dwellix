import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function MyListings() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/properties/my/listings', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProperties(res.data.properties))
      .catch(() => setError('Could not load your listings'));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>My Listings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {properties.length === 0 && !error && <p>You haven't listed anything yet.</p>}
      {properties.map(p => (
        <div key={p.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <h3>{p.title}</h3>
          <p>{p.location}</p>
          <p>₹{p.price_per_night} / night</p>
        </div>
      ))}
      <br />
      <Link to="/create-listing">+ Add New Listing</Link>
    </div>
  );
}

export default MyListings;