// js/emagz.js

/**
 */
const emagzData = [
  {
    id: 1,
    title: "Arti Kemerdekaan",
    description: "Komik 2.0 karya Salsabila Miftahusy Syifa – Kimia",
    coverSrc: "https://apps.bem-unsoed.com/wp-content/uploads/2023/08/IMG_1799.png",

    pdfLink: "/img/emagz/sample.pdf",
  },
  {
    id: 2,
    title: "Riset Teknologi Terbaru",
    description: "Deskripsi singkat artikel 2 tentang riset.",
    coverSrc: "/img/emagz/page2.webp",

    pdfLink: "/img/emagz/sample.pdf",
  },
  {
    id: 3,
    title: "Profil Alumni Sukses",
    description: "Deskripsi singkat artikel 3.",
    coverSrc: "/img/emagz/page3.webp",

    pdfLink: "/img/emagz/sample.pdf",
  },
  {
    id: 4,
    title: "Edisi Khusus Wisuda",
    description: "Perayaan kelulusan angkatan 2020.",
    coverSrc: "/img/emagz/page4.webp",

    pdfLink: "/img/emagz/sample.pdf",
  },
];

// === CARD RENDERING LOGIC (Untuk sections/emagz.html di Homepage & Arsip) ===

function createEmagzCardHTML(edition) {
  const readerLink = `/page/emagz/emagz-reader.html?id=${edition.id}`;
  const imagePath = edition.coverSrc;

  return `
        <div class="border-2 border-green-800 w-[260px] md:w-[280px] rounded-lg overflow-hidden shadow-lg bg-black hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-shadow duration-300 flex flex-col">
          <div class="bg-gray-800 flex justify-center items-center h-64 p-3 relative"> 
            <img src="${imagePath}" 
                 alt="${edition.title}" 
                 class="max-w-full max-h-full object-contain"
                 onerror="this.onerror=null;this.src='/img/logohmte.png';" />
          </div>

          <div class="p-4 bg-gray-800 flex-1 flex flex-col">
            <h3 class="text-white font-semibold text-lg mb-1">${edition.title}</h3>
            <p class="text-gray-300 text-sm mb-4">${edition.description}</p>
            <a href="${readerLink}" class="mt-auto px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition text-center font-semibold"> Baca </a>
          </div>
        </div>
    `;
}

// Render section Emagz di Homepage, menampilkan 3 edisi terbaru.
function renderEmagzSection() {
  const container = document.getElementById("emagz-cards-container");
  const moreLink = document.getElementById("emagz-more-link");

  if (!container) return;

  const latestEditions = emagzData.slice(0, 3);

  if (latestEditions.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400">Belum ada edisi E-Magazine yang tersedia.</p>';
    if (moreLink) moreLink.classList.add("hidden");
    return;
  }

  const cardsHTML = latestEditions.map(createEmagzCardHTML).join("");
  container.innerHTML = cardsHTML;

  if (moreLink && emagzData.length > 3) {
    const linkElement = moreLink.querySelector("a");
    if (linkElement) {
      linkElement.href = "/page/emagz/emagz.html";
    }
    moreLink.classList.remove("hidden");
  }
}

// Fungsi pengecekan (untuk loader.js)
function checkAndRenderEmagzSection() {
  const container = document.getElementById("emagz-cards-container");
  if (container) {
    renderEmagzSection();
  } else {
    setTimeout(checkAndRenderEmagzSection, 50);
  }
}

// ARCHIVE RENDERING LOGIC
function loadEmagzArchivePage() {
  const container = document.getElementById("emagz-archive-container");
  if (!container) return;

  if (emagzData.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400">Belum ada edisi E-Magazine yang tersedia dalam arsip.</p>';
    return;
  }

  const allCardsHTML = emagzData
    .sort((a, b) => b.id - a.id)
    .map(createEmagzCardHTML)
    .join("");

  container.className = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto";
  container.innerHTML = allCardsHTML;
  console.log("✅ Arsip E-Magz berhasil di-render!");
}

// === READER LOGIC (MENGGUNAKAN IFRAME UNTUK EMBED PDF) ===
function loadEmagzReader() {
  const readerContainer = document.getElementById("emagz-reader-container");
  if (!readerContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const editionId = parseInt(urlParams.get("id"));

  const edition = emagzData.find((e) => e.id === editionId);

  if (!edition) {
    readerContainer.innerHTML = '<p class="text-center text-red-400">Error: Edisi Emagz tidak ditemukan.</p>';
    return;
  }

  // Update Judul Halaman
  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = `Baca Emagz HMTE - Edisi ${editionId}: ${edition.title}`;

  const mainTitle = document.querySelector("main h1");
  if (mainTitle) mainTitle.textContent = `E-Magazine HMTE Edisi ${editionId}`;
  const subTitle = document.querySelector("main p.text-center");
  if (subTitle) subTitle.textContent = `Membaca: ${edition.title}`;

  // Implementasi Embed PDF
  if (edition.pdfLink) {
    const pdfContentHtml = `
      <div class="shadow-2xl border-4 border-gray-700 bg-gray-200 w-full">
        <iframe src="${edition.pdfLink}" width="100%" height="800px" style="border: none;"></iframe>
      </div>
    `;

    const fullViewLink = `
       
    `;

    readerContainer.innerHTML = fullViewLink + pdfContentHtml;
  } else {
    readerContainer.innerHTML = '<p class="text-center text-red-400">Error: Tautan PDF untuk edisi ini tidak ditemukan.</p>';
  }
}
// HAPUS: document.addEventListener("DOMContentLoaded", ...) di sini (sudah di loader.js)
