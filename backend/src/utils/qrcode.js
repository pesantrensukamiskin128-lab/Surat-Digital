const QRCode = require('qrcode');
const Jimp   = require('jimp');
const path   = require('path');
const fs     = require('fs');
const prisma = require('../config/prisma');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Resolve logo path dari DB ke absolute filesystem path
function resolveLogoPath(logoPathFromDB) {
  if (!logoPathFromDB) return null;
  const BASE_UPLOAD = process.env.UPLOAD_DIR
    ? (process.env.UPLOAD_DIR.startsWith('/') ? process.env.UPLOAD_DIR : path.join(__dirname, '../../', process.env.UPLOAD_DIR))
    : path.join(__dirname, '../../uploads');
  const lp = logoPathFromDB.trim();
  if (path.isAbsolute(lp))        return lp;
  if (lp.startsWith('/uploads/')) return path.join(BASE_UPLOAD, lp.replace(/^\/uploads\//, ''));
  if (lp.startsWith('uploads/'))  return path.join(__dirname, '../../', lp);
  return path.join(BASE_UPLOAD, lp);
}

/**
 * Overlay logo di tengah QR code menggunakan Jimp.
 * Logo diberi padding putih agar QR tetap terbaca (error correction H).
 * @param {Buffer} qrBuffer   - Buffer PNG hasil QRCode
 * @param {string} logoPath   - Absolute path ke file logo
 * @param {number} qrSize     - Ukuran QR (px)
 * @returns {Promise<Buffer>} - Buffer PNG hasil composite
 */
async function overlayLogo(qrBuffer, logoPath, qrSize) {
  const [qrImg, logoImg] = await Promise.all([
    Jimp.read(qrBuffer),
    Jimp.read(logoPath),
  ]);

  // Logo maksimal 22% dari ukuran QR (aman untuk error correction H)
  const logoMaxPx = Math.floor(qrSize * 0.22);
  logoImg.resize(logoMaxPx, Jimp.AUTO);

  const logoW = logoImg.getWidth();
  const logoH = logoImg.getHeight();

  // Padding putih di sekitar logo (4px setiap sisi)
  const pad = 4;
  const boxW = logoW + pad * 2;
  const boxH = logoH + pad * 2;

  // Buat kotak putih sebagai background logo
  const bg = new Jimp(boxW, boxH, 0xFFFFFFFF);
  bg.composite(logoImg, pad, pad);

  // Posisi tengah QR
  const x = Math.floor((qrSize - boxW) / 2);
  const y = Math.floor((qrSize - boxH) / 2);

  qrImg.composite(bg, x, y);
  return qrImg.getBufferAsync(Jimp.MIME_PNG);
}

/**
 * Ambil logo organisasi dari DB (cached ringan via module scope)
 */
let _cachedLogoPath = undefined; // undefined = belum dicek, null = tidak ada logo

async function getOrgLogoPath() {
  if (_cachedLogoPath !== undefined) return _cachedLogoPath;
  try {
    const org = await prisma.organisasiProfil.findFirst({ select: { logoPath: true } });
    const resolved = org?.logoPath ? resolveLogoPath(org.logoPath) : null;
    _cachedLogoPath = (resolved && fs.existsSync(resolved)) ? resolved : null;
  } catch (_) {
    _cachedLogoPath = null;
  }
  return _cachedLogoPath;
}

// Reset cache saat logo diupdate (dipanggil dari organisasi controller jika perlu)
function resetLogoCache() {
  _cachedLogoPath = undefined;
}

/**
 * Generate QR Code untuk surat (disimpan ke file PNG)
 * @param {string} token  - Token unik surat
 * @param {string} suratId - ID surat
 * @returns {Promise<string>} - Path relatif file QR Code
 */
async function generateQRCode(token, suratId) {
  const BASE_UPLOAD = process.env.UPLOAD_DIR
    ? (process.env.UPLOAD_DIR.startsWith('/') ? process.env.UPLOAD_DIR : path.join(__dirname, '../../', process.env.UPLOAD_DIR))
    : path.join(__dirname, '../../uploads');
  const qrDir = path.join(BASE_UPLOAD, 'qrcodes');
  ensureDir(qrDir);

  const frontendUrl    = process.env.FRONTEND_URL || 'https://sirama.masyppsukamiskin.sch.id';
  const verifikasiUrl  = `${frontendUrl}/verifikasi/${token}`;
  const qrSize         = 400; // lebih besar agar logo tetap proporsional

  // Generate QR sebagai buffer PNG
  const qrBuffer = await QRCode.toBuffer(verifikasiUrl, {
    color: { dark: '#166534', light: '#FFFFFF' },
    width: qrSize,
    margin: 2,
    errorCorrectionLevel: 'H',
  });

  // Overlay logo jika tersedia
  const logoPath = await getOrgLogoPath();
  let finalBuffer = qrBuffer;
  if (logoPath) {
    try {
      finalBuffer = await overlayLogo(qrBuffer, logoPath, qrSize);
    } catch (err) {
      console.warn('⚠️ Gagal overlay logo pada QR Code:', err.message);
      finalBuffer = qrBuffer; // fallback tanpa logo
    }
  }

  const filename = `qr-${suratId}.png`;
  const filepath = path.join(qrDir, filename);
  fs.writeFileSync(filepath, finalBuffer);

  return `/uploads/qrcodes/${filename}`;
}

/**
 * Generate QR Code sebagai Data URL (base64) — untuk embed di PDF
 */
async function generateQRCodeDataURL(token) {
  const frontendUrl   = process.env.FRONTEND_URL || 'https://sirama.masyppsukamiskin.sch.id';
  const verifikasiUrl = `${frontendUrl}/verifikasi/${token}`;
  const qrSize        = 300;

  const qrBuffer = await QRCode.toBuffer(verifikasiUrl, {
    color: { dark: '#166534', light: '#FFFFFF' },
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: 'H',
  });

  // Overlay logo jika tersedia
  const logoPath = await getOrgLogoPath();
  let finalBuffer = qrBuffer;
  if (logoPath) {
    try {
      finalBuffer = await overlayLogo(qrBuffer, logoPath, qrSize);
    } catch (err) {
      console.warn('⚠️ Gagal overlay logo pada QR Code DataURL:', err.message);
      finalBuffer = qrBuffer;
    }
  }

  return `data:image/png;base64,${finalBuffer.toString('base64')}`;
}

module.exports = { generateQRCode, generateQRCodeDataURL, resetLogoCache };
