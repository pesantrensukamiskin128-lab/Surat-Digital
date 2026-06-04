-- CreateTable: TemplateSurat
CREATE TABLE `TemplateSurat` (
  `id`           VARCHAR(36)  NOT NULL,
  `nama`         VARCHAR(191) NOT NULL,
  `deskripsi`    VARCHAR(191) NULL,
  `jenisSurat`   ENUM('A','B','C','D','E','F','G','H','I','J','K','SK') NOT NULL DEFAULT 'A',
  `perihal`      VARCHAR(191) NULL,
  `tujuanSurat`  TEXT         NULL,
  `lampiran`     VARCHAR(191) NULL,
  `isiSurat`     TEXT         NOT NULL,
  `lampiranIsi`  TEXT         NULL,
  `tempatTerbit` VARCHAR(191) NOT NULL DEFAULT 'Bandung',
  `createdAt`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`    DATETIME(3)  NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
