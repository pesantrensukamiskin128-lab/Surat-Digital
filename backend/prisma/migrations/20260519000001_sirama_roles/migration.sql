-- Migrasi SIRAMA: Perbaikan data + rename kolom
-- Jalankan via phpMyAdmin tab SQL

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- LANGKAH 1: Kembalikan enum Role ke versi lengkap dulu
-- agar bisa isi ulang data yang kosong
-- ============================================================
ALTER TABLE `User` MODIFY COLUMN `role`
  ENUM('ADMIN','TATA_USAHA','KEPALA','GURU','SEKRETARIS','KETUA','PENGURUS')
  NOT NULL DEFAULT 'GURU';

-- Perbaiki data yang kosong berdasarkan email
UPDATE `User` SET `role` = 'TATA_USAHA' WHERE `email` = 'sekretaris@safira.com';
UPDATE `User` SET `role` = 'KEPALA'     WHERE `email` = 'ketua@safira.com';
UPDATE `User` SET `role` = 'GURU'       WHERE `email` = 'pengurus1@safira.com';
UPDATE `User` SET `role` = 'GURU'       WHERE `email` = 'pengurus2@safira.com';

-- Finalisasi enum hanya nilai baru
ALTER TABLE `User` MODIFY COLUMN `role`
  ENUM('ADMIN','TATA_USAHA','KEPALA','GURU') NOT NULL DEFAULT 'GURU';

-- ============================================================
-- LANGKAH 2: Ubah enum SuratStatus
-- ============================================================
ALTER TABLE `SuratKeluar` MODIFY COLUMN `status`
  ENUM('DRAFT','MENUNGGU_SEKRETARIS','MENUNGGU_KETUA','DITOLAK_SEKRETARIS','DITOLAK_KETUA','SELESAI',
       'MENUNGGU_TATA_USAHA','MENUNGGU_KEPALA','DITOLAK_TATA_USAHA','DITOLAK_KEPALA')
  NOT NULL DEFAULT 'DRAFT';

UPDATE `SuratKeluar` SET `status` = 'MENUNGGU_TATA_USAHA' WHERE `status` = 'MENUNGGU_SEKRETARIS';
UPDATE `SuratKeluar` SET `status` = 'MENUNGGU_KEPALA'     WHERE `status` = 'MENUNGGU_KETUA';
UPDATE `SuratKeluar` SET `status` = 'DITOLAK_TATA_USAHA'  WHERE `status` = 'DITOLAK_SEKRETARIS';
UPDATE `SuratKeluar` SET `status` = 'DITOLAK_KEPALA'      WHERE `status` = 'DITOLAK_KETUA';

ALTER TABLE `SuratKeluar` MODIFY COLUMN `status`
  ENUM('DRAFT','MENUNGGU_TATA_USAHA','MENUNGGU_KEPALA','DITOLAK_TATA_USAHA','DITOLAK_KEPALA','SELESAI')
  NOT NULL DEFAULT 'DRAFT';

-- ============================================================
-- LANGKAH 3: Rename kolom di SuratKeluar
-- ============================================================
ALTER TABLE `SuratKeluar`
  CHANGE `sekretarisId`     `tataUsahaId`       VARCHAR(36) NULL,
  CHANGE `ketuaId`          `kepalaId`          VARCHAR(36) NULL,
  CHANGE `ttdSekretaris`    `parafTataUsaha`    BOOLEAN NOT NULL DEFAULT false,
  CHANGE `ttdKetua`         `ttdKepala`         BOOLEAN NOT NULL DEFAULT false,
  CHANGE `tglTtdSekretaris` `tglParafTataUsaha` DATETIME(3) NULL,
  CHANGE `tglTtdKetua`      `tglTtdKepala`      DATETIME(3) NULL;

SET FOREIGN_KEY_CHECKS = 1;
