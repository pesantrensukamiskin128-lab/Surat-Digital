const { execSync } = require('child_process');
const path = require('path');

/**
 * Jalankan prisma migrate deploy secara otomatis saat server start.
 * Hanya berjalan di production dan jika DATABASE_URL tersedia.
 */
async function autoMigrate() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('⏭️  Auto-migrate dilewati (bukan production)');
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL tidak ditemukan, auto-migrate dilewati');
    return;
  }

  try {
    console.log('🔄 Menjalankan prisma migrate deploy...');
    const rootDir = path.join(__dirname, '../../');
    execSync('npx prisma migrate deploy', {
      cwd: rootDir,
      stdio: 'inherit',
      env: process.env,
    });
    console.log('✅ Migrasi database selesai');
  } catch (err) {
    console.error('❌ Migrasi gagal:', err.message);
    // Tidak throw — biarkan server tetap jalan meski migrasi gagal
    // agar bisa dicek via endpoint /api/health
  }
}

/**
 * Jalankan seed database.
 * Dipanggil via endpoint /api/setup/seed (dilindungi SETUP_SECRET).
 */
async function runSeed() {
  const seedPath = path.join(__dirname, '../../prisma/seed.js');
  // Hapus cache agar seed selalu dijalankan ulang
  delete require.cache[require.resolve(seedPath)];
  require(seedPath);
}

module.exports = { autoMigrate, runSeed };
