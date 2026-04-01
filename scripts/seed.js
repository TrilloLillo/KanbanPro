const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // or 'bcrypt' — match what you use in your auth

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  const email = 'trillo@mail.com';
  const name = 'trillo';
  const password = 'admin123';

  const passwordHash = await bcrypt.hash(password, 10);

await pool.query(
  `INSERT INTO usuarios (name, email, password, "createdAt", "updatedAt")
   VALUES ($1, $2, $3, NOW(), NOW())
   ON CONFLICT (email) DO NOTHING`,
  [name, email, passwordHash]
);

  console.log('✅ Seed user created (or already exists)');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});