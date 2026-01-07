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
const addBtn = document.getElementById('addGameBtn');
const panel = document.getElementById('adminPanel');
const list = document.getElementById('adminGameList');

if(!location.search.includes("admin=true")){
  addBtn.style.display='none';
}

addBtn.onclick = ()=>{
  panel.style.display='flex';
  renderAdmin();
};

window.closeAdminPanel = ()=> panel.style.display='none';

function renderAdmin(){
  list.innerHTML='';
  adminGames.forEach((g,i)=>{
    const d=document.createElement('div');
    d.className='admin-game';
    d.innerHTML=`
      <strong>${g.name}</strong>
      <button onclick="editGame(${i})">✏️</button>
      <button onclick="addVersion(${i})">➕</button>
      <button onclick="removeGame(${i})">🗑</button>
    `;
    list.appendChild(d);
  });
}

window.addVersion = i=>{
  const v=prompt("الإصدار:");
  const s=prompt("الحجم:");
  const l=prompt("الرابط:");
  if(!v||!l) return;
  adminGames[i].versions.push({v,size:s,link:l});
  save();
};

window.editGame = i=>{
  const n=prompt("اسم اللعبة",adminGames[i].name);
  const d=prompt("الوصف",adminGames[i].desc);
  if(!n) return;
  adminGames[i].name=n;
  adminGames[i].desc=d;
  save();
};

window.removeGame = i=>{
  if(!confirm("حذف اللعبة؟")) return;
  adminGames.splice(i,1);
  save();
};

function save(){
  localStorage.setItem('adminGames',JSON.stringify(adminGames));
  location.reload();
}

/* =========================
   تشغيل أولي
========================= */
renderGames();
renderPagination();

});

const versionsBox = document.getElementById("versionsBox");

function addVersionField() {
  const div = document.createElement("div");
  div.className = "version-row";
  div.innerHTML = `
    <input placeholder="الإصدار (مثال 1.0)">
    <input placeholder="الحجم (MB)">
    <input placeholder="رابط التحميل">
    <button onclick="this.parentElement.remove()">✕</button>
  `;
  versionsBox.appendChild(div);
}

function saveAdminGame() {
  const name = document.getElementById("adminGameName").value;
  const img = document.getElementById("adminGameImg").value;
  const desc = document.getElementById("adminGameDesc").value;
  
  if (!name || !img) {
    alert("أدخل اسم اللعبة والصورة");
    return;
  }
  
  const versions = [];
  document.querySelectorAll(".version-row").forEach(row => {
    const inputs = row.querySelectorAll("input");
    versions.push({
      v: inputs[0].value,
      size: inputs[1].value,
      link: inputs[2].value
    });
  });
  
  if (versions.length === 0) {
    alert("أضف إصدار واحد على الأقل");
    return;
  }
  
  const game = { name, img, desc, versions };
  
  let adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];
  adminGames.unshift(game);
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  
  alert("✅ تم إضافة اللعبة");
  location.reload();
}