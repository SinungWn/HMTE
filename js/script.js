function waitForElm(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    // Coba lagi dalam 50 milidetik
    setTimeout(function () {
      waitForElm(selector, callback);
    }, 50);
  }
}

// JavaScript untuk Navbar
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".nav-contain");
  const lines = document.querySelectorAll(".line, .linee, .lineee");
  const navLinks = document.querySelectorAll(".nav-link");
  const main = document.querySelector(".main");

  // Fungsi untuk menutup navbar
  const closeNav = () => {
    if (navbar) navbar.classList.remove("nav-open");
    if (main) main.classList.remove("nav-open");
    lines.forEach((line) => line.classList.remove("nav-open"));
  };

  // Toggle navbar saat tombol toggle diklik
  if (navToggle && navbar && lines.length > 0) {
    navToggle.addEventListener("click", () => {
      navbar.classList.toggle("nav-open");
      if (main) main.classList.toggle("nav-open");
      lines.forEach((line) => line.classList.toggle("nav-open"));
    });
  }

  // Tutup navbar saat klik di luar navbar atau tombol toggle
  document.addEventListener("click", (e) => {
    const isClickInsideNav = navbar && navbar.contains(e.target);
    const isClickOnToggle = navToggle && navToggle.contains(e.target);

    if (!isClickInsideNav && !isClickOnToggle && navbar && navbar.classList.contains("nav-open")) {
      closeNav();
    }
  });

  // Tutup navbar saat .nav-link diklik
  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });
  }

  // ANIMASI SAAT SCROLL
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
        threshold: 0.5,
      }
    );

    fadeElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // Ambil elemen dengan class 'nav-berita'
  const navBerita = document.querySelector(".nav-berita");

  // Ambil elemen dropdown-menu yang bersangkutan
  if (navBerita) {
    const dropdownMenu = navBerita.nextElementSibling;

    // Tambahkan event listener untuk klik
    navBerita.addEventListener("click", function (e) {
      e.preventDefault(); // Mencegah perilaku default link

      // Toggle class 'show-dropdown' pada dropdown-menu
      if (dropdownMenu) dropdownMenu.classList.toggle("show-dropdown");
    });

    // Optional: Tutup dropdown ketika mengklik di luar dropdown
    document.addEventListener("click", function (e) {
      if (navBerita && !navBerita.contains(e.target)) {
        if (dropdownMenu) dropdownMenu.classList.remove("show-dropdown");
      }
    });
  }
});
