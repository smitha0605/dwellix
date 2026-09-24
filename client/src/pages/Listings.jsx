import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Listings() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get('/properties')
      .then(res => setProperties(res.data.properties))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Browse Stays</h2>
      {properties.length === 0 && <p>No listings yet.</p>}
      <div style={{ display: 'grid', gap: '16px' }}>
        {properties.map(p => (
          <Link key={p.id} to={`/listings/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
              <h3>{p.title}</h3>
              <p>{p.location}</p>
              <p>₹{p.price_per_night} / night · up to {p.max_guests} guests</p>
              <p style={{ fontSize: 12, color: '#888' }}>Hosted by {p.host_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Listings;