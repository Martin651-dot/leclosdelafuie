/* ============================================================
   Le Clos de la Fuie — app.js
   ============================================================ */
(function(){
  'use strict';
  const $  = (s,c)=> (c||document).querySelector(s);
  const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));

  /* ---------------- i18n ---------------- */
  let lang = localStorage.getItem('lcf-lang') || 'fr';
  const DICT = window.I18N, DATA = window.I18N_DATA;

  // Capture the text written directly in the page as the FRENCH source of truth.
  // This means any edit made directly in index.html is preserved and never
  // overwritten by the dictionary on load. The dictionary's FR entries become
  // fallbacks only (used if an element has no inline text yet).
  $$('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    const inline = el.innerHTML.trim();
    if(inline) DICT.fr[k] = inline;   // page text wins for French
  });

  function applyLang(l){
    lang = l;
    localStorage.setItem('lcf-lang', l);
    document.documentElement.lang = l;
    const d = DICT[l];
    $$('[data-i18n]').forEach(el=>{
      const k = el.getAttribute('data-i18n');
      if(d[k] != null) el.innerHTML = d[k];
    });
    $$('#lang button').forEach(b=> b.classList.toggle('on', b.dataset.lang===l));
    buildEquip(); buildTips(); buildReviews(); buildFaq();
  }
  $$('#lang button').forEach(b=> b.addEventListener('click', ()=> applyLang(b.dataset.lang)));

  /* ---------------- dynamic content ---------------- */
  function buildEquip(){
    const ul = $('#equip'); if(!ul) return;
    const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-11"/></svg>';
    ul.innerHTML = DATA[lang].equip.map(e=> `<li>${check}<span>${e}</span></li>`).join('');
  }
  function buildTips(){
    const box = $('#tips'); if(!box) return;
    const d = DICT[lang];
    box.innerHTML = DATA[lang].tips.map((t,i)=>`
      <div class="tip">
        <div class="mi">${i+1}</div>
        <div><h4>${d[t+'.h']}</h4><p>${d[t+'.p']}</p></div>
      </div>`).join('');
  }
  function buildReviews(){
    const box = $('#reviews'); if(!box) return;
    box.innerHTML = DATA[lang].reviews.map(r=>`
      <div class="review">
        <div style="display:flex;align-items:center"><span class="stars">${'★'.repeat(r.s)}</span><span class="src">${r.src}</span></div>
        <blockquote>${r.q}</blockquote>
        <div class="who"><span class="av">${r.n[0]}</span><div><div class="nm">${r.n}</div><div class="dt">${r.d}</div></div></div>
      </div>`).join('');
  }
  function buildFaq(){
    const box = $('#faq-list'); if(!box) return;
    box.innerHTML = DATA[lang].faq.map(f=>`
      <div class="qa">
        <button type="button"><span>${f.q}</span><span class="pm"></span></button>
        <div class="ans"><p>${f.a}</p></div>
      </div>`).join('');
    $$('.qa button', box).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const qa = btn.parentElement;
        const open = qa.classList.contains('open');
        $$('.qa', box).forEach(o=>{ o.classList.remove('open'); $('.ans',o).style.maxHeight = null; });
        if(!open){ qa.classList.add('open'); const a=$('.ans',qa); a.style.maxHeight = a.scrollHeight+'px'; }
      });
    });
  }

  /* ---------------- nav scroll ---------------- */
  const nav = $('#nav');
  const onScroll = ()=>{
    nav.classList.toggle('solid', window.scrollY > 40);
    document.body.classList.toggle('scrolled', window.scrollY > 40);
    const mc = $('#mobileCta');
    if(mc){
      const heroH = window.innerHeight * .7;
      const footEl = $('.footer');
      const nearFoot = footEl ? (window.scrollY + window.innerHeight > footEl.offsetTop + 60) : false;
      mc.classList.toggle('show', window.scrollY > heroH && !nearFoot);
    }
  };
  window.addEventListener('scroll', onScroll, {passive:true});

  /* ---------------- mobile menu ---------------- */
  const mm = $('#mobileMenu'), tog = $('#navToggle');
  function closeMenu(){ mm.classList.remove('open'); tog.classList.remove('on'); document.body.style.overflow=''; }
  tog.addEventListener('click', ()=>{
    const open = mm.classList.toggle('open');
    tog.classList.toggle('on', open);
    nav.classList.toggle('solid', open || window.scrollY>40);
    document.body.classList.toggle('scrolled', open || window.scrollY>40);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#mobileMenu a').forEach(a=> a.addEventListener('click', closeMenu));

  /* ---------------- smooth anchor offset ---------------- */
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if(id.length<2) return;
      const t = document.querySelector(id);
      if(!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({top:y, behavior:'smooth'});
    });
  });

  /* ---------------- reveal on scroll ---------------- */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(el=> io.observe(el));
  // Fallback: reveal anything already in view on load (covers IO timing / capture contexts)
  function revealInView(){
    $$('.reveal:not(.in)').forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < window.innerHeight*0.96 && r.bottom > 0){ el.classList.add('in'); io.unobserve(el); }
    });
  }
  window.addEventListener('load', ()=>{ revealInView(); setTimeout(revealInView, 300); });
  revealInView();

  /* ---------------- lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let gallery = [], idx = 0;
  function collectGallery(){
    gallery = $$('[data-src]').map(el=> ({src:el.dataset.src, cap:el.dataset.cap||''}));
  }
  function openLb(i){
    idx = (i+gallery.length)%gallery.length;
    lbImg.src = gallery[idx].src;
    lbCap.textContent = gallery[idx].cap;
    lb.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeLb(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  document.addEventListener('click', e=>{
    const el = e.target.closest('[data-src]');
    if(el){ collectGallery(); const i = gallery.findIndex(g=>g.src===el.dataset.src); openLb(i); }
  });
  $('#lbX').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', ()=> openLb(idx-1));
  $('#lbNext').addEventListener('click', ()=> openLb(idx+1));
  lb.addEventListener('click', e=>{ if(e.target===lb) closeLb(); });
  document.addEventListener('keydown', e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') closeLb();
    if(e.key==='ArrowLeft') openLb(idx-1);
    if(e.key==='ArrowRight') openLb(idx+1);
  });

  /* ---------------- calendar ---------------- */
  // Saturdays of summer 2026, week = Sat->Sat. Mark some booked.
  const MONTHS = {
    fr:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
    en:['January','February','March','April','May','June','July','August','September','October','November','December']
  };
  const DOW = { fr:['L','M','M','J','V','S','D'], en:['M','T','W','T','F','S','S'] };
  // booked individual dates (ISO) — derived from booked weeks
  // booked ranges (start ISO + nights) — flexible arrival, not fixed weeks
  const bookedRanges = [
    {start:'2026-06-13', nights:6},
    {start:'2026-07-11', nights:9},
    {start:'2026-08-01', nights:11},
    {start:'2026-09-05', nights:5},
  ];
  function isBooked(date){
    return bookedRanges.some(r=>{
      const s = new Date(r.start+'T00:00:00');
      const e = new Date(s); e.setDate(e.getDate()+r.nights);
      return date>=s && date<e;
    });
  }
  function buildMonth(year, month){ // month 0-indexed
    const first = new Date(year, month, 1);
    let startDow = (first.getDay()+6)%7; // Monday=0
    const days = new Date(year, month+1, 0).getDate();
    const today = new Date('2026-06-01');
    let cells = '';
    for(let i=0;i<startDow;i++) cells += '<div class="cal-cell empty"></div>';
    for(let d=1; d<=days; d++){
      const date = new Date(year, month, d);
      let cls = 'cal-cell', iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      if(date < today){ cls += ' busy'; }
      else if(isBooked(date)){ cls += ' busy'; }
      else { cls += ' free'; }
      const isSat = date.getDay()===6;
      cells += `<div class="${cls}" data-iso="${iso}" ${isSat&&cls.includes('free')?'data-sat="1"':''}>${d}</div>`;
    }
    return `<div class="cal">
      <h4>${MONTHS[lang][month]} ${year} <span class="av"></span></h4>
      <div class="cal-grid">${DOW[lang].map(x=>`<div class="dow">${x}</div>`).join('')}${cells}</div>
    </div>`;
  }
  function buildCalendar(){
    const wrap = $('#calWrap'); if(!wrap) return;
    wrap.innerHTML = buildMonth(2026,5) + buildMonth(2026,6) + buildMonth(2026,7) + buildMonth(2026,8); // Jun → Sep
    // click a free date → arrival there, departure = minimum stay (4 nights, 7 in summer)
    $$('.cal-cell.free', wrap).forEach(c=>{
      c.addEventListener('click', ()=>{
        const iso = c.dataset.iso;
        const s = new Date(iso+'T00:00:00');
        const isSummer = (s.getMonth()===6 || s.getMonth()===7); // Jul/Aug
        const minN = isSummer ? 7 : 4;
        const e = new Date(s); e.setDate(e.getDate()+minN);
        // don't run the default stay into a booked date
        for(let d=new Date(s); d<e; d.setDate(d.getDate()+1)){
          if(isBooked(d)) return;
        }
        highlightWeek(s,e);
        const fmt = dt=>{ const m=String(dt.getMonth()+1).padStart(2,'0'), day=String(dt.getDate()).padStart(2,'0'); return `${dt.getFullYear()}-${m}-${day}`; };
        const arr=$('#fArrive'), dep=$('#fDepart');
        if(arr) arr.value = fmt(s);
        if(dep) dep.value = fmt(e);
        const ss=$('#fSeason'); if(ss) ss.selectedIndex = isSummer ? 2 : 1;
        const form=$('#bookForm');
        if(form){ const y=form.getBoundingClientRect().top+window.scrollY-90; window.scrollTo({top:y,behavior:'smooth'}); }
        flash(form);
      });
    });
  }
  function highlightWeek(s,e){
    $$('.cal-cell').forEach(c=>{
      c.style.boxShadow=''; c.style.outline='';
      if(!c.dataset.iso) return;
      const d = new Date(c.dataset.iso+'T00:00:00');
      if(d>=s && d<e && c.classList.contains('free')){
        c.style.background='var(--moss)'; c.style.color='#fff'; c.style.fontWeight='700';
      } else if(c.classList.contains('free')){
        c.style.background=''; c.style.color=''; c.style.fontWeight='';
      }
    });
  }
  function flash(el){
    if(!el) return;
    el.style.transition='box-shadow .4s';
    el.style.boxShadow='0 0 0 3px var(--moss), var(--shadow-md)';
    setTimeout(()=> el.style.boxShadow='', 1400);
  }

  /* ---------------- booking form ---------------- */
  const form = $('#bookForm');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const d = DICT[lang];
      form.innerHTML = `<div class="form-success">
        <div class="ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="30" height="30"><path d="m5 12 5 5 9-11"/></svg></div>
        <h3>${d['form.okh']}</h3>
        <p>${d['form.okp']}</p>
      </div>`;
    });
  }

  /* ---------------- init ---------------- */
  buildCalendar();
  applyLang(lang);
  onScroll();
})();
