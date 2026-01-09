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
    id: "base-1",
    name: "Hay Day",
    img: "/unnamed (2).jpg",
    desc: "Hay Day Mod APK Unlimited Money",
    rating: 4.8,
    category: "strategy",
    versions: [{ v: "1.0", size: "150 MB", link: "#" }]
  }
];

/* =========================
   دمج وترتيب A-Z
========================= */
function getAllGames() {
  return [...baseGames, ...adminGames].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function getFilteredGames() {
  const games = getAllGames();
  if (currentCategory === "all") return games;
  return games.filter(g => g.category === currentCategory);
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
    const isAdminGame = adminGames.some(g => g.id === game.id);

    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${game.img}">
      <h3>
        <a href="game.html?id=${game.id}">
          ${game.name}
        </a>
      </h3>
      <p>${game.desc || ''}</p>

      ${location.search.includes("admin=true") && isAdminGame ? `
        <div class="admin-actions">
          <button onclick="editGame('${game.id}')">✏️</button>
          <button onclick="removeGame('${game.id}')">🗑</button>
          <button onclick="addVersionPrompt('${game.id}')">➕ إصدار</button>
        </div>
      ` : ``}
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
        c.innerHTML = `
          <img src="${game.img}">
          <h3><a href="game.html?id=${game.id}">${game.name}</a></h3>
        `;
        gamesGrid.appendChild(c);
      });

    if (v === "") {
      renderGames();
      renderPagination();
    }
  };
}

/* =========================
   الأقسام
========================= */
window.renderByCategory = cat => {
  currentCategory = cat;
  currentPage = 1;
  renderGames();
  renderPagination();
};

window.renderAll = () => {
  currentCategory = "all";
  currentPage = 1;
  renderGames();
  renderPagination();
};

/* =========================
   لوحة الأدمن
========================= */
const versionsDiv = document.getElementById("versions");

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

window.saveGame = () => {
  const name = aName.value.trim();
  const img = aImg.value.trim();
  const desc = aDesc.value.trim();
  const category = aCategory.value;

  if (!name || !img || !category) {
    alert("أكمل البيانات");
    return;
  }

  const versionsArr = [];
  document.querySelectorAll(".version-box").forEach(v => {
    const i = v.querySelectorAll("input");
    if (i[0].value && i[2].value) {
      versionsArr.push({
        v: i[0].value,
        size: i[1].value,
        link: i[2].value
      });
    }
  });

  if (!versionsArr.length) {
    alert("أضف إصدار واحد على الأقل");
    return;
  }

  adminGames.unshift({
    id: crypto.randomUUID(),
    name,
    img,
    desc,
    category,
    rating: 4.5,
    versions: versionsArr
  });

  save();
};

/* =========================
   تعديل / حذف / إصدار
========================= */
window.editGame = id => {
  const game = adminGames.find(g => g.id === id);
  if (!game) return;

  const n = prompt("اسم اللعبة", game.name);
  const d = prompt("الوصف", game.desc);
  if (!n) return;

  game.name = n;
  game.desc = d;
  save();
};

window.removeGame = id => {
  if (!confirm("حذف اللعبة؟")) return;
  adminGames = adminGames.filter(g => g.id !== id);
  save();
};

window.addVersionPrompt = id => {
  const game = adminGames.find(g => g.id === id);
  if (!game) return;

  const v = prompt("الإصدار:");
  const s = prompt("الحجم:");
  const l = prompt("الرابط:");
  if (!v || !l) return;

  game.versions.push({ v, size: s, link: l });
  save();
};

function save() {
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  location.reload();
}

/* =========================
   تشغيل أولي
========================= */
renderGames();
renderPagination();

});
