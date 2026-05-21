require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { autoMigrate, runSeed } = require('./utils/autoMigrate');

const app = express();

// Trust reverse proxy (Hostinger)
app.set('trust proxy', 1);

// Security middleware
// Content-Security-Policy dilonggarkan agar frontend React bisa load assets
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  contentSecurityPolicy: false, // dihandle oleh Vite build
}));

// Rate limiting hanya untuk API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Terlalu banyak permintaan, coba lagi nanti.' }
});
app.use('/api/', limiter);

// CORS tidak diperlukan lagi (monolitik, satu domain)
// Tetap aktifkan untuk development lokal
if (process.env.NODE_ENV === 'development') {
  const cors = require('cors');
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
}

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files untuk uploads
const uploadsDir = process.env.UPLOAD_DIR
  ? (process.env.UPLOAD_DIR.startsWith('/') ? process.env.UPLOAD_DIR : path.join(__dirname, '../', process.env.UPLOAD_DIR))
  : path.join(__dirname, '../uploads');
console.log('📁 Serving uploads from:', uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/surat-keluar', require('./routes/suratKeluar.routes'));
app.use('/api/surat-masuk', require('./routes/suratMasuk.routes'));
app.use('/api/disposisi', require('./routes/disposisi.routes'));
app.use('/api/organisasi', require('./routes/organisasi.routes'));
app.use('/api/verifikasi', require('./routes/verifikasi.routes'));
app.use('/api/rekap', require('./routes/rekap.routes'));
app.use('/api/push', require('./routes/push.routes'));
app.use('/api/notifikasi', require('./routes/notifikasi.routes'));
app.use('/api/agenda', require('./routes/agenda.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SAFIRA berjalan dengan baik',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Endpoint debug path logo — hapus setelah masalah teratasi
app.get('/api/setup/logo-check', async (req, res) => {
  const secret = req.query.secret;
  if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ success: false, message: 'Akses ditolak' });
  }
  const prisma = require('./config/prisma');
  const fs = require('fs');
  const path = require('path');
  try {
    const profil = await prisma.organisasiProfil.findFirst();
    const logoPath = profil?.logoPath;
    const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
    const BASE_UPLOAD = UPLOAD_DIR.startsWith('/')
      ? UPLOAD_DIR
      : path.join(__dirname, '../', UPLOAD_DIR);

    // Coba berbagai kemungkinan path
    const candidates = logoPath ? [
      path.join(BASE_UPLOAD, logoPath.replace(/^\/uploads/, '')),
      path.join(__dirname, '../uploads', logoPath.replace(/^\/uploads\//, '')),
      path.join(__dirname, '../../uploads', logoPath.replace(/^\/uploads\//, '')),
      logoPath,
    ] : [];

    const results = candidates.map(p => ({ path: p, exists: fs.existsSync(p) }));

    res.json({
      logoPathDB: logoPath,
      UPLOAD_DIR: process.env.UPLOAD_DIR,
      BASE_UPLOAD,
      __dirname,
      candidates: results,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post('/api/setup/seed', async (req, res) => {
  const secret = req.headers['x-setup-secret'];
  if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
    return res.status(403).json({ success: false, message: 'Akses ditolak' });
  }
  try {
    await runSeed();
    res.json({ success: true, message: 'Seed database berhasil dijalankan' });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve frontend React (production)
// Harus setelah semua route /api agar tidak tertimpa
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// Semua route non-API dikembalikan ke index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  autoMigrate().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 SAFIRA berjalan di port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 App URL: https://madina.masyppsukamiskin.sch.id`);
    });
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 SAFIRA berjalan di port ${PORT}`);
  });
}

module.exports = app;
