/* main.js — نسخة مُعدلة آمنة جاهزة للاستبدال
   التغييرات الأساسية:
   - تحميل shared-games.json وحفظه في localStorage.sharedGames
   - دمج base + shared + admin عند العرض (getAllGames)
   - منع ظهور أزرار الأدمن للزوار (تعتمد على ?admin=true في الـ URL)
   - حساب isAdminGame عن طريق قراءة localStorage لكل عرض (مزامنة)
   - إصلاح Export / Import بحيث يحدث ريفريش بعد التعديل
   - التهيئة تنتظر تحميل shared قبل العرض
   الرجاء: احفظ نسخة احتياطية من main.js الحالي قبل الاستبدال.
*/

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     الهامبرغر / sidebar / overlay
  ========================== */
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
      sidebar.setAttribute('aria-hidden', !sidebar.classList.contains('open'));
      overlay.setAttribute('aria-hidden', !overlay.classList.contains('open'));
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      sidebar.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
    });
  }

  /* =========================
     عناصر DOM و إعدادات عامة
  ========================== */
  const gamesGrid = document.getElementById("gamesGrid");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput");
  const searchClear = document.getElementById("searchClear");

  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const smartBtn = document.getElementById("smartBtn");

  const aName = document.getElementById("aName");
  const aImg = document.getElementById("aImg");
  const aDesc = document.getElementById("aDesc");
  const aCategory = document.getElementById("aCategory");
  const versionsDiv = document.getElementById("versions");

  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');

  let gamesPerPage = 10;
  let currentPage = 1;
  let currentCategory = "all";
  let searchQuery = "";

  // Admin mode detection: show admin UI only if URL contains ?admin=true
  const urlParams = new URLSearchParams(location.search);
  const isAdminMode = urlParams.get('admin') === 'true';

  /* =========================
     البيانات الابتدائية (base)
  ========================== */
  // نجعل baseGames متاحًا كمتغيّر عالمي لأن ملفات أخرى تعتمد عليه (game-details.js)
  window.baseGames = [
    {
      name: "Hay Day",
      img: "/unnamed (2).jpg",
      desc: "Hay Day Mod APK Unlimited Money",
      category: "strategy",
      versions: [{ v: "1.0", size: "150 MB", link: "#" }]
    }
  ];

  /* =========================
     Shared JSON URL (ضع هنا رابط raw الصحيح بعد رفع shared-games.json إلى GitHub)
  ========================== */
  const SHARED_JSON_URL = 'https://raw.githubusercontent.com/Ahmedyemen20/Bmodee/main/shared-games.json';

  /* =========================
     دوال مساعدة: رابط جوجل بلاي + جلب الصور
  ========================== */
  function getPlayStoreSearchLink(name) {
    return `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`;
  }

  function tryLoadImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ ok: true, url });
      img.onerror = () => resolve({ ok: false });
      img.src = url;
    });
  }

  async function fetchImageForName(name) {
    if (!name) return "/no-image.png";
    try {
      const unsplash = `https://source.unsplash.com/640x360/?${encodeURIComponent(name)},game`;
      const res1 = await tryLoadImage(unsplash);
      if (res1.ok) return res1.url;
    } catch (_) {}
    try {
      const fallback = '/no-image.png';
      return fallback;
    } catch (_) {
      return '/no-image.png';
    }
  }

  /* =========================
     Shared games: تحميل وحفظ محلياً (لا يغيّر adminGames)
  ========================== */
  async function fetchSharedGames() {
    try {
      if (!SHARED_JSON_URL) return;
      const res = await fetch(SHARED_JSON_URL, { cache: 'no-store' });
      if (!res.ok) {
        console.warn('fetchSharedGames: non-ok status', res.status);
        return;
      }
      const shared = await res.json();
      if (!Array.isArray(shared)) {
        console.warn('fetchSharedGames: expected array in JSON');
        return;
      }
      try {
        localStorage.setItem('sharedGames', JSON.stringify(shared));
      } catch (e) {
        console.warn('fetchSharedGames: cannot save to localStorage', e);
      }
      // إعادة رسم الواجهة العامة إن كانت محملة
      try {
        if (window.GameManager && typeof GameManager.refreshPublic === 'function') {
          GameManager.refreshPublic('gamesContainer');
        } else {
          if (typeof renderGames === 'function') {
            renderGames();
            if (typeof renderPagination === 'function') renderPagination();
          }
        }
      } catch (e) {
        console.warn('fetchSharedGames: UI refresh failed', e);
      }
    } catch (err) {
      console.warn('fetchSharedGames error', err);
    }
  }

  /* =========================
     إدارة البيانات المحلية (adminGames في localStorage)
  ========================== */
  function readAdminGames() {
    try {
      return JSON.parse(localStorage.getItem('adminGames') || '[]');
    } catch (e) {
      console.warn('readAdminGames error', e);
      return [];
    }
  }

  function saveAdminGames(arr) {
    try {
      localStorage.setItem('adminGames', JSON.stringify(arr || []));
    } catch (e) {
      console.warn('saveAdminGames error', e);
    }
  }

  /* =========================
     دمج الألعاب عند العرض: base + shared + admin
  ========================== */
  function getAllGames() {
    const base = Array.isArray(window.baseGames) ? baseGames : [];
    const shared = JSON.parse(localStorage.getItem('sharedGames') || '[]');
    const admin = readAdminGames();
    return [...base, ...shared, ...admin];
  }

  /* =========================
     فلترة الألعاب (بحث وفئة)
  ========================== */
  function getFilteredGames() {
    let list = getAllGames();
    if (currentCategory && currentCategory !== "all") {
      list = list.filter(g => g.category === currentCategory);
    }
    if (searchQuery) {
      list = list.filter(g => (g.name || "").toLowerCase().includes(searchQuery));
    }
    return list;
  }

  /* =========================
     عرض الألعاب (الصفحة العامة)
  ========================== */
  function renderGames() {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = "";

    const games = getFilteredGames();
    const start = (currentPage - 1) * gamesPerPage;
    const slice = games.slice(start, start + gamesPerPage);

    if (!slice.length && games.length === 0) {
      gamesGrid.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px">لا توجد ألعاب مطابقة</div>`;
      return;
    }

    slice.forEach(game => {
      // نقرأ adminList من localStorage في كل مرة لتضمن التزامن بين الأجهزة
      const adminList = readAdminGames();
      const index = adminList.findIndex(g => g.name === game.name && g.versions && JSON.stringify(g.versions) === JSON.stringify(game.versions));
      const isAdminGame = index !== -1;

      const card = document.createElement("div");
      card.className = "game-card";

      card.onclick = () => {
        try {
          sessionStorage.setItem('selectedGame', JSON.stringify(game));
        } catch (e) {}
        location.href = `game.html?name=${encodeURIComponent(game.name)}${isAdminMode ? "&admin=true" : ""}`;
      };

      // بنية البطاقة
      const safeImg = game.img || '/no-image.png';
      card.innerHTML = `
        <img src="${safeImg}" onerror="this.src='/no-image.png'">
        <h3>${escapeHtml(game.name)}</h3>
        <p>${escapeHtml(game.desc || "")}</p>
        <p><a class="source-link" href="${getPlayStoreSearchLink(game.name)}" target="_blank" rel="noopener">مصدر (Google Play)</a></p>
        ${isAdminMode && isAdminGame ? `
          <div class="admin-actions" onclick="event.stopPropagation()">
            <button class="edit" data-idx="${index}" data-name="${escapeHtml(game.name)}">✏️</button>
            <button class="del" data-idx="${index}" data-name="${escapeHtml(game.name)}">🗑</button>
          </div>
        ` : ``}
      `;
      gamesGrid.appendChild(card);
    });

    if (games.length === 0) {
      // عرض رسالة عند عدم وجود ألعاب بعد الفلترة
      if (!slice.length) {
        gamesGrid.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px">لا توجد ألعاب مطابقة</div>`;
      }
    }
  }

  /* =========================
     Pagination
  ========================== */
  function renderPagination() {
    if (!pagination) return;
    pagination.innerHTML = "";
    const pages = Math.max(1, Math.ceil(getFilteredGames().length / gamesPerPage));
    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener('click', () => {
        currentPage = i;
        renderGames();
        renderPagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      pagination.appendChild(btn);
    }
  }

  /* =========================
     Utilities: escapeHtml
  ========================== */
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* =========================
     Admin: Export / Import / Edit / Delete
     - نعرض أزرار الأدمن فقط إن كانت isAdminMode true
  ========================== */

  function exportAdminGames() {
    const data = localStorage.getItem('adminGames') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adminGames.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importAdminGamesFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) throw new Error('JSON must be an array');
        localStorage.setItem('adminGames', JSON.stringify(parsed));
        alert('تم استيراد الألعاب بنجاح. حدث الصفحة ليظهر المحتوى.');
        // إعادة رسم
        try { renderGames(); renderPagination(); } catch (e) {}
      } catch (err) {
        alert('فشل استيراد الملف: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  if (exportBtn) exportBtn.addEventListener('click', exportAdminGames);
  if (importBtn) importBtn.addEventListener('click', () => importFile.click());
  if (importFile) importFile.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (f) importAdminGamesFile(f);
  });

  // حذف لعبة من admin (index من admin array)
  function removeAdminGame(index) {
    const arr = readAdminGames();
    if (index < 0 || index >= arr.length) return;
    if (!confirm('هل تريد ��ذف هذه اللعبة؟')) return;
    arr.splice(index, 1);
    saveAdminGames(arr);
    renderGames();
    renderPagination();
  }

  // دالة تعديل بسيطة: توجيه إلى صفحة الادمن (يمكن تعديل لتفتح مودال)
  function editAdminGame(index) {
    // في مشروعك القديم قد تكون هناك نافذة تعديل؛ هنا نعيد توجيه للصفحة الرئيسية مع admin=true
    // أو يمكنك فتح modal تعديل حسب هيكل مشروعك
    location.href = `index.html?admin=true&edit=${index}`;
  }

  // تفويض مستمع للأزرار الديناميكية داخل gamesGrid (تفادى duplicate handlers)
  gamesGrid && gamesGrid.addEventListener('click', (ev) => {
    const target = ev.target;
    if (target.matches('.admin-actions .edit') || target.matches('button.edit')) {
      ev.stopPropagation();
      const idx = parseInt(target.getAttribute('data-idx'), 10);
      if (!Number.isNaN(idx)) editAdminGame(idx);
    }
    if (target.matches('.admin-actions .del') || target.matches('button.del')) {
      ev.stopPropagation();
      const idx = parseInt(target.getAttribute('data-idx'), 10);
      if (!Number.isNaN(idx)) removeAdminGame(idx);
    }
  });

  /* =========================
     Sidebar categories binding (placeholder)
  ========================== */
  function bindSidebarCategories() {
    // إن كان لديك قائمة فئات، اربطها هنا. مثال افتراضي:
    const cats = document.querySelectorAll('.category-item');
    cats.forEach(c => {
      c.addEventListener('click', (e) => {
        const cat = c.getAttribute('data-cat');
        currentCategory = cat || 'all';
        currentPage = 1;
        renderGames();
        renderPagination();
      });
    });
  }

  bindSidebarCategories();

  /* =========================
     Search handling
  ========================== */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target.value || '').toLowerCase();
      currentPage = 1;
      renderGames();
      renderPagination();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      currentPage = 1;
      renderGames();
      renderPagination();
    });
  }

  /* =========================
     Adjust admin UI visibility based on isAdminMode
  ========================== */
  if (!isAdminMode) {
    // اخفِ عناصر الادمن إن لم يكن admin=true
    if (adminBtn) adminBtn.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';
  } else {
    // إظهار لوحة الأدمن إذا كان admin=true
    if (adminPanel) adminPanel.style.display = '';
    // adminBtn يمكن أن يفتح/يغلق لوحة الأدمن
    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        if (!adminPanel) return;
        const isOpen = adminPanel.style.display !== 'none';
        adminPanel.style.display = isOpen ? 'none' : '';
      });
    }
  }

  /* =========================
     Initialization: load shared then render
  ========================== */
  (async function init() {
    await fetchSharedGames().catch(() => {});
    try {
      renderGames();
      renderPagination();
    } catch (e) {
      console.warn('Init render failed', e);
    }
  })();

  /* =========================
     Expose some helpers globally if other scripts expect them
  ========================== */
  window.renderGames = renderGames;
  window.renderPagination = renderPagination;
  window.readAdminGames = readAdminGames;
  window.saveAdminGames = saveAdminGames;
  window.fetchSharedGames = fetchSharedGames;

  /* =========================
     End of DOMContentLoaded
  ========================== */
});
