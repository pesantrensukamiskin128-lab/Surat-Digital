const prisma = require('../config/prisma');
const path = require('path');
const fs = require('fs');
const { resetLogoCache } = require('../utils/qrcode');

const getProfil = async (req, res) => {
  try {
    let profil = await prisma.organisasiProfil.findFirst();
    if (!profil) {
      profil = await prisma.organisasiProfil.create({
        data: {
          tingkatanOrg:    'Pimpinan Cabang',
          namaOrg:         'Fatayat Nahdlatul Ulama',
          daerahOrg:       'Kota Bandung',
          alamat:          '',
          telepon:         '',
          email:           '',
          website:         '',
          kodeKlasifikasi: 'PP.06',
        },
      });
    }
    res.json({ success: true, data: profil });
  } catch (err) {
    console.error('getProfil error:', err);
    // Jika error karena kolom belum ada (migration belum jalan),
    // kembalikan data fallback agar frontend tidak crash
    if (err.code === 'P2022' || err.message?.includes('kodeKlasifikasi') || err.message?.includes('Unknown column')) {
      return res.json({
        success: true,
        data: {
          tingkatanOrg:    'Pimpinan Cabang',
          namaOrg:         'Fatayat Nahdlatul Ulama',
          daerahOrg:       'Kota Bandung',
          alamat:          '',
          telepon:         '',
          email:           '',
          website:         '',
          kodeKlasifikasi: 'PP.06',
          logoPath:        null,
        },
        _migrationPending: true,
      });
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan' });
  }
};

const updateProfil = async (req, res) => {
  try {
    const { tingkatanOrg, namaOrg, daerahOrg, alamat, telepon, email, website, kodeKlasifikasi } = req.body;
    let profil = await prisma.organisasiProfil.findFirst();

    const updateData = {
      tingkatanOrg:    tingkatanOrg    ?? profil?.tingkatanOrg    ?? 'Pimpinan Cabang',
      namaOrg:         namaOrg         ?? profil?.namaOrg         ?? 'Fatayat Nahdlatul Ulama',
      daerahOrg:       daerahOrg       ?? profil?.daerahOrg       ?? 'Kota Bandung',
      alamat:          alamat          !== undefined ? alamat      : (profil?.alamat   || ''),
      telepon:         telepon         !== undefined ? telepon     : (profil?.telepon  || ''),
      email:           email           !== undefined ? email       : (profil?.email    || ''),
      website:         website         !== undefined ? website     : (profil?.website  || ''),
      kodeKlasifikasi: kodeKlasifikasi !== undefined ? kodeKlasifikasi : (profil?.kodeKlasifikasi || 'PP.06'),
    };

    if (req.file) {
      if (profil?.logoPath) {
        const old = path.join(__dirname, '../..', profil.logoPath);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      updateData.logoPath = `uploads/logos/${req.file.filename}`;
    }

    try {
      profil = profil
        ? await prisma.organisasiProfil.update({ where: { id: profil.id }, data: updateData })
        : await prisma.organisasiProfil.create({ data: updateData });
    } catch (prismaErr) {
      // Fallback: jika kolom kodeKlasifikasi belum ada di DB (migration pending),
      // simpan tanpa field itu agar data lain tetap tersimpan
      if (prismaErr.message?.includes('kodeKlasifikasi') || prismaErr.message?.includes('Unknown column')) {
        console.warn('⚠️  kodeKlasifikasi belum ada di DB, menyimpan tanpa field tersebut');
        const { kodeKlasifikasi: _omit, ...safeData } = updateData;
        profil = profil
          ? await prisma.organisasiProfil.update({ where: { id: profil.id }, data: safeData })
          : await prisma.organisasiProfil.create({ data: safeData });
      } else {
        throw prismaErr;
      }
    }

    if (req.file) resetLogoCache();

    res.json({ success: true, message: 'Profil organisasi diperbarui', data: profil });
  } catch (err) {
    console.error('updateProfil error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan: ' + err.message });
  }
};

const deleteLogo = async (req, res) => {
  try {
    const profil = await prisma.organisasiProfil.findFirst();
    if (!profil?.logoPath) return res.status(404).json({ success: false, message: 'Logo tidak ditemukan' });
    const logoPath = path.join(__dirname, '../..', profil.logoPath);
    if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    await prisma.organisasiProfil.update({ where: { id: profil.id }, data: { logoPath: null } });
    resetLogoCache();
    res.json({ success: true, message: 'Logo dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan' });
  }
};

module.exports = { getProfil, updateProfil, deleteLogo };
