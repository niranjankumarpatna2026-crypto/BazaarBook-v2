import { query } from '../db.js';
import { hashPassword } from '../utils/password.js';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

async function main() {
  console.log('\n🔐 Admin Seed\n');
  const email = (await ask('Email: ')).trim().toLowerCase();
  const name = (await ask('Name: ')).trim();
  const password = (await ask('Password (min 8): ')).trim();

  if (!email || !name || password.length < 8) {
    console.error('Invalid'); process.exit(1);
  }

  const hash = await hashPassword(password);
  const { rows } = await query(
    `INSERT INTO admins (email, password_hash, name, role)
     VALUES ($1,$2,$3,'super')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
     RETURNING id, email, name, role`,
    [email, hash, name]
  );

  console.log('✅ Admin created:', rows[0]);
  rl.close();
  process.exit(0);
}

main();
