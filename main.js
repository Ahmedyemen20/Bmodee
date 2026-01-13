/* main.js — نسخة كاملة مع إضافة المساعد الذكي (الوصف: "اسم اللعبة Mod Ultimate money 💰")
   لا أغير أي سلوك آخر في الملف، الصق هذا الملف مكان الملف الحالي.
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

  let gamesPerPage = 10;
  let currentPage = 1;
  let currentCategory = "all";
  let searchQuery = "";

  /* =========================
     البيانات
  ========================== */
  let adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];

  const baseGames = [
    {
      name: "Hay Day",
      img: "/unnamed (2).jpg",
      desc: "Hay Day Mod APK Unlimited Money",
      category: "strategy",
      versions: [{ v: "1.0", size: "150 MB", link: "#" }]
    }
  ];

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
      const flickr = `https://loremflickr.com/640/360/${encodeURIComponent(name)}`;
      const res2 = await tryLoadImage(flickr);
      if (res2.ok) return res2.url;
    } catch (_) {}
    return "/no-image.png";
  }

  /* =========================
     تفعيل أزرار الأدمن والمساعد الذكي
     شرط الظهور: ?admin=true أو localStorage.isAdmin === 'true'
  ========================== */
  if (adminBtn) adminBtn.style.display = "none";
  if (smartBtn) smartBtn.style.display = "none";

  const isAdmin = location.search.includes("admin=true") || localStorage.getItem("isAdmin") === "true";

  if (isAdmin) {
    if (adminBtn) {
      adminBtn.style.display = "flex";
      adminBtn.addEventListener('click', (e) => {
        // تجاهل النقر على زر المساعد الذكي الداخلي
        if (e.target && (e.target.id === 'smartBtn' || e.target.closest && e.target.closest('#smartBtn'))) return;
        if (adminPanel) {
          adminPanel.style.display = "flex";
          renderAdminPanelForNew();
        }
      });
    }

    if (smartBtn) {
      smartBtn.style.display = "inline-flex";
      smartBtn.style.zIndex = '100005';
      smartBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          if (typeof smartAddGame === 'function') await smartAddGame();
        } catch (err) {
          alert('حدث خطأ عند تشغيل المساعد الذكي. افتح Console للمزيد.');
        }
      });
    }
  }

  window.closeAdmin = () => {
    if (adminPanel) adminPanel.style.display = "none";
    renderGames();
    renderPagination();
  };

  /* =========================
     البحث (search)
  ========================== */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target.value || "").trim().toLowerCase();
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
     دمج وتصفيه الألعاب
  ========================== */
  function getAllGames() {
    return [...baseGames, ...adminGames];
  }

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
     عرض الألعاب
  ========================== */
  function renderGames() {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = "";

    const games = getFilteredGames();
    const start = (currentPage - 1) * gamesPerPage;
    const slice = games.slice(start, start + gamesPerPage);

    slice.forEach(game => {
      const index = adminGames.findIndex(g => g.name === game.name && g.versions && JSON.stringify(g.versions) === JSON.stringify(game.versions));
      const isAdminGame = index !== -1;

      const card = document.createElement("div");
      card.className = "game-card";
      card.onclick = () => {
        location.href = `game.html?name=${encodeURIComponent(game.name)}${isAdmin ? "&admin=true" : ""}`;
      };

      card.innerHTML = `
        <img src="${game.img}" onerror="this.src='/no-image.png'">
        <h3>${game.name}</h3>
        <p>${game.desc || ""}</p>
        <p><a class="source-link" href="${getPlayStoreSearchLink(game.name)}" target="_blank" rel="noopener">مصدر (Google Play)</a></p>
        ${isAdmin && isAdminGame ? `
          <div class="admin-actions" onclick="event.stopPropagation()">
            <button onclick="editGame(${index})" class="edit">✏️</button>
            <button onclick="removeGame(${index})" class="del">🗑</button>
          </div>
        ` : ``}
      `;
      gamesGrid.appendChild(card);
    });

    if (games.length === 0) {
      gamesGrid.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px">لا توجد ألعاب مطابقة</div>`;
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
     ربط أقسام الشريط الجانبي
     يدعم data-category وأيضًا الروابط التي تستدعي renderByCategory مباشرة
  ========================== */
  function bindSidebarCategories() {
    if (!sidebar) return;
    // أزرار data-category
    const catButtons = sidebar.querySelectorAll('[data-category]');
    catButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = btn.dataset.category || "all";
        window.renderByCategory(cat);
      });
    });
    // روابط <a href="?category=...">
    const catLinks = sidebar.querySelectorAll('a[href*="category="]');
    catLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const u = new URL(a.href, location.href);
        const cat = u.searchParams.get('category') || "all";
        window.renderByCategory(cat);
      });
    });
  }

  /* =========================
     وظائف قابلة للاستدعاء من HTML
  ========================== */
  window.renderByCategory = cat => {
    currentCategory = cat || "all";
    currentPage = 1;
    // افراغ البحث عند تغيير القسم (اختياري)
    searchQuery = "";
    if (searchInput) searchInput.value = "";
    renderGames();
    renderPagination();
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  };

  window.renderAll = () => window.renderByCategory("all");

  /* =========================
     إدارة الإصدارات داخل لوحة الأدمن
  ========================== */
  let editingIndex = null;
  window.tempVersions = window.tempVersions || []; // نجعلها متاحة عالمياً لأن saveGame قد يعتمد عليها

  function renderVersionsInPanel() {
    if (!versionsDiv) return;
    versionsDiv.innerHTML = "";
    window.tempVersions.forEach((v, i) => {
      const div = document.createElement("div");
      div.className = "admin-version";
      div.innerHTML = `
        <input placeholder="الإصدار" value="${v.v || ''}" data-i="${i}" class="ver-v">
        <input placeholder="الحجم" value="${v.size || ''}" data-i="${i}" class="ver-size">
        <input placeholder="رابط التحميل" value="${v.link || ''}" data-i="${i}" class="ver-link">
        <button class="del" data-i="${i}">حذف</button>
      `;
      versionsDiv.appendChild(div);
    });

    // ربط الحقول بالأحداث
    versionsDiv.querySelectorAll(".ver-v").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions[i].v = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".ver-size").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions[i].size = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".ver-link").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions[i].link = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".del").forEach(btn => {
      btn.onclick = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions.splice(i, 1);
        renderVersionsInPanel();
      };
    });
  }

  window.addVersionPrompt = () => {
    window.tempVersions.push({ v: "", size: "", link: "" });
    renderVersionsInPanel();
  };

  window.removeVersionFromPanel = (i) => {
    window.tempVersions.splice(i, 1);
    renderVersionsInPanel();
  };

  function renderAdminPanelForNew() {
    editingIndex = null;
    window.tempVersions = [];
    if (aName) aName.value = "";
    if (aImg) aImg.value = "";
    if (aDesc) aDesc.value = "";
    if (aCategory) aCategory.value = "";
    renderVersionsInPanel();
  }

  window.saveGame = () => {
    const name = aName ? aName.value.trim() : "";
    const img = aImg ? aImg.value.trim() : "";
    const desc = aDesc ? aDesc.value.trim() : "";
    const category = aCategory ? aCategory.value : "";

    if (!name) {
      alert("الرجاء إدخال اسم اللعبة");
      return;
    }

    if (window.tempVersions.length === 0) {
      window.tempVersions.push({ v: "1.0", size: "", link: "#" });
    }

    const gameObj = { name, img: img || "/no-image.png", desc, category, versions: window.tempVersions.map(v => ({ v: v.v, size: v.size, link: v.link })) };

    if (editingIndex === null) {
      adminGames.push(gameObj);
    } else {
      adminGames[editingIndex] = gameObj;
    }

    localStorage.setItem("adminGames", JSON.stringify(adminGames));
    alert("تم الحفظ بنجاح");
    window.closeAdmin();
    renderGames();
    renderPagination();
  };

  window.editGame = (index) => {
    const g = adminGames[index];
    if (!g) {
      alert("اللعبة غير موجودة في إضافات الأدمن");
      return;
    }
    editingIndex = index;
    if (aName) aName.value = g.name || "";
    if (aImg) aImg.value = g.img || "";
    if (aDesc) aDesc.value = g.desc || "";
    if (aCategory) aCategory.value = g.category || "";
    window.tempVersions = g.versions ? g.versions.map(v => ({ v: v.v, size: v.size, link: v.link })) : [];
    renderVersionsInPanel();
    if (adminPanel) adminPanel.style.display = "flex";
  };

  window.removeGame = (index) => {
    if (!confirm("هل تريد حذف هذه اللعبة من إضافات الأدمن؟")) return;
    adminGames.splice(index, 1);
    localStorage.setItem("adminGames", JSON.stringify(adminGames));
    renderGames();
    renderPagination();
  };

  /* =========================
     المساعد الذكي (smartAddGame)
     السلوك المعدل: الوصف = "اسم اللعبة Mod Ultimate money 💰"
  ========================== */
  async function smartAddGame() {
    const name = prompt("اسم اللعبة (الإضافة الذكي) - اكتب اسم اللعبة:");
    if (!name) return;

    // جلب صورة مناسبة تلقائياً
    const imgUrl = await fetchImageForName(name);

    // املأ الحقول في لوحة الأدمن وافتحها للمراجعة قبل الحفظ
    editingIndex = null;
    window.tempVersions = [{ v: "1.0", size: "", link: "#" }];
    if (aName) aName.value = name;
    if (aImg) aImg.value = imgUrl || "/no-image.png";

    // الوصف المطلوب: اسم اللعبة + " Mod Ultimate money 💰"
    if (aDesc) aDesc.value = `${name} Mod Ultimate money 💰`;

    if (aCategory && aCategory.options.length) {
      aCategory.value = aCategory.options[1]?.value || "";
    }
    renderVersionsInPanel();

    if (adminPanel) adminPanel.style.display = "flex";

    alert("تم جلب صورة تلقائيًا. راجع الحقول ثم اضغط حفظ.");
  }
  window.smartAddGame = smartAddGame;

  /* =========================
     ربط الأقسام وتهيئة عند التحميل
  ========================== */
  bindSidebarCategories();

  // قراءة category من الـ URL عند التحميل (مثال: index.html?category=action)
  const urlParams = new URLSearchParams(location.search);
  const initialCategory = urlParams.get('category');
  if (initialCategory) {
    window.renderByCategory(initialCategory);
  }

  /* =========================
     تهيئة أولية
  ========================== */
  (function init() {
    renderGames();
    renderPagination();
  })();

// Export / Import adminGames (ضع داخل DOMContentLoaded)
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

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
      // إعادة تحميل أو إعادة رسم الألعاب:
      adminGames = parsed; // if adminGames variable is in scope
      renderGames();
      renderPagination();
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

// مثال: تحميل ملف JSON مركزي ودمجه مع adminGames
const SHARED_JSON_URL = 'https://raw.githubusercontent.com/Ahmedyemen20/Bmodee/main/shared-games.json';

async function fetchSharedGames() {
  try {
    const res = await fetch(SHARED_JSON_URL);
    if (!res.ok) return;
    const shared = await res.json();
    if (!Array.isArray(shared)) return;
    // ادمج: ضع shared قبل adminGames حتى تظهر الألعاب المشتركة أولاً
    adminGames = [...shared, ...JSON.parse(localStorage.getItem('adminGames') || '[]')];
    renderGames();
    renderPagination();
  } catch (err) {
    console.warn('fetchSharedGames error', err);
  }
}

// استدعاء أثناء تهيئة التطبيق
fetchSharedGames();

});
