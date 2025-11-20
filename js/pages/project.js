// js/pages/project.js

// === HELPER & DATA PROCESSING ===

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function getAllProjects() {
  const all = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fallbackImage = "/img/logohmte.png";

  if (typeof ongoingProjects !== "undefined") {
    ongoingProjects.forEach((project) => {
      all.push({
        ...project,
        category: "ongoing",
        categoryLabel: "Sedang Berjalan",
        statusText: `Progres: ${project.status}`,
        image: project.image || fallbackImage,
        content: project.description,
      });
    });
  }

  if (typeof upcomingProjects !== "undefined") {
    upcomingProjects.forEach((project) => {
      all.push({
        ...project,
        category: "upcoming",
        categoryLabel: "Akan Datang",
        statusText: "Segera Hadir",
        image: project.image || fallbackImage,
        content: project.description,
      });
    });
  }

  if (typeof completedProjects !== "undefined") {
    completedProjects.forEach((project) => {
      const content = project.release || project.description;
      all.push({
        ...project,
        category: "completed",
        categoryLabel: "Arsip Kegiatan",
        statusText: "Selesai",
        image: project.image || fallbackImage,
        content: content,
      });
    });
  }

  return all.map((p, i) => ({ ...p, id: i + 1 }));
}

// === LOGIKA HALAMAN DETAIL ===

function loadProjectDetailPage() {
  const eventId = getQueryParam("id");
  const allProjects = getAllProjects();
  const project = allProjects.find((p) => p.id == eventId);

  const titleEl = document.getElementById("detail-title");
  const contentEl = document.getElementById("detail-content");
  const dateEl = document.getElementById("detail-date");
  const categoryBadge = document.getElementById("detail-category-badge");
  const statusBadge = document.getElementById("detail-status-badge");
  const imgContainer = document.getElementById("detail-image-container");
  const docSection = document.getElementById("documentation-section");
  const docLink = document.getElementById("documentation-link");

  if (!project) {
    if (titleEl) titleEl.textContent = "Proyek Tidak Ditemukan";
    if (contentEl) contentEl.innerHTML = '<p class="text-red-400 text-center py-10">Maaf, proyek yang Anda cari tidak tersedia.</p>';
    if (imgContainer) imgContainer.style.display = "none";
    if (docSection) docSection.style.display = "none";
    return;
  }

  // 1. Metadata Header
  document.getElementById("page-title").textContent = `${project.title} - Detail`;
  titleEl.textContent = project.title;
  statusBadge.textContent = project.statusText;
  categoryBadge.textContent = project.categoryLabel;

  // Styling Badge
  if (project.category === "completed") {
    categoryBadge.className = "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-900/50 text-green-400 border border-green-800";
  } else if (project.category === "ongoing") {
    categoryBadge.className = "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/50 text-blue-400 border border-blue-800";
  } else {
    categoryBadge.className = "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-900/50 text-yellow-400 border border-yellow-800";
  }

  // Tanggal
  if (project.date) {
    const dateObj = new Date(project.date);
    dateEl.textContent = isNaN(dateObj.getTime()) ? "Tanggal belum ditentukan" : dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } else {
    dateEl.textContent = "-";
  }

  // 2. Render Gambar
  const imgSrc = project.image.startsWith("/") ? project.image : `/${project.image.replace(/^\//, "")}`;

  if (imgContainer) {
    imgContainer.innerHTML = `
      <img src="${imgSrc}" 
           alt="${project.title}" 
           class="w-full h-auto rounded-lg shadow-lg"
           onerror="this.onerror=null;this.src='/img/logohmte.png';" />
    `;
  }

  // 3. Konten
  contentEl.innerHTML = project.content;

  // 4. Link Dokumentasi
  if (project.link && docSection && docLink) {
    docLink.href = project.link;
    docSection.classList.remove("hidden");
  } else if (docSection) {
    docSection.classList.add("hidden");
  }
}

// === LOGIKA HALAMAN LIST ===

function loadProjectSections() {
  const allProjects = getAllProjects();
  const ongoing = allProjects.filter((p) => p.category === "ongoing");
  const upcoming = allProjects.filter((p) => p.category === "upcoming").sort((a, b) => new Date(a.date) - new Date(b.date));
  const completed = allProjects.filter((p) => p.category === "completed").sort((a, b) => new Date(b.date) - new Date(a.date));

  renderOngoingProjects(ongoing.slice(0, 3));
  renderUpcomingProjects(upcoming);
  renderCompletedProjects(completed);
}

function renderOngoingProjects(projects) {
  const container = document.getElementById("ongoing-projects-container");
  if (!container) return;
  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Tidak ada proyek yang sedang berjalan saat ini.</p>';
    return;
  }

  const projectsHTML = projects
    .map((project) => {
      const imagePath = project.image.startsWith("/") ? project.image : `/${project.image}`;
      // FIX: Tambahkan link detail (Absolut)
      const detailLink = `/page/project/project-detail.html?id=${project.id}`;

      // FIX: Ubah div menjadi a href, tambah class group dan hover effects
      return `
            <a href="${detailLink}" class="group project-card flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden border-t-4 border-green-500 cursor-pointer transition-transform transform hover:scale-[1.02]">
                <div class="block relative h-72 overflow-hidden"> 
                    <img src="${imagePath}" alt="${project.title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-110" onerror="this.onerror=null;this.src='/img/logohmte.png';">
                    <div class="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-3 py-1 m-2 rounded-full font-bold">ONGOING</div>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition">${project.title}</h3>
                    <p class="text-gray-400 text-sm mb-3 flex-grow line-clamp-3">${project.description}</p>
                    <p class="text-gray-500 text-xs mt-auto">${project.statusText}</p>
                </div>
            </a>`;
    })
    .join("");
  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${projectsHTML}</div>`;
}

function renderUpcomingProjects(projects) {
  const container = document.getElementById("upcoming-projects-container");
  if (!container) return;
  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Tidak ada proyek yang dijadwalkan.</p>';
    return;
  }

  const projectsHTML = projects
    .map((project) => {
      const imagePath = project.image.startsWith("/") ? project.image : `/${project.image}`;
      // FIX: Tambahkan link detail
      const detailLink = `/page/project/project-detail.html?id=${project.id}`;

      return `
            <a href="${detailLink}" class="group project-card flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden border-t-4 border-yellow-500 cursor-pointer transition-transform transform hover:scale-[1.02]">
                <div class="block relative h-72 overflow-hidden"> 
                    <img src="${imagePath}" alt="${project.title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-110" onerror="this.onerror=null;this.src='/img/logohmte.png';">
                    <div class="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-3 py-1 m-2 rounded-full font-bold">UPCOMING</div>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition">${project.title}</h3>
                    <p class="text-gray-400 text-sm mb-3 flex-grow line-clamp-3">${project.description}</p>
                    <p class="text-yellow-400 text-xs mt-auto">${project.statusText}</p>
                </div>
            </a>`;
    })
    .join("");
  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${projectsHTML}</div>`;
}

function renderCompletedProjects(projects) {
  const container = document.getElementById("completed-projects-container");
  if (!container) return;
  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Belum ada proyek selesai.</p>';
    return;
  }

  const projectsHTML = projects
    .map((project) => {
      // FIX: Gunakan jalur absolut untuk detail link
      const detailLink = `/page/project/project-detail.html?id=${project.id}`;
      const imagePath = project.image.startsWith("/") ? project.image : `/${project.image}`;

      return `
            <a href="${detailLink}" class="group project-card flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02] border-t-4 border-cyan-500 cursor-pointer">
                <div class="block relative h-72 overflow-hidden"> 
                    <img src="${imagePath}" alt="${project.title}" class="w-full h-full object-cover transition duration-300 ease-in-out group-hover:opacity-80" onerror="this.onerror=null;this.src='/img/logohmte.png';">
                    <div class="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-3 py-1 m-2 rounded-full font-bold">COMPLETED</div>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition line-clamp-2">${project.title}</h3>
                    <p class="text-gray-400 text-sm mb-3 flex-grow line-clamp-3">${project.description}</p>
                    <p class="text-gray-500 text-xs mt-auto mb-2">${project.statusText}</p>
                    <span class="text-cyan-400 mt-auto text-sm font-semibold group-hover:underline">Lihat Detail →</span>
                </div>
            </a>`;
    })
    .join("");
  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${projectsHTML}</div>`;
}

// === EXECUTION LOGIC ===
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("project-detail.html")) {
    loadProjectDetailPage();
  } else if (path.includes("project.html")) {
    if (typeof loadProjectSections === "function") {
      setTimeout(loadProjectSections, 100);
    }
  }
});
