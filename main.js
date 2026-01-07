document.addEventListener("DOMContentLoaded", () => {

/* =========================
   الهامبرقر
========================= */
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (hamburger && sidebar && overlay) {
  const openMenu = () => {
    hamburger.setAttribute('aria-expanded','true');
    sidebar.classList.add('open');
    overlay.classList.add('open');
  };
  const closeMenu = () => {
    hamburger.setAttribute('aria-expanded','false');
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  };

  hamburger.onclick = () => {
    hamburger.getAttribute('aria-expanded') === 'true'
      ? closeMenu()
      : openMenu();
  };
  overlay.onclick = closeMenu;
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape') closeMenu();
  });
}

/* =========================
   إعدادات
========================= */
const gamesPerPage = 4;
let currentPage = 1;

const gamesGrid = document.getElementById('gamesGrid');
const pagination = document.getElementById('pagination');

/* =========================
   بيانات الألعاب الأساسية
========================= */
const allGames = [
  {
    name: "Hay Day",
    img: "/unnamed (2).jpg",
    desc: "Hay Day Mod APK Unlimited Money",
    versions: [
      { v: "1.0", size: "150 MB", link: "#" }
    ]
  }
];

/* =========================
   ألعاب الأدمن
========================= */
let adminGames = JSON.parse(localStorage.getItem('adminGames')) || [];
adminGames.forEach(g => allGames.unshift(g));

/* =========================
   Pagination
========================= */
function getGamesForPage(page){
  const start = (page - 1) * gamesPerPage;
  return allGames.slice(start, start + gamesPerPage);
}

function renderPagination(){
  if(!pagination) return;
  pagination.innerHTML = '';
  const totalPages = Math.ceil(allGames.length / gamesPerPage);

  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    if(i === currentPage) btn.classList.add('active');
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
function renderGames(){
  if(!gamesGrid) return;
  gamesGrid.innerHTML = '';

  getGamesForPage(currentPage).forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';

    card.innerHTML = `
      <div class="game-thumb">
        <img src="${game.img}" alt="${game.name}">
      </div>
      <div class="game-info">
        <h3>
          <a href="game.html?game=${encodeURIComponent(game.name)}">
            ${game.name}
          </a>
        </h3>
        <p>${game.desc}</p>
      </div>
    `;
    gamesGrid.appendChild(card);
  });
}

/* =========================
   البحث
========================= */
const searchInput = document.getElementById('searchInput');
if(searchInput){
  searchInput.oninput = () => {
    const term = searchInput.value.toLowerCase();
    gamesGrid.innerHTML = '';

    allGames
      .filter(g => g.name.toLowerCase().includes(term))
      .forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
          <div class="game-thumb">
            <img src="${game.img}">
          </div>
          <div class="game-info">
            <h3>${game.name}</h3>
            <p>${game.desc}</p>
          </div>
        `;
        gamesGrid.appendChild(card);
      });

    if(term === ''){
      renderGames();
      renderPagination();
    }
  };
}

/* =========================
   لوحة الأدمن
========================= */
const addGameBtn = document.getElementById('addGameBtn');
const adminModal = document.getElementById('adminModal');
const saveGame = document.getElementById('saveGame');
const gameSelect = document.getElementById('gameSelect');
const adminTitle = document.getElementById('adminTitle');

const gName = document.getElementById('gName');
const gImg = document.getElementById('gImg');
const gDesc = document.getElementById('gDesc');
const gVer = document.getElementById('gVer');
const gSize = document.getElementById('gSize');
const gLink = document.getElementById('gLink');

/* إخفاء الزر */
if (!location.search.includes("admin=true") && addGameBtn) {
  addGameBtn.style.display = 'none';
}

/* تعبئة قائمة الألعاب */
function fillGameSelect(){
  gameSelect.innerHTML = `<option value="">➕ لعبة جديدة</option>`;
  allGames.forEach((g,i)=>{
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = g.name;
    gameSelect.appendChild(opt);
  });
}

if(gameSelect){
  gameSelect.onchange = () => {
    adminTitle.textContent = gameSelect.value === ""
      ? "إضافة لعبة جديدة"
      : "إضافة إصدار جديد";
  };
}

if(addGameBtn){
  addGameBtn.onclick = () => {
    fillGameSelect();
    adminModal.style.display = 'flex';
  };
}

window.closeAdmin = () => adminModal.style.display = 'none';

/* حفظ */
if(saveGame){
  saveGame.onclick = () => {

    const versionData = {
      v: gVer.value,
      size: gSize.value,
      link: gLink.value
    };

    if(gameSelect.value !== ""){
      // إضافة إصدار
      allGames[gameSelect.value].versions.push(versionData);
    } else {
      // لعبة جديدة
      const game = {
        name: gName.value,
        img: gImg.value,
        desc: gDesc.value,
        versions: [versionData]
      };
      allGames.unshift(game);
      adminGames.unshift(game);
    }

    localStorage.setItem('adminGames', JSON.stringify(adminGames));
    renderGames();
    renderPagination();
    closeAdmin();
  };
}

/* =========================
   تشغيل أولي
========================= */
renderGames();
renderPagination();

});

/* =========================
   تعديل الإصدار + حذف اللعبة
========================= */

const updateVersionBtn = document.getElementById('updateVersion');
const deleteGameBtn = document.getElementById('deleteGame');

/* تعديل إصدار */
if (updateVersionBtn) {
  updateVersionBtn.onclick = () => {
    if (gameSelect.value === "") {
      alert("اختر لعبة أولاً");
      return;
    }
    
    const game = allGames[gameSelect.value];
    const versionIndex = game.versions.findIndex(v => v.v === gVer.value);
    
    if (versionIndex === -1) {
      alert("الإصدار غير موجود");
      return;
    }
    
    game.versions[versionIndex] = {
      v: gVer.value,
      size: gSize.value,
      link: gLink.value
    };
    
    localStorage.setItem('adminGames', JSON.stringify(adminGames));
    renderGames();
    closeAdmin();
    alert("تم تعديل الإصدار بنجاح ✅");
  };
}

/* حذف لعبة */
if (deleteGameBtn) {
  deleteGameBtn.onclick = () => {
    if (gameSelect.value === "") {
      alert("اختر لعبة للحذف");
      return;
    }
    
    const confirmDelete = confirm("⚠️ هل أنت متأكد من حذف اللعبة؟");
    if (!confirmDelete) return;
    
    allGames.splice(gameSelect.value, 1);
    adminGames = adminGames.filter((_, i) => i !== gameSelect.value);
    
    localStorage.setItem('adminGames', JSON.stringify(adminGames));
    renderGames();
    renderPagination();
    closeAdmin();
  };
}

const adminPanel = document.getElementById('adminPanel');
const adminGameList = document.getElementById('adminGameList');

if (!location.search.includes("admin=true")) {
  document.getElementById('addGameBtn').style.display = 'none';
}

addGameBtn.onclick = () => {
  adminPanel.style.display = 'flex';
  renderAdminGames();
};

function closeAdminPanel() {
  adminPanel.style.display = 'none';
}

function renderAdminGames() {
  adminGameList.innerHTML = '';
  adminGames.forEach((game, index) => {
    const div = document.createElement('div');
    div.className = 'admin-game';
    div.innerHTML = `
      <h4>${game.name}</h4>
      <div class="admin-actions">
        <button class="edit" onclick="editGame(${index})">✏️ تعديل</button>
        <button class="addver" onclick="addVersion(${index})">➕ إصدار</button>
        <button class="del" onclick="deleteGame(${index})">🗑 حذف</button>
      </div>
    `;
    adminGameList.appendChild(div);
  });
}

function deleteGame(i) {
  if (!confirm('حذف اللعبة؟')) return;
  adminGames.splice(i, 1);
  localStorage.setItem('adminGames', JSON.stringify(adminGames));
  location.reload();
}

function addVersion(i) {
  const v = prompt("رقم الإصدار:");
  const s = prompt("الحجم:");
  const l = prompt("رابط التحميل:");
  if (!v || !l) return;
  
  adminGames[i].versions.push({ v, size: s, link: l });
  localStorage.setItem('adminGames', JSON.stringify(adminGames));
  alert('تمت إضافة الإصدار');
}

function editGame(i) {
  const name = prompt("اسم اللعبة:", adminGames[i].name);
  const desc = prompt("الوصف:", adminGames[i].desc);
  if (!name) return;
  
  adminGames[i].name = name;
  adminGames[i].desc = desc;
  localStorage.setItem('adminGames', JSON.stringify(adminGames));
  alert('تم التعديل');
}