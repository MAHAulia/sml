import GuestLayout from '@/layouts/guest-layout';

export default function TermsAndConditions() {

    return (
        <GuestLayout title="EasyForm">
            {/* Hero Section */}
            <section className="container mx-auto flex flex-col items-center justify-center py-20 md:py-32">
                <div className="prose max-w-none">
                    <h1 className="text-4xl font-bold mb-6 text-center">Syarat dan Ketentuan</h1>
                    <p className="text-gray-600 text-center mb-12">
                        **Tanggal Efektif: 29 Juni 2025**
                    </p>

                    <p className="mb-8">
                        Selamat datang di <span className="font-bold ml-1">Easy</span><span className="font-extrabold text-primary">Form</span>! Syarat dan Ketentuan ini ("Ketentuan") mengatur penggunaan Anda atas layanan kami, seperti formulir online, situs web, atau aplikasi, yang disediakan oleh <span className="font-bold ml-1">Easy</span><span className="font-extrabold text-primary">Form</span> ("kami," "milik kami").
                    </p>
                    <p className="mb-8">
                        Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari Ketentuan ini, Anda tidak diperkenankan untuk menggunakan layanan kami.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">1. Penggunaan Layanan</h2>
                    <h3 className="text-xl font-semibold mb-2">a. Kelayakan</h3>
                    <p className="mb-4">
                        Dengan menggunakan layanan kami, Anda menyatakan bahwa Anda berusia setidaknya <strong>17 tahun</strong> dan memiliki hak serta wewenang untuk terikat oleh Ketentuan ini.
                    </p>

                    <h3 className="text-xl font-semibold mb-2">b. Akun Anda</h3>
                    <p className="mb-4">
                        Jika Anda membuat akun, Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda dan semua aktivitas yang terjadi di bawah akun Anda. Anda setuju untuk segera memberi tahu kami jika ada penggunaan akun Anda yang tidak sah.
                    </p>

                    <h3 className="text-xl font-semibold mb-2">c. Konten Pengguna</h3>
                    <p className="mb-6">
                        Anda bertanggung jawab penuh atas semua data, teks, file, informasi, dan materi lain yang Anda unggah, posting, atau kirimkan melalui layanan kami ("Konten Pengguna"). Anda menjamin bahwa Anda memiliki semua hak yang diperlukan atas Konten Pengguna tersebut.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">2. Kewajiban Pengguna</h2>
                    <p className="mb-6">
                        Anda setuju untuk tidak:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li>Menggunakan layanan kami untuk tujuan ilegal atau tidak sah.</li>
                        <li>Mengunggah atau mengirimkan konten yang melanggar hukum, memfitnah, melecehkan, atau cabul.</li>
                        <li>Mengunggah virus atau kode berbahaya lainnya.</li>
                        <li>Mengganggu atau mengacaukan integritas atau kinerja layanan kami.</li>
                        <li>Mencoba mendapatkan akses tidak sah ke sistem atau jaringan kami.</li>
                    </ul>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">3. Hak Kekayaan Intelektual</h2>
                    <p className="mb-8">
                        Layanan dan semua isinya, termasuk teks, grafis, logo, dan perangkat lunak, adalah milik eksklusif <span className="font-bold ml-1">Easy</span><span className="font-extrabold text-primary">Form</span> dan dilindungi oleh undang-undang hak cipta serta merek dagang. Anda tidak boleh mereproduksi, mendistribusikan, memodifikasi, atau membuat karya turunan dari konten kami tanpa izin tertulis dari kami.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">4. Pengakhiran</h2>
                    <p className="mb-8">
                        Kami berhak untuk menghentikan atau menangguhkan akses Anda ke layanan kami sewaktu-waktu, tanpa pemberitahuan sebelumnya, atas kebijakan kami sendiri, jika Anda melanggar Ketentuan ini.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">5. Penolakan Jaminan (Disclaimer of Warranties)</h2>
                    <p className="mb-8">
                        Layanan kami disediakan "sebagaimana adanya" dan "sebagaimana tersedia" tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa layanan akan bebas dari kesalahan, tidak terganggu, atau aman.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">6. Batasan Tanggung Jawab</h2>
                    <p className="mb-8">
                        Sejauh diizinkan oleh hukum, <span className="font-bold ml-1">Easy</span><span className="font-extrabold text-primary">Form</span> tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan Anda untuk menggunakan layanan kami.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">7. Ganti Rugi</h2>
                    <p className="mb-8">
                        Anda setuju untuk mengganti rugi dan membebaskan <span className="font-bold ml-1">Easy</span><span className="font-extrabold text-primary">Form</span> dari setiap klaim, kerugian, atau kerusakan yang timbul dari penggunaan layanan Anda atau pelanggaran Ketentuan ini oleh Anda.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">8. Perubahan Ketentuan</h2>
                    <p className="mb-8">
                        Kami dapat memperbarui Ketentuan ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan dengan memposting Ketentuan yang diperbarui di halaman ini. Penggunaan layanan secara berkelanjutan setelah perubahan menunjukkan penerimaan Anda terhadap Ketentuan yang direvisi.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">9. Hukum yang Mengatur</h2>
                    <p className="mb-8">
                        Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum <strong>Indonesia</strong>, tanpa memperhatikan pertentangan ketentuan hukum.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">10. Hubungi Kami</h2>
                    <p className="mb-8">
                        Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li>Email: <a href="mailto:support@easyform.site" className="text-blue-600 hover:underline">support@easyform.site</a></li>
                    </ul>
                </div>
            </section>
        </GuestLayout>
    );
}