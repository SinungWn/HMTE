// js/pages/home.js

// Tentukan tanggal hari ini (gunakan tanggal referensi yang lebih realistis untuk menguji data proyek)
const today = new Date("2025-11-13");
today.setHours(0, 0, 0, 0);

/**
 * Fungsi untuk merender 3 acara Upcoming terdekat di homepage (sections/ongoing.html).
 * Menggunakan filter tanggal dan styling yang konsisten.
 */
function renderHomeOngoingEvents() {
  const container = document.getElementById("home-ongoing-container");

  // Cek ketersediaan elemen dan data
  if (!container || typeof upcomingProjects === "undefined") {
    if (document.getElementById("ongoing-placeholder")) {
      setTimeout(renderHomeOngoingEvents, 50);
    }
    return;
  }

  // 1. Filter: Hanya ambil acara yang tanggalnya belum terlewat
  const futureEvents = upcomingProjects.filter((project) => {
    const eventDate = new Date(project.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  // 2. Sortir: Urutkan berdasarkan tanggal terdekat
  futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 3. Ambil 3 acara teratas
  const featuredEvents = futureEvents.slice(0, 3);

  if (featuredEvents.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400 col-span-full">Tidak ada kegiatan yang akan datang dalam waktu dekat.</p>';
    return;
  }

  const eventsHTML = featuredEvents
    .map((event) => {
      const formattedDate = new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      const description = event.description.length > 70 ? event.description.substring(0, 70) + "..." : event.description;

      // Menggunakan desain yang sama dengan kartu Proker
      return `
            <div class="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300">
                <div class="text-5xl mb-4">🗓️</div>
                <h3 class="text-lg font-bold text-white mb-2">${event.title}</h3>
                <p class="text-gray-300 text-sm mb-2">${description}</p>
                <p class="text-gray-500 text-xs">Tgl: ${formattedDate}</p>
                <a href="./page/event/event.html" class="mt-4 text-green-400 hover:text-green-300 transition text-sm font-semibold"> Lihat Detail → </a>
            </div>
        `;
    })
    .join("");

  container.innerHTML = eventsHTML;
}

/**
 * Fungsi untuk merender Program Kerja unggulan (4 item) di homepage (sections/proker.html).
 */
function renderHomeProker() {
  const container = document.getElementById("home-proker-container");

  if (!container || typeof ongoingProjects === "undefined" || typeof upcomingProjects === "undefined") {
    if (document.getElementById("proker-placeholder")) {
      setTimeout(renderHomeProker, 50);
    }
    return;
  }

  const featuredProjects = [];

  // 1. Ambil maksimal 2 ongoing projects
  for (let i = 0; i < Math.min(2, ongoingProjects.length); i++) {
    featuredProjects.push({
      ...ongoingProjects[i],
      type: "ongoing",
      emoji: "🚀",
      statusText: `Status: ${ongoingProjects[i].status}`,
    });
  }

  // 2. Ambil sisanya dari upcoming projects hingga total 4 (hanya yang belum terlewat)
  let remainingSlots = 4 - featuredProjects.length;

  const futureUpcomingProjects = upcomingProjects.filter((project) => {
    const eventDate = new Date(project.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  for (let i = 0; i < Math.min(remainingSlots, futureUpcomingProjects.length); i++) {
    const date = new Date(futureUpcomingProjects[i].date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    featuredProjects.push({
      ...futureUpcomingProjects[i],
      type: "upcoming",
      emoji: "🗓️",
      statusText: `Tgl: ${date}`,
    });
  }

  const detailLink = "./page/project/project.html";

  const projectsHTML = featuredProjects
    .map((project) => {
      const description = project.description.length > 70 ? project.description.substring(0, 70) + "..." : project.description;

      return `
            <div class="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300">
                <div class="text-5xl mb-4">${project.emoji}</div>
                <h3 class="text-lg font-bold text-white mb-2">${project.title}</h3>
                <p class="text-gray-300 text-sm mb-2">${description}</p>
                <p class="text-gray-500 text-xs">${project.statusText}</p>
                <a href="${detailLink}" class="mt-4 text-green-400 hover:text-green-300 transition text-sm font-semibold"> Lihat Detail → </a>
            </div>
        `;
    })
    .join("");

  container.innerHTML = projectsHTML;
}

// Eksekusi kedua fungsi setelah DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    renderHomeProker();
    renderHomeOngoingEvents();
  }, 100);
});
