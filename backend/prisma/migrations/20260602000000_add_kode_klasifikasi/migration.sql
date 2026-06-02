-- AlterTable: tambah kolom kodeKlasifikasi ke OrganisasiProfil
ALTER TABLE `OrganisasiProfil`
  ADD COLUMN `kodeKlasifikasi` VARCHAR(191) NOT NULL DEFAULT 'PP.06';
