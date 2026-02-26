// js/pages/project.js
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return (json.items || []).map((p) => ({
      ...p,
      category,
      image: p.image || FALLBACK_IMAGE,
    }));
  } catch (e) {
    console.warn(`[project.js] Gagal fetch ${category}:`, e.message);
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
    ...withMeta(ongoing,   "Sedang Berjalan", (p) => `Progres: ${p.status}`, (p) => p.description),
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

  document.getElementById("page-title").textContent = `${project.title} - Detail`;
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

  const imgSrc = project.image.startsWith("/") ? project.image : `/${project.image}`;
  if (imgContainer) {
    imgContainer.innerHTML = `<img src="${imgSrc}" alt="${project.title}"
      class="w-full h-auto rounded-lg shadow-lg"
      onerror="this.onerror=null;this.src='/img/logohmte.png';" />`;
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
  container.innerHTML = `<div class="cards-grid">${projects.map((p) => {
    const img  = p.image.startsWith("/") ? p.image : `/${p.image}`;
    const link = `/page/project/project-detail.html?id=${p.id}`;
    return `<a href="${link}" class="project-card border-t-green group">
      <div class="card-img-wrap"><img src="${img}" alt="${p.title}" onerror="this.onerror=null;this.src='/img/logohmte.png';"><span class="card-badge">ONGOING</span></div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="card-title text-base font-bold text-white mb-2 group-hover:text-green-400 transition">${p.title}</h3>
        <p class="card-desc text-gray-400 text-sm mb-3">${p.description}</p>
        <p class="text-gray-500 text-xs mt-auto">${p.statusText}</p>
      </div></a>`;
  }).join("")}</div>`;
}

function renderUpcomingProjects(projects) {
  const container = document.getElementById("upcoming-projects-container");
  if (!container) return;
  if (projects.length === 0) { container.innerHTML = '<p class="text-gray-400">Tidak ada proyek yang dijadwalkan.</p>'; return; }
  container.innerHTML = `<div class="cards-grid">${projects.map((p) => {
    const img  = p.image.startsWith("/") ? p.image : `/${p.image}`;
    const link = `/page/project/project-detail.html?id=${p.id}`;
    return `<a href="${link}" class="project-card border-t-yellow group">
      <div class="card-img-wrap"><img src="${img}" alt="${p.title}" onerror="this.onerror=null;this.src='/img/logohmte.png';"><span class="card-badge">UPCOMING</span></div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="card-title text-base font-bold text-white mb-2 group-hover:text-yellow-400 transition">${p.title}</h3>
        <p class="card-desc text-gray-400 text-sm mb-3">${p.description}</p>
        <p class="text-yellow-400 text-xs mt-auto">${p.statusText}</p>
      </div></a>`;
  }).join("")}</div>`;
}

function renderCompletedProjects(projects) {
  const container = document.getElementById("completed-projects-container");
  if (!container) return;
  if (projects.length === 0) { container.innerHTML = '<p class="text-gray-400">Belum ada proyek selesai.</p>'; return; }
  container.innerHTML = `<div class="cards-grid">${projects.map((p) => {
    const img  = p.image.startsWith("/") ? p.image : `/${p.image}`;
    const link = `/page/project/project-detail.html?id=${p.id}`;
    return `<a href="${link}" class="project-card border-t-cyan group">
      <div class="card-img-wrap"><img src="${img}" alt="${p.title}" onerror="this.onerror=null;this.src='/img/logohmte.png';"><span class="card-badge">COMPLETED</span></div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="card-title text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition">${p.title}</h3>
        <p class="card-desc text-gray-400 text-sm mb-3">${p.description}</p>
        <p class="text-gray-500 text-xs mt-auto mb-2">${p.statusText}</p>
        <span class="text-cyan-400 text-sm font-semibold group-hover:underline mt-auto">Lihat Detail →</span>
      </div></a>`;
  }).join("")}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("project-detail.html")) loadProjectDetailPage();
  else if (path.includes("project.html"))   loadProjectSections();
});
