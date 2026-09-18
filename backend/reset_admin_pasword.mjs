import bcrypt from 'bcryptjs';
import { query } from './dist/db.js';

async function resetPassword() {
  try {
    console.log('🔐 Password reset kar rahe hain...');

    const newPassword = 'NayaStrong@2026!';
    const hash = await bcrypt.hash(newPassword, 12);

    const result = await query(
      'UPDATE admins SET password_hash = $1 WHERE email = $2 RETURNING id, email, name',
      [hash, 'admin@bazaar-book.com']
    );

    if (result.rowCount === 0) {
      console.error('❌ Admin nahi mila');
      process.exit(1);
    }

    console.log('✅ Password reset ho gaya!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    ' + result.rows[0].email);
    console.log('👤 Name:     ' + result.rows[0].name);
    console.log('🔑 Password: ' + newPassword);
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

resetPassword();