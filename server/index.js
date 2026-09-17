const express = require('express');

const app = express();
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Dwellix API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});