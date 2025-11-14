// kangj0n0/hmte/HMTE-d084e3f499a90bd56268fedec26d73d3fc9a6de0/js/data/news-generator.js (REVISI LENGKAP)

// === Helper Functions (Diperlukan untuk rendering) ===

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString.replace(/-/g, "/"));
  return date.toLocaleDateString("id-ID", options);
}

function getMonthName(month) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return months[month];
}

// === Renderer for Index Page (Homepage Section) ===

function generateLatestNews() {
  const newsContainer = document.getElementById("latest-news-container");

  if (!newsContainer || typeof newsData === "undefined" || !Array.isArray(newsData) || newsData.length === 0) {
    return;
  }

  // FIX 1: Sortir berita berdasarkan tanggal terbaru (Newest First)
  const sortedNews = newsData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const latestNews = sortedNews.slice(0, 3);
  let newsCardsHTML = "";

  latestNews.forEach((news) => {
    // Jalur tautan dari index.html ke news-detail.html di page/news/
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

// === Renderer for Full News Page (Div 1, 2, 3) ===

function renderTopNews(news) {
  const container = document.getElementById("top-news-container");
  if (!container) return;

  const top4News = news.slice(0, 4);

  const newsHTML = top4News
    .map((item) => {
      // Path link dari page/news/news.html ke news-detail.html di folder yang sama
      const detailLink = `news-detail.html?id=${item.id}`;

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
}

function renderEventPromotion() {
  const container = document.getElementById("event-promo-container");
  // Membutuhkan window.eventsData dari calendar.js (harus dimuat sebelumnya)
  if (!container || typeof eventsData === "undefined") return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = eventsData
    .filter((event) => new Date(event.date).setHours(0, 0, 0, 0) >= today.getTime())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

  if (upcomingEvents.length === 0) {
    container.innerHTML = '<p class="text-white font-semibold">Saat ini tidak ada event besar yang akan datang.</p>';
    return;
  }

  const eventHTML = upcomingEvents
    .map((event) => {
      // Path link dari page/news/news.html ke event-detail.html di page/event/
      const detailLink = `../event/event-detail.html?id=${event.id}`;
      const formattedDate = formatDate(event.date);

      return `
            <div class="flex items-start gap-4 p-4 border-b border-gray-700 last:border-b-0">
                <div class="text-center bg-cyan-600 p-2 rounded-lg flex-shrink-0 min-w-[70px]">
                    <p class="text-lg font-bold text-white">${new Date(event.date).getDate()}</p>
                    <p class="text-xs text-white">${getMonthName(new Date(event.date).getMonth())}</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white mb-1">${event.title}</h3>
                    <p class="text-gray-400 text-sm mb-2">${event.description.substring(0, 100)}...</p>
                    <a href="${detailLink}" class="text-green-400 hover:text-green-300 transition text-sm font-semibold">Lihat Event →</a>
                </div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = eventHTML;
}

function renderArchiveNews(news) {
  const container = document.getElementById("archive-news-container");
  if (!container) return;

  const archiveNews = news.slice(4);

  if (archiveNews.length === 0) {
    container.innerHTML = '<p class="text-gray-400">Tidak ada berita lama yang diarsipkan.</p>';
    return;
  }

  const newsHTML = archiveNews
    .map((item) => {
      // Path link dari page/news/news.html ke news-detail.html di folder yang sama
      const detailLink = `news-detail.html?id=${item.id}`;

      return `
            <a href="${detailLink}" class="block bg-gray-800 rounded-lg p-4 border-l-4 border-gray-700 hover:bg-gray-700 transition cursor-pointer">
                <div>
                    <p class="text-xs font-medium text-cyan-400 mb-1">${item.category}</p>
                    <h3 class="text-lg font-bold text-white">${item.title}</h3>
                    <p class="text-gray-400 text-sm mt-1">${item.preview.substring(0, 120)}...</p>
                    <p class="text-gray-400 text-xs mt-2">${formatDate(item.date)}</p>
                </div>
            </a>
        `;
    })
    .join("");

  container.innerHTML = newsHTML;
}

// === INIT FUNCTION ===

function generateNewsPage() {
  if (typeof newsData === "undefined" || newsData.length === 0) {
    return;
  }
  // Sorting dilakukan di sini untuk halaman news.html
  const sortedNews = newsData.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  renderTopNews(sortedNews);
  renderArchiveNews(sortedNews);
  renderEventPromotion();
}

// Global initialization functions
window.generateLatestNews = generateLatestNews; // Untuk index.html (3 berita)
window.initNewsPage = generateNewsPage; // Untuk page/news/news.html (Penuh)
