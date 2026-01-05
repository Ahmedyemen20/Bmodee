const games = {
  hayday: {
    name: "Hay Day",
    img: "/unnamed (2).jpg",
    versions: {
      "1.0": {
        size: "150 MB",
        link: "https://www.mediafire.com/file/v1/hayday1.apk"
      },
      "2.1": {
        size: "180 MB",
        link: "https://www.mediafire.com/file/v2/hayday2.apk"
      }
    }
  }
};

// قراءة القيم من الرابط
const params = new URLSearchParams(window.location.search);
const gameKey = params.get("game");
const version = params.get("v");

const game = games[gameKey];

if (!game || !game.versions[version]) {
  document.body.innerHTML = "<h2>اللعبة أو الإصدار غير موجود</h2>";
} else {
  document.getElementById("gameImg").src = game.img;
  document.getElementById("gameName").textContent = game.name;
  document.getElementById("gameVersion").textContent = "الإصدار: " + version;
  document.getElementById("gameSize").textContent = "الحجم: " + game.versions[version].size;
  document.getElementById("downloadBtn").href = game.versions[version].link;
}