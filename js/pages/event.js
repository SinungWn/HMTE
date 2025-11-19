// File: js/pages/event.js

// Pastikan eventsData dari calendar.js sudah dimuat
if (typeof eventsData === "undefined") {
  console.error("eventsData belum dimuat. Pastikan calendar.js di-load sebelum event.js.");
}

/**
 * Fungsi untuk mengubah YYYY-MM-DD menjadi format cantik
 */
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString.replace(/-/g, "/"));
  return date.toLocaleDateString("id-ID", options);
}

// === FUNGSI REUSABLE: POSTER CARD MARKUP ===
function createEventCardHTML(event) {
  // Jalur fallback ke halaman event utama (ABSULUT)
  const mainEventLink = `/page/event/event.html`;

  // Menggunakan jalur ABSOLUT untuk gambar
  let imagePath = event.imgSrc ? `/${event.imgSrc.replace(/^\//, "")}` : "/img/logohmte.png";

  const formattedDate = formatDate(event.date);

  // FIX: Logika tombol hanya menampilkan 'Daftar Sekarang' jika ada link.
  // Tombol 'Lihat Detail' atau 'Baca Selengkapnya' dihilangkan.
  const actionButtonHTML = event.registrationLink
    ? `
        <button onclick="window.open('${event.registrationLink}', '_blank')" class="mt-auto px-3 py-1 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm w-full">
            Daftar Sekarang
        </button>
        `
    : `
        <p class="mt-auto text-center text-gray-500 text-xs italic py-2">Pendaftaran akan dibuka.</p>
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
                  onerror="this.onerror=null;this.src='/img/logohmte.png';" />
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
}
// === END FUNGSI REUSABLE ===

/**
 * Logika untuk Halaman Daftar Event (event.html)
 */
function loadEventListPage() {
  const featuredListContainer = document.getElementById("featured-events-list");
  const currentEventContainer = document.getElementById("current-event-register");

  if (!featuredListContainer || !currentEventContainer || typeof eventsData === "undefined") return;

  // 1. Filter Event yang Sesuai Kriteria
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFeaturedEvents = eventsData.filter((event) => new Date(event.date).setHours(0, 0, 0, 0) >= today.getTime() && event.isFeatured).sort((a, b) => new Date(a.date) - new Date(b.date));

  currentEventContainer.innerHTML = "";
  featuredListContainer.innerHTML = "";

  if (upcomingFeaturedEvents.length === 0) {
    currentEventContainer.innerHTML = '<p class="text-gray-400 text-center">Saat ini tidak ada event utama yang akan datang.</p>';
    featuredListContainer.innerHTML = '<p class="text-gray-400 col-span-3">Tidak ada event utama tambahan yang akan datang.</p>';
    return;
  }

  // 2. Tentukan Event Paling Utama (DIV 2: Kolom Kanan Register)
  const currentEvent = upcomingFeaturedEvents[0];

  // 3. Render Div 2 (Kolom Kanan: Event Saat Ini & Register)
  currentEventContainer.innerHTML = renderCurrentEvent(currentEvent);

  // 4. Render Div 1 (Featured Events Lainnya)
  const otherFeaturedEvents = upcomingFeaturedEvents.slice(1);
  featuredListContainer.innerHTML = otherFeaturedEvents.map(createEventCardHTML).join("");

  if (otherFeaturedEvents.length === 0) {
    featuredListContainer.innerHTML = '<p class="text-gray-400 col-span-3">Tidak ada event utama tambahan yang akan datang.</p>';
  }
}

/**
 * Render markup untuk Event yang Sedang Berlangsung (Div 2 di event.html)
 */
function renderCurrentEvent(event) {
  const formattedDate = formatDate(event.date);
  const mainEventLink = `/page/event/event.html`;

  // FIX 1: HILANGKAN GAMBAR dari card paling atas (untuk kerapian)
  const imageHTML = "";

  // FIX 2: HILANGKAN tombol sekunder "Baca Selengkapnya"
  const secondaryButtonHTML = "";

  let primaryButtonHTML = "";

  if (event.registrationLink) {
    // Tombol aksi utama: DAFTAR SEKARANG
    primaryButtonHTML = `
          <a href="${event.registrationLink}" target="_blank"
             class="inline-block w-full text-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-edit mr-2"></i> DAFTAR SEKARANG
          </a>
      `;
  } else {
    // Jika tidak ada link daftar, tombol diganti dengan teks info karena tidak ada halaman detail
    primaryButtonHTML = '<p class="text-center text-gray-500 text-sm italic">Informasi pendaftaran akan segera dibuka.</p>';
  }

  return `
        <div class="bg-gray-900 p-6 rounded-lg shadow-inner">
            ${imageHTML} <h3 class="text-2xl font-extrabold text-green-400 mb-2">${event.title}</h3>
            <p class="text-gray-300 mb-4">${event.description}</p>
            
            <div class="text-sm space-y-2 mb-6">
                <p class="text-white font-medium"><i class="far fa-calendar-alt mr-2 text-cyan-400"></i> ${formattedDate}</p>
                <p class="text-white font-medium"><i class="fas fa-clock mr-2 text-cyan-400"></i> ${event.time}</p>
                <p class="text-white font-medium"><i class="fas fa-map-marker-alt mr-2 text-cyan-400"></i> 
                    <a href="${event.locationLink}" target="_blank" class="${event.locationLink ? "underline hover:text-cyan-300" : ""}">${event.location}</a>
                </p>
            </div>
            
            ${primaryButtonHTML}
            ${secondaryButtonHTML} </div>
    `;
}

// Catatan: loadEventDetailPage() tetap ada di file ini tetapi tidak akan terpanggil

// === EKSEKUSI BERDASARKAN LOKASI FILE ===
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Menggunakan jalur ABSOLUT untuk deteksi halaman
  if (path === "/page/event/event.html") {
    setTimeout(() => {
      loadEventListPage();
    }, 100);
  } else if (path.includes("event-detail.html")) {
    // Kosongkan fungsi karena halaman detail dihapus
    document.querySelector("main").innerHTML = '<h1 class="text-center text-4xl text-red-500 py-16">Halaman Detail Telah Dihapus</h1>';
  }
});

// Expose functions jika diperlukan oleh loader lain
window.loadEventListPage = loadEventListPage;
