const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Buat profil organisasi default
  const existingProfil = await prisma.organisasiProfil.findFirst();
  if (!existingProfil) {
    await prisma.organisasiProfil.create({
      data: {
        tingkatanOrg: 'Madrasah Ibtidaiyah',
        namaOrg:      'Madrasah',
        daerahOrg:    '',
        alamat:       '',
        telepon:      '',
        email:        '',
        website:      '',
      },
    });
    console.log('✅ Profil organisasi default dibuat');
  }

  // Buat admin default
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@sirama.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: {
        email: 'admin@sirama.com',
        password: hashedPassword,
        namaLengkap: 'Administrator',
        jabatan: 'Administrator Sistem',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin default dibuat: admin@sirama.com / admin123');
  }

  // Buat user contoh
  const users = [
    {
      email: 'tatausaha@sirama.com',
      namaLengkap: 'Siti Aminah',
      jabatan: 'Kepala Tata Usaha',
      role: 'TATA_USAHA',
    },
    {
      email: 'kepala@sirama.com',
      namaLengkap: 'Bapak Kepala',
      jabatan: 'Kepala Madrasah',
      role: 'KEPALA',
    },
    {
      email: 'guru1@sirama.com',
      namaLengkap: 'Nur Hidayah',
      jabatan: 'Guru Kelas 1',
      role: 'GURU',
    },
    {
      email: 'guru2@sirama.com',
      namaLengkap: 'Aisyah Putri',
      jabatan: 'Guru Kelas 2',
      role: 'GURU',
    },
  ];

  for (const userData of users) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      await prisma.user.create({
        data: { ...userData, password: hashedPassword },
      });
      console.log(`✅ User dibuat: ${userData.email} / password123`);
    }
  }

  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
