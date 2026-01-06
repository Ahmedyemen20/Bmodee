/* =========================
   قائمة الهامبرقر
========================= */
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function openMenu(){
  hamburger.setAttribute('aria-expanded','true');
  sidebar.classList.add('open');
  overlay.classList.add('open');
}
function closeMenu(){
  hamburger.setAttribute('aria-expanded','false');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
}

hamburger.addEventListener('click', ()=>{
  hamburger.getAttribute('aria-expanded') === 'true'
    ? closeMenu()
    : openMenu();
});
overlay.addEventListener('click', closeMenu);
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') closeMenu();
});


/* =========================
   إعدادات الألعاب
========================= */
const gamesPerPage = 4;
let currentPage = 1;

const gamesGrid = document.getElementById('gamesGrid');
const pagination = document.getElementById('pagination');


/* =========================
   بيانات الألعاب
========================= */
const allGames = [
  {
    name: "Hay Day",
    img: "/unnamed (2).jpg",
    desc: "Hay Day Mod APK Unlimited Money",
    versions: [
      {
        v: "1.0",
        size: "150 MB",
        link: "https://www.mediafire.com/file/hayday_v1.apk"
      },
      {
        v: "2.1",
        size: "180 MB",
        link: "https://www.mediafire.com/file/hayday_v2.apk"
      }
    ]
  },

  {
    name: "Air Fighters",
    img: "https://i.postimg.cc/Y0qPFvZD/tnzyl.webp",
    desc: "Air Fighters Mod for Android",
    versions: [
      {
        v: "4.3.1",
        size: "134 MB",
        link: "https://www.mediafire.com/file/xu74boi185ek8um/up-mod-airfighters-4-3-1-mod-unlocked-43101.apk/file"
      }
    ]
  },

  {
    name: "Truck of Europe 3",
    img: "https://i.postimg.cc/jd6w8vg7/1656059656-truckers-of-europe-3.jpg",
    desc: "Truck of Europe 3 Unlimited Money",
    versions: [
      {
        v: "0.46.2",
        size: "536 MB",
        link: "https://www.mediafire.com/file/kun8eypezvk4lul/truckers-of-europe-3-hashipro-0.46.2.apk/file"
      }
    ]
  },

  {
    name: "Jetpack Joyride",
    img: "https://i.postimg.cc/SxJkFyLM/tnzyl-(1).webp",
    desc: "Jetpack Joyride Unlimited Money",
    versions: [
      {
        v: "0.1.40",
        size: "150 MB",
        link: "https://www.mediafire.com/file/t0zcopdrfqdem33/Jetpack_Joyride_2_v0.1.40_Unlimited_Money.apk/file"
      }
    ]
  },
  
   {
    name: "RFS",
    img: "",
    desc: "RFS mode unlimited Money",
    versions: [
      {
        v: "2.5.0",
        size: "2.0 GB",
        link: ""
      }
    ]
  },
];


/* =========================
   Pagination
========================= */
function getGamesForPage(page){
  const start = (page - 1) * gamesPerPage;
  return allGames.slice(start, start + gamesPerPage);
}

function renderPagination(){
  pagination.innerHTML = '';
  const totalPages = Math.ceil(allGames.length / gamesPerPage);

  if(currentPage > 1){
    const prev = document.createElement('button');
    prev.textContent = '⬅ السابق';
    prev.onclick = () => {
      currentPage--;
      renderGames();
      renderPagination();
    };
    pagination.appendChild(prev);
  }

  for(let i = 1; i <= totalPages; i++){
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

  if(currentPage < totalPages){
    const next = document.createElement('button');
    next.textContent = 'التالي ➡';
    next.onclick = () => {
      currentPage++;
      renderGames();
      renderPagination();
    };
    pagination.appendChild(next);
  }
}


/* =========================
   عرض الألعاب (تصميم HappyMod)
========================= */
function renderGames() {
  gamesGrid.innerHTML = '';
  const currentGames = getGamesForPage(currentPage);
  
  currentGames.forEach((game, index) => {
    
    /* ===== كرت اللعبة ===== */
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

        <select class="version-select">
          <option value="">اختر الإصدار</option>
          ${game.versions.map((ver, i) =>
            `<option value="${i}">v ${ver.v}</option>`
          ).join("")}
        </select>

        <p class="version-info"></p>

        <a class="Download-btn" style="display:none" target="_blank">
          Download
        </a>
      </div>
    `;
    
    const select = card.querySelector('.version-select');
    const info = card.querySelector('.version-info');
    const btn = card.querySelector('.Download-btn');
    
    select.addEventListener('change', () => {
      if (select.value === '') return;
      const version = game.versions[select.value];
      info.textContent = `الإصدار: ${version.v} | الحجم: ${version.size}`;
      btn.href = `download.html?game=${encodeURIComponent(game.name)}&v=${version.v}`;
      btn.style.display = 'inline-block';
    });
    
    gamesGrid.appendChild(card);
    
    /* ===== إعلان بعد كل لعبتين ===== */
    if ((index + 1) % 2 === 0) {
      const ad = document.createElement('div');
      ad.className = 'ad-card';
      ad.innerHTML = `<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
      `;
      gamesGrid.appendChild(ad);
    }
    
  });
}


/* =========================
   البحث
========================= */
const searchInput = document.getElementById('searchInput');
if(searchInput){
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    gamesGrid.innerHTML = '';

    allGames
      .filter(game =>
        game.name.toLowerCase().includes(term) ||
        game.desc.toLowerCase().includes(term)
      )
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
  });
}


/* =========================
   تشغيل أولي
========================= */
renderGames();
renderPagination();