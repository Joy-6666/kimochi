const $ = (selector) => document.querySelector(selector);
const hairNames = ['短短瀏海', '俏皮丸子', '柔柔鮑伯', '自然捲捲', '隨性旁分', '帥氣刺蝟'];
const faceNames = ['開心微笑', '累到放空', '有點難過', '超級開心', '小小生氣', '平靜自在'];
const presets = ['☀️ 今天心情超好', '🫠 電量只剩 1%', '🌿 想放空一下', '💪 繼續努力中', '☁️ 有一點點低落', '✨ 小事也值得開心'];
const presetText = (preset) => preset.slice(preset.indexOf(' ') + 1);
let hair = 0, face = 0, records = [], toastTimer;
const storageKey = 'kimochi-moments-v1';
const hairs = [
  '<path d="M38 96Q27 45 65 35Q102 22 120 55L121 88L110 78L104 57L88 66L86 55L61 68L48 65L46 96Z" fill="currentColor"/>',
  '<circle cx="80" cy="27" r="20" fill="currentColor"/><path d="M37 92Q26 40 80 39Q132 40 122 93L109 80L105 56Q84 73 53 59L49 91Z" fill="currentColor"/>',
  '<path d="M25 124L29 69Q31 29 79 29Q125 27 131 75L136 126L111 123L108 59L93 65L91 54L52 65L48 127Z" fill="currentColor"/>',
  '<path d="M36 97Q19 82 32 65Q18 45 40 39Q35 19 58 25Q72 8 86 25Q109 12 114 33Q139 34 128 54Q143 71 123 88L109 71L106 56Q92 62 83 47Q71 66 51 60L49 95Z" fill="currentColor"/>',
  '<path d="M36 94Q25 48 59 35Q101 15 123 47L125 86L111 78L105 50Q85 75 47 70L48 94Z" fill="currentColor"/><path d="M62 40Q84 15 119 28Q117 43 104 50" fill="currentColor"/>',
  '<path d="M34 91L28 62L37 64L30 43L49 49L47 25L66 36L80 14L91 33L113 21L111 43L131 40L124 61L132 66L121 92L109 72L105 57L55 65L48 94Z" fill="currentColor"/>'
];
const faces = [
  '<path d="M55 88Q62 76 69 88M91 88Q98 76 105 88M66 110Q81 126 96 109"/>',
  '<path d="M54 85L69 85M92 85L107 85M69 115L92 115"/><path d="M61 90V94M100 90V94"/>',
  '<path d="M54 82L68 78M93 78L106 82M67 118Q80 106 94 118"/><path d="M60 90V93M101 90V93"/><path d="M107 96Q117 108 108 110Q101 109 107 96" fill="#a6c5cc" stroke="none"/>',
  '<path d="M53 86Q62 73 71 86M90 86Q99 73 108 86"/><path d="M62 106Q81 112 100 106Q96 131 81 131Q66 130 62 106Z" fill="#fff"/><path d="M66 116H96"/>',
  '<path d="M53 76L70 84M91 84L108 76M69 118Q81 108 94 118M61 91V94M101 91V94"/>',
  '<path d="M54 87Q62 94 70 87M91 87Q99 94 107 87M69 112Q81 120 93 112"/>'
];
function avatarSvg(h, f, mode = 'all') {
  const head = '<path d="M43 83Q31 77 33 93Q34 105 45 104M117 83Q129 77 127 93Q126 105 115 104" fill="#fffefa" stroke="currentColor" stroke-width="3"/><path d="M44 73Q44 39 81 39Q117 39 117 75L113 108Q107 139 81 141Q53 138 47 111Z" fill="#fffefa" stroke="currentColor" stroke-width="3"/>';
  return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="color:#30372d">${mode !== 'face' ? head + hairs[h] : ''}${mode !== 'hair' ? `<g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${faces[f]}<path d="M81 91L78 101Q83 104 86 100"/></g>${mode === 'all' ? '<ellipse cx="55" cy="104" rx="7" ry="4" fill="#edb39a" opacity=".5"/><ellipse cx="107" cy="104" rx="7" ry="4" fill="#edb39a" opacity=".5"/>' : ''}` : ''}</svg>`;
}
function updatePreview() {
  $('#avatar').innerHTML = avatarSvg(hair, face);
  $('#preview-name').textContent = $('#name').value.trim() || '嗨，這是我';
  $('#preview-mood').textContent = $('#mood').value.trim() || '每一種心情，都有自己的樣子。';
  $('#char-count').textContent = `${$('#mood').value.length} / 80`;
  $('#hair-count').textContent = `0${hair + 1} / 06`;
  $('#face-count').textContent = `0${face + 1} / 06`;
  document.querySelectorAll('[data-hair]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.hair) === hair));
  document.querySelectorAll('[data-face]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.face) === face));
  document.querySelectorAll('#presets button').forEach(b => { const selected = presetText(b.textContent) === $('#mood').value; b.classList.toggle('selected', selected); b.setAttribute('aria-pressed', selected); });
}
function notify(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('show');
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3500);
}
function renderRecords() {
  $('#record-count').textContent = `${records.length} 個此刻`;
  $('#records').replaceChildren();
  if (!records.length) { $('#records').innerHTML = '<div class="empty"><span>☻</span>這裡還是空白的，留下你的第一個此刻吧。</div>'; return; }
  for (const record of records) {
    const card = document.createElement('article'); card.className = 'record';
    const portrait = document.createElement('div'); portrait.className = 'record-avatar'; portrait.innerHTML = avatarSvg(record.hair, record.face);
    const content = document.createElement('div'); content.className = 'record-content';
    const name = document.createElement('p'); name.className = 'record-name'; name.textContent = record.name;
    const mood = document.createElement('p'); mood.className = 'record-mood'; mood.textContent = record.mood;
    const time = document.createElement('time'); time.dateTime = record.time; time.textContent = new Intl.DateTimeFormat('zh-TW', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false }).format(new Date(record.time));
    content.append(name, mood, time); card.append(portrait, content); $('#records').append(card);
  }
}
for (const [index, preset] of presets.entries()) {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = preset; button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => { $('#mood').value = presetText(preset); $('#mood').setCustomValidity(''); face = [0, 1, 5, 4, 2, 3][index]; updatePreview(); }); $('#presets').append(button);
}
for (const [type, names] of [['hair', hairNames], ['face', faceNames]]) {
  names.forEach((name, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'choice'; button.dataset[type] = index; button.setAttribute('aria-label', name); button.title = name;
    button.innerHTML = avatarSvg(type === 'hair' ? index : 0, type === 'face' ? index : 0, type);
    button.addEventListener('click', () => { if (type === 'hair') hair = index; else face = index; updatePreview(); }); $(`#${type === 'hair' ? 'hairs' : 'faces'}`).append(button);
  });
}
$('#name').addEventListener('input', () => { $('#name').setCustomValidity(''); updatePreview(); });
$('#mood').addEventListener('input', () => { $('#mood').setCustomValidity(''); updatePreview(); });
$('#random').addEventListener('click', () => { hair = Math.floor(Math.random() * hairs.length); face = Math.floor(Math.random() * faces.length); updatePreview(); });
$('#checkin').addEventListener('submit', event => {
  event.preventDefault();
  for (const [id, message] of [['name', '請輸入你的名字或暱稱'], ['mood', '寫下一句心情，或點選一個預設心情吧']]) {
    if (!$( `#${id}`).value.trim()) { $(`#${id}`).setCustomValidity(message); $(`#${id}`).reportValidity(); return; }
  }
  const record = { name: $('#name').value.trim(), mood: $('#mood').value.trim(), hair, face, time: new Date().toISOString() };
  records.unshift(record);
  let saved = true;
  try { localStorage.setItem(storageKey, JSON.stringify(records)); } catch { saved = false; }
  renderRecords(); notify(saved ? '✓  已收藏這一刻，謝謝你照顧自己的心情。' : '已顯示這一刻；瀏覽器無法儲存，關閉後不會保留。');
});
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) records = stored.filter(r => r && typeof r.name === 'string' && typeof r.mood === 'string' && Number.isInteger(r.hair) && r.hair >= 0 && r.hair < hairs.length && Number.isInteger(r.face) && r.face >= 0 && r.face < faces.length && typeof r.time === 'string' && Number.isFinite(Date.parse(r.time)));
} catch { records = []; }
updatePreview(); renderRecords();
