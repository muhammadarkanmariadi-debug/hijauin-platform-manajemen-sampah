const fs = require('fs');
const path = require('path');
const XLSX = require('../hijauin-frontend/node_modules/xlsx');

// Target directories
const targetDirs = [
  path.resolve(__dirname, '../docs/samples'),
  path.resolve(__dirname, '../hijauin-frontend/public/samples'),
  path.resolve(__dirname, '../data/samples'),
];

targetDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to write CSV with UTF-8 BOM
function writeCsvWithBom(filePath, headers, rows) {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const csvLines = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ];
  const content = '\uFEFF' + csvLines.join('\r\n') + '\r\n';
  fs.writeFileSync(filePath, content, 'utf8');
}

// Helper to write styled XLSX
function writeExcelWorkbook(filePath, sheetName, headers, rows) {
  const aoa = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // Set column widths based on maximum length in columns
  const colWidths = headers.map((h, i) => {
    let maxLen = String(h).length;
    rows.forEach((r) => {
      const cellLen = String(r[i] || '').length;
      if (cellLen > maxLen) maxLen = cellLen;
    });
    return { wch: Math.min(Math.max(maxLen + 4, 14), 50) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filePath);
}

// 1. Kategori Sampah (Waste Categories)
const kategoriSample = {
  filenameBase: 'template_kategori_sampah',
  sheetName: 'Kategori Sampah',
  headers: ['Nama Kategori', 'Jenis Material', 'Harga per kg (Rp)', 'Poin per kg', 'Deskripsi'],
  rows: [
    ['Botol Plastik PET Bening', 'plastik', 4500, 45, 'Botol air mineral transparan bersih tanpa tutup dan label'],
    ['Gelas Plastik PP Bersih', 'plastik', 3500, 35, 'Gelas cup minuman kemasan tanpa tutup sealer'],
    ['Botol Plastik HDPE Buram', 'plastik', 4000, 40, 'Botol shampoo, sabun cair, lotion, dan jerigen putih'],
    ['Kardus & Karton Dupleks', 'kertas', 2500, 25, 'Kardus cokelat kemasan kering terlipat rapi'],
    ['Kertas Arsip & HVS Putih', 'kertas', 3000, 30, 'Kertas dokumen print, fotokopi kantor bebas staples'],
    ['Koran & Majalah Bekas', 'kertas', 1800, 18, 'Koran harian dan majalah bekas kering'],
    ['Kaleng Aluminium Minuman', 'logam', 14000, 140, 'Kaleng soda, minuman berkarbonasi dan larutan kempes'],
    ['Besi Campur & Rongsok', 'logam', 5500, 55, 'Besi tua potongan, paku, dan perabot logam bekas'],
    ['Kuningan & Tembaga Murni', 'logam', 65000, 650, 'Kawat tembaga kabel dan pipa kuningan bersih'],
    ['Botol Kaca Sirup & Kecap', 'kaca', 1500, 15, 'Botol beling utuh kecap, sirup, atau marjan'],
    ['Pecahan Kaca Bening', 'kaca', 800, 8, 'Pecahan kaca kaca jendela dan botol bening'],
    ['Minyak Jelantah (UCO)', 'plastik', 7000, 70, 'Minyak goreng jelantah bekas pakai tersaring bersih dalam jerigen']
  ]
};

// 2. Katalog Hadiah (Rewards Catalog)
const hadiahSample = {
  filenameBase: 'template_katalog_hadiah',
  sheetName: 'Katalog Hadiah',
  headers: ['Nama Hadiah', 'Poin Dibutuhkan', 'Stok', 'Deskripsi'],
  rows: [
    ['Minyak Goreng 1 Liter Pouch', 150, 30, 'Minyak goreng kelapa sawit higienis pouch kemasan 1 liter'],
    ['Beras Premium Pandan Wangi 2.5 kg', 320, 20, 'Beras putih pulen kualitas premium kemasan 2.5 kg'],
    ['Gula Pasir Tebu Kristal 1 kg', 120, 40, 'Gula pasir kristal putih murni kemasan 1 kg'],
    ['Sabun Cuci Piring Cair 750 ml', 80, 50, 'Sabun cuci piring konsentrat ekstrak jeruk nipis'],
    ['Deterjen Bubuk Konsentrat 800 gr', 100, 35, 'Deterjen pembersih pakaian wangi semerbak'],
    ['Kecap Manis Pouch 520 ml', 75, 25, 'Kecap manis kedelai hitam pilihan kemasan pouch'],
    ['Voucher Token PLN Rp 20.000', 210, 50, 'Kode token listrik PLN prabayar nominal Rp 20.000'],
    ['Voucher Pulsa All Operator Rp 25.000', 260, 50, 'Pulsa elektrik langsung kirim ke nomor HP nasabah'],
    ['Tote Bag Belanja Kanvas Ramah Lingkungan', 60, 60, 'Tas belanja spunbond kanvas tebal untuk belanja tanpa plastik'],
    ['Tumbler Minum Stainless Steel 500 ml', 250, 15, 'Botol minum insulasi stainless steel tahan panas dan dingin']
  ]
};

// 3. Data Nasabah (Nasabah Accounts)
const nasabahSample = {
  filenameBase: 'template_data_nasabah',
  sheetName: 'Data Nasabah',
  headers: ['Nama Lengkap', 'Email', 'No Telepon', 'Alamat', 'Saldo Poin Awal'],
  rows: [
    ['Budi Santoso', 'budi.santoso@gmail.com', '081234567801', 'Jl. Merdeka RT 01 / RW 03 No. 12', 150],
    ['Siti Nurhaliza', 'siti.nurhaliza@gmail.com', '081234567802', 'Jl. Anggrek Blok B No. 4', 320],
    ['Ahmad Fauzi', 'ahmad.fauzi@yahoo.com', '081234567803', 'Jl. Melati RT 05 / RW 02 No. 88', 85],
    ['Dewi Lestari', 'dewi.lestari@gmail.com', '081234567804', 'Komplek Griya Indah Blok C2/15', 540],
    ['Hendra Kurniawan', 'hendra.kurniawan@outlook.com', '081234567805', 'Jl. Kenanga No. 23', 0],
    ['Rina Marlina', 'rina.marlina@gmail.com', '081234567806', 'Jl. Mawar RT 02 / RW 01 No. 5', 210],
    ['Eko Prasetyo', 'eko.prasetyo@gmail.com', '081234567807', 'Jl. Flamboyan Blok D No. 7', 45]
  ]
};

// 4. Batch Setoran Sampah (Deposit Transactions)
const setoranSample = {
  filenameBase: 'template_batch_setoran_sampah',
  sheetName: 'Setoran Sampah',
  headers: ['Identifier Nasabah (Email / Telp)', 'Kategori Sampah', 'Berat (kg)', 'Status Setoran', 'Catatan'],
  rows: [
    ['budi.santoso@gmail.com', 'Botol Plastik PET Bening', 3.5, 'diterima', 'Botol bersih kering tanpa label'],
    ['siti.nurhaliza@gmail.com', 'Kardus & Karton Dupleks', 8.2, 'diterima', 'Kardus terikat rapi'],
    ['ahmad.fauzi@yahoo.com', 'Kaleng Aluminium Minuman', 1.8, 'diterima', 'Kaleng kempes'],
    ['dewi.lestari@gmail.com', 'Kertas Arsip & HVS Putih', 12.0, 'diterima', 'Kertas dokumen kantor'],
    ['hendra.kurniawan@outlook.com', 'Botol Kaca Sirup & Kecap', 5.0, 'menunggu', 'Setoran diantar sore hari'],
    ['rina.marlina@gmail.com', 'Minyak Jelantah (UCO)', 4.0, 'diterima', 'Minyak jerigen 4 liter']
  ]
};

// 5. Data Pengguna & Petugas (System Users / Staff)
const usersSample = {
  filenameBase: 'template_pengguna_petugas',
  sheetName: 'Petugas & Pengguna',
  headers: ['Nama Lengkap', 'Email', 'Role / Peran', 'No Telepon', 'Status Akun'],
  rows: [
    ['Bambang Trihatmojo', 'petugas.bambang@banksampah.id', 'petugas', '082111223344', 'aktif'],
    ['Ratna Juwita', 'petugas.ratna@banksampah.id', 'petugas', '082111223355', 'aktif'],
    ['Agus Salim', 'admin.agus@banksampah.id', 'admin_unit', '082111223366', 'aktif'],
    ['Nurul Hidayah', 'petugas.nurul@banksampah.id', 'petugas', '082111223377', 'aktif']
  ]
};

const allTemplates = [kategoriSample, hadiahSample, nasabahSample, setoranSample, usersSample];

console.log('Generating sample CSV and XLSX files...');

allTemplates.forEach((tpl) => {
  targetDirs.forEach((dir) => {
    const csvPath = path.join(dir, `${tpl.filenameBase}.csv`);
    const xlsxPath = path.join(dir, `${tpl.filenameBase}.xlsx`);

    writeCsvWithBom(csvPath, tpl.headers, tpl.rows);
    writeExcelWorkbook(xlsxPath, tpl.sheetName, tpl.headers, tpl.rows);

    console.log(`✓ Created: ${csvPath}`);
    console.log(`✓ Created: ${xlsxPath}`);
  });
});

console.log('All sample spreadsheets generated successfully!');
