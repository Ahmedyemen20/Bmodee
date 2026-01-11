document.addEventListener("DOMContentLoaded", () => {

/* =========================
   الهامبرقر
========================= */
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (hamburger && sidebar && overlay) {
  hamburger.onclick = () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  };
  overlay.onclick = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  };
}

/* =========================
   إعدادات
========================= */
const gamesPerPage = 10;
let currentPage = 1;
let currentCategory = "all";

const gamesGrid = document.getElementById('gamesGrid');
const pagination = document.getElementById('pagination');

/* =========================
   البيانات
========================= */
let adminGames = JSON.parse(localStorage.getItem('adminGames')) || [];

const baseGames = [
  {
    name: "Hay Day",
    img: "/unnamed (2).jpg",
    desc: "Hay Day Mod APK Unlimited Money",
    rating: 4.8,
    category: "strategy",
    versions: [{ v: "1.0", size: "150 MB", link: "#" }]
  }
];

/* =========================
   دمج + ترتيب
========================= */
function getAllGames() {
  return [...baseGames, ...adminGames].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function getFilteredGames() {
  if (currentCategory === "all") return getAllGames();
  return getAllGames().filter(g => g.category === currentCategory);
}

/* =========================
   Pagination
========================= */
function renderPagination() {
  if (!pagination) return;
  pagination.innerHTML = '';

  const games = getFilteredGames();
  const pages = Math.ceil(games.length / gamesPerPage);

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => {
      currentPage = i;
      renderGames();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

/* =========================
   عرض الألعاب
========================= */
function renderGames() {
  if (!gamesGrid) return;
  gamesGrid.innerHTML = '';

  const games = getFilteredGames();
  const start = (currentPage - 1) * gamesPerPage;
  const slice = games.slice(start, start + gamesPerPage);

  slice.forEach(game => {
    const adminIndex = adminGames.indexOf(game);
    const isAdminGame = adminIndex !== -1;

    const card = document.createElement('div');
    card.className = 'game-card';
    card.onclick = () => {
      location.href = `game.html?name=${encodeURIComponent(game.name)}`;
    };

    card.innerHTML = `
      <img src="${game.img}" onerror="this.src='/no-image.png'">
      <h3>${game.name}</h3>
      <p>${game.desc || ''}</p>

      ${location.search.includes("admin=true") && isAdminGame ? `
        <div class="admin-actions" onclick="event.stopPropagation()">
          <button onclick="editGame(${adminIndex})">✏️</button>
          <button onclick="removeGame(${adminIndex})">🗑</button>
          <button onclick="addVersionPrompt(${adminIndex})">➕ إصدار</button>
        </div>` : ``}
    `;

    gamesGrid.appendChild(card);
  });
}

/* =========================
   البحث
========================= */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.oninput = () => {
    const v = searchInput.value.toLowerCase();
    gamesGrid.innerHTML = '';

    getAllGames()
      .filter(g => g.name.toLowerCase().includes(v))
      .forEach(game => {
        const c = document.createElement('div');
        c.className = 'game-card';
        c.onclick = () => {
          location.href = `game.html?name=${encodeURIComponent(game.name)}`;
        };
        c.innerHTML = `
          <img src="${game.img}">
          <h3>${game.name}</h3>
        `;
        gamesGrid.appendChild(c);
      });

    if (!v) {
      renderGames();
      renderPagination();
    }
  };
}

/* =========================
   لوحة الأدمن
========================= */
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");

if (adminBtn) {
  // نخفيه افتراضيًا عن الكل
  adminBtn.style.display = "none";

  // نطلعه فقط لو أدمن
  if (location.search.includes("admin=true")) {
    adminBtn.style.display = "block";
    adminBtn.onclick = () => {
      adminPanel.style.display = "flex";
    };
  }
}
/* =========================
   زر الإضافة الذكية (ثابت)
========================= */
const smartBtn = document.getElementById("smartBtn");
if (smartBtn && location.search.includes("admin=true")) {
  smartBtn.style.display = "block";
  smartBtn.onclick = smartAddGame;
}

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
  document.getElementById("versions").appendChild(div);
};

/* =========================
   حفظ / تعديل / حذف
========================= */
window.saveGame = () => {
  if (!aName.value || !aImg.value || !aCategory.value) return alert("أكمل البيانات");

  adminGames.unshift({
    name: aName.value,
    img: aImg.value,
    desc: aDesc.value,
    category: aCategory.value,
    rating: 4.5,
    versions: [{ v: "Latest", size: "—", link: "#" }]
  });

  save();
};

window.editGame = i => {
  adminGames[i].name = prompt("اسم اللعبة", adminGames[i].name);
  save();
};

window.removeGame = i => {
  if (confirm("حذف؟")) {
    adminGames.splice(i, 1);
    save();
  }
};

function save() {
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  location.reload();
}

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

function autoDesc(name) {
  return `${name} Mod APK for Android`;
}

function smartAddGame() {
  const name = prompt("اسم اللعبة:");
  if (!name) return;

  const img = prompt("رابط الصورة (اختياري):") || autoImage(name);

  adminGames.unshift({
    name,
    img,
    desc: autoDesc(name),
    category: autoCategory(name),
    rating: 4.5,
    versions: [{ v: "Latest", size: "—", link: "#" }]
  });

  save();
}

/* =========================
   تشغيل أولي
========================= */
renderGames();
renderPagination();

});
