/**
 * Konversi tanggal Masehi ke Hijriyah
 * Menggunakan Intl.DateTimeFormat dengan kalender islamic-civil
 */

const BULAN_HIJRIYAH = [
  'Muharram', 'Shafar', 'Rabi\'ul Awwal', 'Rabi\'ul Akhir',
  'Jumadil Awwal', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
  'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
];

function toHijriyah(date) {
  // Pakai noon agar tidak terpengaruh timezone offset
  const d = new Date(date);
  const noon = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);

  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-civil', {
    day: 'numeric', month: 'numeric', year: 'numeric',
  }).formatToParts(noon);

  const get = (type) => parseInt(parts.find(p => p.type === type)?.value || '0');
  const day   = get('day');
  const month = get('month');
  const year  = get('year');

  return {
    day,
    month,
    year,
    monthName: BULAN_HIJRIYAH[month - 1],
    formatted: `${day} ${BULAN_HIJRIYAH[month - 1]} ${year} H`,
  };
}

function formatTanggalLengkap(tanggalMasehi, tanggalHijriyah) {
  const d = new Date(tanggalMasehi);
  const bulanMasehi = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const masehi = `${d.getDate()} ${bulanMasehi[d.getMonth()]} ${d.getFullYear()}`;
  return `${masehi} M / ${tanggalHijriyah}`;
}

module.exports = { toHijriyah, formatTanggalLengkap, BULAN_HIJRIYAH };
