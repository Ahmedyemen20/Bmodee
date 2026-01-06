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
        link: "https://www.mediafire.com/file/i1yreog619js9hq/RFS-v2.2.9-full-mundoperfecto.net.apk/file"
      }
    ]
  },
  
   {
    name: "X-Plan",
    img: "https://i.postimg.cc/m28G8Fg8/9618ef3b6e8bdca502289c2c1cbc80ebc57b7a173d49672698f6084e34e6318e-200.webp",
    desc: "تعديل فتح الطائرات",
    versions: [
      {
        v: "12.3.5",
        size: "1.28 GB",
        link: "https://www.mediafire.com/file/5dhnsr0sb7iiicj/x_plane_flight_mod_12.3.5.apk/file"
      }
    ]
  },
  
  {
    name: "Dream league soccer",
    img: "https://i.postimg.cc/DwtJWjHg/IMG-20260106-183854-452.jpg",
    desc: "unlimited Money-onlin",
    versions: [
      {
        v: "6.14",
        size: "353 MB",
        link: "https://www.mediafire.com/file/lkw8n1amkkpr1t0/dream-league-soccer-mod_6.14.apk/file"
      }
    ]
  },
  
    {
    name: "Sniper 3D assassin",
    img: "https://i.postimg.cc/KYPz1Zt6/IMG-20260106-183906-009.jpg",
    desc: "Mod menu & No dead",
    versions: [
      {
        v: "4.33.6",
        size: "175",
        link: "https://www.mediafire.com/file/z5g33yqv8t5csgb/sniper-3d-assassin-v4.33.6-mod1.apk/file"
      }
    ]
    
  },
    {
    name: "Hill climb Racing",
    img: "https://i.postimg.cc/fW2btq0X/IMG-20260106-183901-051.jpg",
    desc: "Unlimited Money",
    versions: [
      {
        v: "1.60.3",
        size: "86 MB",
        link: "https://www.mediafire.com/file/4z4hs9rsrbrl3qw/hill-climb-racing-v1.60.3-mod.apk/file"
      }
    ]
  },
  
   {
    name: "Angry-birds-Friends",
    img: "https://i.postimg.cc/k5tcBMFs/angry-birds-friends-75x75.png",
    desc: "Unlimited",
    versions: [
      {
        v: "13.6.1",
        size: "150 MB",
        link: "https://www.mediafire.com/file/kjh1ae46lgrdz1t/Angry-Birds-Friends-v13.6.1-mod-mundoperfecto.net.apk/file"
      }
    ]
  },
  
    {
    name: "Clash Royale",
    img: "https://i.postimg.cc/cHSQCRJx/clash-royale-150x150.png.",
    desc: "Unlimited Money",
    versions: [
      {
        v: "130300006",
        size: "994 MB",
        link: "https://www.mediafire.com/file/vqfii31ke4xewwv/Clash+Royale+Mod+v130300016+-+androforever.com.apk/file"
      }
    ]
  },
  
    {
    name: "Car parking multiplayer",
    img: "https://i.postimg.cc/8PPmLmmT/car-parking-multiplayer-150x150.webp",
    desc: "Mod menu + Money",
    versions: [
      {
        v: "4.8.21.3",
        size: "996 MB",
        link: "https://www.mediafire.com/file/q1feka0dg6827h4/cpm48213modt-androidoyunclub.apk/file"
      }
    ]
  },
  
    {
    name: "Brawl Stars",
    img: "https://i.postimg.cc/cCJttXGv/brawl-stars-150x150.webp",
    desc: "Unlimited Money",
    versions: [
      {
        v: "56.250",
        size: "449 MB",
        link: "https://www.mediafire.com/file/bllpzau1t7zabkh/Brawl_Stars_SV1_nul-mundoperfecto.net.apk/file"
      }
    ]
  },
  
    {
    name: "Boom beach",
    img: "https://i.postimg.cc/L8gfVCYd/boom-beach-150x150.png",
    desc: "Mod unlimited money",
    versions: [
      {
        v: "59.120",
        size: "453 MB",
        link: "https://transfer.it/t/lOTx2t4TjbKR"
      }
    ]
  },
  
      {
    name: "Coach bus simulator",
    img: "https://i.postimg.cc/zX6H3Ct8/coach-bus-simulator-150x150.png",
    desc: "Mod Unlimited",
    versions: [
      {
        v: "2.6.0",
        size: "140 MB",
        link: "https://www.mediafire.com/file/umcbnbpo3m3rkmw/cbussim260modt-androidoyunclub.apk/file"
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
/* =========================
   البحث (معدّل لربط صفحة التفاصيل)
========================= */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    gamesGrid.innerHTML = '';
    
    const filtered = allGames.filter(game =>
      game.name.toLowerCase().includes(term) ||
      game.desc.toLowerCase().includes(term)
    );
    
    filtered.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';
      
      card.innerHTML = `
        <div class="game-thumb">
          <a href="game.html?game=${encodeURIComponent(game.name)}">
            <img src="${game.img}" alt="${game.name}">
          </a>
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
    
    if (term === '') {
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


