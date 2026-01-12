document.addEventListener("DOMContentLoaded", () => {

/* =========================
   الهامبرقر
========================= */
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
   الإعدادات
========================= */
const gamesPerPage = 10;
let currentPage = 1;
let currentCategory = "all";

const gamesGrid = document.getElementById("gamesGrid");
const pagination = document.getElementById("pagination");

/* =========================
   البيانات
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
   دمج الألعاب
========================= */
function getAllGames() {
  return [...baseGames, ...adminGames];
}

function getFilteredGames() {
  if (currentCategory === "all") return getAllGames();
  return getAllGames().filter(g => g.category === currentCategory);
}

/* =========================
   عرض الألعاب
========================= */
function renderGames() {
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
      location.href = `game.html?name=${encodeURIComponent(game.name)}`;
    };

    card.innerHTML = `
      <img src="${game.img}" onerror="this.src='/no-image.png'">
      <h3>${game.name}</h3>
      <p>${game.desc || ""}</p>

      ${location.search.includes("admin=true") && isAdminGame ? `
        <div class="admin-actions" onclick="event.stopPropagation()">
          <button onclick="editGame(${index})">✏️</button>
          <button onclick="removeGame(${index})">🗑</button>
        </div>
      ` : ``}
    `;

    gamesGrid.appendChild(card);
  });
}

/* =========================
   Pagination
========================= */
function renderPagination() {
  pagination.innerHTML = "";
  const pages = Math.ceil(getFilteredGames().length / gamesPerPage);

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderGames();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

/* =========================
   الأقسام
========================= */
window.renderByCategory = cat => {
  currentCategory = cat;
  currentPage = 1;
  renderGames();
  renderPagination();
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
};

window.renderAll = () => renderByCategory("all");

/* =========================
   لوحة الأدمن
========================= */
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const smartBtn = document.getElementById("smartBtn");

if (adminBtn) adminBtn.style.display = "none";
if (smartBtn) smartBtn.style.display = "none";

if (location.search.includes("admin=true")) {
  adminBtn.style.display = "block";
  adminBtn.onclick = () => adminPanel.style.display = "flex";

  smartBtn.style.display = "block";
  smartBtn.onclick = smartAddGame;
}

window.closeAdmin = () => adminPanel.style.display = "none";

/* =========================
   عناصر الفورم
========================= */
const aName = document.getElementById("aName");
const aImg = document.getElementById("aImg");
const aDesc = document.getElementById("aDesc");
const aCategory = document.getElementById("aCategory");

/* =========================
   إضافة لعبة عادية
========================= */
window.saveGame = () => {
  if (!aName.value || !aImg.value || !aCategory.value) {
    alert("كمّل البيانات");
    return;
  }

  adminGames.unshift({
    name: aName.value,
    img: aImg.value,
    desc: aDesc.value,
    category: aCategory.value,
    versions: [{ v: "Latest", size: "—", link: "#" }]
  });

  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  location.reload();
};

/* =========================
   الإصدارات
========================= */
window.addVersion = () => {
  const div = document.createElement("div");
  div.className = "version-box";
  div.innerHTML = `
    <input placeholder="الإصدار">
    <input placeholder="الحجم">
    <input placeholder="رابط التحميل">
    <button onclick="this.parentElement.remove()">🗑</button>
  `;
  versionsDiv.appendChild(div);
};

/* =========================
   تعديل / حذف
========================= */
window.editGame = i => {
  const n = prompt("اسم اللعبة", adminGames[i].name);
  if (!n) return;
  adminGames[i].name = n;
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  location.reload();
};

window.removeGame = i => {
  if (!confirm("حذف؟")) return;
  adminGames.splice(i, 1);
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  location.reload();
};

/* =========================
   إضافة ذكية
========================= */
function autoImage(name) {
  return `https://source.unsplash.com/600x400/?${encodeURIComponent(name)} game`;
}

function autoCategory(name) {
  name = name.toLowerCase();
  if (name.includes("clash")) return "strategy";
  if (name.includes("gta") || name.includes("call")) return "action";
  return "other";
}

function smartAddGame() {
  const name = prompt("اسم اللعبة:");
  if (!name) return;

  const img = prompt("رابط الصورة (اختياري):") || autoImage(name);
  const cat = prompt("القسم:", autoCategory(name));

  adminGames.unshift({
    name,
    img,
    desc: `${name} Mod APK`,
    category: cat || "other",
    versions: [{ v: "Latest", size: "—", link: "#" }]
  });

  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  location.reload();
}

/* =========================
   تشغيل أولي
========================= */
renderGames();
renderPagination();

});
