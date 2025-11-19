// js/pages/project.js

// === Helper Functions ===

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fungsi untuk menggabungkan dan melabeli semua proyek (FIXED: Konten detail dan CompletedProjects)
function getAllProjects() {
  const all = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fallback image path (relative to root)
  const fallbackImage = "img/logohmte.png";

  // 1. Ongoing Projects
  if (typeof ongoingProjects !== "undefined") {
    ongoingProjects.forEach((project) => {
      all.push({
        ...project,
        category: "ongoing",
        statusText: `Status: ${project.status}`,
        emoji: "🚀",
        date: project.date || "2050-01-01",
        link: project.link || null,
        image: project.image || fallbackImage,
        content: project.description, // Default detail content
        release: project.release || null, // Tambahkan properti release (biasanya null di Ongoing)
      });
    });
  }

  // 2. Upcoming Projects
  if (typeof upcomingProjects !== "undefined") {
    upcomingProjects.forEach((project) => {
      const projectDate = new Date(project.date);
      projectDate.setHours(0, 0, 0, 0);

      if (projectDate >= today) {
        let statusText = `Tgl: ${projectDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;

        all.push({
          ...project,
          category: "upcoming",
          statusText: statusText,
          emoji: "🗓️",
          link: project.link || null,
          image: project.image || fallbackImage, // FIX: Menggunakan fallback image yang valid
          content: project.description,
          release: project.release || null,
        });
      }
    });
  }

  // 3. Completed Projects (FIX: Ambil dari array completedProjects)
  if (typeof completedProjects !== "undefined") {
    completedProjects.forEach((project) => {
      const projectDate = new Date(project.date);
      const statusText = `Selesai: ${projectDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;

      all.push({
        ...project,
        category: "completed",
        statusText: statusText,
        emoji: "✅",
        link: project.link || null,
        image: project.image || fallbackImage,
        // FIX: Menggunakan properti release untuk detail page content
        content: project.description, // Tetap simpan description
        release: project.release || project.description, // Content yang akan ditampilkan di detail
      });
    });
  }

  // Assign simple numeric IDs
  return all.map((project, index) => ({ ...project, id: project.id || index + 1 }));
}

// --- DETAIL PAGE LOADER ---
function loadProjectDetailPage() {
  const eventId = getQueryParam("id");
  const allProjects = getAllProjects();
  const project = allProjects.find((p) => p.id == eventId);

  if (!project) {
    document.getElementById("detail-title").textContent = "404 - Proyek Tidak Ditemukan";
    document.getElementById("detail-content").innerHTML = '<p class="text-red-400">ID Proyek yang Anda cari tidak valid.</p>';
    document.getElementById("documentation-link").style.display = "none";
    return;
  }

  if (project.category !== "completed") {
    document.getElementById("detail-title").textContent = `${project.title} - Belum Tersedia`;
    document.getElementById("detail-content").innerHTML = '<p class="text-yellow-400">Detail proyek hanya tersedia setelah proyek selesai (Completed).</p>';
    document.getElementById("documentation-link").style.display = "none";
    return;
  }

  const statusColor = "text-cyan-400";
  const buttonColor = "bg-cyan-600";

  // 3. Set metadata
  document.getElementById("page-title").textContent = project.title + " - HMTE Proyek";
  document.getElementById("detail-title").textContent = project.title;
  document.getElementById("detail-status").textContent = project.statusText;

  // FIX: Hapus tampilan PIC karena tidak relevan
  document.getElementById("detail-pic").textContent = ""; // Kosongkan elemen PIC

  document.getElementById("detail-status").classList.add(statusColor);

  // FIX: Menggunakan project.release sebagai konten detail utama
  const detailContent = project.release || project.content;
  document.getElementById("detail-content").innerHTML = detailContent;

  // 5. Handle Image Display (Poster Format)
  const imageContainer = document.getElementById("detail-image-container");
  const imageSource = project.image ? `../../${project.image}` : "../../img/logohmte.png";

  if (imageContainer) {
    imageContainer.innerHTML = `
            <img src="${imageSource}" alt="${project.title}" class="block mx-auto max-w-sm h-auto rounded-xl shadow-xl border border-gray-700" onerror="this.onerror=null;this.src='../../img/logohmte.png';">
        `;
  }

  const docLink = document.getElementById("documentation-link");
  if (project.link) {
    docLink.href = project.link;
    docLink.textContent = "Lihat Dokumentasi Proker";
    docLink.classList.remove("hidden");
    docLink.classList.add(buttonColor);
  } else {
    docLink.style.display = "none";
  }
}

// --- RENDER 3 SECTIONS ---
function loadProjectSections() {
  const allProjects = getAllProjects();

  const ongoing = allProjects.filter((p) => p.category === "ongoing");
  const upcoming = allProjects.filter((p) => p.category === "upcoming").sort((a, b) => new Date(a.date) - new Date(b.date));
  const completed = allProjects.filter((p) => p.category === "completed").sort((a, b) => new Date(b.date) - new Date(a.date));

  renderOngoingProjects(ongoing.slice(0, 3));
  renderUpcomingProjects(upcoming);
  renderCompletedProjects(completed);
}

// Function to render Ongoing Projects (Card View - DIV 1) - TIDAK KLIKABLE
function renderOngoingProjects(projects) {
  const container = document.getElementById("ongoing-projects-container");
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Tidak ada proyek yang sedang berjalan saat ini.</p>';
    return;
  }

  const projectsHTML = projects
    .map((project) => {
      const imagePath = project.image ? `../../${project.image}` : "../../img/logohmte.png";
      const borderColor = "border-green-500";
      const description = project.description.length > 100 ? project.description.substring(0, 100) + "..." : project.description;

      return `
            <div class="project-card flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden border-t-4 ${borderColor} cursor-default">
                
                <div class="block relative h-72 overflow-hidden"> 
                    <img src="${imagePath}" alt="${project.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='../../img/logohmte.png';">
                    <div class="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-3 py-1 m-2 rounded-full font-bold">
                        ONGOING
                    </div>
                </div>

                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2">
                        ${project.title}
                    </h3>
                    <p class="text-gray-400 text-sm mb-3 flex-grow">${description}</p>
                    <p class="text-gray-500 text-xs mt-auto">${project.statusText}</p>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${projectsHTML}</div>`;
}

// Function to render Upcoming Projects (Card View - DIV 2) - TIDAK KLIKABLE
function renderUpcomingProjects(projects) {
  const container = document.getElementById("upcoming-projects-container");
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Tidak ada proyek yang dijadwalkan dalam waktu dekat.</p>';
    return;
  }

  const projectsHTML = projects
    .map((project) => {
      // FIX: Image path now correctly uses project.image which is set in getAllProjects
      const imagePath = project.image ? `../../${project.image}` : "../../img/logohmte.png";
      const borderColor = "border-yellow-500";
      const description = project.description.length > 100 ? project.description.substring(0, 100) + "..." : project.description;

      return `
            <div class="project-card flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden border-t-4 ${borderColor} cursor-default">
                
                <div class="block relative h-72 overflow-hidden"> 
                    <img src="${imagePath}" alt="${project.title}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='../../img/logohmte.png';">
                    <div class="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-3 py-1 m-2 rounded-full font-bold">
                        UPCOMING
                    </div>
                </div>

                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2">
                        ${project.title}
                    </h3>
                    <p class="text-gray-400 text-sm mb-3 flex-grow">${description}</p>
                    <p class="text-yellow-400 text-xs mt-auto">${project.statusText}</p>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${projectsHTML}</div>`;
}

// Function to render Completed Projects (Card View - DIV 3) - KLIKABLE KE DETAIL
function renderCompletedProjects(projects) {
  const container = document.getElementById("completed-projects-container");
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Belum ada proyek yang tercatat sebagai selesai.</p>';
    return;
  }

  const projectsHTML = projects
    .map((project) => {
      const detailLink = `page/project/project-detail.html?id=${project.id}`;
      const imagePath = project.image ? `../../${project.image}` : "../../img/logohmte.png";
      const borderColor = "border-cyan-500";
      const description = project.description.length > 100 ? project.description.substring(0, 100) + "..." : project.description;

      return `
            <a href="${detailLink}" class="project-card flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02] border-t-4 ${borderColor}">
                
                <div class="block relative h-72 overflow-hidden"> 
                    <img src="${imagePath}" alt="${project.title}" class="w-full h-full object-cover transition duration-300 ease-in-out hover:opacity-80" onerror="this.onerror=null;this.src='../../img/logohmte.png';">
                    <div class="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-3 py-1 m-2 rounded-full font-bold">
                        COMPLETED
                    </div>
                </div>

                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                        ${project.title}
                    </h3>
                    <p class="text-gray-400 text-sm mb-3 flex-grow">${description}</p>
                    <p class="text-gray-500 text-xs mt-auto">${project.statusText}</p>
                    
                    ${project.link ? `<span class="text-cyan-400 mt-2 text-sm font-semibold">Press Release  →</span>` : `<span class="text-gray-500 mt-2 text-xs">Detail tersedia</span>`}
                </div>
            </a>
        `;
    })
    .join("");

  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${projectsHTML}</div>`;
}

// === EXECUTION LOGIC ===

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("project.html") && !path.includes("project-detail.html")) {
    setTimeout(() => {
      loadProjectSections();
    }, 100);
  } else if (path.includes("project-detail.html")) {
    loadProjectDetailPage();
  }
});
