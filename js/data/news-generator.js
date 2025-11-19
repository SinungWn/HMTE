// js/data/news-generator.js (MODIFIKASI FINAL UNTUK SINGLE PAGINATED ARCHIVE)

// Global state dan constants
const newsPerPage = 8; // Menampilkan 8 berita per halaman (2 baris x 4 kolom)
let sortedNewsData = [];

// === Helper Functions (formatDate, getMonthName, generateLatestNews tetap ada untuk Index.html) ===

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString.replace(/-/g, "/"));
  return date.toLocaleDateString("id-ID", options);
}

function getMonthName(month) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return months[month];
}

// === Renderer for Index Page (tetap sama) ===

function generateLatestNews() {
  const newsContainer = document.getElementById("latest-news-container");

  if (!newsContainer || typeof newsData === "undefined" || !Array.isArray(newsData) || newsData.length === 0) {
    return;
  }

  const sortedNews = newsData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const latestNews = sortedNews.slice(0, 3);
  let newsCardsHTML = "";

  latestNews.forEach((news) => {
    const detailLink = `page/news/news-detail.html?id=${news.id}`;

    const newsCard = `
        <div class="flex flex-col rounded-xl overflow-hidden border border-transparent transition-all duration-500 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/40 cursor-pointer"
          onclick="window.location.href='${detailLink}'" style="max-width: 300px;">
          <div class="overflow-hidden rounded-xl shadow-lg flex items-center justify-center bg-black" style="width: 100%; height: 220px; flex-shrink: 0">
            <img src="${news.imgSrc}" alt="${news.title}" style="width: 100%; height: 100%; object-fit: cover" class="transition-transform duration-500 hover:scale-105" />
          </div>
          <div class="mt-4 flex flex-col flex-1 p-4">
            <p class="text-xs font-semibold text-cyan-400 mb-1">${news.date} • ${news.category}</p>
            <h3 class="font-bold text-white text-lg mb-2">${news.title}</h3>
            <p class="text-gray-300 text-sm leading-relaxed">${news.preview}</p>
          </div>
        </div>
      `;
    newsCardsHTML += newsCard;
  });

  newsContainer.innerHTML = newsCardsHTML;
}

// === Pagination Logic ===

// Helper function untuk merender kontrol pagination
function renderPaginationControls(container, totalPages, currentPage) {
  let paginationHTML = "";

  // Tautan klik memanggil fungsi global renderAllPaginatedNews
  window.goToNewsPage = (page) => renderAllPaginatedNews(window.sortedNewsData, page);

  // Previous button
  paginationHTML += `<button class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-green-600 disabled:opacity-50 transition" onclick="window.goToNewsPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>Prev</button>`;

  // Page buttons
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, currentPage + Math.floor(maxButtons / 2));

  // Adjust startPage if near the end
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<button class="px-3 py-1 rounded transition ${i === currentPage ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}" onclick="window.goToNewsPage(${i})">${i}</button>`;
  }

  // Next button
  paginationHTML += `<button class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-green-600 disabled:opacity-50 transition" onclick="window.goToNewsPage(${currentPage + 1})" ${
    currentPage === totalPages ? "disabled" : ""
  }>Next</button>`;

  container.innerHTML = paginationHTML;
}

// === Renderer for Full News Page (Single Paginated Archive) ===

function renderAllPaginatedNews(news, page = 1) {
  const container = document.getElementById("all-news-container");
  const paginationContainer = document.getElementById("news-pagination-container");

  if (!container || !paginationContainer) return;

  const totalPages = Math.ceil(news.length / newsPerPage);

  const start = (page - 1) * newsPerPage;
  const end = start + newsPerPage;
  const paginatedNews = news.slice(start, end);

  if (paginatedNews.length === 0) {
    container.innerHTML = '<p class="text-gray-400 col-span-full text-center">Tidak ada berita yang ditemukan.</p>';
    paginationContainer.innerHTML = "";
    return;
  }

  const newsHTML = paginatedNews
    .map((item) => {
      const detailLink = `page/news/news-detail.html?id=${item.id}`;

      return `
            <div 
                class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-cyan-500 transition duration-300 cursor-pointer"
                onclick="window.location.href='${detailLink}'"
            >
                <img src="../../${item.imgSrc}" alt="${item.title}" class="w-full h-32 object-cover" onerror="this.onerror=null;this.src='../../img/logohmte.png';">
                <div class="p-4">
                    <p class="text-xs font-medium text-green-400 mb-1">${item.category}</p>
                    <h3 class="text-lg font-bold text-white mb-2 leading-tight">${item.title}</h3>
                    <p class="text-gray-400 text-sm mb-2">${item.preview.substring(0, 100)}...</p> 
                    <p class="text-gray-400 text-xs">${formatDate(item.date)}</p>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = newsHTML;
  renderPaginationControls(paginationContainer, totalPages, page);
}

// === INIT FUNCTION ===

function generateNewsPage() {
  if (typeof newsData === "undefined" || newsData.length === 0) {
    const container = document.getElementById("all-news-container");
    if (container) container.innerHTML = '<p class="text-center text-gray-400">Data berita tidak ditemukan!</p>';
    return;
  }

  // Sortir semua berita
  const sortedNews = newsData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  // Simpan data yang sudah disortir ke window agar dapat diakses oleh pagination (onclick)
  window.sortedNewsData = sortedNews;

  // Render halaman 1 dari semua berita
  renderAllPaginatedNews(window.sortedNewsData, 1);
}

// Global initialization functions
window.generateLatestNews = generateLatestNews; // Untuk index.html
window.initNewsPage = generateNewsPage; // Untuk page/news/news.html
