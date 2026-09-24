import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CreateListing() {
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    price_per_night: '', max_guests: 1, property_type: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.role !== 'host') {
    return (
      <div style={{ maxWidth: 400, margin: '60px auto' }}>
        <p>Only hosts can create listings. Go to your dashboard to become a host.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await api.post('/properties', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <h2>Create a Listing</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <br /><br />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <br /><br />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <br /><br />
        <input name="price_per_night" type="number" placeholder="Price per night" value={form.price_per_night} onChange={handleChange} required />
        <br /><br />
        <input name="max_guests" type="number" placeholder="Max guests" value={form.max_guests} onChange={handleChange} />
        <br /><br />
        <input name="property_type" placeholder="Property type (House, Apartment...)" value={form.property_type} onChange={handleChange} />
        <br /><br />
        <button type="submit">Create Listing</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreateListing;