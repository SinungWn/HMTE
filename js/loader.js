/**
 * Fungsi untuk memuat file HTML dan menyuntikkannya ke placeholder yang ditentukan,
 * dan MENGEMBALIKAN Promise agar bisa dipanggil fungsi lain setelah selesai.
 */
function loadComponent(placeholderId, filePath) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    console.error(`Placeholder ID: ${placeholderId} tidak ditemukan.`);
    return Promise.resolve(); // Mengembalikan Promise yang selesai
  }

  return fetch(filePath) // Mengembalikan hasil fetch
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Gagal memuat ${filePath}: ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error saat memuat komponen:", error);
      placeholder.innerHTML = `<p class="text-red-500 text-center">Gagal memuat konten dari ${filePath}</p>`;
    });
}

// --- Kode Eksekusi Utama ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Muat Header
  loadComponent("header-placeholder", "components/header.html")
    .then(() => {
      // 2. SETELAH Header berhasil dimuat, baru kita jalankan script yang memerlukannya

      // Panggil file script.js secara manual, sehingga DOM Header sudah ada

      // Ini akan menjalankan semua kode di script.js
      const script = document.createElement("script");
      script.src = "js/script.js";
      document.body.appendChild(script);
    })
    .catch((error) => console.error("Gagal menjalankan script header: ", error));

  // 3. Muat semua komponen lain (Tidak perlu menunggu header)
  loadComponent("footer-placeholder", "components/footer.html").then(() => {
    // Setelah footer dan mungkin elemen emagz dimuat, jalankan emagz.js
    const emagzScript = document.createElement("script");
    emagzScript.src = "js/emagz.js";
    document.body.appendChild(emagzScript);
  });

  loadComponent("hero-placeholder", "sections/hero.html");
  loadComponent("news-placeholder", "sections/news.html");
  loadComponent("events-ongoing-placeholder", "sections/events-ongoing.html");
  loadComponent("timeline-placeholder", "sections/timeline.html");
  loadComponent("magazine-placeholder", "sections/magazine.html");
  loadComponent("podcast-placeholder", "sections/podcast.html");
});
