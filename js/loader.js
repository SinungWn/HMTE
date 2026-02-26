// ============================================================
// COMPONENT REGISTRY — tempat komponen mendaftarkan diri
// ============================================================
window.__components = window.__components || {};

// ============================================================
// loadComponent — fetch, inject, eksekusi script, panggil init
// ============================================================
function loadComponent(placeholderId, filePath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return Promise.resolve();

  return fetch(filePath)
    .then((res) => {
      if (!res.ok) throw new Error(`Gagal memuat ${filePath}: ${res.statusText}`);
      return res.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;

      // Eksekusi script yang diinjeksi via innerHTML
      placeholder.querySelectorAll('script').forEach((old) => {
        const s = document.createElement('script');
        Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
        s.textContent = old.textContent;
        old.parentNode.replaceChild(s, old);
      });

      // Nama komponen dari nama file (misal: "news.html" → "news")
      const name = filePath.split('/').pop().replace('.html', '');

      // Panggil init() jika komponen sudah mendaftarkan diri
      if (window.__components[name]?.init) {
        window.__components[name].init();
      }

      // Broadcast ke seluruh halaman bahwa komponen ini selesai
      document.dispatchEvent(
        new CustomEvent('component:loaded', { detail: { name, placeholder } })
      );

      console.log(`✅ Dimuat: ${filePath}`);
    })
    .catch((err) => {
      console.error(`❌ Error:`, err);
      placeholder.innerHTML = `<p class="text-red-500 text-center p-4">Gagal memuat ${filePath}</p>`;
    });
}

// ============================================================
// initializeScripts — hanya untuk elemen GLOBAL (header/footer)
// ============================================================
function initializeScripts() {
  // Header baru (header.html v2) sudah punya initHeaderNav() sendiri di dalamnya.
  // Deteksi: header baru pakai id="nav-toggle-btn".
  // Kalau ketemu → skip navbar init di sini, cegah double event listener.
  const isNewHeader = !!document.getElementById('nav-toggle-btn');

  if (!isNewHeader) {
    // ── Fallback: inisialisasi untuk header versi lama ──
    const navToggle = document.querySelector('.nav-toggle');
    const navbar    = document.querySelector('.nav-contain');
    const lines     = document.querySelectorAll('.line, .linee, .lineee');
    const navLinks  = document.querySelectorAll('.nav-link');
    const main      = document.querySelector('.main, #main');

    const closeNav = () => {
      navbar?.classList.remove('nav-open');
      main?.classList.remove('nav-open');
      lines.forEach((l) => l.classList.remove('nav-open'));
    };

    if (navToggle && navbar) {
      navToggle.addEventListener('click', () => {
        navbar.classList.toggle('nav-open');
        main?.classList.toggle('nav-open');
        lines.forEach((l) => l.classList.toggle('nav-open'));
      });
    }

    document.addEventListener('click', (e) => {
      if (!navbar?.contains(e.target) && !navToggle?.contains(e.target)) {
        if (navbar?.classList.contains('nav-open')) closeNav();
      }
    });

    navLinks.forEach((link) => link.addEventListener('click', closeNav));

    const navBerita = document.querySelector('.nav-berita');
    if (navBerita) {
      const dropdown = navBerita.nextElementSibling;
      navBerita.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown?.classList.toggle('show-dropdown');
      });
      document.addEventListener('click', (e) => {
        if (!navBerita.contains(e.target)) dropdown?.classList.remove('show-dropdown');
      });
    }
  }

  // ── Fade-in global — selalu dijalankan ──
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('visible'); o.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach((el) => obs.observe(el));
  }
}

// ============================================================
// MAIN EXECUTION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const is   = (str) => path.includes(str);

  const isIndex   = path === '/' || path.endsWith('/index.html');
  const isNews    = is('/page/news/news.html');
  const isEmagz   = is('/page/emagz/emagz.html');
  const isReader  = is('emagz-reader.html');
  const isEvent   = is('/page/event/');
  const isProject = is('/page/project/');

  const loads = [];

  // Global
  loads.push(loadComponent('header-placeholder', '/components/header.html'));
  loads.push(loadComponent('footer-placeholder', '/components/footer.html'));

  // Halaman spesifik
  if (isIndex) {
    ['hero','news','emagz','proker','podcast','timeline','ongoing'].forEach((name) => {
      loads.push(loadComponent(`${name}-placeholder`, `../sections/${name}.html`));
    });
  }

  Promise.all(loads).then(() => {
    // Inisialisasi global — navbar lama di-skip otomatis kalau header baru terdeteksi
    initializeScripts();

    const call = (fn, label) => {
      if (typeof fn === 'function') {
        try { fn(); console.log(`✅ ${label}`); }
        catch (e) { console.error(`❌ ${label}:`, e); }
      }
    };

    if (isIndex) {
      call(window.generateLatestNews,         'generateLatestNews');
      call(window.initCalendar,               'initCalendar');
      call(window.checkAndRenderEmagzSection, 'checkAndRenderEmagzSection');
    }
    if (isNews)    call(window.initNewsPage,        'initNewsPage');
    if (isEvent)   call(window.loadEventListPage,   'loadEventListPage');
    if (isProject) call(window.renderProjects,      'renderProjects');
    if (isEmagz)   call(window.loadEmagzArchivePage,'loadEmagzArchivePage');
    if (isReader)  call(window.loadEmagzReader,     'loadEmagzReader');
  });
});