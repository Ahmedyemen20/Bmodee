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
const gamesPerPage = 4;
let currentPage = 1;

const gamesGrid = document.getElementById('gamesGrid');
const pagination = document.getElementById('pagination');

/* =========================
   البيانات
========================= */
let adminGames = JSON.parse(localStorage.getItem('adminGames')) || [];

let allGames = [
  {
    name: "Hay Day",
    img: "/unnamed (2).jpg",
    desc: "Hay Day Mod APK Unlimited Money",
    versions: [{ v: "1.0", size: "150 MB", link: "#" }]
  },
  ...adminGames
];

/* =========================
   Pagination
========================= */
function renderPagination(){
  if(!pagination) return;
  pagination.innerHTML = '';
  const pages = Math.ceil(allGames.length / gamesPerPage);

  for(let i=1;i<=pages;i++){
    const b = document.createElement('button');
    b.textContent = i;
    if(i===currentPage) b.classList.add('active');
    b.onclick = ()=>{
      currentPage=i;
      renderGames();
      renderPagination();
    };
    pagination.appendChild(b);
  }
}

/* =========================
   عرض الألعاب
========================= */
function renderGames(){
  if(!gamesGrid) return;
  gamesGrid.innerHTML = '';

  const start = (currentPage-1)*gamesPerPage;
  const slice = allGames.slice(start,start+gamesPerPage);

  slice.forEach(game=>{
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${game.img}">
      <h3><a href="game.html?game=${encodeURIComponent(game.name)}">${game.name}</a></h3>
      <p>${game.desc}</p>
    `;
    gamesGrid.appendChild(card);
  });
}

/* =========================
   البحث
========================= */
const searchInput = document.getElementById('searchInput');
if(searchInput){
  searchInput.oninput = ()=>{
    const v = searchInput.value.toLowerCase();
    gamesGrid.innerHTML = '';
    allGames.filter(g=>g.name.toLowerCase().includes(v))
      .forEach(game=>{
        const c=document.createElement('div');
        c.className='game-card';
        c.innerHTML=`<img src="${game.img}"><h3>${game.name}</h3>`;
        gamesGrid.appendChild(c);
      });
    if(v===""){renderGames();renderPagination();}
  };
}

/* =========================
   لوحة الأدمن
========================= */
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const versionsDiv = document.getElementById("versions");

let adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];

if (!location.search.includes("admin=true")) {
  adminBtn.style.display = "none";
}

adminBtn.onclick = () => {
  adminPanel.style.display = "flex";
};

function closeAdmin() {
  adminPanel.style.display = "none";
}

function addVersion() {
  const div = document.createElement("div");
  div.className = "version-box";
  div.innerHTML = `
    <input placeholder="الإصدار">
    <input placeholder="الحجم">
    <input placeholder="رابط التحميل">
    <button class="btn red" onclick="this.parentElement.remove()">حذف الإصدار</button>
  `;
  versionsDiv.appendChild(div);
}

function saveGame() {
  const name = document.getElementById("aName").value;
  const img = document.getElementById("aImg").value;
  const desc = document.getElementById("aDesc").value;
  
  if (!name || !img) {
    alert("أدخل اسم اللعبة والصورة");
    return;
  }
  
  const versions = [];
  document.querySelectorAll(".version-box").forEach(v => {
    const i = v.querySelectorAll("input");
    versions.push({
      v: i[0].value,
      size: i[1].value,
      link: i[2].value
    });
  });
  
  if (versions.length === 0) {
    alert("أضف إصدار واحد على الأقل");
    return;
  }
  
  adminGames.unshift({ name, img, desc, versions });
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  
  alert("✅ تم حفظ اللعبة");
  location.reload();
}
});

