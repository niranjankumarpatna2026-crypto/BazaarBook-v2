import { env } from './env.js';
import { createApp } from './app.js';
import { pool } from './db.js';

async function main() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected');
  } catch (e) {
    console.error('❌ Database failed:', e);
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log('');
    console.log('🚀 BazaarBook API');
    console.log('   Env:      ' + env.nodeEnv);
    console.log('   Port:     ' + env.port);
    console.log('   Frontend: ' + env.frontendUrl);
    console.log('');
  });

  const shutdown = async (sig: string) => {
    console.log(sig + ' — shutting down');
    server.close(async () => { await pool.end(); process.exit(0); });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main();
