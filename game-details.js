document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     جلب اسم اللعبة من الرابط
  ========================= */
  const params = new URLSearchParams(window.location.search);
  const gameName = params.get("name");

  if (!gameName) {
    document.body.innerHTML = "<h2>❌ اللعبة غير موجودة</h2>";
    return;
  }

  /* =========================
     الألعاب الأساسية
  ========================= */
  const baseGames = [
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
  const adminGames = JSON.parse(localStorage.getItem("adminGames")) || [];

  const allGames = [...baseGames, ...adminGames];

  /* =========================
     البحث عن اللعبة
  ========================= */
  const game = allGames.find(g => g.name === gameName);

  if (!game) {
    document.body.innerHTML = "<h2>❌ اللعبة غير موجودة</h2>";
    return;
  }

  /* =========================
     عرض البيانات
  ========================= */
  document.getElementById("gameImg").src = game.img;
  document.getElementById("gameName").textContent = game.name;
  document.getElementById("gameDesc").textContent = game.desc || "";

  const versionsDiv = document.getElementById("versions");
  versionsDiv.innerHTML = "";

  game.versions.forEach(ver => {
    const div = document.createElement("div");
    div.className = "version-item";
    div.innerHTML = `
      <span>📦 الإصدار: ${ver.v}</span>
      <span>💾 الحجم: ${ver.size || "-"}</span>
      <a href="${ver.link}" target="_blank" class="download-btn">
        ⬇ تحميل
      </a>
    `;
    versionsDiv.appendChild(div);
  });

});