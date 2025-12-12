// js/data/projects.js

/**
 * Data Proyek HMTE (Program Kerja)
 * Catatan: Ganti nilai 'link' dengan URL dokumentasi/press release nyata
 */

const ongoingProjects = [
  {
    id: 1,
    title: "Coming Soon",
    description: "Coming Soon.",
    pic: "Divisi Coming Soon",
    status: "0%",
    image: "img/", // Ganti dengan path gambar cover
  },
];

const upcomingProjects = [
  {
    id: 4,
    title: "DTE Informal",
    date: "2025-12-27",
    description: "Perayaan Dies Natalis Electrical Fest 1.0 sebagai acara kebersamaan.",
    image: "img/Asset Feed/INTERNAL/3.webp",
  },
];

const completedProjects = [
  {
    id: 20,
    title: "Upgrading 1",
    date: "2025-07-10",
    description: "Acara upgrading 1 yang dilaksanakan oleh Internal HMTE 2025.",
    link: "page/project/docs/reuni-akbar-2025.html", // Path ke detail/dokumen
    image: "img/Project/upgrading1.JPG",
    release: "loreeeem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 21,
    title: "Upgrading 2",
    date: "2025-09-01",
    description: "Acara Upgrading 2 yang dilaksanakan oleh Internal HMTE 2025.",
    link: "page/project/docs/or-2025.html",
    image: "img/Project/upgrading2.JPG",
    release: "loreeeem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 22,
    title: "Electrical for Society di Panti Asuhan",
    date: "2025-11-22",
    description: "Acara dari teknik elektro yang menghadirkan volunteer untuk acara Bakti Sosial.",
    link: "page/project/docs/or-2025.html",
    image: "img/Project/EFS-pan.JPG",
    release: "loreeeem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

// Expose data secara global
window.ongoingProjects = ongoingProjects;
window.upcomingProjects = upcomingProjects;
window.completedProjects = completedProjects;
