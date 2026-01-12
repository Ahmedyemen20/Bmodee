/* main.js — جاهز للنسخ
   يعالج عرض الألعاب، الهامبرقر، لوحة الأدمن، والإضافة الذكية مع جلب صورة تلقائيًا.
   التعليقات بالعربية لتسهيل المتابعة.
*/

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
     الإعدادات والـ DOM عناصر
  ========================== */
  const gamesGrid = document.getElementById("gamesGrid");
  const pagination = document.getElementById("pagination");

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
     دالة تولّد رابط Google Play بحث بالاسم
  ========================== */
  function getPlayStoreSearchLink(name) {
    return `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`;
  }

  /* =========================
     دالة لجلب صورة مناسبة من الإنترنت بحسب اسم اللعبة
     تستخدم مصادر بدون حاجة لمفتاح API: Unsplash Source أو LoremFlickr كاحتياط.
     تعيد رابط صورة صالح بعد تجربة التحميل.
  ========================== */
  function tryLoadImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ ok: true, url });
      img.onerror = () => resolve({ ok: false });
      // عند بعض المصادر قد يمنع CORS تحميل الصورة في بعض البيئات، لكن عادة تعمل للعرض
      img.src = url;
    });
  }

  async function fetchImageForName(name) {
    if (!name) return "/no-image.png";

    // محاولة 1: Unsplash Source (صورة ذات علاقة بالكلمة المفتاحية)
    const unsplash = `https://source.unsplash.com/640x360/?${encodeURIComponent(name)},game`;
    const res1 = await tryLoadImage(unsplash);
    if (res1.ok) return res1.url;

    // محاولة 2: LoremFlickr (كبديل)
    const flickr = `https://loremflickr.com/640/360/${encodeURIComponent(name)}`;
    const res2 = await tryLoadImage(flickr);
    if (res2.ok) return res2.url;

    // محاولة 3: صورة افتراضية محلية
    return "/no-image.png";
  }

  /* =========================
     أدوات الأدمن — إظهار/إخفاء الأزرار
     يعتمد على ?admin=true أو localStorage.isAdmin
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
      smartBtn.onclick = () => window.smartAddGame && window.smartAddGame();
    }
  }

  window.closeAdmin = () => {
    if (adminPanel) adminPanel.style.display = "none";
    renderGames();
    renderPagination();
  };

  /* =========================
     دوال جلب وتصفيه الألعاب
  ========================== */
  function getAllGames() {
    return [...baseGames, ...adminGames];
  }

  function getFilteredGames() {
    if (currentCategory === "all") return getAllGames();
    return getAllGames().filter(g => g.category === currentCategory);
  }

  /* =========================
     عرض الألعاب
     أضفنا رابط "مصدر (Google Play)" في البطاقة
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
        <p>
          <a class="source-link" href="${getPlayStoreSearchLink(game.name)}" target="_blank" rel="noopener">
            مصدر (Google Play)
          </a>
        </p>
        ${isAdmin && isAdminGame ? `
          <div class="admin-actions" onclick="event.stopPropagation()">
            <button onclick="editGame(${index})" class="edit">✏️</button>
            <button onclick="removeGame(${index})" class="del">🗑</button>
          </div>
        ` : ``}
      `;

      gamesGrid.appendChild(card);
    });
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

  /* تحرير وحذف مرتبطة بالـ window لأن HTML يستخدم onclick داخلي */
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
     إضافة ذكية مُحسّنة: تبحث عن صورة تلقائياً
     سلوك: تطلب اسم اللعبة، تجلب صورة تلقائياً ثم تفتح لوحة الأدمن مع تعبئة الحقول
     (حتى تتأكد قبل الحفظ).
  ========================== */
  async function smartAddGame() {
    const name = prompt("اسم اللعبة (الإضافة الذكية) - اكتب اسم اللعبة:");
    if (!name) return;

    // حاول جلب صورة مناسبة
    const imgUrl = await fetchImageForName(name);

    // املأ الحقول في لوحة الأدمن وافتحها للمراجعة
    editingIndex = null;
    tempVersions = [{ v: "1.0", size: "", link: "#" }];
    if (aName) aName.value = name;
    if (aImg) aImg.value = imgUrl;
    if (aDesc) aDesc.value = "تمت الإضافة بواسطة الإضافة الذكية";
    if (aCategory) aCategory.value = "action";
    renderVersionsInPanel();

    if (adminPanel) adminPanel.style.display = "flex";

    // إخطار المستخدم أن الصورة تمت إضافتها تلقائياً
    alert("تم جلب صورة تلقائيًا. راجع الحقول ثم اضغط حفظ.");
  }
  window.smartAddGame = smartAddGame;

  /* =========================
     تهيئة أولية
  ========================== */
  (function init() {
    renderGames();
    renderPagination();
  })();

});
