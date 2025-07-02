const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Policy Backend API Running');
});

// API routes
app.use('/api/policies', require('./routes/policies'));
app.use('/api/attachments', require('./routes/attachments'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/metadata', require('./routes/metadata'));
app.use('/api/users', require('./routes/users'));
app.use('/api/policyVersions', require('./routes/policyVersions'));
app.use('/api/report', require('./routes/report'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Sync DB (only for dev)
if (process.env.NODE_ENV !== 'production') {
  db.sequelize.sync().then(() => {
    console.log('Database synced');
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
