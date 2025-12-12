// js/data/calendar.js (Revisi untuk menghilangkan navigasi)

/**
 * Data Kegiatan Timeline
 * Format: YYYY-MM-DD
 * NOTE: Data di sini hanya contoh, pastikan Anda menggunakan variabel global yang benar.
 */
const eventsData = [
  {
    id: 1,
    date: "2025-07-13",
    title: "Line Tracer Soedirman",
    description: "Perlombaan Robot Line Tracer yang dilaksanakan di Fakultas Teknik Unsoed",
    time: "13 Juli - 27 Juli",
    location: "Gedung C Fakultas Teknik Unsoed",
    color: "green",
    isFeatured: true, // Tampilkan di Div 1/2
    registrationLink: "https://forms.gle/linkgformworkshop", // Link pendaftaran

    // --- TAMBAHAN: Properti untuk Halaman Detail ---
    imgSrc: "img/Event/lts.jpg", // Path/link gambar cover event
    locationLink: "https://maps.app.goo.gl/link-ke-aula-teknik", // Link Google Maps lokasi
    content: `
      <h3 class="text-xl font-bold mb-3 text-white">Detail LTS</h3>
      <p class="mb-4 text-gray-300">Lomba Line Tracer ini bertujuan berkompetisi dengan keterampilan dalam implementasi Sensor Tracing pada robot.</p>
    `,
  },
  {
    id: 2,
    date: "2025-11-20",
    title: "Seminar Nasional: Masa Depan AI",
    description: "Seminar tentang perkembangan teknologi AI dalam bidang elektro dan dampaknya terhadap industri 4.0.",
    time: "13:00 - 16:00 WIB",
    location: "Gedung C Fakultas Teknik",
    color: "blue",
    isFeatured: true,
    registrationLink: "https://forms.gle/linkgformseminar",

    // --- TAMBAHAN: Properti untuk Halaman Detail ---
    imgSrc: "/img/49d9b1a0-ca5b-4e48-99fd-b3b1d1a6c305.jpeg", // Path/link gambar cover event
    locationLink: "https://maps.app.goo.gl/link-ke-convention-center", // Link Google Maps lokasi
    content: `
      <h3 class="text-xl font-bold mb-3 text-white">Detail Seminar</h3>
      <p class="mb-4 text-gray-300">Seminar ini menghadirkan pembicara kunci dari industri dan akademisi untuk membahas bagaimana Kecerdasan Buatan (AI) merevolusi sektor kelistrikan, mulai dari efisiensi energi hingga smart manufacturing.</p>
      <p class="text-gray-300">Peserta akan mendapatkan wawasan mendalam tentang peluang karir di bidang AI dan Elektro.</p>
    `,
  },
  {
    id: 3,
    date: "2025-11-25",
    title: "Rapat Koordinasi Pengurus",
    description: "Rapat koordinasi internal pengurus HMTE, tertutup untuk umum.",
    time: "19:00 - 21:00 WIB",
    location: "Sekretariat HMTE",
    color: "yellow",
    isFeatured: false, // Event internal, tidak ditampilkan di Div 1/2
    registrationLink: null,

    // --- TAMBAHAN: Properti untuk Halaman Detail ---
    imgSrc: "/img/49d9b1a0-ca5b-4e48-99fd-b3b1d1a6c305.jpeg",
    locationLink: null,
    content: `<p class="text-gray-300">Rapat internal rutin pengurus HMTE.</p>`,
  },
  {
    id: 4,
    date: "2025-12-05",
    title: "Kunjungan Industri: PLN Pembangkit",
    description: "Kunjungan ke pembangkit listrik untuk melihat langsung proses kerja dan teknologi yang digunakan.",
    time: "08:00 - 17:00 WIB",
    location: "PLN Unit Pembangkit XXX",
    color: "green",
    isFeatured: true,
    registrationLink: "https://forms.gle/linkgformkunjungan",

    // --- TAMBAHAN: Properti untuk Halaman Detail ---
    imgSrc: "/img/49d9b1a0-ca5b-4e48-99fd-b3b1d1a6c305.jpeg",
    locationLink: "https://maps.app.goo.gl/link-ke-pln-pembangkit",
    content: `<p class="mb-4 text-gray-300">Kesempatan langka untuk melihat langsung operasional pembangkit listrik modern dan berinteraksi dengan insinyur profesional. Bus akan berangkat dari Kampus Teknik jam 07.30 WIB.</p>`,
  },
  {
    id: 5,
    date: "2025-12-15",
    title: "Lomba Desain PCB Mahasiswa",
    description: "Kompetisi desain PCB tingkat universitas dengan hadiah menarik.",
    time: "Sepanjang Hari",
    location: "Lab Komputer",
    color: "blue",
    isFeatured: true,
    registrationLink: "https://forms.gle/linkgformlomba",

    // --- TAMBAHAN: Properti untuk Halaman Detail ---
    imgSrc: "/img/49d9b1a0-ca5b-4e48-99fd-b3b1d1a6c305.jpeg",
    locationLink: "https://maps.app.goo.gl/link-ke-lab-komputer",
    content: `<p class="mb-4 text-gray-300">Tunjukkan keahlian Anda dalam merancang papan sirkuit tercetak (PCB). Kompetisi ini mengasah kemampuan teknis dan kreativitas. Batas akhir pengiriman desain adalah 10 Desember 2025.</p>`,
  },
];

/**
 * State Calendar (Diperlukan oleh renderCalendar dan changeMonth)
 */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// === Helper Functions (Dipertahankan) ===

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month, year) {
  return new Date(year, month, 1).getDay();
}

function getMonthName(month) {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return months[month];
}

function hasEvent(day, month, year) {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  // NOTE: Akses ke variabel global eventsData dipertahankan
  // Asumsi eventsData tetap digunakan secara global oleh script lain.
  return eventsData.find((event) => event.date === dateStr);
}

// === Main Functions (Dipertahankan) ===

/**
 * Fungsi untuk render kalender grid (showEventDetails dipertahankan)
 */
function renderCalendar() {
  const calendarGrid = document.getElementById("calendar-grid");
  const monthYearDisplay = document.getElementById("month-year-display");

  if (!calendarGrid || !monthYearDisplay) {
    return;
  }

  monthYearDisplay.textContent = `${getMonthName(currentMonth)} ${currentYear}`;
  calendarGrid.innerHTML = "";

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const colorMap = {
    green: "bg-green-600",
    blue: "bg-cyan-600",
    yellow: "bg-yellow-500",
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += `<div class="p-2 text-center text-gray-700 text-sm"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const event = hasEvent(day, currentMonth, currentYear);
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isToday = dateStr === todayStr;

    let classes = "p-2 text-center text-white hover:bg-gray-700 rounded-lg cursor-pointer transition transform hover:scale-105 text-sm relative bg-gray-700";

    if (isToday) {
      classes = classes.replace("bg-gray-700", "bg-cyan-600 font-bold");
      classes = classes.replace("hover:bg-gray-700", "hover:bg-cyan-700");
    }

    if (event && !isToday) {
      const eventBgColor = colorMap[event.color] || "bg-green-600";
      classes = classes.replace("bg-gray-700", eventBgColor);
      classes = classes.replace("hover:bg-gray-700", "hover:bg-gray-800");
    } else if (event && isToday) {
      classes += " ring-2 ring-green-400";
    }

    const dotColorClass = event ? colorMap[event.color].replace("bg-", "bg-") : "bg-transparent";
    const eventDot = event ? `<div class="absolute bottom-1 right-1 w-2 h-2 ${dotColorClass} rounded-full"></div>` : "";

    // showEventDetails dipertahankan karena ini adalah aksi internal halaman
    calendarGrid.innerHTML += `
            <div class="${classes}" onclick="showEventDetails('${dateStr}')">
                ${day}
                ${eventDot}
            </div>
        `;
  }

  const totalCells = firstDay + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  if (remainingCells > 0) {
    for (let day = 1; day <= remainingCells; day++) {
      calendarGrid.innerHTML += `<div class="p-2 text-center text-gray-700 text-sm"></div>`;
    }
  }
}

/**
 * Fungsi untuk tampilkan detail event (dipertahankan)
 */
function showEventDetails(dateStr) {
  const event = eventsData.find((e) => e.date === dateStr);
  const eventDetailsContainer = document.getElementById("event-details");

  if (!eventDetailsContainer) return;

  const dateParts = dateStr.split("-");
  const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const formattedDate = `${eventDate.getDate()} ${getMonthName(eventDate.getMonth())} ${eventDate.getFullYear()}`;
  const eventColor = event ? event.color : "gray";

  const borderColorMap = {
    green: "border-green-500",
    blue: "border-cyan-500",
    yellow: "border-yellow-500",
    gray: "border-gray-500",
  };
  const borderColor = borderColorMap[eventColor];

  // Tautan yang ada di detail event ini tidak mengarah ke halaman baru
  const actionButton = event && event.registrationLink ? `<a href="${event.registrationLink}" target="_blank" class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold">Daftar</a>` : "";

  if (event) {
    eventDetailsContainer.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-4 border-l-4 ${borderColor}">
                <p class="text-gray-400 text-sm mb-1">Tanggal: <span class="text-white font-semibold">${formattedDate}</span></p>
                <h4 class="text-white font-bold text-lg mb-2">${event.title}</h4>
                <p class="text-gray-300 text-sm mb-2">${event.description}</p>
                <div class="text-cyan-400 text-xs mb-1">
                    <i class="fas fa-clock mr-1"></i> ${event.time}
                </div>
                <div class="text-cyan-400 text-xs mb-4">
                    <i class="fas fa-map-marker-alt mr-1"></i> ${event.location}
                </div>
                ${actionButton}
            </div>
        `;
  } else {
    eventDetailsContainer.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-4 text-center text-gray-400">
                ${formattedDate}: Tidak ada kegiatan terjadwal
            </div>
        `;
  }
}

/**
 * Fungsi untuk tampilkan upcoming events di sidebar
 * FIX: Menghilangkan window.location.href dari onclick.
 */
function displayUpcomingEvents() {
  const upcomingContainer = document.getElementById("upcoming-events");

  if (!upcomingContainer) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = eventsData
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Tampilkan 5 terdekat

  if (upcoming.length === 0) {
    upcomingContainer.innerHTML = '<p class="text-gray-400 text-sm">Tidak ada kegiatan mendatang</p>';
    return;
  }

  const colorMap = {
    green: "bg-green-600",
    blue: "bg-cyan-600",
    yellow: "bg-yellow-500",
  };

  const upcomingHTML = upcoming
    .map((event) => {
      const eventDate = new Date(event.date);
      const day = eventDate.getDate();
      const month = getMonthName(eventDate.getMonth()).substring(0, 3);
      const bgColor = colorMap[event.color] || "bg-gray-600";

      // FIX: Menghilangkan logic window.location.href. Hanya mempertahankan showEventDetails.
      const cardAction = `onclick="showEventDetails('${event.date}')"`;

      return `
            <div class="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer" ${cardAction}>
                <div class="flex items-start gap-3">
                    <div class="${bgColor} rounded-lg p-2 text-center min-w-[50px] shadow-md">
                        <div class="text-white font-bold text-xl">${day}</div>
                        <div class="text-white text-xs">${month}</div>
                    </div>
                    <div class="flex-1">
                        <h5 class="text-white font-semibold text-sm mb-1">${event.title}</h5>
                        <p class="text-gray-400 text-xs mb-1">${event.time}</p>
                        <p class="text-cyan-400 text-xs">
                            <i class="fas fa-map-marker-alt mr-1"></i>${event.location}
                        </p>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  upcomingContainer.innerHTML = upcomingHTML;
}

/**
 * Fungsi untuk navigasi bulan (Dipertahankan)
 */
function changeMonth(direction) {
  currentMonth += direction;

  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }

  renderCalendar();
  displayUpcomingEvents();
}

/**
 * Expose functions ke global scope
 */
window.changeMonth = changeMonth;
window.showEventDetails = showEventDetails;

/**
 * PENTING: Fungsi Inisialisasi yang dipanggil oleh loader.js
 */
window.initCalendar = function () {
  renderCalendar();
  displayUpcomingEvents();

  // Otomatis tampilkan detail event terdekat saat load
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const firstUpcomingEvent = eventsData.filter((event) => event.date >= todayStr).sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  if (firstUpcomingEvent) {
    showEventDetails(firstUpcomingEvent.date);
  }
};
