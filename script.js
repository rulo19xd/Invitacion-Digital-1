// Countdown
const targetDate = new Date('2025-11-29T21:00:00'); // 29/11/25 21:00
function updateCountdown(){
  const now = new Date();
  const diff = targetDate - now;
  const cl = (v)=>String(v).padStart(2,'0');
  if (diff <= 0){
    ['days','hours','minutes','seconds'].forEach(id=>document.getElementById(id).textContent='00');
    clearInterval(intv); return;
  }
  const s = Math.floor(diff/1000);
  const d = Math.floor(s/86400);
  const h = Math.floor((s%86400)/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  document.getElementById('days').textContent = d;
  document.getElementById('hours').textContent = cl(h);
  document.getElementById('minutes').textContent = cl(m);
  document.getElementById('seconds').textContent = cl(sec);
}
updateCountdown();
const intv = setInterval(updateCountdown,1000);

// Modal Regalo
toast = document.getElementById("toast");
const modal = document.getElementById('gift-modal');
document.getElementById('btn-gift')?.addEventListener('click',()=> modal.classList.add('show'));
document.getElementById('close-gift')?.addEventListener('click',()=> modal.classList.remove('show'));
modal?.addEventListener('click', (e)=> { if(e.target===modal) modal.classList.remove('show'); });
document.getElementById('copy-alias')?.addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText('sofiacumple.mp');
    toast.hidden=false;setTimeout(()=>toast.hidden=true,1600);
  }catch(e){ alert('No se pudo copiar'); }
});

// ── Carrusel “Mi Álbum” (autoplay + fade + swipe) ────────────────────────────
(function(){
  const slidesWrap = document.getElementById('album-slides');
  const dotsWrap   = document.getElementById('album-dots');
  if (!slidesWrap || !dotsWrap) return;

  const imgs = Array.from(slidesWrap.querySelectorAll('img'));
  const prev = document.querySelector('#album .nav.prev');
  const next = document.querySelector('#album .nav.next');
  let i = 0, timer = null, AUTO_MS = 5000, paused = false;

  function setActive(n){
    imgs[i].classList.remove('active');
    dotsWrap.children[i]?.classList.remove('active');
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add('active');
    dotsWrap.children[i]?.classList.add('active');
  }
  function go(n){ setActive(n); restart(); }
  function nextFn(){ go(i+1); }
  function prevFn(){ go(i-1); }

  // init
  if (imgs.length) imgs[0].classList.add('active');
  imgs.forEach((_img, idx)=>{
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Ir a imagen ' + (idx+1));
    dot.addEventListener('click', ()=> go(idx));
    dotsWrap.appendChild(dot);
  });
  dotsWrap.children[0]?.classList.add('active');

  // autoplay
  function restart(){
    if (timer) clearInterval(timer);
    if (!paused && imgs.length>1) timer = setInterval(nextFn, AUTO_MS);
  }
  restart();

  // hover pause on desktop
  const album = document.getElementById('album');
  album?.addEventListener('mouseenter', ()=>{ paused=true; if (timer) clearInterval(timer); });
  album?.addEventListener('mouseleave', ()=>{ paused=false; restart(); });

  // buttons
  prev?.addEventListener('click', prevFn);
  next?.addEventListener('click', nextFn);

  // swipe
  let startX = null;
  slidesWrap.addEventListener('touchstart', e=> startX = e.touches[0].clientX, {passive:true});
  slidesWrap.addEventListener('touchend', e=>{
    if (startX===null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx<0 ? nextFn() : prevFn());
    startX = null;
  }, {passive:true});
})();
