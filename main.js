document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     الهامبرغر / sidebar / overlay
  ========================== */
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
      sidebar.setAttribute('aria-hidden', !sidebar.classList.contains('open'));
      overlay.setAttribute('aria-hidden', !overlay.classList.contains('open'));
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      sidebar.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
    });
  }

  /* =========================
     عناصر DOM و إعدادات عامة
  ========================== */
  const gamesGrid = document.getElementById("gamesGrid");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("searchInput");
  const searchClear = document.getElementById("searchClear");

  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const smartBtn = document.getElementById("smartBtn");

  const aName = document.getElementById("aName");
  const aImg = document.getElementById("aImg");
  const aDesc = document.getElementById("aDesc");
  const aCategory = document.getElementById("aCategory");
  const versionsDiv = document.getElementById("versions");

  let gamesPerPage = 10;
  let currentPage = 1;
  let currentCategory = "all";
  let searchQuery = "";

  /* =========================
     البيانات
  ========================== */
  let adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];

// Auto-generated file
// Generated from Admin Panel
const baseGames = [
  {
    "name": "Roblox",
    "img": "assets/images/unnamed.png",
    "desc": "المزيد ....... Roblox",
    "category": "action",
    "versions": [
      {
        "v": "2.703.1353",
        "size": "119 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Pizza Ready!",
    "img": "assets/images/unnamed (3).png",
    "desc": "المزيد ....... Pizza Ready",
    "category": "action",
    "versions": [
      {
        "v": "v 54.2.0",
        "size": "147 MB ",
        "link": "#"
      }
    ]
  },
  {
    "name": "My Talking Tom 2",
    "img": "assets/images/unnamed (4).png",
    "desc": "المزيد ...... My talking Tom 2",
    "category": "action",
    "versions": [
      {
        "v": "25.5.4.17292",
        "size": "141 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Hole.io",
    "img": "assets/images/unnamed (5).png",
    "desc": "المزيد ........ Hole.io",
    "category": "action",
    "versions": [
      {
        "v": "v 2.37.8",
        "size": "242 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Honor of kings",
    "img": "assets/images/unnamed (7).png",
    "desc": "المزيد .......... Honor of kings",
    "category": "action",
    "versions": [
      {
        "v": "v 11.2.1.5",
        "size": "380 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "النجاه في الصقيع",
    "img": "assets/images/unnamed (8).png",
    "desc": "النجاه في الصقيع ....",
    "category": "strategy",
    "versions": [
      {
        "v": "v 1.29.20",
        "size": "723 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Monopoly Go!",
    "img": "assets/images/unnamed (9).png",
    "desc": ".... Monopoly GO",
    "category": "action",
    "versions": [
      {
        "v": "1.60.1 v",
        "size": "123 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Candy Cursh Saga",
    "img": "assets/images/unnamed (10).png",
    "desc": "Candy Cursh Sega......",
    "category": "action",
    "versions": [
      {
        "v": "v 1.319.1.1",
        "size": "83 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Pokèmon Go",
    "img": "assets/images/unnamed (11).png",
    "desc": "المزيد ....... Pokèmon Go",
    "category": "action",
    "versions": [
      {
        "v": "0.393.0",
        "size": "150 M5",
        "link": "#"
      }
    ]
  },
  {
    "name": "Pokémon TCG Pocket",
    "img": "assets/images/unnamed (12).png",
    "desc": "المزيد ........ Pokémon TCG Pocket",
    "category": "action",
    "versions": [
      {
        "v": "1.4.1",
        "size": "241 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Royal Match",
    "img": "assets/images/unnamed (13).png",
    "desc": "المزيد .......... Royal Match",
    "category": "strategy",
    "versions": [
      {
        "v": "3321",
        "size": "160 MB ",
        "link": "#"
      }
    ]
  },
  {
    "name": "Clash Royale",
    "img": "assets/images/unnamed (14).png",
    "desc": "المزيد ........ Clash Royale",
    "category": "action",
    "versions": [
      {
        "v": "130300024",
        "size": "1.11 GB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Temple Run 2",
    "img": "assets/images/unnamed (15).png",
    "desc": "المزيد ........ Temple Run 2",
    "category": "action",
    "versions": [
      {
        "v": "1.128.0",
        "size": "123 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Traffic Rider",
    "img": "assets/images/unnamed (16).png",
    "desc": "المزيد ....... Traffic Raider",
    "category": "action",
    "versions": [
      {
        "v": "2.11 v",
        "size": "123 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Fruit Ninja",
    "img": "assets/images/unnamed (17).png",
    "desc": "المزيد ......... Fruit Ninja",
    "category": "action",
    "versions": [
      {
        "v": "3.91.3 v",
        "size": "229 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "8 Ball pool",
    "img": "assets/images/unnamed (18).png",
    "desc": "المزيد ....... 8 Ball pool",
    "category": "action",
    "versions": [
      {
        "v": "56.17.1 v",
        "size": "111 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "لعبة سباق سيارات-Asphalt 8",
    "img": "assets/images/unnamed (19).png",
    "desc": "المزيد ........ Asphalt 8",
    "category": "racing",
    "versions": [
      {
        "v": "v 8.7.0i ",
        "size": "128 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Subway princess Runner",
    "img": "assets/images/unnamed (20).png",
    "desc": "المزيد ....... Subway princess Runner",
    "category": "sports",
    "versions": [
      {
        "v": "8.4.7 v",
        "size": "128 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Plants Vs Zombie (PVZ)",
    "img": "assets/images/unnamed (21).png",
    "desc": "المزيد ....... Plants Vs Zombie (PVZ)",
    "category": "action",
    "versions": [
      {
        "v": "3.14.0 v",
        "size": "105 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Carrom pool",
    "img": "assets/images/unnamed (22).png",
    "desc": "المزيد ...... Carrom pool",
    "category": "sports",
    "versions": [
      {
        "v": "18.9.3 ",
        "size": "112 MB ",
        "link": "#"
      }
    ]
  },
  {
    "name": "Geometry dash Lite",
    "img": "assets/images/unnamed (23).png",
    "desc": "المزيد ...... Geometry dash Lite",
    "category": "action",
    "versions": [
      {
        "v": "2.2.144 v",
        "size": "163",
        "link": "#"
      }
    ]
  },
  {
    "name": "Mini Militia",
    "img": "assets/images/unnamed (24).png",
    "desc": "المزيد ......... Mini Militia",
    "category": "action",
    "versions": [
      {
        "v": "5.6.0",
        "size": "53 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Call of duty : Mobile",
    "img": "assets/images/unnamed (26).png",
    "desc": "المزيد ........ Call of duty : Mobile V",
    "category": "action",
    "versions": [
      {
        "v": "1.0.53 v",
        "size": "1.6 GB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Genshin Impact",
    "img": "assets/images/icon (1) (20).webp",
    "desc": "المزيد ........ Genshin impact",
    "category": "action",
    "versions": [
      {
        "v": "‏6.3.0_41350619_41366669 v",
        "size": "369 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Fishdom",
    "img": "assets/images/unnamed (28).png",
    "desc": "المزيد ........ Fishdom",
    "category": "action",
    "versions": [
      {
        "v": "9.5.3.0 v ",
        "size": "170 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Township",
    "img": "assets/images/unnamed (29).png",
    "desc": "المزيد ......... Township",
    "category": "action",
    "versions": [
      {
        "v": "33.0.0",
        "size": "171 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Bubble Shooter Classic",
    "img": "assets/images/unnamed (30).png",
    "desc": "المزيد ......... Bubble Shooter Classic",
    "category": "action",
    "versions": [
      {
        "v": "16.1.1",
        "size": "53.54 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Temple Run OZ",
    "img": "assets/images/icon (2).webp",
    "desc": "المزيد ........ Temple Run OZ",
    "category": "action",
    "versions": [
      {
        "v": "2.0",
        "size": "53.21",
        "link": "#"
      }
    ]
  },
  {
    "name": "Words with friends 2",
    "img": "assets/images/icon (4).webp",
    "desc": "المزيد ........ Words with friends 2",
    "category": "action",
    "versions": [
      {
        "v": "49.03.02 v",
        "size": "163 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Crossy road",
    "img": "assets/images/icon (5).webp",
    "desc": ".......Crossy road",
    "category": "action",
    "versions": [
      {
        "v": "7.9.1",
        "size": "115 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Zombie Catchers",
    "img": "assets/images/icon (6).webp",
    "desc": "........Zombie Catchers",
    "category": "action",
    "versions": [
      {
        "v": "1.59.31 v",
        "size": "98.63",
        "link": "#"
      }
    ]
  },
  {
    "name": "Score! Hero",
    "img": "assets/images/icon (7).webp",
    "desc": "........Score! Hero",
    "category": "sports",
    "versions": [
      {
        "v": "4.310 v ",
        "size": "165 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "FIFA Mobile",
    "img": "assets/images/icon (8).webp",
    "desc": "........FIFA Mobile",
    "category": "sports",
    "versions": [
      {
        "v": "26.1.02 v",
        "size": "130 Mb",
        "link": "#"
      }
    ]
  },
  {
    "name": "eFootball™ (PES)",
    "img": "assets/images/icon (9).webp",
    "desc": ".........eFootball™ (PES)",
    "category": "sports",
    "versions": [
      {
        "v": "10.2.2 v",
        "size": "2.4 GB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Real Racing",
    "img": "assets/images/icon (10).webp",
    "desc": ".........Real Racing 3",
    "category": "racing",
    "versions": [
      {
        "v": "1.3.28",
        "size": "232 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Need for Speed™ No Limits",
    "img": "assets/images/icon (11).webp",
    "desc": "........Need for Speed™ No Limits",
    "category": "racing",
    "versions": [
      {
        "v": "8.9.1 v",
        "size": "138 MB ",
        "link": "#"
      }
    ]
  },
  {
    "name": "UNO!",
    "img": "assets/images/icon (12).webp",
    "desc": "UNO!......",
    "category": "action",
    "versions": [
      {
        "v": "1.16.4416 v",
        "size": "401 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Dream League Soccer 2026",
    "img": "assets/images/icon.png",
    "desc": ".........Dream League Score 2026",
    "category": "sports",
    "versions": [
      {
        "v": "13.050 v",
        "size": "171 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "NBA Live Mobile",
    "img": "assets/images/icon (14).webp",
    "desc": ".........NBA Live Mobile",
    "category": "sports",
    "versions": [
      {
        "v": "10.00.11 v",
        "size": "866 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Madden NFL Mobile",
    "img": "assets/images/icon (15).webp",
    "desc": "........Madden NFL Mobile",
    "category": "sports",
    "versions": [
      {
        "v": "12.0.8",
        "size": "111 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Clash Mini",
    "img": "assets/images/icon (16).webp",
    "desc": "........Clash Mini",
    "category": "strategy",
    "versions": [
      {
        "v": "1.0",
        "size": "",
        "link": "#"
      }
    ]
  },
  {
    "name": "world cricket championship 2",
    "img": "assets/images/icon (17).webp",
    "desc": ".........world cricket championship 2",
    "category": "action",
    "versions": [
      {
        "v": "5.4.5 v",
        "size": "404 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Golf Clash",
    "img": "assets/images/icon (18).webp",
    "desc": ".........Golf Clash",
    "category": "sports",
    "versions": [
      {
        "v": "3.3.5",
        "size": "132 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Shadow Fight 3",
    "img": "assets/images/icon (1) (1).webp",
    "desc": "...........Shadow Fight 3",
    "category": "action",
    "versions": [
      {
        "v": "1.44.1 v",
        "size": "186 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Injustice 2",
    "img": "assets/images/icon (1) (2).webp",
    "desc": "..........Injustice 2",
    "category": "action",
    "versions": [
      {
        "v": "6.6.0 v",
        "size": "1.49 GB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Marvel Strike Force",
    "img": "assets/images/icon (1) (3).webp",
    "desc": ".........Marvel Strike Force",
    "category": "action",
    "versions": [
      {
        "v": "9.5.2",
        "size": "171 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Star wars: Galaxy of Heroes",
    "img": "assets/images/icon (1) (4).webp",
    "desc": "........Star wars: Galaxy of Heroes",
    "category": "action",
    "versions": [
      {
        "v": "0.38.1908387 v",
        "size": "81.73 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "AFK Arena",
    "img": "assets/images/icon (1) (5).webp",
    "desc": ".......AFK Arena",
    "category": "action",
    "versions": [
      {
        "v": "1.185.01 v",
        "size": "564 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Summoners War Chronicles",
    "img": "assets/images/icon (1) (6).webp",
    "desc": ".......Summoners War Chronicles",
    "category": "action",
    "versions": [
      {
        "v": "4.15.521180 v ",
        "size": "134 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "RAID : Shadow Legends",
    "img": "assets/images/icon (1) (7).webp",
    "desc": ".......RAID : Shadow Legends",
    "category": "action",
    "versions": [
      {
        "v": "11.10.5 v",
        "size": "129 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Idle Heroes",
    "img": "assets/images/icon (1) (8).webp",
    "desc": "......Idle Heroes",
    "category": "action",
    "versions": [
      {
        "v": "1.34.4 v",
        "size": "726 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Dragon Mania Legends",
    "img": "assets/images/icon (1) (9).webp",
    "desc": "......Dragon Mania Legends",
    "category": "action",
    "versions": [
      {
        "v": "8.9.3",
        "size": "200 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Magic Tiles 3",
    "img": "assets/images/icon (1) (10).webp",
    "desc": "......Magic Tiles 3",
    "category": "action",
    "versions": [
      {
        "v": "12.122.201 v",
        "size": "231 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Chess",
    "img": "assets/images/icon (1) (11).webp",
    "desc": ".......Chess",
    "category": "strategy",
    "versions": [
      {
        "v": "2.8.9 v",
        "size": "2.42 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Backgammon Masters",
    "img": "assets/images/icon (1) (12).webp",
    "desc": ".......Backgammon Masters",
    "category": "strategy",
    "versions": [
      {
        "v": "1.7.174 v",
        "size": "23 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Sudoku",
    "img": "assets/images/icon (1) (13).webp",
    "desc": "........Sudoku",
    "category": "strategy",
    "versions": [
      {
        "v": "5.43.1 v",
        "size": "87.45 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Words Story",
    "img": "assets/images/icon (1) (14).webp",
    "desc": "........Words Story",
    "category": "strategy",
    "versions": [
      {
        "v": "2.0.0 v",
        "size": "88.53 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Jelly Splash",
    "img": "assets/images/icon (1) (15).webp",
    "desc": ".......Jelly Splash",
    "category": "action",
    "versions": [
      {
        "v": "1.0",
        "size": "",
        "link": "#"
      }
    ]
  },
  {
    "name": "Toon Blast",
    "img": "assets/images/icon (1) (16).webp",
    "desc": ".........Toon Blast",
    "category": "action",
    "versions": [
      {
        "v": "20759 v",
        "size": "134 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Angry Birds Blast",
    "img": "assets/images/icon (1) (17).webp",
    "desc": "........Angry Birds Dream Blast",
    "category": "strategy",
    "versions": [
      {
        "v": "2.8.7 v",
        "size": "158 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Angry Birds Dream Blast",
    "img": "assets/images/icon (1) (18).webp",
    "desc": "........Angry Birds Dream Blast",
    "category": "strategy",
    "versions": [
      {
        "v": "1.99.1 v",
        "size": "164 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Cookie Run : Kingdom",
    "img": "assets/images/icon (1) (19).webp",
    "desc": ".......Cookie Run : Kingdom",
    "category": "action",
    "versions": [
      {
        "v": "7.0.102 v",
        "size": "1.30 GB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Free Fire",
    "img": "assets/images/unnamed (1).png",
    "desc": ".......Free Fire",
    "category": "action",
    "versions": [
      {
        "v": "v 1.119.13",
        "size": "700 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "Free Fire Max",
    "img": "assets/images/unnamed (2).png",
    "desc": "......Free Fire Max",
    "category": "action",
    "versions": [
      {
        "v": "2.120.1",
        "size": "358 MB",
        "link": "#"
      }
    ]
  },
  {
    "name": "PUBG MOBILE",
    "img": "assets/images/unnamed (6).png",
    "desc": "........PUBG MOBILE",
    "category": "action",
    "versions": [
      {
        "v": "v 4.2.0",
        "size": "1.8 GB",
        "link": "#"
      }
    ]
  },
 {
    "name": "clash of clans ",
    "img": "assets/images/Clash of Clans Logo.jpeg",
    "desc": "clash of clans.....",
    "category": "strategy",
    "rating": 4.5,
    "versions": [
      {
        "v": "Latest",
        "size": "—",
        "link": "#"
      }
    ]
  },
  {
    "name": "Coach bus simulator",
    "img": "https://i.postimg.cc/zX6H3Ct8/coach-bus-simulator-150x150.png\",     desc: \"Mod Unlimited",
    "desc": "Coach bus simulator.....",
    "category": "car",
    "rating": 4.5,
    "versions": [
      {
        "v": "2.6.0 v",
        "size": "140 MB",
        "link": "https://www.mediafire.com/file/umcbnbpo3m3rkmw/cbussim260modt-androidoyunclub.apk/file"
      }
    ]
  },
  {
    "name": "Car parking multiplayer ",
    "img": "https://i.postimg.cc/8PPmLmmT/car-parking-multiplayer-150x150.webp",
    "desc": "Ultimate money ",
    "category": "car",
    "rating": 4.5,
    "versions": [
      {
        "v": "4.8.21.3 v",
        "size": "996 MB",
        "link": "https://www.mediafire.com/file/q1feka0dg6827h4/cpm48213modt-androidoyunclub.apk/file"
      }
    ]
  },
  {
    "name": "Brawl Stars",
    "img": "https://i.postimg.cc/cCJttXGv/brawl-stars-150x150.webp",
    "desc": "Ultimate money 💰",
    "category": "strategy",
    "rating": 4.5,
    "versions": [
      {
        "v": "56.250 v",
        "size": "449 MB",
        "link": "https://www.mediafire.com/file/bllpzau1t7zabkh/Brawl_Stars_SV1_nul-mundoperfecto.net.apk/file"
      }
    ]
  },
  {
    "name": "angry birds",
    "img": "assets/images/Angry Birds icon.jpeg",
    "desc": "Angry birds....",
    "category": "strategy",
    "versions": [
      {
        "v": "2.0v",
        "size": "333 MB",
        "link": "N"
      }
    ]
  },
  {
    "name": "Grand theft auto Vice city ",
    "img": "assets/images/grand-theft-auto-vice-city-150x150.webp",
    "desc": "Grand theft auto Vice city.....",
    "category": "action",
    "rating": 4.5,
    "versions": [
      {
        "v": "1.0",
        "size": "2.0 GB",
        "link": "Dhh"
      }
    ]
  },
  {
    "name": "Sniper 3D assassin",
    "img": "https://i.postimg.cc/KYPz1Zt6/IMG-20260106-183906-009.jpg",
    "desc": "Sniper 3D assassin.....",
    "category": "action",
    "versions": [
      {
        "v": "4.33.6 v",
        "size": "175 MB",
        "link": "https://www.mediafire.com/file/z5g33yqv8t5csgb/sniper-3d-assassin-v4.33.6-mod1.apk/file"
      },
      {
        "v": "2.5.0v",
        "size": "180 MB",
        "link": ""
      }
    ]
  },
  {
    "name": "Subway Surfers",
    "img": "assets/images/Subway Surfers_icon.png",
    "desc": "Subway Surfers.....",
    "category": "sports",
    "versions": [
      {
        "v": "v 3.43.5",
        "size": "189 MB",
        "link": "https://github.com/Ahmedyemen20/Bmodee/releases/download/v1.0.0/subway-surfers-3-48-5.apk"
      }
    ]
  }
];



  /* =========================
     دوال مساعدة: رابط جوجل بلاي + جلب الصور
  ========================== */
  function getPlayStoreSearchLink(name) {
    return `https://play.google.com/store/search?q=${encodeURIComponent(name)}&c=apps`;
  }

  function tryLoadImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ ok: true, url });
      img.onerror = () => resolve({ ok: false });
      img.src = url;
    });
  }

  async function fetchImageForName(name) {
    if (!name) return "/no-image.png";
    try {
      const unsplash = `https://source.unsplash.com/640x360/?${encodeURIComponent(name)},game`;
      const res1 = await tryLoadImage(unsplash);
      if (res1.ok) return res1.url;
    } catch (_) {}
    try {
      const flickr = `https://loremflickr.com/640/360/${encodeURIComponent(name)}`;
      const res2 = await tryLoadImage(flickr);
      if (res2.ok) return res2.url;
    } catch (_) {}
    return "/no-image.png";
  }

  /* =========================
     تفعيل أزرار الأدمن والمساعد الذكي
     شرط الظهور: ?admin=true أو localStorage.isAdmin === 'true'
  ========================== */
  if (adminBtn) adminBtn.style.display = "none";
  if (smartBtn) smartBtn.style.display = "none";

  const isAdmin = location.search.includes("admin=true") || localStorage.getItem("isAdmin") === "true";

  if (isAdmin) {
    if (adminBtn) {
      adminBtn.style.display = "flex";
      adminBtn.addEventListener('click', (e) => {
        // تجاهل النقر على زر المساعد الذكي الداخلي
        if (e.target && (e.target.id === 'smartBtn' || e.target.closest && e.target.closest('#smartBtn'))) return;
        if (adminPanel) {
          adminPanel.style.display = "flex";
          renderAdminPanelForNew();
        }
      });
    }

    if (smartBtn) {
      smartBtn.style.display = "inline-flex";
      smartBtn.style.zIndex = '100005';
      smartBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          if (typeof smartAddGame === 'function') await smartAddGame();
        } catch (err) {
          alert('حدث خطأ عند تشغيل المساعد الذكي. افتح Console للمزيد.');
        }
      });
    }
  }

  window.closeAdmin = () => {
    if (adminPanel) adminPanel.style.display = "none";
    renderGames();
    renderPagination();
  };

  /* =========================
     البحث (search)
  ========================== */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target.value || "").trim().toLowerCase();
      currentPage = 1;
      renderGames();
      renderPagination();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      currentPage = 1;
      renderGames();
      renderPagination();
    });
  }

  /* =========================
     دمج وتصفيه الألعاب
  ========================== */
  function getAllGames() {
    return [...baseGames, ...adminGames];
  }

  function getFilteredGames() {
    let list = getAllGames();
    if (currentCategory && currentCategory !== "all") {
      list = list.filter(g => g.category === currentCategory);
    }
    if (searchQuery) {
      list = list.filter(g => (g.name || "").toLowerCase().includes(searchQuery));
    }
    return list;
    }
    
      /* =========================
     عرض الألعاب
  ========================== */
  function renderGames() {
    if (!gamesGrid) return;
    gamesGrid.innerHTML = "";
    
    const games = getFilteredGames();
    const start = (currentPage - 1) * gamesPerPage;
    const slice = games.slice(start, start + gamesPerPage);
    
    slice.forEach(game => {
      const index = adminGames.findIndex(g => g.name === game.name && g.versions && JSON.stringify(g.versions) === JSON.stringify(game.versions));
      const isAdminGame = index !== -1;
      
      const card = document.createElement("div");
      card.className = "game-card";
      card.onclick = () => {
        try {
          sessionStorage.setItem('selectedGame', JSON.stringify(game));
        } catch (e) {}
        location.href = `game.html?name=${encodeURIComponent(game.name)}${isAdmin ? "&admin=true" : ""}`;
      };
      
      card.innerHTML = `
        <img src="${game.img}" onerror="this.src='/no-image.png'">
        <h3>${game.name}</h3>
        <p>${game.desc || ""}</p>
        <p><a class="source-link" href="${getPlayStoreSearchLink(game.name)}" target="_blank" rel="noopener">مصدر (Google Play)</a></p>
        ${isAdmin && isAdminGame ? `
          <div class="admin-actions" onclick="event.stopPropagation()">
            <button onclick="editGame(${index})" class="edit">✏️</button>
            <button onclick="removeGame(${index})" class="del">🗑</button>
          </div>
        ` : ``}
      `;
      gamesGrid.appendChild(card);
    });
    
    if (games.length === 0) {
      gamesGrid.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px">لا توجد ألعاب مطابقة</div>`;
    }
  }
  
  /* =========================
     Pagination
  ========================== */
  function renderPagination() {
    if (!pagination) return;
    pagination.innerHTML = "";
    const pages = Math.max(1, Math.ceil(getFilteredGames().length / gamesPerPage));
    for (let i = 1; i <= pages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener('click', () => {
        currentPage = i;
        renderGames();
        renderPagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      pagination.appendChild(btn);
    }
  }
  
  /* =========================
     ربط أقسام الشريط الجانبي
     يدعم data-category وأيضًا الروابط التي تستدعي renderByCategory مباشرة
  ========================== */
  function bindSidebarCategories() {
    if (!sidebar) return;
    // أزرار data-category
    const catButtons = sidebar.querySelectorAll('[data-category]');
    catButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = btn.dataset.category || "all";
        window.renderByCategory(cat);
      });
    });
    // روابط <a href="?category=...">
    const catLinks = sidebar.querySelectorAll('a[href*="category="]');
    catLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const u = new URL(a.href, location.href);
        const cat = u.searchParams.get('category') || "all";
        window.renderByCategory(cat);
      });
    });
  }
  
  /* =========================
     وظائف قابلة للاستدعاء من HTML
  ========================== */
  window.renderByCategory = cat => {
    currentCategory = cat || "all";
    currentPage = 1;
    // افراغ البحث عند تغيير القسم (اختياري)
    searchQuery = "";
    if (searchInput) searchInput.value = "";
    renderGames();
    renderPagination();
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  };
  
  window.renderAll = () => window.renderByCategory("all");
  
  /* =========================
     إدارة الإصدارات داخل لوحة الأدمن
  ========================== */
  let editingIndex = null;
  window.tempVersions = window.tempVersions || []; // نجعلها متاحة عالمياً لأن saveGame قد يعتمد عليها
  
  function renderVersionsInPanel() {
    if (!versionsDiv) return;
    versionsDiv.innerHTML = "";
    window.tempVersions.forEach((v, i) => {
      const div = document.createElement("div");
      div.className = "admin-version";
      div.innerHTML = `
        <input placeholder="الإصدار" value="${v.v || ''}" data-i="${i}" class="ver-v">
        <input placeholder="الحجم" value="${v.size || ''}" data-i="${i}" class="ver-size">
        <input placeholder="رابط التحميل" value="${v.link || ''}" data-i="${i}" class="ver-link">
        <button class="del" data-i="${i}">حذف</button>
      `;
      versionsDiv.appendChild(div);
    });
    
    // ربط الحقول بالأحداث
    versionsDiv.querySelectorAll(".ver-v").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions[i].v = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".ver-size").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions[i].size = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".ver-link").forEach(el => {
      el.oninput = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions[i].link = e.target.value;
      };
    });
    versionsDiv.querySelectorAll(".del").forEach(btn => {
      btn.onclick = (e) => {
        const i = Number(e.target.dataset.i);
        window.tempVersions.splice(i, 1);
        renderVersionsInPanel();
      };
    });
  }
  
  window.addVersionPrompt = () => {
    window.tempVersions.push({ v: "", size: "", link: "" });
    renderVersionsInPanel();
  };
  
  window.removeVersionFromPanel = (i) => {
    window.tempVersions.splice(i, 1);
    renderVersionsInPanel();
  };
  
  function renderAdminPanelForNew() {
    editingIndex = null;
    window.tempVersions = [];
    if (aName) aName.value = "";
    if (aImg) aImg.value = "";
    if (aDesc) aDesc.value = "";
    if (aCategory) aCategory.value = "";
    renderVersionsInPanel();
  }
  
  window.saveGame = () => {
  const name = aName ? aName.value.trim() : "";
  const img = aImg ? aImg.value.trim() : "";
  const desc = aDesc ? aDesc.value.trim() : "";
  const category = aCategory ? aCategory.value : "";
  
  if (!name) {
    alert("الرجاء إدخال اسم اللعبة");
    return;
  }
  
  if (window.tempVersions.length === 0) {
    window.tempVersions.push({ v: "1.0", size: "", link: "#" });
  }
  
  const gameObj = { name, img: img || "/no-image.png", desc, category, versions: window.tempVersions.map(v => ({ v: v.v, size: v.size, link: v.link })) };
  
  if (editingIndex === null) {
    adminGames.push(gameObj);
  } else {
    adminGames[editingIndex] = gameObj;
  }
  
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  alert("تم الحفظ بنجاح");
  window.closeAdmin();
  renderGames();
  renderPagination();
};

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
  window.tempVersions = g.versions ? g.versions.map(v => ({ v: v.v, size: v.size, link: v.link })) : [];
  renderVersionsInPanel();
  if (adminPanel) adminPanel.style.display = "flex";
};

window.removeGame = (index) => {
  if (!confirm("هل تريد حذف هذه اللعبة من إضافات الأدمن؟")) return;
  adminGames.splice(index, 1);
  localStorage.setItem("adminGames", JSON.stringify(adminGames));
  renderGames();
  renderPagination();
};

/* =========================
   المساعد الذكي (smartAddGame)
   السلوك المعدل: الوصف = "اسم اللعبة Mod Ultimate money 💰"
========================== */
async function smartAddGame() {
  const name = prompt("اسم اللعبة (الإضافة الذكي) - اكتب اسم اللعبة:");
  if (!name) return;
  
  // جلب صورة مناسبة تلقائياً
  const imgUrl = await fetchImageForName(name);
  
  // املأ الحقول في لوحة الأدمن وافتحها للمراجعة قبل الحفظ
  editingIndex = null;
  window.tempVersions = [{ v: "1.0", size: "", link: "#" }];
  if (aName) aName.value = name;
  if (aImg) aImg.value = imgUrl || "/no-image.png";
  
  // الوصف المطلوب: اسم اللعبة + " Mod Ultimate money 💰"
  if (aDesc) aDesc.value = `${name} Mod Ultimate money 💰`;
  
  if (aCategory && aCategory.options.length) {
    aCategory.value = aCategory.options[1]?.value || "";
  }
  renderVersionsInPanel();
  
  if (adminPanel) adminPanel.style.display = "flex";
  
  alert("تم جلب صورة تلقائيًا. راجع الحقول ثم اضغط حفظ.");
}
window.smartAddGame = smartAddGame;

/* =========================
   ربط الأقسام وتهيئة عند التحميل
========================== */
bindSidebarCategories();

// قراءة category من الـ URL عند التحميل (مثال: index.html?category=action)
const urlParams = new URLSearchParams(location.search);
const initialCategory = urlParams.get('category');
if (initialCategory) {
  window.renderByCategory(initialCategory);
}

/* =========================
   تهيئة أولية
========================== */
(function init() {
  renderGames();
  renderPagination();
})();

// Export / Import adminGames (ضع داخل DOMContentLoaded)
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

function exportAdminGames() {
  const data = JSON.parse(localStorage.getItem('adminGames') || '[]');

  const jsContent =
`// Auto-generated file
// Generated from Admin Panel
const baseGames = ${JSON.stringify(data, null, 2)};
`;

  const blob = new Blob([jsContent], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'baseGames.js';
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function importAdminGamesFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array');
      localStorage.setItem('adminGames', JSON.stringify(parsed));
      alert('تم استيراد الألعاب بنجاح. حدث الصفحة ليظهر المحتوى.');
      // إعادة تحميل أو إعادة رسم الألعاب:
      adminGames = parsed; // if adminGames variable is in scope
      renderGames();
      renderPagination();
    } catch (err) {
      alert('فشل استيراد الملف: ' + err.message);
    }
  };
  reader.readAsText(file);
}

if (exportBtn) exportBtn.addEventListener('click', exportAdminGames);
if (importBtn) importBtn.addEventListener('click', () => importFile.click());
if (importFile) importFile.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (f) importAdminGamesFile(f);
});

// مثال: تحميل ملف JSON مركزي ودمجه مع adminGames
const SHARED_JSON_URL = 'https://raw.githubusercontent.com/Ahmedyemen20/Bmodee/main/shared-games.json';
// ===== استبدل الدالة الحالية fetchSharedGames() في main.js بهذه النسخة الآمنة =====
async function fetchSharedGames() {
    try {
      const res = await fetch(SHARED_JSON_URL);
      if (!res.ok) return;
      const shared = await res.json();
      if (!Array.isArray(shared)) return;
      
      // حفظ sharedGames بشكل منفصل — لا نغيّر adminGames (حتى لا تظهر في الأدمن)
      try {
        localStorage.setItem('sharedGames', JSON.stringify(shared));
      } catch (e) {
        console.warn('Failed to save sharedGames to localStorage', e);
      }
      
      // أعد رسم الواجهة العامة إذا كانت دالة مخصصة متوفرة (GameManager أو renderPublic محلية)
      // إذا قمت بإضافة admin-games-filter.js فستستفيد من GameManager.refreshPublic
      try {
        if (window.GameManager && typeof GameManager.refreshPublic === 'function') {
          GameManager.refreshPublic('gamesContainer');
        } else {
          // fallback آمن: حاول إعادة رسم باستخدام الدوال الموجودة (إن كانت تقرأ من localStorage.sharedGames)
          if (typeof renderGames === 'function') {
            renderGames();
            if (typeof renderPagination === 'function') renderPagination();
          }
        }
      } catch (e) {
        console.warn('Error while attempting to refresh public UI after loading sharedGames', e);
      }
    } catch (err) {
   console.warn('fetchSharedGames error', err);
 }
 }
 
 // تأكد أن الاستدعاء fetchSharedGames() يبقى كما هو (أو أعد تفعيله هنا) — الدالة الآن لن >
 
 // استدعاء أثناء تهيئة التطبيق
 fetchSharedGames();
 
 });
