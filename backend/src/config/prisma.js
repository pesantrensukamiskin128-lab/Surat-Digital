const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Naikkan max_allowed_packet agar konten HTML dengan gambar base64 bisa tersimpan.
// Default MySQL 1-4MB seringkali tidak cukup untuk surat dengan banyak gambar.
prisma.$connect().then(async () => {
  try {
    await prisma.$executeRawUnsafe('SET SESSION max_allowed_packet = 67108864'); // 64MB
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ max_allowed_packet MySQL diset ke 64MB');
    }
  } catch (err) {
    // Tidak fatal — mungkin user DB tidak punya izin SET SESSION
    console.warn('⚠️ Tidak bisa set max_allowed_packet:', err.message);
  }
}).catch(() => {}); // koneksi awal gagal ditangani oleh Prisma sendiri

module.exports = prisma;
