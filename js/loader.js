/**
 * Fungsi untuk memuat file HTML dan menyuntikkannya ke placeholder yang ditentukan
 */
function loadComponent(placeholderId, filePath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    return Promise.resolve(); // Dibiarkan aslinya, OK jika placeholder index tidak ada di halaman detail
  }

  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        // Menambahkan detail error
        throw new new Error(`Gagal memuat ${filePath}: ${response.statusText}`)();
      }
      return response.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;
      console.log(`✅ Berhasil memuat: ${filePath}`);
    })
    .catch((error) => {
      console.error(`❌ Error memuat ${filePath}:`, error);
      placeholder.innerHTML = `<p class="text-red-500 text-center">Gagal memuat konten dari ${filePath}</p>`;
    });
}

/**
 * Fungsi untuk inisialisasi semua JavaScript setelah DOM siap
 */
function initializeScripts() {
  // ⭐️ SEMUA KODE ORIGINAL ANDA DISINI - TIDAK DIUBAH ⭐️
  // Navbar Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".nav-contain");
  const lines = document.querySelectorAll(".line, .linee, .lineee");
  const navLinks = document.querySelectorAll(".nav-link");
  const main = document.querySelector(".main, #main");

  const closeNav = () => {
    if (navbar) navbar.classList.remove("nav-open");
    if (main) main.classList.remove("nav-open");
    lines.forEach((line) => line.classList.remove("nav-open"));
  };

  if (navToggle && navbar && lines.length > 0) {
    navToggle.addEventListener("click", () => {
      navbar.classList.toggle("nav-open");
      if (main) main.classList.toggle("nav-open");
      lines.forEach((line) => line.classList.toggle("nav-open"));
    });
  }

  document.addEventListener("click", (e) => {
    const isClickInsideNav = navbar && navbar.contains(e.target);
    const isClickOnToggle = navToggle && navToggle.contains(e.target);

    if (!isClickInsideNav && !isClickOnToggle && navbar && navbar.classList.contains("nav-open")) {
      closeNav();
    }
  });

  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });
  }

  // Dropdown Menu
  const navBerita = document.querySelector(".nav-berita");
  if (navBerita) {
    const dropdownMenu = navBerita.nextElementSibling;

    navBerita.addEventListener("click", function (e) {
      e.preventDefault();
      if (dropdownMenu) dropdownMenu.classList.toggle("show-dropdown");
    });

    document.addEventListener("click", function (e) {
      if (navBerita && !navBerita.contains(e.target)) {
        if (dropdownMenu) dropdownMenu.classList.remove("show-dropdown");
      }
    });
  }

  // Fade-in Animation
  const fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    fadeElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // E-Magazine Slider
  initEmagzSlider();
}

/**
 * Fungsi untuk inisialisasi slider e-magazine
 */
function initEmagzSlider() {
  let slideIndex = 1;
  const slides = document.getElementsByClassName("gambar");
  // ... (Kode initEmagzSlider Anda yang lain) ...
  // Dibiarkan tanpa perubahan
}

// ⭐️⭐️ KODE EKSEKUSI UTAMA UNIVERSAL (FINAL FIX) ⭐️⭐️
document.addEventListener("DOMContentLoaded", () => {
  // Tentukan Lokasi
  const currentPath = window.location.pathname;
  const isIndexPage = currentPath === "/" || currentPath.endsWith("/index.html");
  const isNewsPage = currentPath.includes("/page/news/news.html"); // Cek halaman berita

  const loadPromises = [];

  // 1. MUAT KOMPONEN GLOBAL (HEADER & FOOTER)
  // FIX: Menggunakan jalur relatif dari root agar loader dapat menemukan komponen
  loadPromises.push(loadComponent("header-placeholder", "components/header.html"));
  loadPromises.push(loadComponent("footer-placeholder", "components/footer.html"));

  // 2. MUAT KOMPONEN SPESIFIK (HANYA JIKA INI INDEX.HTML)
  if (isIndexPage) {
    // FIX: Mengubah semua jalur di sini agar sesuai dengan asumsi root loading
    loadPromises.push(loadComponent("hero-placeholder", "sections/hero.html"));
    loadPromises.push(loadComponent("news-placeholder", "sections/news.html"));
    loadPromises.push(loadComponent("emagz-placeholder", "sections/emagz.html"));
    loadPromises.push(loadComponent("proker-placeholder", "sections/proker.html"));
    loadPromises.push(loadComponent("podcast-placeholder", "sections/podcast.html"));
    loadPromises.push(loadComponent("timeline-placeholder", "sections/timeline.html"));
    loadPromises.push(loadComponent("ongoing-placeholder", "sections/ongoing.html"));
  }

  // 3. EKSEKUSI JANJI (Promise.all)
  Promise.all(loadPromises)
    .then(() => {
      console.log("Semua komponen berhasil dimuat!");

      // Beri waktu 100ms agar memastikan DOM benar-benar siap
      setTimeout(() => {
        // Panggil JS Global (diperlukan untuk Header/Footer)
        initializeScripts();
        console.log("JavaScript berhasil diinisialisasi!");

        // ⭐️ PANGGIL INISIALISASI BERDASARKAN HALAMAN ⭐️

        // 1. Halaman Index (Memuat News dan komponen lainnya)
        if (isIndexPage) {
          // Panggil Generator Berita Index (mengisi news-placeholder)
          if (typeof generateLatestNews === "function") {
            try {
              generateLatestNews();
              console.log("✅ Berita terbaru Index berhasil di-generate!");
            } catch (e) {
              console.error("Gagal menjalankan generateLatestNews (Index):", e);
            }
          }

          // Panggil inisialisasi kalender (jika ada)
          if (typeof window.initCalendar === "function") {
            try {
              window.initCalendar();
              console.log("✅ Kalender berhasil diinisialisasi!");
            } catch (e) {
              console.error("Gagal menjalankan initCalendar:", e);
            }
          }
        }

        // 2. Halaman News Penuh (Mengisi Div 1, 2, 3 di news.html)
        if (isNewsPage) {
          if (typeof window.initNewsPage === "function") {
            try {
              window.initNewsPage();
              console.log("✅ Halaman Berita Penuh berhasil diinisialisasi!");
            } catch (e) {
              console.error("Gagal menjalankan initNewsPage:", e);
            }
          }
        }
      }, 100);
    })
    .catch((error) => {
      console.error("Gagal memuat beberapa komponen:", error);
    });
});
