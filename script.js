// ===== STATE =====
const picks = {};
let noCount = 0;
let courtNoCount = 0;
let pwInput = '';
const PW = '060526';

// ===== BG =====
function spawnBg() {
  const canvas = document.getElementById('bgCanvas');
  const lilyEmojis = ['🌸','🌷','🌺','🌼','🌻','💐','🪷'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'lily';
    el.textContent = lilyEmojis[Math.floor(Math.random()*lilyEmojis.length)];
    el.style.left = Math.random()*100+'vw';
    el.style.fontSize = (1.2+Math.random()*1.8)+'rem';
    el.style.animationDuration = (12+Math.random()*18)+'s';
    el.style.animationDelay = (Math.random()*20)+'s';
    canvas.appendChild(el);
  }
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.style.left = Math.random()*100+'vw';
    el.style.animationDuration = (8+Math.random()*14)+'s';
    el.style.animationDelay = (Math.random()*25)+'s';
    el.style.background = Math.random()>.5
      ? 'radial-gradient(ellipse,#f4a0b8,#e8638a)'
      : 'radial-gradient(ellipse,#fde8ef,#f4a0b8)';
    canvas.appendChild(el);
  }
}

// ===== NAVIGATION =====
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const next = document.getElementById(id);
  next.classList.add('active');
  const card = next.querySelector('.card');
  if (card) { card.classList.remove('slide-in'); void card.offsetWidth; card.classList.add('slide-in'); }
  if (id === 'screen-yes') { populateYes(); launchConfetti(); }
}

// ===== PASSWORD =====
function pwPress(d) {
  if (pwInput.length >= 6) return;
  pwInput += d;
  updatePwDots();
  if (pwInput.length === 6) {
    setTimeout(() => {
      if (pwInput === PW) {
        pwInput = '';
        updatePwDots();
        document.getElementById('pwError').textContent = '';
        goTo('screen-surprise-intro');
      } else {
        document.getElementById('pwError').textContent = 'wrong password 🥺 try again!';
        // shake effect: re-trigger
        const err = document.getElementById('pwError');
        err.style.animation = 'none'; void err.offsetWidth; err.style.animation = 'shake .4s ease';
        pwInput = '';
        updatePwDots();
      }
    }, 150);
  }
}
function pwBack() { pwInput = pwInput.slice(0,-1); updatePwDots(); document.getElementById('pwError').textContent = ''; }
function pwClear() { pwInput = ''; updatePwDots(); document.getElementById('pwError').textContent = ''; }
function updatePwDots() {
  for (let i=0;i<6;i++) {
    document.getElementById('pd'+i).classList.toggle('filled', i < pwInput.length);
  }
}

// ===== OPTION PICK =====
function pick(btn, key, value) {
  btn.closest('.options-grid').querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  picks[key] = value;
  enableNext(btn.closest('.screen').id);
  const wrap = btn.closest('.screen').querySelector('.custom-input-wrap');
  if (wrap) wrap.classList.remove('open');
}
function enableNext(screenId) {
  const qNum = screenId.replace('screen-q','');
  const nextBtn = document.getElementById('btn-q'+qNum);
  if (nextBtn) { nextBtn.style.opacity='1'; nextBtn.style.pointerEvents='auto'; nextBtn.style.transform='scale(1.03)'; setTimeout(()=>nextBtn.style.transform='',200); }
}

// ===== CUSTOM INPUT =====
function toggleCustom(id) {
  const wrap = document.getElementById(id);
  wrap.classList.toggle('open');
  if (wrap.classList.contains('open')) wrap.querySelector('input').focus();
}
function confirmCustom(key, inputId, nextBtnId) {
  const input = document.getElementById(inputId);
  const val = input.value.trim();
  if (!val) { input.focus(); return; }
  picks[key] = val;
  const screen = input.closest('.screen');
  screen.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  const toggle = screen.querySelector('.custom-toggle');
  toggle.textContent = '✅ "'+val+'" saved!';
  toggle.style.borderColor='var(--pink-deep)'; toggle.style.color='var(--pink-deep)';
  const nextBtn = document.getElementById(nextBtnId);
  if (nextBtn) { nextBtn.style.opacity='1'; nextBtn.style.pointerEvents='auto'; }
  input.closest('.custom-input-wrap').classList.remove('open');
}

// ===== DATE NO BUTTON =====
function runAway() {
  noCount++;
  const btn = document.getElementById('btnNo');
  const container = document.getElementById('yesNoContainer');
  const maxX = container.offsetWidth - btn.offsetWidth;
  const maxY = container.offsetHeight - btn.offsetHeight - 56;
  btn.style.left = (Math.random()*Math.max(maxX,0))+'px';
  btn.style.top  = (Math.random()*Math.max(maxY,10))+'px';
  btn.style.right='auto'; btn.style.bottom='auto';
}

// ===== COURT NO BUTTON =====
function courtRunAway() {
  courtNoCount++;
  const btn = document.getElementById('courtBtnNo');
  const container = document.getElementById('courtYNContainer');
  const maxX = container.offsetWidth - btn.offsetWidth;
  const maxY = container.offsetHeight - btn.offsetHeight - 56;
  btn.style.left = (Math.random()*Math.max(maxX,0))+'px';
  btn.style.top  = (Math.random()*Math.max(maxY,10))+'px';
  btn.style.right='auto'; btn.style.bottom='auto';
}

// ===== YAYYY POPUP =====
function showYayyy() {
  document.getElementById('yayPopup').classList.add('show');
  launchConfetti();
}
function closePopup() {
  document.getElementById('yayPopup').classList.remove('show');
}

// ===== POPULATE YES =====
function populateYes() {
  const display = document.getElementById('picksDisplay');
  display.innerHTML = '';
  Object.values(picks).forEach(v => {
    const tag = document.createElement('span');
    tag.className='pick-tag'; tag.textContent=v;
    display.appendChild(tag);
  });
  if (picks.eat)    { document.getElementById('di2-text').textContent=picks.eat;    document.getElementById('di2-emoji').textContent='🍽️'; }
  if (picks.do)     { document.getElementById('di3-text').textContent=picks.do;     document.getElementById('di3-emoji').textContent='✨'; }
  if (picks.matcha) { document.getElementById('di4-text').textContent=picks.matcha; document.getElementById('di4-emoji').textContent='🍵'; }
  if (picks.movie)  { document.getElementById('di5-text').textContent=picks.movie;  document.getElementById('di5-emoji').textContent='🎬'; }
  if (picks.photo)  { document.getElementById('di6-text').textContent=picks.photo;  document.getElementById('di6-emoji').textContent='📸'; }
  ['di1','di2','di3','di4','di5','di6','di7'].forEach((id,i) => {
    setTimeout(() => { const el=document.getElementById(id); if(el) el.classList.add('show'); }, 400+i*180);
  });
}

// ===== DOWNLOAD CARD =====
async function downloadCard() {
  const btn = document.getElementById('btnDownload');
  btn.disabled = true;
  btn.textContent = '⏳ Saving...';
  try {
    // Temporarily hide lily corners (they overflow and clip oddly)
    const corners = document.querySelectorAll('#datePlanCard .lily-corner');
    corners.forEach(c => c.style.visibility='hidden');

    const canvas = await html2canvas(document.getElementById('datePlanCard'), {
      backgroundColor: '#fff5f8',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.getElementById('datePlanCard').scrollWidth,
      windowHeight: document.getElementById('datePlanCard').scrollHeight,
    });

    corners.forEach(c => c.style.visibility='');

    const link = document.createElement('a');
    link.download = 'our-date-plan-💕.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    btn.textContent = '✅ Saved!';
    setTimeout(() => { btn.disabled=false; btn.innerHTML='📥 Save our date plan!'; }, 2500);
  } catch(e) {
    console.error(e);
    btn.disabled=false;
    btn.innerHTML='📥 Save our date plan!';
    alert('Oops! Try right-clicking the card and saving as image 🥺');
  }
}

// ===== CONFETTI =====
function launchConfetti() {
  const colors=['#e8638a','#f4a0b8','#fde8ef','#a8c5a0','#6b9e6b','#fffaf0','#d94f7c'];
  const shapes=['💗','🌸','🌷','✨','💕','🌺','⭐'];
  for(let i=0;i<60;i++) {
    setTimeout(()=>{
      const el=document.createElement('div');
      if(Math.random()>.4) {
        el.style.cssText=`position:fixed;font-size:${.8+Math.random()*1.2}rem;left:${Math.random()*100}vw;top:-20px;animation:confettiFall ${2+Math.random()*3}s linear forwards;z-index:100;pointer-events:none;`;
        el.textContent=shapes[Math.floor(Math.random()*shapes.length)];
      } else {
        el.className='confetti-piece';
        el.style.left=Math.random()*100+'vw'; el.style.top='-20px';
        el.style.background=colors[Math.floor(Math.random()*colors.length)];
        el.style.borderRadius=Math.random()>.5?'50%':'2px';
        el.style.animationDuration=(2+Math.random()*3)+'s';
        el.style.width=el.style.height=(6+Math.random()*10)+'px';
      }
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),5000);
    },i*50);
  }
}

// ===== CURSOR SPARKLE =====
document.addEventListener('mousemove',e=>{
  if(Math.random()>.85){
    const spark=document.createElement('div');
    spark.textContent=['✨','💕','🌸','⭐','💗'][Math.floor(Math.random()*5)];
    spark.style.cssText=`position:fixed;left:${e.clientX-8}px;top:${e.clientY-8}px;font-size:${.6+Math.random()*.7}rem;pointer-events:none;z-index:999;animation:sparkFade .8s ease forwards;`;
    document.body.appendChild(spark);
    setTimeout(()=>spark.remove(),800);
  }
});

spawnBg();