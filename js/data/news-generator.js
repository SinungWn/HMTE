// js/data/news-generator.js

const newsPerPage = 8;
let sortedNewsData = [];

// ── Helper ──────────────────────────────────────────────────

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString.replace(/-/g, "/"));
  return date.toLocaleDateString("id-ID", options);
}

function getMonthName(month) {
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return months[month];
}

// ── Index Page ───────────────────────────────────────────────

function generateLatestNews() {
  const newsContainer = document.getElementById("latest-news-container");

  if (
    !newsContainer ||
    typeof newsData === "undefined" ||
    !Array.isArray(newsData) ||
    newsData.length === 0
  ) return;

  const sortedNews = newsData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestNews = sortedNews.slice(0, 3);

  let newsCardsHTML = "";

  latestNews.forEach((news) => {
    const detailLink = `page/news/news-detail.html?id=${news.id}`;
    newsCardsHTML += `
      <a href="${detailLink}" class="news-card">
        <div class="news-card-img">
          <span class="news-card-num">0${latestNews.indexOf(news) + 1}</span>
          <img src="${news.imgSrc}" alt="${news.title}" loading="lazy">
        </div>
        <div class="news-card-body">
          <div class="news-card-meta">
            <span class="news-card-date">${news.date}</span>
            <span class="news-card-dot"></span>
            <span class="news-card-tag">${news.category}</span>
          </div>
          <h3 class="news-card-title">${news.title}</h3>
          <p class="news-card-desc">${news.preview}</p>
          <span class="news-card-read">Baca selengkapnya <i class="fas fa-arrow-right"></i></span>
        </div>
      </a>
    `;
  });

  newsContainer.innerHTML = newsCardsHTML;

  // ── Auto-adjust kolom sesuai jumlah berita ──
  const count = latestNews.length;
  if (count === 1) {
    newsContainer.style.gridTemplateColumns = "minmax(0, 420px)";
    newsContainer.style.justifyContent     = "center";
  } else if (count === 2) {
    newsContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    newsContainer.style.maxWidth            = "740px";
    newsContainer.style.margin              = "0 auto";
  } else {
    newsContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    newsContainer.style.maxWidth            = "";
    newsContainer.style.margin              = "";
  }

  // Trigger animasi setelah kartu di-inject
  if (typeof window.initNewsAnimations === "function") {
    window.initNewsAnimations();
  }
}

// ── Pagination Controls ──────────────────────────────────────

function renderPaginationControls(container, totalPages, currentPage) {
  window.goToNewsPage = (page) => renderAllPaginatedNews(window.sortedNewsData, page);

  let html = "";

  html += `<button
    class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
    onclick="window.goToNewsPage(${currentPage - 1})"
    ${currentPage === 1 ? "disabled" : ""}
  >Prev</button>`;

  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage   = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button
      class="px-3 py-1 rounded transition ${
        i === currentPage
          ? "bg-green-500 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }"
      onclick="window.goToNewsPage(${i})"
    >${i}</button>`;
  }

  html += `<button
    class="px-3 py-1 bg-gray-700 text-white rounded hover:bg-green-600 disabled:opacity-50 transition"
    onclick="window.goToNewsPage(${currentPage + 1})"
    ${currentPage === totalPages ? "disabled" : ""}
  >Next</button>`;

  container.innerHTML = html;
}

// ── Full News Page ───────────────────────────────────────────

function renderAllPaginatedNews(news, page = 1) {
  const container           = document.getElementById("all-news-container");
  const paginationContainer = document.getElementById("news-pagination-container");

  if (!container || !paginationContainer) return;

  const totalPages   = Math.ceil(news.length / newsPerPage);
  const start        = (page - 1) * newsPerPage;
  const paginatedNews = news.slice(start, start + newsPerPage);

  if (paginatedNews.length === 0) {
    container.innerHTML       = '<p class="text-gray-400 col-span-full text-center">Tidak ada berita yang ditemukan.</p>';
    paginationContainer.innerHTML = "";
    return;
  }

  container.innerHTML = paginatedNews.map((item) => {
    const detailLink = `page/news/news-detail.html?id=${item.id}`;
    return `
      <div
        class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700
               hover:border-green-500 transition duration-300 cursor-pointer"
        onclick="window.location.href='${detailLink}'"
      >
        <img
          src="../../${item.imgSrc}" alt="${item.title}"
          class="w-full h-32 object-cover"
          onerror="this.onerror=null;this.src='../../img/logohmte.png';"
        >
        <div class="p-4">
          <p class="text-xs font-medium text-green-400 mb-1">${item.category}</p>
          <h3 class="text-lg font-bold text-white mb-2 leading-tight">${item.title}</h3>
          <p class="text-gray-400 text-sm mb-2">${item.preview.substring(0, 100)}...</p>
          <p class="text-gray-400 text-xs">${formatDate(item.date)}</p>
        </div>
      </div>
    `;
  }).join("");

  renderPaginationControls(paginationContainer, totalPages, page);
}

// ── News Archive Init ────────────────────────────────────────

function generateNewsPage() {
  const container = document.getElementById("all-news-container");

  if (typeof newsData === "undefined" || newsData.length === 0) {
    if (container) container.innerHTML = '<p class="text-center text-gray-400">Data berita tidak ditemukan!</p>';
    return;
  }

  window.sortedNewsData = newsData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  renderAllPaginatedNews(window.sortedNewsData, 1);
}

// ── Exports ──────────────────────────────────────────────────

window.generateLatestNews = generateLatestNews; // index.html
window.initNewsPage       = generateNewsPage;   // page/news/news.html