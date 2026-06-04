-- AlterTable: tambah kolom nuptk ke User (nullable, max 20 digit)
ALTER TABLE `User`
  ADD COLUMN `nuptk` VARCHAR(20) NULL;
