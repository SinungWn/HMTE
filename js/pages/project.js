// js/pages/project.js

// Fungsi untuk menggabungkan dan melabeli semua proyek
function getAllProjects() {
  const all = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Ongoing Projects
  if (typeof ongoingProjects !== "undefined") {
    ongoingProjects.forEach((project) => {
      all.push({
        ...project,
        category: "ongoing",
        statusText: `Status: ${project.status}`,
        emoji: "🚀",
        date: project.date || "2050-01-01", // Beri tanggal jauh di masa depan agar Ongoing selalu di atas saat sorting
      });
    });
  }

  // 2. Upcoming & Completed Projects
  if (typeof upcomingProjects !== "undefined") {
    upcomingProjects.forEach((project) => {
      const projectDate = new Date(project.date);
      projectDate.setHours(0, 0, 0, 0);

      let category = "upcoming";
      let statusText = `Tgl: ${projectDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
      let emoji = "🗓️";

      if (projectDate < today) {
        category = "completed";
        statusText = `Selesai: ${projectDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
        emoji = "✅";
      }

      all.push({
        ...project,
        category: category,
        statusText: statusText,
        emoji: emoji,
      });
    });
  }

  return all;
}

// Fungsi utama untuk merender proyek
function renderProjects(filter = "all") {
  const container = document.getElementById("projects-container");
  const noMessage = document.getElementById("no-projects-message");

  if (!container) return;

  const allProjects = getAllProjects();

  // 1. Filter data
  const filteredProjects = allProjects.filter((project) => {
    if (filter === "all") return true;
    // Hanya tampilkan 'ongoing', 'upcoming', atau 'completed' yang sesuai dengan filter
    return project.category === filter;
  });

  // 2. Sortir: Ongoing di atas, lalu Upcoming (tanggal terdekat), lalu Completed (tanggal terbaru)
  filteredProjects.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Ongoing selalu di depan
    if (a.category === "ongoing" && b.category !== "ongoing") return -1;
    if (b.category === "ongoing" && a.category !== "ongoing") return 1;

    // Upcoming diurutkan dari tanggal terdekat (A - B)
    if (a.category === "upcoming" && b.category === "upcoming") return dateA - dateB;

    // Completed diurutkan dari tanggal terbaru (B - A)
    if (a.category === "completed" && b.category === "completed") return dateB - dateA;

    // Default sorting
    return 0;
  });

  if (filteredProjects.length === 0) {
    container.innerHTML = "";
    noMessage.classList.remove("hidden");
    return;
  }

  noMessage.classList.add("hidden");

  // 3. Render HTML dengan styling yang konsisten
  const projectsHTML = filteredProjects
    .map((project) => {
      const description = project.description.length > 100 ? project.description.substring(0, 100) + "..." : project.description;

      // Penentuan warna border berdasarkan kategori
      let borderColor = "border-gray-500"; // Completed
      if (project.category === "ongoing") {
        borderColor = "border-green-500";
      } else if (project.category === "upcoming") {
        borderColor = "border-yellow-500";
      }

      return `
            <div class="bg-gray-800 rounded-lg p-6 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 border-t-4 ${borderColor}">
                <div class="text-4xl mb-3">${project.emoji}</div>
                <span class="inline-block bg-gray-700 text-xs font-medium px-2.5 py-0.5 rounded text-white mb-2">${project.category.toUpperCase()}</span>
                <h3 class="text-xl font-bold text-white mb-2">${project.title}</h3>
                <p class="text-gray-400 text-sm mb-3">${description}</p>
                <p class="text-gray-500 text-xs mb-4">${project.statusText}</p>
                <a href="./project.html" class="text-green-400 hover:text-green-300 transition text-sm font-semibold"> Lihat Detail → </a>
            </div>
        `;
    })
    .join("");

  container.innerHTML = projectsHTML;
}

// Fungsi untuk mengganti filter dan tampilan tombol (dipanggil dari tombol di project.html)
function changeFilter(filter) {
  // 1. Update tampilan tombol
  document.querySelectorAll(".tab-button").forEach((button) => {
    if (button.getAttribute("data-filter") === filter) {
      button.classList.remove("text-gray-400", "border-transparent");
      button.classList.add("text-white", "border-green-500");
    } else {
      button.classList.add("text-gray-400", "border-transparent");
      button.classList.remove("text-white", "border-green-500");
    }
  });

  // 2. Render ulang proyek
  renderProjects(filter);
}

// Eksekusi setelah DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Render 'all' (semua proyek) saat halaman dimuat
    renderProjects("all");

    // Atur tampilan tombol awal ke 'all'
    changeFilter("all");
  }, 100);
});
