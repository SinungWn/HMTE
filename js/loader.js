/**
 * Fungsi untuk memuat file HTML dan menyuntikkannya ke placeholder yang ditentukan
 */
function loadComponent(placeholderId, filePath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    console.error(`Placeholder ID: ${placeholderId} tidak ditemukan.`);
    return Promise.resolve();
  }

  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Gagal memuat ${filePath}: ${response.statusText}`);
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

  if (slides.length === 0) return;

  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    slides[slideIndex - 1].style.display = "block";

    const halamanAktif = document.getElementById("halamanAktif");
    if (halamanAktif) {
      halamanAktif.innerHTML = `<p>${slideIndex} / ${slides.length}</p>`;
    }
  }

  window.plusSlides = function (n) {
    slideIndex += n;
    showSlides(slideIndex);
  };

  showSlides(slideIndex);
}

// --- Kode Eksekusi Utama ---
document.addEventListener("DOMContentLoaded", () => {
  // Array untuk menyimpan semua promise
  const loadPromises = [];

  // Muat semua komponen
  loadPromises.push(loadComponent("header-placeholder", "components/header.html"));
  loadPromises.push(loadComponent("footer-placeholder", "components/footer.html"));
  loadPromises.push(loadComponent("hero-placeholder", "sections/hero.html"));
  loadPromises.push(loadComponent("news-placeholder", "sections/news.html"));
  loadPromises.push(loadComponent("emagz-placeholder", "sections/emagz.html"));
  loadPromises.push(loadComponent("proker-placeholder", "sections/proker.html"));
  loadPromises.push(loadComponent("podcast-placeholder", "sections/podcast.html"));
  loadPromises.push(loadComponent("timeline-placeholder", "sections/timeline.html"));
  loadPromises.push(loadComponent("ongoing-placeholder", "sections/ongoing.html"));

  // Jika ada section lain, tambahkan di sini
  // loadPromises.push(loadComponent("events-ongoing-placeholder", "sections/events-ongoing.html"));
  // loadPromises.push(loadComponent("timeline-placeholder", "sections/timeline.html"));
  // loadPromises.push(loadComponent("magazine-placeholder", "sections/magazine.html"));
  // loadPromises.push(loadComponent("podcast-placeholder", "sections/podcast.html"));

  // Tunggu semua komponen selesai dimuat, baru jalankan JavaScript
  Promise.all(loadPromises)
    .then(() => {
      console.log("Semua komponen berhasil dimuat!");
      // Tunggu sebentar untuk memastikan DOM benar-benar siap
      setTimeout(() => {
        initializeScripts();
        console.log("JavaScript berhasil diinisialisasi!");
      }, 100);
    })
    .catch((error) => {
      console.error("Gagal memuat beberapa komponen:", error);
    });
});
