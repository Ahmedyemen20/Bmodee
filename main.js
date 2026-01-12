/* main.js — جاهز للنسخ
   يعالج عرض الألعاب، الصفحات، وأدوات الأدمن (زر الأدمن والزر الذكي).
   العربية في التعليقات لتسهيل التعديل.
*/

/* =========================
   إعداد العناصر والمتغيرات
========================= */
const gamesGrid = document.getElementById("gamesGrid");
const pagination = document.getElementById("pagination");
const sidebar = document.getElementById("sidebar") || { classList: { remove() {} } };
const overlay = document.getElementById("overlay") || { classList: { remove() {} } };

let gamesPerPage = 6;
let currentPage = 1;
let currentCategory = "all";

/* =========================
   بيانات الألعاب الأساسية وبيانات الأدمن المحفوظة
========================= */
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
   حالات الأدمن (من URL أو من localStorage)
   لتفعيل كأدمن: افتح index.html?admin=true
   أو نفذ localStorage.setItem('isAdmin','true')
========================= */
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const smartBtn = document.getElementById("smartBtn");

if (adminBtn) adminBtn.style.display = "none";
if (smartBtn) smartBtn.style.display = "none";

const isAdmin = location.search.includes("admin=true") || localStorage.getItem("isAdmin") === "true";

if (isAdmin) {
  if (adminBtn) {
    adminBtn.style.display = "block";
    adminBtn.onclick = () => {
      if (adminPanel) adminPanel.style.display = "flex";
      renderAdminPanelForNew(); // تفريغ الحقول عند فتح جديد
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
   دوال جلب الألعاب وتصفيتها
========================= */
function getAllGames() {
  return [...baseGames, ...adminGames];
}

function getFilteredGames() {
  if (currentCategory === "all") return getAllGames();
  return getAllGames().filter(g => g.category === currentCategory);
}

/* =========================
   عرض الألعاب (شبكة البطاقات)
========================= */
function renderGames() {
  if (!gamesGrid) return;
  gamesGrid.innerHTML = "";

  const games = getFilteredGames();
  const start = (currentPage - 1) * gamesPerPage;
  const slice = games.slice(start, start + gamesPerPage);

  slice.forEach(game => {
    const index = adminGames.indexOf(game);
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
}

/* =========================
   ترقيم الصفحات
========================= */
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
   تغيير القسم
========================= */
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
   وظائف الأدمن: إضافة / تعديل / حذف
   لوحة الأدمن في index.html تحتوي الحقول:
   #aName, #aImg, #aDesc, #aCategory, #versions
========================= */
const aName = document.getElementById("aName");
const aImg = document.getElementById("aImg");
const aDesc = document.getElementById("aDesc");
const aCategory = document.getElementById("aCategory");
const versionsDiv = document.getElementById("versions");

let editingIndex = null; // index في adminGames عند التحرير، null عند إضافة جديدة
let tempVersions = []; // إصدارات مؤقتة أثناء تحرير/إضافة اللعبة

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
      <button class="del" onclick="removeVersionFromPanel(${i})">حذف</button>
    `;
    versionsDiv.appendChild(div);
  });

  // استماع للتغييرات في الحقول المولدة
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

/* حفظ اللعبة (جديدة أو تحرير) */
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
    // نضيف إصدار افتراضي إن لم يحدد المستخدم
    tempVersions.push({ v: "1.0", size: "", link: "#" });
  }

  const gameObj = { name, img: img || "/no-image.png", desc, category, versions: tempVersions.map(v => ({ v: v.v, size: v.size, link: v.link })) };

  if (editingIndex === null) {
    // إضافة جديدة
    adminGames.push(gameObj);
  } else {
    // تحديث
    adminGames[editingIndex] = gameObj;
  }

  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  alert("تم الحفظ بنجاح");
  window.closeAdmin();
  renderGames();
  renderPagination();
};

/* تحرير لعبة من adminGames بواسطة index */
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

/* حذف لعبة من adminGames بواسطة index */
window.removeGame = (index) => {
  if (!confirm("هل تريد حذف هذه اللعبة من إضافات الأدمن؟")) return;
  adminGames.splice(index, 1);
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  renderGames();
  renderPagination();
};

/* =========================
   زر الإضافة الذكية — مثال بسيط
   يمكن توسيعها لاحقاً لإضافة معلومات أو استيراد من مكان آخر
========================= */
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

/* =========================
   تهيئة أولية
========================= */
(function init() {
  renderGames();
  renderPagination();
})();
