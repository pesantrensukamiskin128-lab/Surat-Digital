-- CreateTable: OrganisasiProfil
CREATE TABLE `OrganisasiProfil` (
    `id` VARCHAR(36) NOT NULL,
    `tingkatanOrg` VARCHAR(191) NOT NULL DEFAULT 'Pimpinan Cabang',
    `namaOrg` VARCHAR(191) NOT NULL DEFAULT 'Fatayat Nahdlatul Ulama',
    `daerahOrg` VARCHAR(191) NOT NULL DEFAULT 'Kota Bandung',
    `alamat` TEXT NOT NULL,
    `telepon` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `website` VARCHAR(191) NOT NULL DEFAULT '',
    `logoPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: User
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL DEFAULT '',
    `nomorHp` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('ADMIN','SEKRETARIS','KETUA','PENGURUS') NOT NULL DEFAULT 'PENGURUS',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `fotoProfil` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: SuratKeluar
CREATE TABLE `SuratKeluar` (
    `id` VARCHAR(36) NOT NULL,
    `nomorSurat` VARCHAR(191) NULL,
    `jenisSurat` ENUM('A','B','C','D','E','F','G','H','I','J','K','SK') NOT NULL DEFAULT 'A',
    `perihal` VARCHAR(191) NOT NULL,
    `lampiran` VARCHAR(191) NULL,
    `isiSurat` TEXT NOT NULL,
    `lampiranIsi` TEXT NULL,
    `tujuanSurat` TEXT NULL,
    `tanggalMasehi` DATETIME(3) NOT NULL,
    `tanggalHijriyah` VARCHAR(191) NOT NULL,
    `tempatTerbit` VARCHAR(191) NOT NULL DEFAULT 'Bandung',
    `status` ENUM('DRAFT','MENUNGGU_SEKRETARIS','MENUNGGU_KETUA','DITOLAK_SEKRETARIS','DITOLAK_KETUA','SELESAI') NOT NULL DEFAULT 'DRAFT',
    `sekretarisId` VARCHAR(36) NULL,
    `ketuaId` VARCHAR(36) NULL,
    `ttdSekretaris` BOOLEAN NOT NULL DEFAULT false,
    `ttdKetua` BOOLEAN NOT NULL DEFAULT false,
    `tglTtdSekretaris` DATETIME(3) NULL,
    `tglTtdKetua` DATETIME(3) NULL,
    `catatanTolak` TEXT NULL,
    `ditolakOleh` VARCHAR(191) NULL,
    `qrCodePath` VARCHAR(191) NULL,
    `qrCodeToken` VARCHAR(191) NULL,
    `pembuatId` VARCHAR(36) NOT NULL,
    `penerimaEksternal` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SuratKeluar_nomorSurat_key`(`nomorSurat`),
    UNIQUE INDEX `SuratKeluar_qrCodeToken_key`(`qrCodeToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: PenerimaInternal
CREATE TABLE `PenerimaInternal` (
    `id` VARCHAR(36) NOT NULL,
    `suratId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `sudahDibaca` BOOLEAN NOT NULL DEFAULT false,
    `dibacaAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: SuratMasuk
CREATE TABLE `SuratMasuk` (
    `id` VARCHAR(36) NOT NULL,
    `nomorSurat` VARCHAR(191) NULL,
    `pengirim` VARCHAR(191) NOT NULL,
    `perihal` VARCHAR(191) NOT NULL,
    `isiSurat` TEXT NULL,
    `lampiran` TEXT NULL,
    `tanggalSurat` DATETIME(3) NOT NULL,
    `tanggalTerima` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('BARU','DIBACA','DIDISPOSISI') NOT NULL DEFAULT 'BARU',
    `filePath` VARCHAR(191) NULL,
    `uploaderId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: PushSubscription
CREATE TABLE `PushSubscription` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `endpoint` VARCHAR(500) NOT NULL,
    `p256dh` VARCHAR(255) NOT NULL,
    `auth` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PushSubscription_endpoint_key`(`endpoint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Notifikasi
CREATE TABLE `Notifikasi` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `pesan` TEXT NOT NULL,
    `url` VARCHAR(191) NOT NULL DEFAULT '/',
    `dibaca` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Agenda
CREATE TABLE `Agenda` (
    `id` VARCHAR(36) NOT NULL,
    `namaAgenda` VARCHAR(191) NOT NULL,
    `penyelenggara` VARCHAR(191) NOT NULL,
    `kategori` ENUM('MUSYAWARAH','RAPAT','PENGAJIAN','LAIN_LAIN') NOT NULL DEFAULT 'RAPAT',
    `tipe` ENUM('LURING','DARING','HIBRID') NOT NULL DEFAULT 'LURING',
    `tempat` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `waktuMulai` VARCHAR(191) NOT NULL,
    `waktuSelesai` VARCHAR(191) NOT NULL,
    `zonaWaktu` ENUM('WIB','WITA','WIT') NOT NULL DEFAULT 'WIB',
    `deskripsi` TEXT NULL,
    `qrToken` VARCHAR(36) NOT NULL,
    `pembuatId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agenda_qrToken_key`(`qrToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: PesertaAgenda
CREATE TABLE `PesertaAgenda` (
    `id` VARCHAR(36) NOT NULL,
    `agendaId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PesertaAgenda_agendaId_userId_key`(`agendaId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Kehadiran
CREATE TABLE `Kehadiran` (
    `id` VARCHAR(36) NOT NULL,
    `agendaId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `nomorHp` VARCHAR(191) NULL,
    `instansi` VARCHAR(191) NULL,
    `jabatan` VARCHAR(191) NULL,
    `metode` ENUM('APLIKASI','FORM') NOT NULL DEFAULT 'APLIKASI',
    `waktuHadir` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Disposisi
CREATE TABLE `Disposisi` (
    `id` VARCHAR(36) NOT NULL,
    `suratMasukId` VARCHAR(36) NOT NULL,
    `dibuatOlehId` VARCHAR(36) NOT NULL,
    `penerimaId` VARCHAR(36) NOT NULL,
    `instruksi` TEXT NOT NULL,
    `catatan` TEXT NULL,
    `sudahDibaca` BOOLEAN NOT NULL DEFAULT false,
    `dibacaAt` DATETIME(3) NULL,
    `jawaban` TEXT NULL,
    `dijawabAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey: SuratKeluar
ALTER TABLE `SuratKeluar` ADD CONSTRAINT `SuratKeluar_sekretarisId_fkey` FOREIGN KEY (`sekretarisId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `SuratKeluar` ADD CONSTRAINT `SuratKeluar_ketuaId_fkey` FOREIGN KEY (`ketuaId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `SuratKeluar` ADD CONSTRAINT `SuratKeluar_pembuatId_fkey` FOREIGN KEY (`pembuatId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: PenerimaInternal
ALTER TABLE `PenerimaInternal` ADD CONSTRAINT `PenerimaInternal_suratId_fkey` FOREIGN KEY (`suratId`) REFERENCES `SuratKeluar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `PenerimaInternal` ADD CONSTRAINT `PenerimaInternal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: SuratMasuk
ALTER TABLE `SuratMasuk` ADD CONSTRAINT `SuratMasuk_uploaderId_fkey` FOREIGN KEY (`uploaderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: PushSubscription
ALTER TABLE `PushSubscription` ADD CONSTRAINT `PushSubscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Notifikasi
ALTER TABLE `Notifikasi` ADD CONSTRAINT `Notifikasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Agenda
ALTER TABLE `Agenda` ADD CONSTRAINT `Agenda_pembuatId_fkey` FOREIGN KEY (`pembuatId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: PesertaAgenda
ALTER TABLE `PesertaAgenda` ADD CONSTRAINT `PesertaAgenda_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `Agenda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `PesertaAgenda` ADD CONSTRAINT `PesertaAgenda_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: Kehadiran
ALTER TABLE `Kehadiran` ADD CONSTRAINT `Kehadiran_agendaId_fkey` FOREIGN KEY (`agendaId`) REFERENCES `Agenda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Kehadiran` ADD CONSTRAINT `Kehadiran_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: Disposisi
ALTER TABLE `Disposisi` ADD CONSTRAINT `Disposisi_suratMasukId_fkey` FOREIGN KEY (`suratMasukId`) REFERENCES `SuratMasuk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Disposisi` ADD CONSTRAINT `Disposisi_dibuatOlehId_fkey` FOREIGN KEY (`dibuatOlehId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Disposisi` ADD CONSTRAINT `Disposisi_penerimaId_fkey` FOREIGN KEY (`penerimaId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
