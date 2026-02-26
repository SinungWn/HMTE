#!/usr/bin/env node
// =============================================================================
//  setup-cms.js — Skrip Otomasi Integrasi Decap CMS untuk HMTE UNSOED
//  Cara pakai: node setup-cms.js
//  Jalankan dari ROOT direktori proyek.
// =============================================================================

const fs   = require("fs");
const path = require("path");

// ── Warna terminal ────────────────────────────────────────────────────────────
const c = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  cyan:   "\x1b[36m",
  gray:   "\x1b[90m",
  white:  "\x1b[37m",
};

const ok   = (msg) => console.log(`${c.green}✅ ${msg}${c.reset}`);
const warn = (msg) => console.log(`${c.yellow}⚠️  ${msg}${c.reset}`);
const err  = (msg) => console.log(`${c.red}❌ ${msg}${c.reset}`);
const info = (msg) => console.log(`${c.cyan}   ${msg}${c.reset}`);
const head = (msg) => console.log(`\n${c.bold}${c.white}── ${msg} ──${c.reset}`);
const sep  = ()    => console.log(`${c.gray}${"─".repeat(55)}${c.reset}`);

// ── Helper: buat folder + semua parent ───────────────────────────────────────
function mkdirp(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    ok(`Folder dibuat: ${dirPath}`);
  } else {
    info(`Folder sudah ada: ${dirPath}`);
  }
}

// ── Helper: tulis file (dengan backup kalau sudah ada) ────────────────────────
function writeFile(filePath, content, label) {
  const absPath = path.resolve(filePath);

  // Backup file lama jika ada
  if (fs.existsSync(absPath)) {
    const backupPath = `${absPath}.bak`;
    fs.copyFileSync(absPath, backupPath);
    info(`Backup disimpan: ${backupPath}`);
  }

  fs.writeFileSync(absPath, content, "utf-8");
  ok(`Ditulis: ${filePath}${label ? ` (${label})` : ""}`);
}

// ── Helper: tulis JSON dengan format { "items": [...] } ──────────────────────
function writeJSON(filePath, items) {
  writeFile(filePath, JSON.stringify({ items }, null, 2), `${items.length} item`);
}

// =============================================================================
//  DATA ASLI — diambil langsung dari js/data/project.js dan calendar.js
// =============================================================================

const ongoingProjects = [
  {
    title:       "Coming Soon",
    description: "Coming Soon.",
    pic:         "Divisi Coming Soon",
    status:      "0%",
    image:       "img/",
  },
];

const upcomingProjects = [
  {
    title:       "DTE Informal",
    date:        "2025-12-27",
    description: "Perayaan Dies Natalis Electrical Fest 1.0 sebagai acara kebersamaan.",
    image:       "img/Asset Feed/INTERNAL/3.webp",
  },
];

const completedProjects = [
  {
    title:              "Upgrading 1",
    date:               "2025-07-10",
    description:        "Acara upgrading 1 yang dilaksanakan oleh Internal HMTE 2025.",
    link:               "page/project/docs/reuni-akbar-2025.html",
    image:              "img/Project/upgrading1.JPG",
    releaseDescription: "loreeeem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title:              "Upgrading 2",
    date:               "2025-09-01",
    description:        "Acara Upgrading 2 yang dilaksanakan oleh Internal HMTE 2025.",
    link:               "page/project/docs/or-2025.html",
    image:              "img/Project/upgrading2.JPG",
    releaseDescription: "loreeeem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title:              "Electrical for Society di Panti Asuhan",
    date:               "2025-11-22",
    description:        "Acara dari teknik elektro yang menghadirkan volunteer untuk acara Bakti Sosial.",
    link:               "page/project/docs/or-2025.html",
    image:              "img/Project/EFS-pan.JPG",
    releaseDescription: "loreeeem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

// ── Data News dari news.js ────────────────────────────────────────────────────
const newsItems = [
  {
    id: "graduation-feb25", date: "Feb 22, 2025", category: "Graduation",
    title: "Electrical Graduation",
    preview: "HMTE Unsoed kembali melaksanakan Electrical Graduation periode Februari 2025, mengawal 16 wisudawan dan wisudawati dari angkatan 2020 dan 2021.",
    imgSrc: "../img/news/NewsCover-Graduation.webp",
    content: "<p class=\"mb-4\">Pada hari yang cerah, 22 Februari 2025, Himpunan Mahasiswa Teknik Elektro (HMTE) dengan bangga kembali menggelar 'Electrical Graduation' untuk periode Februari.</p><p class=\"mb-4\">Acara ini berhasil mengawal 16 wisudawan dan wisudawati hebat dari angkatan 2020 dan 2021.</p><p>Selamat kepada para lulusan! Masa depan listrik ada di tangan Anda.</p>",
  },
  {
    id: "efs-mar25", date: "Mar 12, 2025", category: "Humas",
    title: "Electrical for Society",
    preview: "Himpunan Mahasiswa Teknik Elektro (HMTE) telah berhasil melaksanakan program kerja unggulannya, Electrical for Society (EFS).",
    imgSrc: "../img/news/NewsCover-EFS.webp",
    content: "<p class=\"mb-4\">Program Electrical for Society (EFS) tahun ini sukses besar! Kegiatan yang berfokus pada pengabdian masyarakat ini dilaksanakan di Desa Sukamaju.</p><p>Kegiatan ini ditutup dengan sesi diskusi interaktif.</p>",
  },
  {
    id: "sosialisasippkm-nov25", date: "Nov 11, 2025", category: "Humas",
    title: "Sosialisasi PPKM dan PKM",
    preview: "Sebagai salah satu rangkaian program kerja PKM Center sosialisasi dilakukan untuk membekali KBTE sebelum mengikuti Program Kreativitas Mahasiswa.",
    imgSrc: "../img/news/NewsCover-SosPKM.png",
    content: "<p class=\"mb-4\">Pada tanggal 11 November 2025, HMTE Unsoed mengadakan sosialisasi PKM dan PPKM di Aula Teknik Elektro.</p>",
  },
  {
    id: "Kulum-4", date: "Nov 21, 2025", category: "Ristek",
    title: "Kuliah Umum Seri 4",
    preview: "Kuliah Umum Seri 4 menghadirkan pemaparan mengenai penerapan machine learning dalam kendali prostetik.",
    imgSrc: "../img/news/NewsCover-Kulum4.png",
    content: "<p class=\"mb-4\">Pada tanggal 21 November 2025, HMTE Unsoed menyelenggarakan Kuliah Umum Seri 4 dengan topik 'Machine Learning for Prosthetic Limb Control'.</p>",
  },
  {
    id: "Kulum-3", date: "Nov 20, 2025", category: "Ristek",
    title: "Kuliah Umum Seri 3",
    preview: "Kuliah Umum Seri 3 diselenggarakan untuk memperluas wawasan akademik mahasiswa melalui pemaparan materi tematik.",
    imgSrc: "../img/news/NewsCover-Kulum3.jpg",
    content: "<p class=\"mb-4\">Pada tanggal 20 November 2025, HMTE Unsoed menyelenggarakan Kuliah Umum Seri 3 di Aula Teknik Elektro.</p>",
  },
  {
    id: "Sarasehan-25", date: "Nov 19, 2025", category: "Internal",
    title: "Sarasehan Internal",
    preview: "Sarasehan Internal HMTE 2025 menjadi forum dialog antara mahasiswa, dosen, dan alumni.",
    imgSrc: "../img/news/NewsCover-Sarasehan2025.jpg",
    content: "<p class=\"mb-4\">Pada bulan November 2025, HMTE Unsoed menyelenggarakan Sarasehan Internal dengan tema 'Empowering Voices, Enhancing Quality'.</p>",
  },
];

// ── Data Events dari calendar.js ──────────────────────────────────────────────
const eventsItems = [
  {
    id: 1, date: "2025-09-20",
    title: "Line Tracer Soedirman",
    description: "Perlombaan Robot Line Tracer yang dilaksanakan di Fakultas Teknik Unsoed",
    time: "Pendaftaran 13 Juli - 27 Juli",
    location: "Gedung C Fakultas Teknik Unsoed",
    color: "green", isFeatured: true,
    registrationLink: "https://forms.gle/linkgformworkshop",
    imgSrc: "img/Event/lts.jpg",
    locationLink: "https://maps.app.goo.gl/link-ke-aula-teknik",
    content: "<h3>Detail LTS</h3><p>Lomba Line Tracer ini bertujuan berkompetisi dengan keterampilan dalam implementasi Sensor Tracing pada robot.</p>",
  },
  {
    id: 2, date: "2025-11-30",
    title: "Electrical Fun Run",
    description: "Kegiatan Fun Run yang dilaksanakan oleh Dies Natalis Teknik Elektro 2025",
    time: "Pendaftaran 16 Oktober - 31 Oktober",
    location: "Gedung C Fakultas Teknik",
    color: "blue", isFeatured: true,
    registrationLink: "https://forms.gle/linkgformseminar",
    imgSrc: "/img/Event/funrun.jpg",
    locationLink: "https://maps.app.goo.gl/link-ke-convention-center",
    content: "<h3>Detail Fun Run</h3><p>Kegiatan ini dilaksanakan di sekitar Fakultas Teknik.</p>",
  },
  {
    id: 3, date: "2025-12-12",
    title: "Musyawarah Anggota",
    description: "Kegiatan Musyawarah Anggota HMTE 2025",
    time: "Pelaksanaan Tanggal 12, 13, 14, 20, dan 22 Desember",
    location: "Gedung F Fakultas Teknik dan Balai Desa",
    color: "blue", isFeatured: true,
    registrationLink: "https://forms.gle/linkgformseminar",
    imgSrc: "/img/Event/musyang.jpg",
    locationLink: "https://maps.app.goo.gl/link-ke-convention-center",
    content: "<h3>Detail Musyang</h3><p></p>",
  },
];

// =============================================================================
//  KONTEN FILE — admin/index.html
// =============================================================================
const ADMIN_INDEX_HTML = `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Panel – HMTE UNSOED</title>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"><\/script>
  </head>
  <body>
    <!--
      Body HARUS kosong.
      Decap CMS akan me-mount UI-nya sendiri ke dalam body ini secara otomatis.
    -->
  </body>
</html>
`;

// =============================================================================
//  KONTEN FILE — admin/config.yml
//  ⚠️  GANTI dua placeholder di bawah sebelum deploy:
//      - YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
//      - YOUR_NETLIFY_SITE.netlify.app
// =============================================================================
const ADMIN_CONFIG_YML = `# =============================================================
#  DECAP CMS — KONFIGURASI UTAMA — HMTE UNSOED
#  Dokumentasi: https://decapcms.org/docs/configuration-options/
# =============================================================

# ── BACKEND ──────────────────────────────────────────────────
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME   # ← GANTI INI
  branch: main
  base_url: https://YOUR_NETLIFY_SITE.netlify.app  # ← GANTI INI (OAuth proxy)

# ── MEDIA ────────────────────────────────────────────────────
media_folder: "img/uploads"
public_folder: "/img/uploads"

locale: id

# =============================================================
#  COLLECTIONS
# =============================================================
collections:

  # ── 1. PROGRAM KERJA ───────────────────────────────────────
  - name: "projects"
    label: "Program Kerja"
    files:

      - name: "ongoing"
        label: "Proker Berjalan"
        file: "js/data/json/ongoing-projects.json"
        fields:
          - label: "Daftar Proker"
            name: "items"
            widget: "list"
            summary: "{{fields.title}}"
            fields:
              - { label: "Judul",            name: title,       widget: string }
              - { label: "Deskripsi",        name: description, widget: text }
              - { label: "PIC / Divisi",     name: pic,         widget: string,   required: false }
              - { label: "Status / Progres", name: status,      widget: string,   hint: "Contoh: 60% atau Tahap Perencanaan" }
              - { label: "Gambar",           name: image,       widget: image,    required: false }
              - { label: "Tanggal Mulai",    name: date,        widget: datetime, format: "YYYY-MM-DD", date_format: "DD MMMM YYYY", time_format: false, required: false }
              - { label: "Link Dokumentasi", name: link,        widget: string,   required: false }

      - name: "upcoming"
        label: "Proker Mendatang"
        file: "js/data/json/upcoming-projects.json"
        fields:
          - label: "Daftar Proker"
            name: "items"
            widget: "list"
            summary: "{{fields.title}}"
            fields:
              - { label: "Judul",         name: title,       widget: string }
              - { label: "Deskripsi",     name: description, widget: text }
              - { label: "Gambar",        name: image,       widget: image,    required: false }
              - { label: "Tanggal",       name: date,        widget: datetime, format: "YYYY-MM-DD", date_format: "DD MMMM YYYY", time_format: false, required: false }
              - { label: "Link",          name: link,        widget: string,   required: false }

      - name: "completed"
        label: "Proker Selesai"
        file: "js/data/json/completed-projects.json"
        fields:
          - label: "Daftar Proker"
            name: "items"
            widget: "list"
            summary: "{{fields.title}}"
            fields:
              - { label: "Judul",              name: title,              widget: string }
              - { label: "Deskripsi",          name: description,        widget: text }
              - { label: "Gambar",             name: image,              widget: image,    required: false }
              - { label: "Tanggal Selesai",    name: date,               widget: datetime, format: "YYYY-MM-DD", date_format: "DD MMMM YYYY", time_format: false }
              - { label: "Link Dokumentasi",   name: link,               widget: string,   required: false }
              - { label: "Konten Rilis",       name: releaseDescription, widget: text,     required: false }

  # ── 2. BERITA ──────────────────────────────────────────────
  - name: "news"
    label: "Berita"
    files:
      - name: "all_news"
        label: "Semua Berita"
        file: "js/data/json/news.json"
        fields:
          - label: "Daftar Berita"
            name: "items"
            widget: "list"
            summary: "{{fields.title}}"
            fields:
              - { label: "ID / Slug",    name: id,       widget: string, hint: "URL-friendly, contoh: seminar-ai-2025" }
              - { label: "Judul",        name: title,    widget: string }
              - { label: "Tanggal",      name: date,     widget: string, hint: "Format: Mar 12, 2025" }
              - { label: "Kategori",     name: category, widget: select, options: ["Graduation","Humas","Ristek","Internal","Lainnya"] }
              - { label: "Preview",      name: preview,  widget: text }
              - { label: "Konten",       name: content,  widget: markdown }
              - { label: "Gambar Cover", name: imgSrc,   widget: image, required: false }

  # ── 3. EVENT ──────────────────────────────────────────────
  - name: "events"
    label: "Event"
    files:
      - name: "all_events"
        label: "Semua Event"
        file: "js/data/json/events.json"
        fields:
          - label: "Daftar Event"
            name: "items"
            widget: "list"
            summary: "{{fields.title}}"
            fields:
              - { label: "ID",               name: id,               widget: number }
              - { label: "Nama Event",       name: title,            widget: string }
              - { label: "Deskripsi",        name: description,      widget: text }
              - { label: "Tanggal",          name: date,             widget: datetime, format: "YYYY-MM-DD", date_format: "DD MMMM YYYY", time_format: false }
              - { label: "Waktu / Jadwal",   name: time,             widget: string,   hint: "Contoh: Pendaftaran 13 Juli - 27 Juli" }
              - { label: "Lokasi",           name: location,         widget: string }
              - { label: "Link Google Maps", name: locationLink,     widget: string,   required: false }
              - { label: "Gambar / Poster",  name: imgSrc,           widget: image,    required: false }
              - { label: "Link Pendaftaran", name: registrationLink, widget: string,   required: false }
              - { label: "Warna Badge",      name: color,            widget: select,   options: ["green","blue","yellow"], default: "green" }
              - { label: "Tampil di Beranda",name: isFeatured,       widget: boolean,  default: false }
              - { label: "Konten Detail",    name: content,          widget: markdown, required: false }
`;

// =============================================================================
//  KONTEN FILE — js/pages/project.js (versi fetch JSON)
// =============================================================================
const PROJECT_PAGE_JS = `// js/pages/project.js
// Versi CMS: data di-fetch dari JSON, bukan variabel global.
// Semua logika render TIDAK BERUBAH.

const JSON_PATHS = {
  ongoing:   "/js/data/json/ongoing-projects.json",
  upcoming:  "/js/data/json/upcoming-projects.json",
  completed: "/js/data/json/completed-projects.json",
};
const FALLBACK_IMAGE = "/img/logohmte.png";

async function fetchProjectData(category) {
  try {
    const res = await fetch(JSON_PATHS[category]);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const json = await res.json();
    return (json.items || []).map((p) => ({
      ...p,
      category,
      image: p.image || FALLBACK_IMAGE,
    }));
  } catch (e) {
    console.warn(\`[project.js] Gagal fetch \${category}:\`, e.message);
    return [];
  }
}

async function getAllProjects() {
  const [ongoing, upcoming, completed] = await Promise.all([
    fetchProjectData("ongoing"),
    fetchProjectData("upcoming"),
    fetchProjectData("completed"),
  ]);
  const withMeta = (arr, categoryLabel, statusFn, contentFn) =>
    arr.map((p) => ({ ...p, categoryLabel, statusText: statusFn(p), content: contentFn(p) }));

  const all = [
    ...withMeta(ongoing,   "Sedang Berjalan", (p) => \`Progres: \${p.status}\`, (p) => p.description),
    ...withMeta(upcoming,  "Akan Datang",     ()  => "Segera Hadir",           (p) => p.description),
    ...withMeta(completed, "Arsip Kegiatan",  ()  => "Selesai",                (p) => p.releaseDescription || p.description),
  ];
  return all.map((p, i) => ({ ...p, id: i + 1 }));
}

async function loadProjectSections() {
  const all      = await getAllProjects();
  const ongoing  = all.filter((p) => p.category === "ongoing");
  const upcoming = all.filter((p) => p.category === "upcoming").sort((a, b) => new Date(a.date) - new Date(b.date));
  const completed = all.filter((p) => p.category === "completed").sort((a, b) => new Date(b.date) - new Date(a.date));
  renderOngoingProjects(ongoing.slice(0, 3));
  renderUpcomingProjects(upcoming);
  renderCompletedProjects(completed);
}

async function loadProjectDetailPage() {
  const id  = new URLSearchParams(window.location.search).get("id");
  const all = await getAllProjects();
  const project = all.find((p) => p.id == id);

  const titleEl       = document.getElementById("detail-title");
  const contentEl     = document.getElementById("detail-content");
  const dateEl        = document.getElementById("detail-date");
  const categoryBadge = document.getElementById("detail-category-badge");
  const statusBadge   = document.getElementById("detail-status-badge");
  const imgContainer  = document.getElementById("detail-image-container");
  const docSection    = document.getElementById("documentation-section");
  const docLink       = document.getElementById("documentation-link");

  if (!project) {
    if (titleEl)      titleEl.textContent = "Proyek Tidak Ditemukan";
    if (contentEl)    contentEl.innerHTML = '<p class="text-red-400 text-center py-10">Maaf, proyek tidak tersedia.</p>';
    if (imgContainer) imgContainer.style.display = "none";
    if (docSection)   docSection.style.display   = "none";
    return;
  }

  document.getElementById("page-title").textContent = \`\${project.title} - Detail\`;
  titleEl.textContent        = project.title;
  statusBadge.textContent    = project.statusText;
  categoryBadge.textContent  = project.categoryLabel;

  const badgeMap = {
    completed: "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-900/50 text-green-400 border border-green-800",
    ongoing:   "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/50 text-blue-400 border border-blue-800",
    upcoming:  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-900/50 text-yellow-400 border border-yellow-800",
  };
  categoryBadge.className = badgeMap[project.category] || badgeMap.upcoming;

  if (project.date) {
    const d = new Date(project.date);
    dateEl.textContent = isNaN(d.getTime()) ? "Tanggal belum ditentukan"
      : d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } else {
    dateEl.textContent = "-";
  }

  const imgSrc = project.image.startsWith("/") ? project.image : \`/\${project.image}\`;
  if (imgContainer) {
    imgContainer.innerHTML = \`<img src="\${imgSrc}" alt="\${project.title}"
      class="w-full h-auto rounded-lg shadow-lg"
      onerror="this.onerror=null;this.src='/img/logohmte.png';" />\`;
  }
  contentEl.innerHTML = project.content;

  if (project.link && docSection && docLink) {
    docLink.href = project.link;
    docSection.classList.remove("hidden");
  } else if (docSection) {
    docSection.classList.add("hidden");
  }
}

// ── Render Functions (tidak berubah) ─────────────────────────────────────────
function renderOngoingProjects(projects) {
  const container = document.getElementById("ongoing-projects-container");
  if (!container) return;
  if (projects.length === 0) { container.innerHTML = '<p class="text-gray-400">Tidak ada proyek yang sedang berjalan saat ini.</p>'; return; }
  container.innerHTML = \`<div class="cards-grid">\${projects.map((p) => {
    const img  = p.image.startsWith("/") ? p.image : \`/\${p.image}\`;
    const link = \`/page/project/project-detail.html?id=\${p.id}\`;
    return \`<a href="\${link}" class="project-card border-t-green group">
      <div class="card-img-wrap"><img src="\${img}" alt="\${p.title}" onerror="this.onerror=null;this.src='/img/logohmte.png';"><span class="card-badge">ONGOING</span></div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="card-title text-base font-bold text-white mb-2 group-hover:text-green-400 transition">\${p.title}</h3>
        <p class="card-desc text-gray-400 text-sm mb-3">\${p.description}</p>
        <p class="text-gray-500 text-xs mt-auto">\${p.statusText}</p>
      </div></a>\`;
  }).join("")}</div>\`;
}

function renderUpcomingProjects(projects) {
  const container = document.getElementById("upcoming-projects-container");
  if (!container) return;
  if (projects.length === 0) { container.innerHTML = '<p class="text-gray-400">Tidak ada proyek yang dijadwalkan.</p>'; return; }
  container.innerHTML = \`<div class="cards-grid">\${projects.map((p) => {
    const img  = p.image.startsWith("/") ? p.image : \`/\${p.image}\`;
    const link = \`/page/project/project-detail.html?id=\${p.id}\`;
    return \`<a href="\${link}" class="project-card border-t-yellow group">
      <div class="card-img-wrap"><img src="\${img}" alt="\${p.title}" onerror="this.onerror=null;this.src='/img/logohmte.png';"><span class="card-badge">UPCOMING</span></div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="card-title text-base font-bold text-white mb-2 group-hover:text-yellow-400 transition">\${p.title}</h3>
        <p class="card-desc text-gray-400 text-sm mb-3">\${p.description}</p>
        <p class="text-yellow-400 text-xs mt-auto">\${p.statusText}</p>
      </div></a>\`;
  }).join("")}</div>\`;
}

function renderCompletedProjects(projects) {
  const container = document.getElementById("completed-projects-container");
  if (!container) return;
  if (projects.length === 0) { container.innerHTML = '<p class="text-gray-400">Belum ada proyek selesai.</p>'; return; }
  container.innerHTML = \`<div class="cards-grid">\${projects.map((p) => {
    const img  = p.image.startsWith("/") ? p.image : \`/\${p.image}\`;
    const link = \`/page/project/project-detail.html?id=\${p.id}\`;
    return \`<a href="\${link}" class="project-card border-t-cyan group">
      <div class="card-img-wrap"><img src="\${img}" alt="\${p.title}" onerror="this.onerror=null;this.src='/img/logohmte.png';"><span class="card-badge">COMPLETED</span></div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="card-title text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition">\${p.title}</h3>
        <p class="card-desc text-gray-400 text-sm mb-3">\${p.description}</p>
        <p class="text-gray-500 text-xs mt-auto mb-2">\${p.statusText}</p>
        <span class="text-cyan-400 text-sm font-semibold group-hover:underline mt-auto">Lihat Detail →</span>
      </div></a>\`;
  }).join("")}</div>\`;
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("project-detail.html")) loadProjectDetailPage();
  else if (path.includes("project.html"))   loadProjectSections();
});
`;

// =============================================================================
//  EKSEKUSI UTAMA
// =============================================================================

console.log(`\n${c.bold}${c.green}╔══════════════════════════════════════════════╗`);
console.log(`║   HMTE CMS Setup — Decap CMS Automator      ║`);
console.log(`╚══════════════════════════════════════════════╝${c.reset}`);
console.log(`${c.gray}   Jalankan dari ROOT direktori proyek${c.reset}\n`);

// ── LANGKAH 1: Buat Folder ────────────────────────────────────────────────────
head("LANGKAH 1: Membuat Folder");
mkdirp("admin");
mkdirp("js/data/json");
mkdirp("img/uploads");
// .gitkeep agar folder masuk ke git commit
const gitkeepPath = "img/uploads/.gitkeep";
if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, "", "utf-8");
  ok("File .gitkeep dibuat di img/uploads/");
}

// ── LANGKAH 2: Migrasi Data ke JSON ──────────────────────────────────────────
head("LANGKAH 2: Migrasi Data ke JSON");
writeJSON("js/data/json/ongoing-projects.json",  ongoingProjects);
writeJSON("js/data/json/upcoming-projects.json", upcomingProjects);
writeJSON("js/data/json/completed-projects.json", completedProjects);
writeJSON("js/data/json/news.json",              newsItems);
writeJSON("js/data/json/events.json",            eventsItems);

// ── LANGKAH 3: Tulis File Admin ───────────────────────────────────────────────
head("LANGKAH 3: Menulis File Admin");
writeFile("admin/index.html", ADMIN_INDEX_HTML, "Decap CMS entry point");
writeFile("admin/config.yml", ADMIN_CONFIG_YML, "Konfigurasi CMS");

// ── LANGKAH 4: Update js/pages/project.js ────────────────────────────────────
head("LANGKAH 4: Update js/pages/project.js");

// Cari file project.js di beberapa lokasi yang mungkin
const possibleProjectJsPaths = [
  "js/pages/project.js",
  "page/project/project.js",
];
let projectJsPath = null;
for (const p of possibleProjectJsPaths) {
  if (fs.existsSync(p)) { projectJsPath = p; break; }
}

if (projectJsPath) {
  writeFile(projectJsPath, PROJECT_PAGE_JS, "fetch JSON version");
} else {
  // Tulis ke lokasi standar meskipun belum ada
  writeFile("js/pages/project.js", PROJECT_PAGE_JS, "fetch JSON version (baru)");
  warn("File js/pages/project.js tidak ditemukan → dibuat baru di js/pages/project.js");
}

// ── LANGKAH 5: Update project.html (hapus script tag lama) ───────────────────
head("LANGKAH 5: Update project.html");

// Cari file project.html di berbagai lokasi
const possibleProjectHtmlPaths = [
  "page/project/project.html",
  "project.html",
  "pages/project/project.html",
];
let projectHtmlPath = null;
for (const p of possibleProjectHtmlPaths) {
  if (fs.existsSync(p)) { projectHtmlPath = p; break; }
}

if (projectHtmlPath) {
  let html = fs.readFileSync(projectHtmlPath, "utf-8");
  const originalLength = html.length;

  // Pattern yang dicari: berbagai variasi tag script yang memuat data project
  const scriptPatterns = [
    // Relatif dari page/project/
    /<script[^>]+src=["'][^"']*js\/data\/project\.js["'][^>]*><\/script>\s*\n?/gi,
    // Absolut
    /<script[^>]+src=["']\/js\/data\/project\.js["'][^>]*><\/script>\s*\n?/gi,
    // Dengan ../../
    /<script[^>]+src=["']\.\.\/\.\.\/js\/data\/project\.js["'][^>]*><\/script>\s*\n?/gi,
  ];

  let removed = 0;
  for (const pattern of scriptPatterns) {
    const before = html.length;
    html = html.replace(pattern, "");
    if (html.length < before) removed++;
  }

  if (removed > 0 || html.length < originalLength) {
    // Backup + tulis
    fs.copyFileSync(projectHtmlPath, `${projectHtmlPath}.bak`);
    fs.writeFileSync(projectHtmlPath, html, "utf-8");
    ok(`Tag <script> data lama dihapus dari ${projectHtmlPath}`);
  } else {
    warn(`Tidak ditemukan tag script data lama di ${projectHtmlPath} (mungkin sudah bersih)`);
  }
} else {
  warn("File project.html tidak ditemukan. Hapus manual baris ini dari HTML:");
  info('<script src="../../js/data/project.js"></script>');
}

// ── LAPORAN AKHIR ─────────────────────────────────────────────────────────────
sep();
console.log(`\n${c.bold}${c.green}🎉 SELESAI! Semua langkah berhasil dijalankan.${c.reset}\n`);

console.log(`${c.bold}${c.yellow}📋 LANGKAH MANUAL YANG MASIH PERLU DILAKUKAN:${c.reset}`);
console.log(`
  ${c.cyan}1. Edit admin/config.yml — ganti 2 placeholder:${c.reset}
     - repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
     - base_url: https://YOUR_NETLIFY_SITE.netlify.app

  ${c.cyan}2. Buat GitHub OAuth App:${c.reset}
     - Buka: github.com → Settings → Developer settings → OAuth Apps
     - Homepage URL: URL Vercel Anda
     - Callback URL: https://api.netlify.com/auth/done

  ${c.cyan}3. Deploy OAuth proxy ke Netlify (gratis):${c.reset}
     - Buat folder kosong + index.html → deploy ke Netlify
     - Set env vars: NETLIFY_OAUTH_CLIENT_ID & NETLIFY_OAUTH_CLIENT_SECRET
     - Aktifkan: Identity + Git Gateway di dashboard Netlify

  ${c.cyan}4. Commit & Push ke GitHub:${c.reset}
     git add admin/ js/data/json/ img/uploads/.gitkeep js/pages/project.js
     git commit -m "feat: integrasi Decap CMS + migrasi data JSON"
     git push

  ${c.cyan}5. Buka panel admin:${c.reset}
     https://your-site.vercel.app/admin/
`);

console.log(`${c.gray}File backup (.bak) disimpan untuk setiap file yang diubah.${c.reset}`);
console.log(`${c.gray}Hapus file .bak setelah memastikan semua berjalan normal.${c.reset}\n`);
