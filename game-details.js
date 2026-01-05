const params = new URLSearchParams(window.location.search);
const gameName = params.get('game');

const game = allGames.find(g => g.name === gameName);

if (!game) {
  document.body.innerHTML = "<h2>اللعبة غير موجودة</h2>";
}

document.getElementById('gameImg').src = game.img;
document.getElementById('gameName').textContent = game.name;
document.getElementById('gameDesc').textContent = game.desc;

const versionsBox = document.getElementById('versions');

game.versions.forEach(ver => {
  const div = document.createElement('div');
  div.className = 'version-card';
  div.innerHTML = `
    <p>الإصدار: ${ver.v}</p>
    <p>الحجم: ${ver.size}</p>
    <a href="download.html?game=${encodeURIComponent(game.name)}&v=${ver.v}">
      تحميل
    </a>
  `;
  versionsBox.appendChild(div);
});