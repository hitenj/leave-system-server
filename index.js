const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());


sequelize.authenticate().then(() => {
  console.log('✅ Connected to DB');
}).catch(err => {
  console.error('❌ DB Error:', err);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('Leave Management API is running ✅');
});


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
