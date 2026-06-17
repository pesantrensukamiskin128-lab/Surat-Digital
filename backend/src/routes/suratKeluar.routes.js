const express = require('express');
const router = express.Router();
const {
  getAllSurat, getSuratById, createSurat, updateSurat,
  deleteSurat, kirimSurat, tandaTangan, tolakSurat,
  downloadPDF, previewPDF, getStatistik,
  deleteDokumenPendukung, serveDokumenPendukung,
} = require('../controllers/suratKeluar.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { uploadDokumenPendukung } = require('../middleware/upload.middleware');

router.use(authenticate);

router.get('/statistik', getStatistik);
router.get('/', getAllSurat);
router.get('/:id', getSuratById);
router.get('/:id/download', downloadPDF);
router.get('/:id/preview', previewPDF);
router.get('/:id/dokumen-pendukung/:filename', serveDokumenPendukung);

// Admin only
router.post('/', authorize('ADMIN'), uploadDokumenPendukung.array('dokumenPendukung', 5), createSurat);
router.put('/:id', authorize('ADMIN'), uploadDokumenPendukung.array('dokumenPendukung', 5), updateSurat);
router.delete('/:id', authorize('ADMIN', 'TATA_USAHA', 'KEPALA'), deleteSurat);
router.delete('/:id/dokumen-pendukung/:filename', authorize('ADMIN'), deleteDokumenPendukung);
router.post('/:id/kirim', authorize('ADMIN'), kirimSurat);

// Tata Usaha & Kepala
router.post('/:id/tanda-tangan', authorize('TATA_USAHA', 'KEPALA'), tandaTangan);
router.post('/:id/tolak', authorize('TATA_USAHA', 'KEPALA'), tolakSurat);

module.exports = router;
