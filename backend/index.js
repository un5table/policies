const fs = require('fs');
const path = require('path');
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'backend.log');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
function logToFile(line) {
  const ts = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${ts}] ${line}\n`);
}
const origLog = console.log;
const origErr = console.error;
console.log = function(...args) {
  origLog.apply(console, args);
  logToFile(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
};
console.error = function(...args) {
  origErr.apply(console, args);
  logToFile('ERROR: ' + args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
};
console.log('Backend started');
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');
const { logErrorToFile } = require('./utils/logger');

app.use(cors());
app.use(express.json());
// Serve uploaded files statically for public access
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));
// Log all incoming requests for debugging
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});

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
  // Log error to file and console
  logErrorToFile(`Error in ${req.method} ${req.url}`, err);
  console.error(err);
  if (process.env.NODE_ENV !== 'production') {
    res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    res.status(500).json({ error: err.message });
  }
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
