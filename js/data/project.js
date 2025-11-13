// js/data/projects.js

/**
 * Data Proyek HMTE (Program Kerja)
 * Catatan: Ganti nilai 'link' dengan URL dokumentasi/press release nyata
 */

const ongoingProjects = [
  {
    id: 1,
    title: "ELECTRO FESTIVAL 2026 (E-FEST)",
    description: "Persiapan acara puncak tahunan HMTE, mencakup kompetisi regional dan seminar nasional.",
    pic: "Divisi HUMAS & KWU",
    status: "70%",
    image: "img/Asset Feed/HUMAS/1.jpg", // Ganti dengan path gambar cover
  },
  {
    id: 2,
    title: "Sistem Informasi Manajemen HMTE (SIM-HMTE)",
    description: "Pengembangan dan pemeliharaan sistem informasi internal organisasi untuk efisiensi data.",
    pic: "Divisi RISTEK",
    status: "45%",
    image: "img/Asset Feed/RISTEK/2.webp",
  },
  {
    id: 3,
    title: "Webinar Skill-Up Series: IoT and Embedded Systems",
    description: "Rangkaian webinar bulanan untuk meningkatkan kemampuan teknis mahasiswa di bidang IoT.",
    pic: "Divisi RISTEK & INTERNAL",
    status: "25%",
    image: "img/Asset Feed/INTERNAL/3.webp",
  },
];

const upcomingProjects = [
  {
    id: 4,
    title: "Dies Natalis Teknik Elektro ke-XXV",
    date: "2026-03-20",
    description: "Perayaan ulang tahun jurusan Teknik Elektro dengan berbagai lomba dan acara kebersamaan.",
    pic: "BPH & MIKAT",
  },
  {
    id: 5,
    title: "Workshop Laporan Keuangan Organisasi",
    date: "2026-01-15",
    description: "Pelatihan wajib bagi seluruh pengurus terkait standar pelaporan keuangan yang akuntabel.",
    pic: "Divisi KWU",
  },
];

const completedProjects = [
  {
    id: 6,
    title: "Reuni Akbar Alumni Teknik Elektro 2025",
    date: "2025-07-10",
    description: "Acara temu kangen yang berhasil mengumpulkan lebih dari 200 alumni dari berbagai angkatan.",
    link: "page/project/docs/reuni-akbar-2025.html", // Path ke detail/dokumen
    image: "img/Asset Feed/MIKAT/1.jpg",
  },
  {
    id: 7,
    title: "Open Recruitment Pengurus Baru 2025",
    date: "2025-09-01",
    description: "Proses rekrutmen anggota baru yang melibatkan seleksi ketat dan mentoring.",
    link: "page/project/docs/or-2025.html",
    image: "img/Asset Feed/PSDM/2.webp",
  },
];

// Expose data secara global
window.ongoingProjects = ongoingProjects;
window.upcomingProjects = upcomingProjects;
window.completedProjects = completedProjects;
