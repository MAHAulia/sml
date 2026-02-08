import GuestLayout from '@/layouts/guest-layout';

export default function PrivacyPolicy() {

    return (
        <GuestLayout title="EasyForm">
            {/* Hero Section */}
            <section className="container mx-auto flex flex-col items-center justify-center py-20 md:py-32">
                <div className="prose max-w-none">
                    <h1 className="text-4xl font-bold mb-6 text-center">Kebijakan Privasi</h1>
                    <p className="text-gray-600 text-center mb-12">
                        **Tanggal Efektif: 29 Juni 2025**
                    </p>

                    <p className="mb-8">
                        Terima kasih telah menggunakan layanan kami. Kami di <span className="font-bold ml-1">Easy</span><span className="font-extrabold text-primary">Form</span> berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan layanan kami, seperti formulir online, situs web, atau aplikasi.
                    </p>
                    <p className="mb-8">
                        Dengan menggunakan layanan kami, Anda menyetujui praktik pengumpulan dan penggunaan informasi yang dijelaskan dalam kebijakan ini.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">1. Informasi yang Kami Kumpulkan</h2>
                    <p className="mb-6">
                        Kami mengumpulkan dua jenis informasi utama:
                    </p>

                    <h3 className="text-xl font-semibold mb-2">a. Informasi yang Anda Berikan Secara Langsung</h3>
                    <p className="mb-4">
                        Saat Anda menggunakan layanan kami, Anda mungkin memberikan informasi pribadi, seperti:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li><strong>Informasi Kontak:</strong> Nama, alamat email, nomor telepon, dan alamat pos.</li>
                        <li><strong>Informasi Demografis:</strong> Tanggal lahir, jenis kelamin, dan preferensi pribadi.</li>
                        <li><strong>Konten yang Dibuat Pengguna:</strong> Jawaban formulir, pesan, ulasan, atau konten lain yang Anda unggah atau kirimkan.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-2">b. Informasi yang Dikumpulkan Secara Otomatis</h3>
                    <p className="mb-4">
                        Saat Anda mengakses layanan kami, kami dapat secara otomatis mengumpulkan informasi teknis tertentu, termasuk:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li><strong>Data Penggunaan:</strong> Halaman yang Anda kunjungi, waktu yang dihabiskan di setiap halaman, dan tindakan yang Anda lakukan.</li>
                        <li><strong>Data Perangkat:</strong> Alamat IP, jenis browser, sistem operasi, dan pengidentifikasi perangkat unik.</li>
                        <li><strong>Data Lokasi:</strong> Informasi lokasi umum yang berasal dari alamat IP Anda.</li>
                        <li><strong>Cookies dan Teknologi Serupa:</strong> Kami menggunakan <em>cookies</em> dan teknologi pelacakan lainnya untuk mengelola sesi, mengingat preferensi Anda, dan menganalisis tren penggunaan.</li>
                    </ul>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
                    <p className="mb-6">
                        Kami menggunakan informasi yang kami kumpulkan untuk berbagai tujuan, termasuk:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li><strong>Menyediakan Layanan:</strong> Untuk mengoperasikan, memelihara, dan meningkatkan layanan kami.</li>
                        <li><strong>Komunikasi:</strong> Untuk mengirimkan pembaruan, notifikasi, dan materi promosi (jika Anda setuju).</li>
                        <li><strong>Personalisasi:</strong> Untuk menyesuaikan pengalaman Anda dan menyajikan konten yang relevan.</li>
                        <li><strong>Analisis:</strong> Untuk memahami bagaimana pengguna berinteraksi dengan layanan kami dan mengoptimalkannya.</li>
                        <li><strong>Keamanan:</strong> Untuk mendeteksi dan mencegah penipuan, penyalahgunaan, dan aktivitas ilegal.</li>
                        <li><strong>Kepatuhan Hukum:</strong> Untuk mematuhi kewajiban hukum dan peraturan yang berlaku.</li>
                    </ul>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">3. Pembagian Informasi Anda</h2>
                    <p className="mb-6">
                        Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami dapat membagikan informasi Anda dengan:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li><strong>Penyedia Layanan:</strong> Pihak ketiga yang membantu kami dalam mengoperasikan layanan kami (misalnya, penyedia hosting, pemroses pembayaran). Mereka terikat oleh perjanjian kerahasiaan.</li>
                        <li><strong>Mitra Bisnis:</strong> Jika kami berkolaborasi dengan mitra, kami mungkin membagikan informasi dalam bentuk yang tidak dapat diidentifikasi secara pribadi.</li>
                        <li><strong>Kepatuhan Hukum:</strong> Jika diwajibkan oleh hukum atau untuk menanggapi proses hukum yang sah.</li>
                        <li><strong>Perubahan Kepemilikan:</strong> Dalam kasus merger, akuisisi, atau penjualan aset, informasi Anda dapat dialihkan sebagai bagian dari transaksi tersebut.</li>
                    </ul>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">4. Keamanan Informasi</h2>
                    <p className="mb-8">
                        Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, perlu diingat bahwa tidak ada metode transmisi data melalui internet yang 100% aman.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">5. Pilihan dan Hak Anda</h2>
                    <p className="mb-6">
                        Anda memiliki hak untuk:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li><strong>Mengakses dan Memperbarui:</strong> Anda dapat meninjau dan memperbarui informasi pribadi Anda kapan saja.</li>
                        <li><strong>Berhenti Berlangganan:</strong> Anda dapat memilih untuk tidak menerima komunikasi pemasaran dari kami dengan mengikuti petunjuk berhenti berlangganan yang disediakan.</li>
                        <li><strong>Penghapusan Data:</strong> Anda dapat meminta penghapusan informasi pribadi Anda, tunduk pada kewajiban hukum yang berlaku.</li>
                    </ul>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">6. Perubahan pada Kebijakan Privasi Ini</h2>
                    <p className="mb-8">
                        Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan dengan memposting kebijakan yang diperbarui di halaman ini.
                    </p>

                    <hr className="my-10" />

                    <h2 className="text-2xl font-semibold mb-4">7. Hubungi Kami</h2>
                    <p className="mb-8">
                        Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau praktik data kami, silakan hubungi kami di:
                    </p>
                    <ul className="list-disc list-inside ml-6 mb-6 space-y-2">
                        <li>Email: <a href="mailto:support@easyform.site" className="text-blue-600 hover:underline">support@easyform.site</a></li>
                        {/* <li>Alamat: [Alamat Fisik (opsional)]</li> */}
                    </ul>

                </div>
            </section>
        </GuestLayout>
    );
}