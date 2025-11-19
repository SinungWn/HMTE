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
  const isNewsPage = currentPath.includes("/page/news/news.html");
  const isEmagzArchivePage = currentPath.includes("/page/emagz/emagz.html");
  const isEmagzReaderPage = currentPath.includes("emagz-reader.html"); // FIX: Tambah deteksi Reader
  // Tambahkan cek untuk halaman baru Anda (Event dan Project)
  const isEventPage = currentPath.includes("/page/event/");
  const isProjectPage = currentPath.includes("/page/project/");

  const loadPromises = [];

  // 1. MUAT KOMPONEN GLOBAL (HEADER & FOOTER)
  // FIX: Menggunakan jalur ABSOLUT
  loadPromises.push(loadComponent("header-placeholder", "/components/header.html"));
  loadPromises.push(loadComponent("footer-placeholder", "/components/footer.html"));

  // 2. MUAT KOMPONEN SPESIFIK (HANYA JIKA INI INDEX.HTML)
  if (isIndexPage) {
    // FIX: Menggunakan jalur RELATIF (naik satu tingkat dari js/ ke sections/)
    loadPromises.push(loadComponent("hero-placeholder", "../sections/hero.html"));
    loadPromises.push(loadComponent("news-placeholder", "../sections/news.html"));
    loadPromises.push(loadComponent("emagz-placeholder", "../sections/emagz.html"));
    loadPromises.push(loadComponent("proker-placeholder", "../sections/proker.html"));
    loadPromises.push(loadComponent("podcast-placeholder", "../sections/podcast.html"));
    loadPromises.push(loadComponent("timeline-placeholder", "../sections/timeline.html"));
    loadPromises.push(loadComponent("ongoing-placeholder", "../sections/ongoing.html"));
  }

  // 3. EKSEKUSI JANJI (Promise.all)
  Promise.all(loadPromises)
    .then(() => {
      console.log("Semua komponen berhasil dimuat!");

      setTimeout(() => {
        // Panggil JS Global (diperlukan untuk Header/Footer)
        initializeScripts();
        console.log("JavaScript berhasil diinisialisasi!");

        // ⭐️ PANGGIL INISIALISASI BERDASARKAN HALAMAN ⭐️

        // 1. Halaman Index
        if (isIndexPage) {
          if (typeof generateLatestNews === "function") {
            try {
              generateLatestNews();
              console.log("✅ Berita terbaru Index berhasil di-generate!");
            } catch (e) {
              console.error("Gagal menjalankan generateLatestNews (Index):", e);
            }
          }
          if (typeof window.initCalendar === "function") {
            try {
              window.initCalendar();
              console.log("✅ Kalender berhasil diinisialisasi!");
            } catch (e) {
              console.error("Gagal menjalankan initCalendar:", e);
            }
          }
          // FIX: Panggil E-MAGZ SECTION DI HOMEPAGE (DITINGKATKAN)
          if (typeof checkAndRenderEmagzSection === "function") {
            try {
              checkAndRenderEmagzSection();
              console.log("✅ E-Magz Section Index berhasil diinisialisasi!");
            } catch (e) {
              console.error("Gagal menjalankan checkAndRenderEmagzSection:", e);
            }
          }
        }

        // 2. Halaman News Penuh
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

        // 3. Halaman Event (Asumsi Anda punya initEventPage)
        if (isEventPage) {
          if (typeof loadEventListPage === "function") {
            try {
              loadEventListPage();
              console.log("✅ Halaman Event berhasil diinisialisasi!");
            } catch (e) {
              console.error("Gagal menjalankan loadEventListPage:", e);
            }
          }
        }

        // 4. Halaman Project (Asumsi Anda punya initProjectPage)
        if (isProjectPage) {
          if (typeof renderProjects === "function") {
            try {
              renderProjects();
              console.log("✅ Halaman Project berhasil diinisialisasi!");
            } catch (e) {
              console.error("Gagal menjalankan renderProjects:", e);
            }
          }
        }

        // 5. Halaman Emagz Archive
        if (isEmagzArchivePage) {
          if (typeof loadEmagzArchivePage === "function") {
            try {
              loadEmagzArchivePage();
            } catch (e) {
              console.error("Gagal menjalankan loadEmagzArchivePage:", e);
            }
          }
        }

        // 6. Halaman Emagz Reader (BARU)
        if (isEmagzReaderPage) {
          if (typeof loadEmagzReader === "function") {
            try {
              setTimeout(loadEmagzReader, 100); // Memberi waktu DOM load
              console.log("✅ Halaman Reader E-Magz berhasil diinisialisasi!");
            } catch (e) {
              console.error("Gagal menjalankan loadEmagzReader:", e);
            }
          }
        }
      }, 100);
    })
    .catch((error) => {
      console.error("Gagal memuat beberapa komponen:", error);
    });
});
