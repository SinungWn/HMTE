// js/pages/project.js

document.addEventListener("DOMContentLoaded", () => {
  // Berikan sedikit waktu agar loader.js selesai (pola yang sudah Anda gunakan)
  setTimeout(() => {
    if (window.location.pathname.includes("project.html")) {
      renderProjects();
    }
  }, 100);
});

/**
 * Fungsi utama untuk merender ketiga divisi proyek.
 */
function renderProjects() {
  // Pastikan data dan elemen ada
  if (typeof ongoingProjects === "undefined" || !document.getElementById("ongoing-projects")) return;

  renderOngoingProjects();
  renderUpcomingProjects();
  renderCompletedProjects();
}

/**
 * Render Divisi 1: Ongoing Projects (Grid Card)
 */
function renderOngoingProjects() {
  const container = document.getElementById("ongoing-projects");
  if (!container) return;

  const projectsHTML = ongoingProjects
    .map((project) => {
      const statusColor = project.status.includes("100") ? "bg-green-600" : "bg-cyan-600";
      const progressWidth = project.status.replace("%", "");

      return `
            <div class="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-green-500 transition duration-300">
                <img src="../../${project.image}" alt="${project.title}" class="w-full h-40 object-cover" onerror="this.onerror=null;this.src='../../img/logohmte.png';">
                <div class="p-5">
                    <h3 class="text-xl font-bold text-white mb-2">${project.title}</h3>
                    <p class="text-gray-400 text-sm mb-4">${project.description}</p>
                    
                    <div class="mb-3">
                        <p class="text-xs text-gray-500">PIC: ${project.pic}</p>
                    </div>

                    <div class="mb-2">
                        <div class="h-2 w-full bg-gray-600 rounded-full">
                            <div class="h-2 rounded-full ${statusColor}" style="width: ${progressWidth}%"></div>
                        </div>
                        <p class="text-xs text-right text-white mt-1">${project.status} Selesai</p>
                    </div>
                    
                    <a href="#" class="text-cyan-400 hover:text-cyan-300 transition text-sm font-semibold mt-3 inline-block">Lihat Update →</a>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = projectsHTML;
}

/**
 * Render Divisi 2: Upcoming Projects (List Sederhana)
 */
function renderUpcomingProjects() {
  const container = document.getElementById("upcoming-projects");
  if (!container) return;

  const projectsHTML = upcomingProjects
    .map((project) => {
      const formattedDate = new Date(project.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

      return `
            <div class="bg-gray-800 rounded-lg p-5 border-l-4 border-yellow-500 flex justify-between items-center hover:bg-gray-700 transition">
                <div>
                    <h3 class="text-xl font-bold text-white">${project.title}</h3>
                    <p class="text-gray-400 text-sm mt-1">${project.description}</p>
                    <p class="text-xs text-gray-500 mt-2">PIC: ${project.pic}</p>
                </div>
                <div class="text-right min-w-[120px]">
                    <p class="text-green-400 font-semibold">${formattedDate}</p>
                    <span class="text-xs text-yellow-400">Akan Datang</span>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = projectsHTML || '<p class="text-gray-400">Tidak ada proyek yang akan datang saat ini.</p>';
}

/**
 * Render Divisi 3: Completed Projects (List dengan Link Dokumentasi)
 */
function renderCompletedProjects() {
  const container = document.getElementById("completed-projects");
  if (!container) return;

  const projectsHTML = completedProjects
    .map((project) => {
      const formattedDate = new Date(project.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

      // Pastikan link valid. Jika link tidak ada, arahkan ke '#'
      const linkHref = project.link.startsWith("http") ? project.link : `../../${project.link}`;
      const target = project.link.startsWith("http") ? "_blank" : "_self";

      return `
            <a href="${linkHref}" target="${target}" class="block bg-gray-800 rounded-lg p-5 border-l-4 border-green-500 flex justify-between items-center hover:bg-gray-700 transition cursor-pointer">
                <div>
                    <h3 class="text-xl font-bold text-white">${project.title}</h3>
                    <p class="text-gray-400 text-sm mt-1">${project.description}</p>
                </div>
                <div class="text-right min-w-[150px]">
                    <p class="text-green-400 font-semibold">${formattedDate}</p>
                    <span class="text-xs text-green-400 mt-1">Lihat Dokumentasi <i class="fas fa-external-link-alt ml-1"></i></span>
                </div>
            </a>
        `;
    })
    .join("");

  container.innerHTML = projectsHTML || '<p class="text-gray-400">Belum ada proyek yang diselesaikan.</p>';
}
