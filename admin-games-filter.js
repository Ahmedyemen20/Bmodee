/**
 * admin-games-filter.js
 *
 * جاهز للنسخ: ضع هذا الملف في مشروعك واستبدل/أضف الاستدعاء المناسب في ملفات HTML/JS.
 * هذا الملف لا يغيّر أي قيمة في localStorage بشكل تلقائي — ما عدا عمليات الحذف التي يقوم بها المستخدم
 * عبر زر الحذف في واجهة الأدمن (هذه العملية تحفظ adminGames بعد حذف عنصر).
 *
 * - يمنع ظهور ألعاب sharedGames في لوحة الأدمن (يعرض adminGames فقط).
 * - يعرض في الواجهة العامة الدمج بين adminGames + sharedGames بدون تكرار (admin يفضّل عند التعارض).
 * - يقوم بتشغيل تلقائي عند تحميل الصفحة (DOMContentLoaded) مع إعدادات افتراضية.
 *
 * ملاحظة: إن كانت أسماء عناصر الحاوية في صفحاتك مختلفة (ليست 'gamesContainer' أو 'adminGamesContainer')
 * غيّر القيم في الأسفل في GameManager.init(...) إلى الـ IDs الصحيحة قبل الاستخدام.
 */

(function (global) {
  const GameManager = {};

  /* ---------- Helpers ---------- */

  function readJSON(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      console.warn('readJSON error for', key, e);
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

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // دمج الألعاب بدون تكرار (نفضل adminGames عند التعارض)
  function mergeGamesPreferAdmin(adminGames, sharedGames) {
    const map = new Map();
    (adminGames || []).forEach(g => {
      const key = (g.name || '').trim().toLowerCase();
      if (key) map.set(key, g);
    });
    (sharedGames || []).forEach(g => {
      const key = (g.name || '').trim().toLowerCase();
      if (!key) return;
      if (!map.has(key)) map.set(key, g);
    });
    return Array.from(map.values());
  }

  /* ---------- Fetch shared games (optional) ---------- */

  async function fetchSharedGames(url) {
    if (!url) return [];
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.warn('fetchSharedGames non-ok response', res.status);
        return [];
      }
      const json = await res.json();
      if (!Array.isArray(json)) {
        console.warn('fetchSharedGames: expected array, got', typeof json);
        return [];
      }
      // store locally so other parts of app can use it if needed
      try { localStorage.setItem('sharedGames', JSON.stringify(json)); } catch (e) {}
      return json;
    } catch (e) {
      console.warn('fetchSharedGames error', e);
      return [];
    }
  }

  /* ---------- Rendering functions ---------- */

  // Render public (merged) games into container element (DOM element or id)
  function renderPublicGames(container, options = {}) {
    const containerEl = typeof container === 'string' ? document.getElementById(container) : container;
    if (!containerEl) return;

    const adminGames = readJSON('adminGames');
    const sharedGames = readJSON('sharedGames');
    const games = mergeGamesPreferAdmin(adminGames, sharedGames);

    containerEl.innerHTML = '';

    if (!games.length) {
      const msg = document.createElement('div');
      msg.className = 'no-games';
      msg.textContent = options.emptyText || 'لا توجد ألعاب متاحة.';
      containerEl.appendChild(msg);
      return;
    }

    games.forEach(g => {
      const card = document.createElement('div');
      card.className = options.cardClass || 'game-card';
      // Minimal safe markup; project CSS can style these classes
      card.innerHTML = `
        <div class="game-thumb"><img src="${escapeHtml(g.img || '/no-image.png')}" alt="${escapeHtml(g.name || '')}"></div>
        <div class="game-body">
          <h3 class="game-name">${escapeHtml(g.name || '')}</h3>
          <p class="game-desc">${escapeHtml(g.desc || '')}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        try { sessionStorage.setItem('selectedGame', JSON.stringify(g)); } catch (e) {}
        // Navigate to game details preserving original behavior
        location.href = `game.html?name=${encodeURIComponent(g.name || '')}`;
      });
      containerEl.appendChild(card);
    });
  }

  // Render only adminGames for admin page (no sharedGames)
  function renderAdminGames(container, options = {}) {
    const containerEl = typeof container === 'string' ? document.getElementById(container) : container;
    if (!containerEl) return;

    const adminGames = readJSON('adminGames');

    containerEl.innerHTML = '';

    if (!adminGames.length) {
      const msg = document.createElement('div');
      msg.className = 'no-games';
      msg.textContent = options.emptyText || 'لا توجد ألعاب في لوحة الأدمن.';
      containerEl.appendChild(msg);
      return;
    }

    adminGames.forEach((g, idx) => {
      // Keep structure non-destructive so your existing admin UI can be preserved
      const row = document.createElement('div');
      row.className = options.rowClass || 'admin-game-row';
      row.innerHTML = `
        <div class="admin-game-info">
          <div class="admin-game-title">${escapeHtml(g.name || '')}</div>
          <div class="admin-game-desc">${escapeHtml(g.desc || '')}</div>
        </div>
        <div class="admin-game-actions">
          <button class="admin-edit-btn" data-idx="${idx}">تعديل</button>
          <button class="admin-del-btn" data-idx="${idx}">حذف</button>
        </div>
      `;

      // Edit button: try to call a callback if provided (so we don't break existing behavior)
      const editBtn = row.querySelector('.admin-edit-btn');
      editBtn.addEventListener('click', () => {
        if (typeof options.onEdit === 'function') {
          try { options.onEdit(idx, g); } catch (e) { console.warn('onEdit callback error', e); }
        } else {
          // fallback: navigate to admin page (non-destructive)
          location.href = 'index.html?admin=true';
        }
      });

      const delBtn = row.querySelector('.admin-del-btn');
      delBtn.addEventListener('click', () => {
        if (!confirm('هل تود حذف هذه اللعبة؟')) return;
        const adminArr = readJSON('adminGames');
        adminArr.splice(idx, 1);
        saveAdminGames(adminArr);
        // re-render admin area
        renderAdminGames(containerEl, options);
      });

      containerEl.appendChild(row);
    });
  }

  /* ---------- Public API & init ---------- */

  /**
   * Init GameManager: optionally fetch shared JSON and render containers.
   * options:
   *  - publicContainerId: id or element for public games
   *  - adminContainerId: id or element for admin games
   *  - sharedJsonUrl: optional URL to fetch sharedGames (will save to localStorage.sharedGames)
   *  - onEdit: optional callback function(idx, game) used in admin edit button
   *  - renderOptions: optional object passed to render functions (cardClass, rowClass, emptyText)
   */
  GameManager.init = async function (options = {}) {
    const { publicContainerId, adminContainerId, sharedJsonUrl, renderOptions } = options || {};

    if (sharedJsonUrl) {
      // attempt to fetch and cache sharedGames
      await fetchSharedGames(sharedJsonUrl);
    }

    if (publicContainerId) {
      try {
        renderPublicGames(publicContainerId, renderOptions || {});
      } catch (e) {
        console.warn('renderPublicGames failed', e);
      }
    }

    if (adminContainerId) {
      try {
        renderAdminGames(adminContainerId, Object.assign({}, renderOptions || {}, { onEdit: options.onEdit }));
      } catch (e) {
        console.warn('renderAdminGames failed', e);
      }
    }
  };

  // Allow manual refresh (useful after admin changes)
  GameManager.refreshPublic = function (publicContainerId, renderOptions) {
    try {
      renderPublicGames(publicContainerId, renderOptions || {});
    } catch (e) {
      console.warn('refreshPublic failed', e);
    }
  };

  GameManager.refreshAdmin = function (adminContainerId, renderOptions) {
    try {
      renderAdminGames(adminContainerId, renderOptions || {});
    } catch (e) {
      console.warn('refreshAdmin failed', e);
    }
  };

  // Expose utilities if needed
  GameManager.mergeGamesPreferAdmin = mergeGamesPreferAdmin;
  GameManager.readJSON = readJSON;
  GameManager.saveAdminGames = saveAdminGames;
  GameManager.fetchSharedGames = fetchSharedGames;

  // attach to global
  global.GameManager = GameManager;

})(window);


/* --------------------------
   Automatic initialization
   --------------------------
   This code runs on DOMContentLoaded and initializes GameManager with safe defaults.
   - If your page uses different container IDs, change the IDs below.
   - If you want to fetch sharedGames from a URL, uncomment sharedJsonUrl and set the URL.
   - onEdit tries to call existing global edit handlers if present, otherwise redirects to admin page.
*/

document.addEventListener('DOMContentLoaded', function () {
  try {
    GameManager.init({
      publicContainerId: 'gamesContainer',         // <-- غيّر هذا إذا كان id الحاوية العامة مختلفاً
      adminContainerId: 'adminGamesContainer',     // <-- غيّر هذا إذا كان id لوحة الأدمن مختلفاً
      // sharedJsonUrl: 'https://raw.githubusercontent.com/USER/REPO/main/shared-games.json', // اختياري: ضع رابط JSON مشترك هنا إن رغبت
      renderOptions: {
        emptyText: 'لا توجد ألعاب لعرضها'
      },
      onEdit: function (idx, game) {
        // حاول استدعاء دوال التحرير الموجودة مسبقاً إن وجدت (لاتغيّر سلوكك الحالي)
        if (typeof window.openEditModal === 'function') {
          try { window.openEditModal(idx, game); return; } catch (e) { console.warn(e); }
        }
        if (typeof window.editGame === 'function') {
          try { window.editGame(idx, game); return; } catch (e) { console.warn(e); }
        }
        // fallback: اذهب إلى صفحة الأدمن (آمن وغير مدمر)
        location.href = 'index.html?admin=true';
      }
    });
  } catch (e) {
    console.warn('GameManager.init failed', e);
  }
});
