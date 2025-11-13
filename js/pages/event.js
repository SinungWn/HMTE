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

  // Filter: Event yang belum lewat DAN memiliki flag isFeatured
  const upcomingFeaturedEvents = eventsData.filter((event) => new Date(event.date).setHours(0, 0, 0, 0) >= today.getTime() && event.isFeatured).sort((a, b) => new Date(a.date) - new Date(b.date)); // Urutkan terdekat

  // Jika tidak ada event utama
  if (upcomingFeaturedEvents.length === 0) {
    currentEventContainer.innerHTML = '<p class="text-gray-400 text-center col-span-2">Saat ini tidak ada event utama yang akan datang.</p>';
    featuredListContainer.innerHTML = "";
    return;
  }

  // 2. Tentukan Event Paling Utama (DIV 2: Kolom Kanan Register)
  const currentEvent = upcomingFeaturedEvents[0];

  // 3. Render Div 2 (Kolom Kanan: Event Saat Ini & Register)
  currentEventContainer.innerHTML = renderCurrentEvent(currentEvent);

  // 4. Render Div 1 (4 List Event Lainnya)
  // Ambil event mulai dari indeks 1, dan maksimal 4 event
  const otherFeaturedEvents = upcomingFeaturedEvents.slice(1, 5);
  featuredListContainer.innerHTML = renderFeaturedEvents(otherFeaturedEvents);
}

/**
 * Render markup untuk Event yang Sedang Berlangsung (Div 2)
 */
function renderCurrentEvent(event) {
  const formattedDate = formatDate(event.date);
  const detailLink = `event-detail.html?id=${event.id}`;

  return `
        <div class="bg-gray-900 p-6 rounded-lg shadow-inner">
            <h3 class="text-2xl font-extrabold text-green-400 mb-2">${event.title}</h3>
            <p class="text-gray-300 mb-4">${event.description}</p>
            
            <div class="text-sm space-y-2 mb-6">
                <p class="text-white font-medium"><i class="far fa-calendar-alt mr-2 text-cyan-400"></i> ${formattedDate}</p>
                <p class="text-white font-medium"><i class="fas fa-clock mr-2 text-cyan-400"></i> ${event.time}</p>
                <p class="text-white font-medium"><i class="fas fa-map-marker-alt mr-2 text-cyan-400"></i> ${event.location}</p>
            </div>
            
            <a href="${event.registrationLink || detailLink}" target="_blank" 
               class="inline-block w-full text-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
                <i class="fas fa-edit mr-2"></i> ${event.registrationLink ? "DAFTAR SEKARANG" : "LIHAT DETAIL"}
            </a>
            
            <a href="${detailLink}" class="inline-block w-full text-center mt-2 px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition text-sm">
                Baca Selengkapnya
            </a>
        </div>
    `;
}

/**
 * Render markup untuk 4 Featured Events Lainnya (Div 1)
 */
function renderFeaturedEvents(events) {
  if (events.length === 0) {
    return '<p class="text-gray-400 col-span-2">Tidak ada event utama tambahan yang akan datang.</p>';
  }

  return events
    .map((event) => {
      const detailLink = `event-detail.html?id=${event.id}`;
      const formattedDate = formatDate(event.date);
      const eventColorClass = event.color === "blue" ? "border-cyan-500" : event.color === "green" ? "border-green-500" : "border-yellow-500";

      return `
            <div 
                class="bg-gray-800 rounded-xl p-5 border-l-4 ${eventColorClass} hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
                onclick="window.location.href='${detailLink}'"
            >
                <p class="text-xs font-semibold text-cyan-400 mb-1">${formattedDate}</p>
                <h3 class="font-bold text-white text-xl mb-2">${event.title}</h3>
                <p class="text-gray-300 text-sm leading-relaxed mb-4">${event.description.substring(0, 100)}...</p>
                
                <div class="flex justify-between items-center">
                    <p class="text-gray-400 text-xs"><i class="fas fa-map-marker-alt mr-1"></i>${event.location}</p>
                    <a href="${detailLink}" class="text-green-400 hover:text-green-300 transition text-sm font-semibold">Detail →</a>
                </div>
            </div>
        `;
    })
    .join("");
}

// === EKSEKUSI BERDASARKAN LOKASI FILE ===
document.addEventListener("DOMContentLoaded", () => {
  // Memberikan delay singkat untuk memastikan loader.js selesai
  setTimeout(() => {
    const path = window.location.pathname;

    if (path.includes("event.html") && !path.includes("event-detail.html")) {
      loadEventListPage();
    } else if (path.includes("event-detail.html")) {
      // Tetap jalankan detail page loader
      loadEventDetailPage();
    }
  }, 200);
});

// Catatan: loadEventDetailPage() tidak diubah dan tetap ada di event.js untuk halaman detail.
// Pastikan anda sudah menyalin file event.js dari respons sebelumnya ke js/pages/event.js
// dan hanya mengganti loadEventListPage() dengan yang baru ini, atau menggunakan kode event.js lengkap
// yang sudah saya berikan di respons sebelumnya, dan hanya mengganti bagian loadEventListPage()
