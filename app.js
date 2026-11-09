const $ = (selector) => document.querySelector(selector);
const hairNames = ['焦糖翹翹', '莓果雙丸子', '紫芋鮑伯', '薄荷捲捲', '蜜桃側瀏海', '藍莓刺蝟'];
const faceNames = ['笑眼彎彎', '電量耗盡', '眼淚汪汪', '開心尖叫', '氣成河豚', '愛心發射'];
const presets = ['☀️ 今天心情超好', '🫠 電量只剩 1%', '🌿 想放空一下', '💪 繼續努力中', '☁️ 有一點點低落', '✨ 小事也值得開心'];
const presetText = (preset) => preset.slice(preset.indexOf(' ') + 1);
const encouragements = [
  '不必完美，只要是你。',
  '慢慢來，你正走在自己的路上。',
  '今天的小小一步，也值得為自己鼓掌。',
  '休息一下，也是好好前進的一部分。',
  '你值得被溫柔對待，也包括被自己。',
  '每一種心情，都值得被好好接住。',
  '先照顧好自己，再出發也來得及。',
  '不需要和別人一樣，你有自己的光。',
  '今天的你，已經很努力了。',
  '小小的快樂，也能讓今天亮一點。',
  '把步伐放慢，也能看見沿途的美好。',
  '允許自己有不順利的日子。',
  '能說出自己的心情，就是一種勇敢。',
  '給自己一點時間，花也有自己的花期。',
  '你不需要一直很棒，也值得被喜歡。',
  '別忘了，也為自己的努力說聲謝謝。',
  '今天先做到這裡，也可以。',
  '把溫柔留一份給自己。',
  '每一次重新開始，都算數。',
  '願你在平凡的今天，遇見一點小驚喜。',
  '再小的進步，也是你努力的證明。',
  '你可以用自己的速度，靠近想去的地方。',
  '偶爾停下來，是為了聽見自己的聲音。',
  '今天還有好多值得期待的小事。',
  '你的存在，本身就很珍貴。',
  '不用急著有答案，先陪自己待一會兒。',
  '給自己一個擁抱，今天也辛苦了。',
  '就算走得慢，你也沒有白走。',
  '勇敢不一定大聲，也可以是再試一次。',
  '把今天過成自己喜歡的一小格。',
  '別讓一次不順利，替你定義全部的自己。',
  '你正在學習，也正在慢慢長大。',
  '心裡有點累的時候，就對自己輕一點。',
  '好好吃飯、好好睡覺，也是在認真生活。',
  '每一個認真的你，都值得被看見。',
  '不用撐成別人的樣子，做自己就很好。',
  '願你相信，自己也有創造美好的能力。',
  '今天可以先做一件讓自己開心的小事。',
  '你走過的每一步，都在累積自己的力量。',
  '就算今天有點灰，也可以留一盞小燈。',
  '練習喜歡自己，從今天的一句鼓勵開始。',
  '遇到困難時，尋求幫忙也是一種力量。',
  '把注意力放回此刻，你已經在這裡了。',
  '你可以一邊不確定，一邊勇敢往前走。',
  '為自己的小小成就，開一場迷你慶祝。',
  '有些美好，正在日常的小角落等你。',
  '讓自己喘口氣，世界可以等一下。',
  '你值得擁有讓自己安心的生活。',
  '今天的心情，明天也可以有新的樣子。',
  '願你今天，也能找到一個微笑的理由。'
];
let hair = 0, face = 0, records = [], toastTimer;
const storageKey = 'kimochi-moments-v1';
const config = window.KIMOCHI_CONFIG || {};
const shared = Boolean(config.endpoint);
let pendingSubmission = null;
const hairs = [
  '<path d="M35 88Q22 46 53 34Q63 25 60 17Q82 17 86 30Q115 20 127 53L123 90L110 76L104 55L86 64L84 52L56 67L46 63L47 88Z" fill="#ad6b49"/><path d="M48 48Q61 35 76 38" stroke="#eab588" stroke-width="6" fill="none" stroke-linecap="round"/>',
  '<circle cx="38" cy="35" r="19" fill="#a34a76"/><circle cx="122" cy="35" r="19" fill="#a34a76"/><path d="M33 91Q26 39 80 35Q133 39 126 91L111 77L105 57Q81 76 54 57L47 91Z" fill="#b85c89"/><path d="M25 52L42 48M117 48L135 52" stroke="#ffc553" stroke-width="7" stroke-linecap="round"/>',
  '<path d="M24 124L27 65Q29 27 80 27Q129 27 133 69L137 125Q120 135 109 122L107 59L92 66L89 54L53 65L50 123Q37 135 24 124Z" fill="#8d74ba"/><path d="M37 73L35 110" stroke="#bba1e0" stroke-width="6" stroke-linecap="round"/><path d="M104 48L116 53" stroke="#ffcf62" stroke-width="6" stroke-linecap="round"/>',
  '<path d="M35 94Q16 83 29 66Q12 49 34 39Q31 17 53 25Q67 7 82 22Q102 8 114 28Q137 24 132 47Q149 59 131 76Q139 92 121 98L109 70L104 54Q91 64 80 49Q69 67 52 59L48 96Z" fill="#4e9a92"/><path d="M40 43Q44 29 57 36M91 32Q108 24 115 40" fill="none" stroke="#8dd2bf" stroke-width="6" stroke-linecap="round"/>',
  '<path d="M33 89Q20 52 48 34Q71 19 84 30Q105 12 127 32Q129 49 118 58L126 88L110 79L103 55Q84 77 47 67L48 90Z" fill="#d47c6b"/><path d="M58 47Q83 31 104 37" stroke="#f5b29b" stroke-width="7" fill="none" stroke-linecap="round"/>',
  '<path d="M34 90L22 62L35 63L24 38L46 46L43 20L65 34L80 11L92 32L116 18L112 42L137 38L126 62L138 68L122 93L109 73L104 57L56 64L47 91Z" fill="#597db5"/><path d="M61 44L79 29L83 46" fill="#9fbeed"/>'
];
const faces = [
  '<path d="M53 89Q62 72 71 89M90 89Q99 72 108 89"/><path d="M64 108Q81 115 98 108Q93 129 81 130Q69 128 64 108Z" fill="#76465a"/><path d="M72 124Q81 116 91 124" stroke="#f49db2" stroke-width="7"/>',
  '<path d="M53 84L71 87M90 87L108 84M57 91L69 93M93 93L105 91M69 116L92 116"/><path d="M114 76Q125 90 116 94Q107 91 114 76" fill="#8fcbdc" stroke="none"/><path d="M47 106L57 103M104 103L114 106" stroke="#b5a1c2"/>',
  '<path d="M52 78L70 73M91 73L109 78"/><ellipse cx="62" cy="91" rx="9" ry="11" fill="#fff"/><ellipse cx="100" cy="91" rx="9" ry="11" fill="#fff"/><circle cx="64" cy="92" r="5" fill="currentColor" stroke="none"/><circle cx="98" cy="92" r="5" fill="currentColor" stroke="none"/><path d="M55 100L55 116M108 100L108 116" stroke="#89c8e5" stroke-width="8"/><path d="M70 120Q81 109 92 120"/>',
  '<path d="M53 82L68 89L53 96M108 82L93 89L108 96"/><path d="M61 108Q81 116 101 108Q99 135 81 136Q63 135 61 108Z" fill="#75455e"/><path d="M71 130Q81 119 93 130" stroke="#f48db1" stroke-width="8"/><path d="M64 111L98 111" stroke="#fff" stroke-width="5"/>',
  '<path d="M52 77L71 85M91 85L110 77"/><ellipse cx="62" cy="94" rx="5" ry="7" fill="currentColor" stroke="none"/><ellipse cx="100" cy="94" rx="5" ry="7" fill="currentColor" stroke="none"/><path d="M71 117Q81 107 91 117"/><circle cx="55" cy="109" r="10" fill="#f8b4bd" stroke="none"/><circle cx="107" cy="109" r="10" fill="#f8b4bd" stroke="none"/><path d="M120 73L126 68L130 75M125 81L132 83" stroke="#d87190"/>',
  '<path d="M62 97L51 87Q46 76 55 76Q60 76 62 81Q68 71 74 78Q80 85 62 97ZM100 97L89 87Q84 76 93 76Q98 76 100 81Q106 71 112 78Q118 85 100 97Z" fill="#ef78a4" stroke="#d96391" stroke-width="2"/><path d="M69 111Q81 127 94 111"/>'
];
function avatarSvg(h, f, mode = 'all') {
  const head = '<path d="M43 82Q29 75 31 92Q32 106 45 103M117 82Q131 75 129 92Q128 106 115 103" fill="#ffe5cf" stroke="currentColor" stroke-width="2.5"/><path d="M42 73Q42 36 81 36Q120 36 120 75L117 106Q112 142 81 144Q49 142 44 108Z" fill="#ffead6" stroke="currentColor" stroke-width="2.5"/>';
  const blush = '<ellipse cx="54" cy="105" rx="9" ry="5" fill="#f4a0a6" opacity=".65"/><ellipse cx="108" cy="105" rx="9" ry="5" fill="#f4a0a6" opacity=".65"/>';
  return `<svg viewBox="${mode === 'face' ? '37 64 88 80' : '0 0 160 160'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="color:#69455b">${mode !== 'face' ? head + hairs[h] : ''}${mode !== 'hair' ? `${blush}<g fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${faces[f]}<path d="M81 94L78 102Q82 105 85 102" stroke-width="2.5"/></g>` : ''}</svg>`;
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
function loadSharedRecords() {
  return new Promise((resolve, reject) => {
    const callback = `kimochi_${crypto.randomUUID().replaceAll('-', '')}`;
    const script = document.createElement('script');
    const cleanup = () => { clearTimeout(timeout); delete window[callback]; script.remove(); };
    const timeout = setTimeout(() => { cleanup(); reject(new Error('讀取逾時，請稍後按「更新心情牆」重試。')); }, 20000);
    window[callback] = (data) => {
      cleanup();
      if (!data.ok || !Array.isArray(data.records)) { reject(new Error(data.message || '暫時無法讀取心情牆。')); return; }
      records = data.records.filter(r => r && typeof r.name === 'string' && typeof r.mood === 'string' && Number.isInteger(r.hair) && r.hair >= 0 && r.hair < hairs.length && Number.isInteger(r.face) && r.face >= 0 && r.face < faces.length && Number.isFinite(Date.parse(r.time)));
      renderRecords();
      $('#record-count').textContent = `${data.total} 個此刻`;
      $('#storage-status').textContent = '共用心情牆 · 顯示最近 200 筆。管理者修改或刪除後，按更新即可同步。';
      resolve(records);
    };
    script.onerror = () => { cleanup(); reject(new Error('無法連線，請稍後重試。')); };
    const url = new URL(config.endpoint); url.searchParams.set('callback', callback); url.searchParams.set('_', Date.now());
    script.src = url.href; document.head.append(script);
  });
}
async function refreshWall() {
  $('#refresh').disabled = true;
  $('#storage-status').textContent = '正在收集大家的心情……';
  try { await loadSharedRecords(); }
  catch (error) { $('#storage-status').textContent = error.message; }
  finally { $('#refresh').disabled = false; }
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
$('#encouragement-text').textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
$('#encouragement').addEventListener('click', () => {
  const text = $('#encouragement-text');
  const choices = encouragements.filter(sentence => sentence !== text.textContent);
  text.textContent = choices[Math.floor(Math.random() * choices.length)];
});
$('#checkin').addEventListener('submit', async event => {
  event.preventDefault();
  for (const [id, message] of [['name', '請輸入你的名字或暱稱'], ['mood', '寫下一句心情，或點選一個預設心情吧']]) {
    if (!$( `#${id}`).value.trim()) { $(`#${id}`).setCustomValidity(message); $(`#${id}`).reportValidity(); return; }
  }
  const record = { name: $('#name').value.trim(), mood: $('#mood').value.trim(), hair, face, time: new Date().toISOString() };
  if (shared) {
    const signature = JSON.stringify([record.name, record.mood, hair, face]);
    if (!pendingSubmission || pendingSubmission.signature !== signature) pendingSubmission = { signature, record: { ...record, id: crypto.randomUUID() } };
    const submitted = pendingSubmission.record;
    const button = $('#checkin .submit');
    button.disabled = true; button.textContent = '正在收藏這一刻……';
    try {
      await fetch(config.endpoint, { method: 'POST', mode: 'no-cors', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(submitted), signal: AbortSignal.timeout(25000) });
      let confirmed = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        const latest = await loadSharedRecords();
        if (latest.some(r => r.id === submitted.id)) { confirmed = true; break; }
        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1500));
      }
      if (!confirmed) throw new Error('尚未確認寫入。請稍後再按送出，相同內容不會重複寫入。');
      pendingSubmission = null;
      notify('✓ 已加入大家的心情牆，這一刻被好好收藏了！');
    } catch (error) {
      notify(error.name === 'TimeoutError' ? '連線逾時，請稍後再按送出確認。' : error.message);
    } finally {
      button.disabled = false; button.innerHTML = '把這一刻留下來 <span>↗</span>';
    }
    return;
  }
  records.unshift(record);
  let saved = true;
  try { localStorage.setItem(storageKey, JSON.stringify(records)); } catch { saved = false; }
  renderRecords(); notify(saved ? '✓  已收藏這一刻，謝謝你照顧自己的心情。' : '已顯示這一刻；瀏覽器無法儲存，關閉後不會保留。');
});
if (!shared) try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) records = stored.filter(r => r && typeof r.name === 'string' && typeof r.mood === 'string' && Number.isInteger(r.hair) && r.hair >= 0 && r.hair < hairs.length && Number.isInteger(r.face) && r.face >= 0 && r.face < faces.length && typeof r.time === 'string' && Number.isFinite(Date.parse(r.time)));
} catch { records = []; }
updatePreview(); renderRecords();
if (shared) {
  $('.privacy').textContent = '免登入打卡 · 姓名與心情會顯示在共用牆上，請用暱稱。';
  $('#refresh').hidden = false;
  $('#refresh').addEventListener('click', refreshWall);
  $('#admin-link').href = config.adminUrl;
  $('#admin-link').hidden = !config.adminUrl;
  refreshWall();
}
