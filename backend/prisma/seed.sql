-- =============================================
-- SAFIRA - Seed Data
-- Import file ini via phpMyAdmin untuk mengisi data awal
-- =============================================

-- Profil Organisasi
INSERT IGNORE INTO `OrganisasiProfil` (`id`, `tingkatanOrg`, `namaOrg`, `daerahOrg`, `alamat`, `telepon`, `email`, `website`, `logoPath`, `createdAt`, `updatedAt`)
VALUES (
  UUID(),
  'Pimpinan Cabang',
  'Fatayat Nahdlatul Ulama',
  'Kota Bandung',
  'Jl. Sancang No. 8 Kel. Burangrang, Kec. Lengkong, Kota Bandung 40262',
  '+6285295361348',
  'info@fatayatnukotabandung.or.id',
  'www.fatayatnukotabandung.or.id',
  NULL,
  NOW(),
  NOW()
);

-- Users
-- admin@safira.com / admin123
INSERT IGNORE INTO `User` (`id`, `email`, `password`, `namaLengkap`, `jabatan`, `nomorHp`, `role`, `isActive`, `fotoProfil`, `createdAt`, `updatedAt`)
VALUES (
  UUID(),
  'admin@safira.com',
  '$2a$12$X1moCiv5LdHweO0r9VSiDustnieEUPcG5YtHhYuDub97X6ibql3J2',
  'Administrator',
  'Administrator Sistem',
  '',
  'ADMIN',
  1,
  NULL,
  NOW(),
  NOW()
);

-- sekretaris@safira.com / password123
INSERT IGNORE INTO `User` (`id`, `email`, `password`, `namaLengkap`, `jabatan`, `nomorHp`, `role`, `isActive`, `fotoProfil`, `createdAt`, `updatedAt`)
VALUES (
  UUID(),
  'sekretaris@safira.com',
  '$2a$12$sY2p2ShJUzSCMxXN1RNJzOHK5B5.Neja0iqDcYUYnwcLJwlXM1I1m',
  'Siti Aminah',
  'Sekretaris Umum',
  '',
  'SEKRETARIS',
  1,
  NULL,
  NOW(),
  NOW()
);

-- ketua@safira.com / password123
INSERT IGNORE INTO `User` (`id`, `email`, `password`, `namaLengkap`, `jabatan`, `nomorHp`, `role`, `isActive`, `fotoProfil`, `createdAt`, `updatedAt`)
VALUES (
  UUID(),
  'ketua@safira.com',
  '$2a$12$sY2p2ShJUzSCMxXN1RNJzOHK5B5.Neja0iqDcYUYnwcLJwlXM1I1m',
  'Hj. Fatimah Zahra',
  'Ketua Umum',
  '',
  'KETUA',
  1,
  NULL,
  NOW(),
  NOW()
);

-- pengurus1@safira.com / password123
INSERT IGNORE INTO `User` (`id`, `email`, `password`, `namaLengkap`, `jabatan`, `nomorHp`, `role`, `isActive`, `fotoProfil`, `createdAt`, `updatedAt`)
VALUES (
  UUID(),
  'pengurus1@safira.com',
  '$2a$12$sY2p2ShJUzSCMxXN1RNJzOHK5B5.Neja0iqDcYUYnwcLJwlXM1I1m',
  'Nur Hidayah',
  'Bendahara',
  '',
  'PENGURUS',
  1,
  NULL,
  NOW(),
  NOW()
);

-- pengurus2@safira.com / password123
INSERT IGNORE INTO `User` (`id`, `email`, `password`, `namaLengkap`, `jabatan`, `nomorHp`, `role`, `isActive`, `fotoProfil`, `createdAt`, `updatedAt`)
VALUES (
  UUID(),
  'pengurus2@safira.com',
  '$2a$12$sY2p2ShJUzSCMxXN1RNJzOHK5B5.Neja0iqDcYUYnwcLJwlXM1I1m',
  'Aisyah Putri',
  'Koordinator Bidang Pendidikan',
  '',
  'PENGURUS',
  1,
  NULL,
  NOW(),
  NOW()
);
