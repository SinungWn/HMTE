// js/emagz.js

/**
 * Data Edisi Emagz
 */
const emagzData = [
  {
    id: 1,
    title: "E-Magz Vol.1",
    description: "Kumpulan konten E-MAGZ EDISI 8 HMTE UNSOED 2025",
    coverSrc: "/img/emagz/Vol1.png",
    pdfLink: "/img/emagz/1.pdf",
  },
  {
    id: 2,
    title: "E-Magz Vol.2",
    description: "E-Magz HMTE UNSOED Vol. 2: Rekomendasi Channel Teknik Elektro, Series 2025, dan Hiburan",
    coverSrc: "/img/emagz/Vol2.png",
    pdfLink: "/img/emagz/2.pdf",
  },
  {
    id: 3,
    title: "E-Magz Vol.3",
    description: "Panduan E-Magz HMTE UNSOED 2025: Kiat Meningkatkan Skill, Manfaat Olahraga, dan Rekomendasi Musik untuk Mahasiswa",
    coverSrc: "/img/emagz/Vol3.png",
    pdfLink: "/img/emagz/3.pdf",
  },
  {
    id: 4,
    title: "E-Magz Vol.4",
    description: "E-MAGZ HMTE UNSOED Edisi 8: Rekomendasi Alat Elektronik dan Tips Hidup Hemat Anak Kost",
    coverSrc: "/img/emagz/Vol4.png",
    pdfLink: "/img/emagz/4.pdf",
  },
];

// === CARD RENDERING LOGIC (POSTER STYLE) ===

function createEmagzCardHTML(edition) {
  const readerLink = `/page/emagz/emagz-reader.html?id=${edition.id}`;
  // Pastikan path gambar absolut
  const imagePath = edition.coverSrc.startsWith("http") ? edition.coverSrc : `/${edition.coverSrc.replace(/^\//, "")}`;

  return `
    <div class="group relative flex flex-col w-full max-w-[280px] mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-green-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-green-500/30">
      
      <div class="relative w-full aspect-[3/4] overflow-hidden">
        <img 
          src="${imagePath}" 
          alt="${edition.title}" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onerror="this.onerror=null;this.src='/img/logohmte.png';" 
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
        
        <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/30">
          Edisi #${edition.id}
        </div>
      </div>

      <div class="p-5 flex flex-col flex-1 relative">
        <h3 class="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-green-400 transition-colors">
          ${edition.title}
        </h3>
        
        <p class="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          ${edition.description}
        </p>
        
        <a href="${readerLink}" class="mt-auto w-full inline-flex items-center justify-center px-4 py-2.5 bg-gray-800 border border-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-green-600 hover:border-green-500 hover:text-white transition-all group-hover:shadow-lg">
          Baca Sekarang <i class="fas fa-arrow-right ml-2 text-xs"></i>
        </a>
      </div>
    </div>
  `;
}

// Render section Emagz di Homepage
function renderEmagzSection() {
  const container = document.getElementById("emagz-cards-container");
  const moreLink = document.getElementById("emagz-more-link");

  if (!container) return;

  const latestEditions = emagzData.slice(0, 3);

  if (latestEditions.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400 col-span-full">Belum ada edisi E-Magazine yang tersedia.</p>';
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

function checkAndRenderEmagzSection() {
  const container = document.getElementById("emagz-cards-container");
  if (container) {
    renderEmagzSection();
  } else {
    setTimeout(checkAndRenderEmagzSection, 50);
  }
}

// === ARCHIVE RENDERING LOGIC (GRID) ===
function loadEmagzArchivePage() {
  const container = document.getElementById("emagz-archive-container");
  if (!container) return;

  if (emagzData.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-400 col-span-full">Belum ada edisi E-Magazine yang tersedia dalam arsip.</p>';
    return;
  }

  const allCardsHTML = emagzData
    .sort((a, b) => b.id - a.id)
    .map(createEmagzCardHTML)
    .join("");

  // Grid Responsif untuk halaman arsip
  container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-auto px-4";
  container.innerHTML = allCardsHTML;
  console.log("✅ Arsip E-Magz berhasil di-render!");
}

// === READER LOGIC (EMBED PDF) ===
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

  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = `Baca Emagz HMTE - Edisi ${editionId}: ${edition.title}`;

  const mainTitle = document.querySelector("main h1");
  if (mainTitle) mainTitle.textContent = `E-Magazine HMTE Edisi ${editionId}`;
  const subTitle = document.querySelector("main p.text-center");
  if (subTitle) subTitle.textContent = `Membaca: ${edition.title}`;

  let readerContentHtml = "";

  if (edition.pdfLink) {
    const fullViewLink = `
        <a href="${edition.pdfLink}" target="_blank" class="px-5 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-200 mt-3 inline-block">
            Lihat di Tab Baru <i class="fas fa-external-link-alt ml-2"></i>
        </a>
    `;

    const metadataHtml = `
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center mb-10 border-l-4 border-green-500">
            <div class="w-32 h-40 flex-shrink-0 bg-gray-900 rounded-lg overflow-hidden mr-6 mb-4 sm:mb-0 border border-gray-700 shadow-md">
                 <img src="${edition.coverSrc.startsWith("http") ? edition.coverSrc : "/" + edition.coverSrc.replace(/^\//, "")}" 
                      alt="Cover ${edition.title}" 
                      class="w-full h-full object-cover"/>
            </div>
            <div class="flex-1">
                <h2 class="text-2xl font-extrabold text-green-400 mb-1">${edition.title}</h2>
                <p class="text-gray-400 mb-4">${edition.description}</p>
                ${fullViewLink}
            </div>
        </div>
    `;

    const embedHtml = `
        <div class="viewer-frame shadow-2xl border-2 border-gray-700 rounded-xl overflow-hidden bg-white">
            <div class="viewer-header p-3 bg-gray-700 text-sm text-center font-medium text-gray-300">
                E-MAGZ READER - Silakan scroll di dalam bingkai untuk membaca.
            </div>
            <iframe src="${edition.pdfLink}" width="100%" height="800px" style="border: none; background-color: white;"></iframe>
        </div>
    `;

    readerContentHtml = metadataHtml + embedHtml;
  } else {
    readerContainer.innerHTML = '<p class="text-center text-red-400">Error: Tautan PDF untuk edisi ini tidak ditemukan.</p>';
  }

  readerContainer.innerHTML = readerContentHtml;
}
