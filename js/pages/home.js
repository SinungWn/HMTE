// js/pages/home.js

// Tentukan tanggal hari ini (Digunakan untuk filtering)
const today = new Date();
today.setHours(0, 0, 0, 0);

/**
 * Fungsi untuk memformat tanggal
 */
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString.replace(/-/g, "/"));
  return date.toLocaleDateString("id-ID", options);
}

// === FUNGSI CHECK BERULANG UNTUK MEMASTIKAN KOMPONEN SUDAH TERLOAD ===
function checkAndRenderHomeOngoing() {
  const container = document.getElementById("home-ongoing-container");
  if (container) {
    renderHomeOngoingEvents();
  } else {
    setTimeout(checkAndRenderHomeOngoing, 50);
  }
}
// === END FUNGSI CHECK BERULANG ===

/**
 * Fungsi untuk merender 2 acara Upcoming terdekat di homepage (sections/ongoing.html).
 */
function renderHomeOngoingEvents() {
  const container = document.getElementById("home-ongoing-container");

  if (!container || typeof eventsData === "undefined") {
    if (container) container.innerHTML = '<p class="text-center text-gray-400 col-span-full">Memuat data kegiatan...</p>';
    return;
  }

  const futureEvents = eventsData.filter((event) => new Date(event.date).setHours(0, 0, 0, 0) >= today.getTime() && event.isFeatured);

  futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  const featuredEvents = futureEvents.slice(0, 2);

  if (featuredEvents.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400 col-span-full">Tidak ada kegiatan yang akan datang dalam waktu dekat.</p>';
    return;
  }

  const eventsHTML = featuredEvents
    .map((event) => {
      const mainEventLink = `./page/event/event.html`;
      let imagePath = event.imgSrc ? event.imgSrc.replace("../../", "") : "img/logohmte.png";
      if (imagePath.startsWith("../")) {
        imagePath = imagePath.substring(3);
      }
      const formattedDate = formatDate(event.date);

      const actionButtonHTML = event.registrationLink
        ? `
        <button onclick="window.open('${event.registrationLink}', '_blank')" class="mt-auto px-3 py-1 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm w-full">
            Daftar Sekarang
        </button>
        `
        : `
        <button onclick="window.location.href='${mainEventLink}'" class="mt-auto px-3 py-1 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition text-sm w-full">
            Lihat Detail
        </button>
        `;

      const borderColorClass = event.color === "green" ? "border-emerald-500" : event.color === "blue" ? "border-cyan-500" : "border-yellow-500";

      return `
        <div class="flex flex-col rounded-xl overflow-hidden
                    border ${borderColorClass}
                    transition-all duration-500
                    hover:border-green-500 hover:shadow-lg hover:shadow-green-500/40
                    cursor-default bg-gray-900 w-full max-w-xs mx-auto"> 

            <div class="flex items-center justify-center bg-black"
                 style="width: 100%; aspect-ratio: 9/12; overflow: hidden;">
                <img src="${imagePath}" 
                    alt="${event.title}" 
                    style="width: 100%; height: 100%; object-fit: cover;"
                    class="transition-transform duration-500 hover:scale-105" 
                    onerror="this.onerror=null;this.src='img/logohmte.png';" />
            </div>

            <div class="p-3 flex flex-col flex-1 bg-gray-900">
                <h3 class="text-sm font-bold text-white mb-2">${event.title}</h3>
                <div class="text-gray-300 text-xs mb-3 space-y-1">
                    <p><i class="far fa-calendar-alt mr-1 text-cyan-400"></i> ${formattedDate}</p>
                    <p><i class="fas fa-clock mr-1 text-cyan-400"></i> ${event.time}</p>
                    <p class="truncate"><i class="fas fa-map-marker-alt mr-1 text-cyan-400"></i> ${event.location}</p>
                </div>
                ${actionButtonHTML}
            </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = eventsHTML;
}

/**
 * Fungsi untuk merender Program Kerja unggulan (3 status).
 * FIX: Logika tautan untuk Completed Projects dipermudah.
 */
function renderHomeProker() {
  const container = document.getElementById("home-proker-container");

  if (!container || typeof ongoingProjects === "undefined" || typeof upcomingProjects === "undefined" || typeof completedProjects === "undefined") {
    if (document.getElementById("proker-placeholder")) {
      setTimeout(renderHomeProker, 50); // Retry logic
    }
    return;
  }

  const projectsToShow = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // --- 1. Get Top Ongoing Project ---
  if (ongoingProjects.length > 0) {
    projectsToShow.push({
      ...ongoingProjects[0],
      type: "Ongoing",
      emoji: "🚀",
      statusText: ongoingProjects[0].status,
      link: "./page/project/project.html",
    });
  }

  // --- 2. Get Top Upcoming Project ---
  const futureUpcoming = upcomingProjects
    .filter((p) => {
      const date = new Date(p.date);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (futureUpcoming.length > 0) {
    const project = futureUpcoming[0];
    projectsToShow.push({
      ...project,
      type: "Upcoming",
      emoji: "🗓️",
      statusText: new Date(project.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      link: "./page/project/project.html",
    });
  }

  // --- 3. Get Top Completed Project ---
  const pastCompleted = completedProjects.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (pastCompleted.length > 0) {
    const project = pastCompleted[0];
    projectsToShow.push({
      ...project,
      type: "Completed",
      emoji: "✅",
      statusText: new Date(project.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      id: project.id || "fallback_id", // Gunakan ID asli atau fallback
      link: project.link || null, // Pertahankan link dokumen asli (bisa null)
    });
  }

  if (projectsToShow.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400 col-span-full">Tidak ada Program Kerja yang dapat ditampilkan.</p>';
    return;
  }

  // --- Render 3 Rich Image Cards ---
  const projectsHTML = projectsToShow
    .map((project) => {
      // Logic Tautan BARU: Prioritaskan project-detail.html untuk Completed
      let finalLink = "./page/project/project.html"; // Default link ke halaman Proker utama
      let target = "_self";
      let linkText = "Lihat Proyek →";

      if (project.type === "Completed") {
        // FIX: Selalu arahkan ke halaman detail sebagai destinasi utama
        finalLink = `./page/project/project-detail.html?id=${project.id}`;

        // Tentukan teks tautan berdasarkan ketersediaan dokumen
        if (project.link) {
          linkText = "Press Release →";
        } else {
          linkText = "";
        }
      } else if (project.type !== "Completed") {
        finalLink = "./page/project/project.html"; // Ongoing/Upcoming tetap ke halaman Proker utama
        linkText = "";
      }

      // Logic Tautan END

      const description = project.description.length > 70 ? project.description.substring(0, 70) + "..." : project.description;
      const imagePath = project.image ? project.image.replace("../../", "") : "img/logohmte.png";

      const borderColor = project.type === "Ongoing" ? "border-green-500" : project.type === "Upcoming" ? "border-yellow-500" : "border-cyan-500";

      return `
        <a href="${finalLink}" target="${target}" class="project-card flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02] border-t-4 ${borderColor}">
            
            <div class="block relative h-72 overflow-hidden"> 
                <img src="${imagePath}" alt="${project.title}" class="w-full h-full object-cover transition duration-300 ease-in-out hover:opacity-80" onerror="this.onerror=null;this.src='img/logohmte.png';">
                <div class="absolute top-0 left-0 bg-gray-900 bg-opacity-70 text-xs text-white px-3 py-1 m-2 rounded-full font-bold">
                    ${project.type.toUpperCase()}
                </div>
            </div>

            <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
                    ${project.title}
                </h3>
                <p class="text-gray-400 text-sm mb-3 flex-grow">${description}</p>
                <p class="text-gray-500 text-xs mt-2">${project.type}: ${project.statusText}</p>
                
                <span class="text-green-400 mt-2 text-sm font-semibold">
                    ${linkText}
                </span>
            </div>
        </a>
      `;
    })
    .join("");

  container.innerHTML = projectsHTML;
}

// Eksekusi kedua fungsi setelah DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  renderHomeProker();

  checkAndRenderHomeOngoing();
});
