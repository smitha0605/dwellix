const express = require('express');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const propertyRoutes = require('./routes/properties');
app.use('/api/properties', propertyRoutes);
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Dwellix API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});