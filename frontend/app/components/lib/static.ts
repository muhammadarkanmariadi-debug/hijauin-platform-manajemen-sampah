
import { Users, BookOpen, Calendar, Award, CalculatorIcon, UserIcon, BookText, Flame, MapPin, Leaf, Recycle } from "lucide-react"
import { title } from "process"
import { RecycleIcon,Calculator,LocateIcon, UserCircle, EarthIcon, } from "lucide-react"


export interface ArtikelProps {
  slug: string
  image: string
  category: string
  title: string
  excerpt: string
  author: string
  authorImage?: string
  authorBio?: string
  readTime: string
  date: string
  content?: string
  tags?: string[]
  likes?: number
  comments?: number
}

export interface FiturProps{
    title : string
    description: string
    link: string
    icon : any
}



export const stats = [
    { icon: Users, value: '12.5K+', label: 'Anggota Aktif' },
    { icon: BookOpen, value: '500+', label: 'Artikel & Panduan' },
    { icon: Calendar, value: '150+', label: 'Event Diadakan' },
    { icon: Award, value: '98%', label: 'Kepuasan Member' }
]


export const artikelData: ArtikelProps[] = [
  {
    slug: "cara-mengelola-sampah-rumah-tangga",
    image: "/images/artikel/sampah-rumah.jpg",
    category: "Lingkungan",
    title: "Cara Mengelola Sampah Rumah Tangga Dengan Benar",
    excerpt: "Pelajari langkah-langkah sederhana untuk mengelola sampah sehari-hari agar lebih ramah lingkungan.",
    author: "Andi Pratama",
    authorImage: "/images/author/andi.jpg",
    authorBio: "Aktivis lingkungan dan edukator daur ulang.",
    readTime: "7 menit",
    date: "2025-01-20",
    content: `
      <h2>Mengapa Pengelolaan Sampah Itu Penting?</h2>
      <p>
        Pengelolaan sampah rumah tangga adalah langkah kecil yang dapat memberikan
        dampak besar terhadap lingkungan. Dengan menerapkan metode yang benar, kita
        dapat mengurangi polusi, meminimalkan limbah, dan mendukung gaya hidup
        berkelanjutan.
      </p>

      <h2>1. Pisahkan Sampah Berdasarkan Jenis</h2>
      <p>
        Langkah pertama yang paling penting adalah <strong>memisahkan sampah</strong>
        menjadi beberapa kategori:
      </p>
      <ul>
        <li>Sampah organik (sisa makanan, daun, kulit buah)</li>
        <li>Sampah anorganik (plastik, kaca, kaleng)</li>
        <li>Sampah berbahaya (baterai, lampu, obat kadaluarsa)</li>
      </ul>

      <h2>2. Gunakan Metode 3R</h2>
      <p>Prinsip utama pengelolaan sampah adalah <strong>Reduce, Reuse, Recycle</strong>:</p>

      <h3>Reduce</h3>
      <p>
        Mengurangi penggunaan barang sekali pakai seperti kantong plastik,
        sedotan, dan kemasan berbahan sintetis.
      </p>

      <h3>Reuse</h3>
      <p>
        Gunakan kembali barang-barang yang masih layak seperti botol kaca,
        kontainer makanan, dan tas belanja.
      </p>

      <h3>Recycle</h3>
      <p>
        Pastikan sampah yang dapat didaur ulang masuk ke tempat daur ulang yang sesuai.
      </p>

      <h2>3. Buat Kompos dari Sampah Organik</h2>
      <p>
        Sampah organik seperti sisa sayuran dan dedaunan dapat diubah menjadi kompos
        yang bermanfaat untuk tanaman.
      </p>

      <blockquote>
        "Mengelola sampah bukan hanya tugas pemerintah, tetapi tanggung jawab kita bersama."
      </blockquote>

      <h2>Kesimpulan</h2>
      <p>
        Memulai kebiasaan mengelola sampah di rumah adalah investasi kecil demi
        masa depan bumi. Mulailah dari langkah-langkah sederhana seperti memilah
        sampah, menggunakan kembali barang, dan memproses sampah organik menjadi kompos.
      </p>
    `,
    tags: ["Sampah", "Lingkungan", "Daur Ulang"],
    likes: 120,
    comments: 15,
  },

  // Tambah artikel lain...
];





export const fiturData: FiturProps[] = [
  {
    title: "Panduan Daur Ulang",
    description:
      "Pelajari cara memilah dan mendaur ulang sampah rumah tangga dengan benar agar lebih ramah lingkungan.",
    link: "/panduan/daur-ulang",
    icon: Recycle
  },
  {
    title: "Kalkulator Jejak Karbon",
    description:
      "Hitung emisi karbon harianmu dan temukan cara untuk menguranginya dengan langkah sederhana.",
    link: "/fitur/jejak-karbon",
    icon: Leaf
  },
  {
    title: "Lokasi Bank Sampah",
    description:
      "Temukan bank sampah terdekat untuk mengelola sampah anorganik dengan lebih bertanggung jawab.",
    link: "/fitur/bank-sampah",
    icon: MapPin
  },
  {
    title: "Komunitas Hijau",
    description:
      "Bergabung dengan komunitas peduli lingkungan dan ikuti gerakan penghijauan daerahmu.",
    link: "/komunitas",
    icon: Users
  },
  {
    title: "Tantangan Eco Habit",
    description:
      "Ikuti tantangan harian ramah lingkungan untuk membangun kebiasaan hijau dan kumpulkan poin.",
    link: "/tantangan",
    icon: Flame
  },
  {
    title: "Artikel & Edukasi",
    description:
      "Baca artikel terbaru mengenai gaya hidup berkelanjutan, zero waste, dan tips lingkungan.",
    link: "/artikel",
    icon: BookText
  }
];
