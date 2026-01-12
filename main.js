/* main.js — متحسّن، يتضمن زر المساعد الذكي (AI-fill) داخل لوحة الأدمن */
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     الهامبرقر
  ========================== */
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (hamburger && sidebar && overlay) {
    hamburger.onclick = () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
    };
    overlay.onclick = () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
    };
  }

  /* =========================
     عناصر البحث والعرض والـ DOM
  ========================== */
  const searchInput = document.getElementById("searchInput");
  const gamesGrid = document.getElementById("gamesGrid");
  const pagination = document.getElementById("pagination");

  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const smartBtn = document.getElementById("smartBtn");
  const aiFillBtn = document.getElementById("aiFillBtn");

  const aName = document.getElementById("aName");
  const aImg = document.getElementById("aImg");
  const aDesc = document.getElementById("aDesc");
  const aCategory = document.getElementById("aCategory");
  const versionsDiv = document.getElementById("versions");

  let gamesPerPage = 10;
  let currentPage = 1;
  let currentCategory = "all";
  let searchQuery = "";
  let searchTimeout = null;

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
     أدوات الأدمن — إظهار/إخفاء الأزرار
  ========================== */
  if (adminBtn) adminBtn.style.display = "none";
  if (smartBtn) smartBtn.style.display = "none";

  const isAdmin = location.search.includes("admin=true") || localStorage.getItem("isAdmin") === "true";

  if (isAdmin) {
    if (adminBtn) {
      adminBtn.style.display = "block";
      adminBtn.onclick = () => {
        if (adminPanel) adminPanel.style.display = "flex";
        renderAdminPanelForNew();
      };
    }
    if (smartBtn) {
      smartBtn.style.display = "block";
      smartBtn.onclick = smartAddGame;
    }
  }

  window.closeAdmin = () => {
    if (adminPanel) adminPanel.style.display = "none";
    renderGames();
    renderPagination();
  };

  /* =========================
     دوال جلب وتصفيه الألعاب (تدعم البحث + الأقسام)
  ========================== */
  function getAllGames() {
    return [...baseGames, ...adminGames];
  }

  function getFilteredGames() {
    let list = getAllGames();
    if (currentCategory && currentCategory !== "all") {
      list = list.filter(g => g.category === currentCategory);
    }
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(g =>
        (g.name && g.name.toLowerCase().includes(q)) ||
        (g.desc && g.desc.toLowerCase().includes(q))
      );
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
      const index = adminGames.findIndex(g => g.name === game.name && JSON.stringify(g.versions) === JSON.stringify(game.versions));
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
      const msg = document.createElement("div");
      msg.className = "no-results";
      msg.textContent = "لا توجد نتائج للبحث.";
      gamesGrid.appendChild(msg);
    }
  }

  /* =========================
     Pagination
  ========================== */
  function renderPagination() {
    if (!pagination) return;
    pagination.innerHTML = "";
    const total = Math.max(1, getFilteredGames().length);
    const pages = Math.max(1, Math.ceil(total / gamesPerPage));

    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.onclick = () => {
        currentPage = i;
        renderGames();
        renderPagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      pagination.appendChild(btn);
    }
  }

  /* =========================
     التعامل مع البحث (debounce)
  ========================== */
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value || "";
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = val.trim();
        currentPage = 1;
        renderGames();
        renderPagination();
      }, 200);
    });
  }

  /* =========================
     الأقسام
  ========================== */
  window.renderByCategory = cat => {
    currentCategory = cat;
    currentPage = 1;
    renderGames();
    renderPagination();
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  };

  window.renderAll = () => renderByCategory("all");

  /* =========================
     إدارة الإصدارات داخل لوحة الأدمن
  ========================== */
  let editingIndex = null;
  let tempVersions = [];

  function renderVersionsInPanel() {
    if (!versionsDiv) return;
    versionsDiv.innerHTML = "";
    tempVersions.forEach((v, i) => {
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

    // الأحداث
    versionsDiv.querySelectorAll(".ver-v").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        tempVersions[i].v = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".ver-size").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        tempVersions[i].size = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".ver-link").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        tempVersions[i].link = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".del").forEach(btn => {
      btn.onclick = (e) => {
        const i = Number(e.target.dataset.i);
        tempVersions.splice(i, 1);
        renderVersionsInPanel();
      };
    });
  }

  window.addVersionPrompt = () => {
    tempVersions.push({ v: "", size: "", link: "" });
    renderVersionsInPanel();
  };

  window.removeVersionFromPanel = (i) => {
    tempVersions.splice(i, 1);
    renderVersionsInPanel();
  };

  function renderAdminPanelForNew() {
    editingIndex = null;
    tempVersions = [];
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

    if (tempVersions.length === 0) {
      tempVersions.push({ v: "1.0", size: "", link: "#" });
    }

    const gameObj = { name, img: img || "/no-image.png", desc, category, versions: tempVersions.map(v => ({ v: v.v, size: v.size, link: v.link })) };

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

  /* تحرير وحذف مرتبطان بالـ window لأن HTML يستخدم onclick داخلي */
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
    tempVersions = g.versions ? g.versions.map(v => ({ v: v.v, size: v.size, link: v.link })) : [];
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
     إضافة ذكية بسيطة (زر عالمي)
  ========================== */
  function smartAddGame() {
    const name = prompt("اسم اللعبة (إضافة ذكية)");
    if (!name) return;
    const newGame = {
      name,
      img: "/no-image.png",
      desc: "تمت الإضافة بواسطة الإضافة الذكية",
      category: "action",
      versions: [{ v: "1.0", size: "", link: "#" }]
    };
    adminGames.push(newGame);
    localStorage.setItem("adminGames", JSON.stringify(adminGames));
    alert("تمت الإضافة بنجاح");
    renderGames();
    renderPagination();
  }
  window.smartAddGame = smartAddGame;

  /* =========================
     المساعد الذكي داخل لوحة الأدمن (AI-fill)
     1) يبحث محلياً أولاً
     2) إذا لم يجد يجرب جلب من ويكيبيديا عبر AllOrigins
     (يحتاج اتصال إنترنت — قد يفشل عند CORS أو انقطاع)
  ========================== */
  async function aiFillHandler() {
    if (!aName) { alert("حقل اسم اللعبة غير موجود"); return; }
    const name = aName.value.trim();
    if (!name) { alert("اكتب اسم اللعبة أولاً"); return; }

    if (!aiFillBtn) return;
    aiFillBtn.disabled = true;
    const origText = aiFillBtn.textContent;
    aiFillBtn.textContent = "جا��ي البحث...";

    try {
      // 1) بحث محلي
      const local = getAllGames().find(g => g.name.toLowerCase() === name.toLowerCase() || g.name.toLowerCase().includes(name.toLowerCase()));
      if (local) {
        if (aImg) aImg.value = local.img || "/no-image.png";
        if (aDesc) aDesc.value = local.desc || "";
        alert("تمت التعبئة من قاعدة البيانات المحلية.");
        return;
      }

      // 2) جلب من ويكيبيديا عبر AllOrigins (CORS proxy)
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/\s+/g, "_"))}`;
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(wikiUrl)}`;
      const res = await fetch(proxy);
      if (!res.ok) throw new Error("فشل جلب الصفحة");

      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // صورة (meta og:image)
      const og = doc.querySelector('meta[property="og:image"], meta[name="og:image"]');
      const image = og ? (og.getAttribute("content") || og.content) : "";

      // وصف: أول فقرة ذات نص معقول داخل محتوى ويكيبيديا
      let desc = "";
      const content = doc.querySelector('#mw-content-text');
      if (content) {
        const p = content.querySelector('p');
        if (p) desc = p.textContent || "";
      }
      if (!desc) {
        const p2 = doc.querySelector('p');
        if (p2) desc = p2.textContent || "";
      }
      // إزالة الاقتباسات [1], [2] الخ.
      desc = desc.replace(/\[[^\]]+\]/g, "").trim();

      if (image && aImg) aImg.value = image;
      if (desc && aDesc) aDesc.value = desc.slice(0, 800); // حدود الوصف

      if (!image && !desc) {
        alert("لم أجد تفاصيل على ويكيبيديا. حاول تعبئة يدوياً أو تحقق من اسم اللعبة.");
      } else {
        alert("تمت التعبئة بنجاح (مصدر: ويكيبيديا إذا لم يكن محلياً).");
      }
    } catch (err) {
      console.error(err);
      alert("فشل جلب المعلومات التلقائية. تأكد من اتصال الإنترنت أو عبّي التفاصيل يدوياً.");
    } finally {
      aiFillBtn.disabled = false;
      aiFillBtn.textContent = origText;
    }
  }

  if (aiFillBtn) aiFillBtn.addEventListener("click", aiFillHandler);
  window.aiFillHandler = aiFillHandler;

  /* =========================
     تهيئة أولية
  ========================== */
  (function init() {
    if (searchInput && location.search) {
      const params = new URLSearchParams(location.search);
      const q = params.get("q");
      if (q) {
        searchQuery = q;
        searchInput.value = q;
      }
    }
    renderGames();
    renderPagination();
  })();

});
