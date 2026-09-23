import api from '../api/axios';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleBecomeHost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.patch(
        '/users/become-host',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Save the new token + user (role is now 'host')
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.reload(); // refresh to reflect new role
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto' }}>
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      {user?.role === 'guest' && (
        <button onClick={handleBecomeHost}>Become a Host</button>
      )}

      {user?.role === 'host' && (
        <p style={{ color: 'green' }}>✅ You're a host — you can create listings.</p>
      )}

      <br /><br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;