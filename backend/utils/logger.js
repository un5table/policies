const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'backend-error.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

function logErrorToFile(message, err) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n${err ? (err.stack || err.message || err) : ''}\n\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
}

module.exports = { logErrorToFile, LOG_FILE };
