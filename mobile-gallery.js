/* Mobile native gallery: leave desktop coverflow unchanged. */
(() => {
  if (!matchMedia('(max-width:700px)').matches) return;
  const original=document.getElementById('cfStage');
  if (!original) return;
  const style=document.createElement('style');
  style.id='mobile-native-gallery-style';
  style.textContent=[
    '@media(max-width:700px){',
    'html{overflow-x:hidden!important;overflow-y:visible!important}',
    'body{overflow-x:hidden!important;overflow-y:visible!important;touch-action:auto!important}',
    '.portfolio-section,.coverflow{overflow:visible!important;touch-action:auto!important}',
    '#cfStage{display:flex!important;align-items:center!important;gap:12px!important;position:relative!important;width:100%!important;height:380px!important;',
    'padding:10px max(16px,calc((100vw - min(80vw,290px))/2))!important;overflow-x:auto!important;overflow-y:hidden!important;',
    'overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory!important;',
    'scrollbar-width:none;touch-action:auto!important;perspective:none!important;transform-style:flat!important;cursor:auto!important}',
    '#cfStage::-webkit-scrollbar{display:none}',
    '#cfStage .cf-item{position:relative!important;top:auto!important;left:auto!important;flex:0 0 min(80vw,290px)!important;',
    'width:min(80vw,290px)!important;height:330px!important;margin:0!important;scroll-snap-align:center!important;',
    'scroll-snap-stop:always;transform:none!important;opacity:1!important;filter:none!important;',
    'pointer-events:auto!important;will-change:auto!important}',
    '#cfStage .cf-card{transform:none!important;-webkit-box-reflect:none!important}',
    '.cf-arrow{top:180px!important;touch-action:manipulation;min-width:44px;min-height:44px}',
    '.cf-caption{min-height:0!important;height:auto!important;padding:14px 18px 36px!important;overflow:visible!important}',
    '.cf-title{overflow-wrap:anywhere;line-height:1.25}',
    '.cf-desc{height:auto!important;max-height:none!important;white-space:normal!important;overflow:visible!important}',
    '}'
  ].join('');
  document.head.append(style);
  // Drop previous 3D hit-testing and synthetic pointer swipe listeners on mobile.
  const stage=original.cloneNode(true);
  original.replaceWith(stage);
  if(typeof cfEls!=='undefined') cfEls=[...stage.querySelectorAll('.cf-item')];
  const cards=()=>[...stage.querySelectorAll('.cf-item')];
  let lastScroll=0,queued=false;
  const updateActive=()=>{
    const els=cards();if(!els.length)return;
    const box=stage.getBoundingClientRect(),center=box.left+box.width/2;
    let nearest=0,distance=Infinity;
    els.forEach((el,i)=>{const r=el.getBoundingClientRect();const d=Math.abs(r.left+r.width/2-center);if(d<distance){nearest=i;distance=d}});
    if(typeof cfActive!=='undefined'&&cfActive!==nearest){
      cfActive=nearest;
      if(typeof cfUpdateCaption==='function')cfUpdateCaption();
      if(typeof updateContextualGuide==='function')updateContextualGuide();
    }
  };
  stage.addEventListener('scroll',()=>{
    lastScroll=performance.now();
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;updateActive()});
  },{passive:true});
  const moveTo=index=>{
    const els=cards();if(!els.length)return;
    const target=((index%els.length)+els.length)%els.length;
    if(typeof cfActive!=='undefined')cfActive=target;
    const sr=stage.getBoundingClientRect(),cr=els[target].getBoundingClientRect();
    stage.scrollTo({left:stage.scrollLeft+cr.left-sr.left-(sr.width-cr.width)/2,behavior:'smooth'});
    if(typeof cfUpdateCaption==='function')cfUpdateCaption();
    if(typeof updateContextualGuide==='function')updateContextualGuide();
    if(typeof navigator.vibrate==='function')try{navigator.vibrate(8)}catch(_){}
  };
  window.cfMove=dir=>moveTo((typeof cfActive!=='undefined'?cfActive:0)+dir);
  window.cfGoTo=index=>moveTo(index);
  stage.addEventListener('click',e=>{
    if(performance.now()-lastScroll<350)return;
    const el=e.target.closest('.cf-item');if(!el)return;
    const index=Number(el.dataset.i);if(!Number.isInteger(index))return;
    if(typeof cfActive!=='undefined'&&index===cfActive){
      if(typeof cfOpen==='function')cfOpen(index);
    }else moveTo(index);
  });
  updateActive();
})();