import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(res => setProperty(res.data.property))
      .catch(() => setError('Property not found'));
  }, [id]);

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
    </div>
  );
}

export default PropertyDetail;