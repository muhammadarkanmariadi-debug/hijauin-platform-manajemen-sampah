import { CheckCircle } from 'lucide-react'


const packages = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: '/bulan',
    desc: 'Cocok untuk pengguna rumahan',
    popular: false,
    features: [
      'Edukasi dasar',
      'Akses artikel komunitas',
      'Forum diskusi',
      'Newsletter bulanan'
    ],
    button: 'Mulai Gratis',
    color: 'gray'
  },
  {
    name: 'Pro',
    price: 'Rp 99.000',
    period: '/bulan',
    desc: 'Paling populer untuk keluarga',
    popular: true,
    features: [
      'Semua fitur Gratis',
      'Newsletter mingguan',
      'Konsultasi online',
      'Event komunitas',
      'Badge eksklusif',
      'Prioritas support'
    ],
    button: 'Mulai Pro',
    color: 'green'
  },
  {
    name: 'Premium',
    price: 'Rp 499.000',
    period: '/bulan',
    desc: 'Solusi lengkap untuk profesional',
    popular: false,
    features: [
      'Semua fitur Pro',
      'Paket starter kit',
      'Garansi tracking',
      'Workshop bulanan',
      'Sertifikat resmi',
      'Akses komunitas VIP'
    ],
    button: 'Mulai Premium',
    color: 'emerald'
  }
]

export default function Paket () {
  return (
    <section className='mx-auto px-4 py-16 max-w-6xl'>
      <div className='mb-12 text-center'>
        <h2 className='mb-3 font-bold text-3xl md:text-4xl'>
          Pilih Paket yang <span className='text-green-600'>Tepat</span>
        </h2>
        <p className='mx-auto max-w-2xl text-gray-600 text-lg'>
          Tingkatkan pengalaman Anda dengan fitur-fitur premium yang disesuaikan
          dengan kebutuhan
        </p>
      </div>

      <div className='gap-6 grid grid-cols-1 md:grid-cols-3'>
        {packages.map((pkg, i) => (
          <div
            key={i}
            className={`relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
              pkg.popular
                ? 'shadow-2xl border-2 border-green-600 scale-105'
                : 'shadow-md hover:shadow-xl border'
            }`}
          >
            {pkg.popular && (
              <div className='top-0 right-0 absolute bg-green-600 px-4 py-1 rounded-bl-xl font-semibold text-white text-xs'>
                ⭐ Paling Populer
              </div>
            )}

            <div
              className={`${
                pkg.popular
                  ? 'bg-linear-to-br from-green-600 to-emerald-600'
                  : 'bg-gray-50'
              } p-6 text-center`}
            >
              <h3
                className={`font-bold text-2xl mb-2 ${
                  pkg.popular ? 'text-white' : 'text-gray-800'
                }`}
              >
                {pkg.name}
              </h3>
              <div
                className={`mb-1 ${
                  pkg.popular ? 'text-white' : 'text-gray-800'
                }`}
              >
                <span className='font-bold text-4xl'>{pkg.price}</span>
                <span
                  className={`text-sm ${
                    pkg.popular ? 'text-green-100' : 'text-gray-600'
                  }`}
                >
                  {pkg.period}
                </span>
              </div>
              <p
                className={`text-sm ${
                  pkg.popular ? 'text-green-100' : 'text-gray-600'
                }`}
              >
                {pkg.desc}
              </p>
            </div>

            <div className='flex-1 p-6'>
              <ul className='space-y-3 mb-6'>
                {pkg.features.map((feature, j) => (
                  <li key={j} className='flex items-start gap-3'>
                    <CheckCircle
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        pkg.popular ? 'text-green-600' : 'text-gray-400'
                      }`}
                    />
                    <span className='text-gray-700 text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='p-6 pt-0'>
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  pkg.popular
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {pkg.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-8 text-center'>
        <p className='text-gray-600 text-sm'>
          Semua paket dapat dibatalkan kapan saja. Tidak ada biaya tersembunyi.
        </p>
      </div>
    </section>
  )
}
