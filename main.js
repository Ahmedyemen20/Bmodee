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

});
