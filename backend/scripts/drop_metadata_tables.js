// Script to drop MetadataAttributes and Contacts tables from the SQLite database
const { Sequelize } = require('sequelize');
const path = require('path');

// Adjust this path if your database file is located elsewhere
const dbPath = path.join(__dirname, '../database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

async function dropTables() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');
    await sequelize.getQueryInterface().dropTable('MetadataAttributes');
    console.log('Dropped table: MetadataAttributes');
    await sequelize.getQueryInterface().dropTable('Contacts');
    console.log('Dropped table: Contacts');
    await sequelize.close();
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

dropTables();
