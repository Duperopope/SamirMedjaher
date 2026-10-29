'use strict';
(() => {
  const endpoint='https://rvhrabwwxpvhupctecfg.supabase.co/functions/v1/portfolio-events';
  const key='portfolio-analytics-consent-v1';
  let consent=localStorage.getItem(key)==='yes';
  let session=crypto.randomUUID?.()||'';
  let lastSection='';
  let lastProject='';
  let lastTime=Date.now();
  const send=(event_type,event_label,duration_seconds=null)=>{
    if(!consent||!session||!navigator.onLine)return;
    const data={opt_in:true,session_id:session,event_type,event_label:String(event_label).replace(/[^\p{L}\p{N} .:_\-]/gu,'').slice(0,100)||'unknown',page_path:location.pathname,duration_seconds};
    fetch(endpoint,{method:'POST',mode:'cors',credentials:'omit',headers:{'Content-Type':'text/plain'},body:JSON.stringify(data),keepalive:event_type==='page_hidden'}).catch(()=>{});
  };
  const consentBox=document.createElement('aside');
  consentBox.setAttribute('aria-label','Statistiques de visite');
  consentBox.style.cssText='position:fixed;right:12px;bottom:12px;z-index:9998;max-width:min(340px,calc(100vw - 24px));border:1px solid #416078;border-radius:12px;background:#10243b;color:#e6eff9;padding:12px 14px;font:13px/1.5 system-ui;box-shadow:0 8px 28px #0008';
  consentBox.innerHTML='<strong>Statistiques anonymes</strong><p style="margin:6px 0">Autoriser la mesure des sections et projets consultés pour améliorer le portfolio ? Aucun nom, email ni adresse IP n’est enregistré dans les données de visite.</p><div style="display:flex;gap:8px"><button data-yes type="button" style="padding:8px;border-radius:8px">Autoriser</button><button data-no type="button" style="padding:8px;border-radius:8px">Refuser</button></div>';
  if(!localStorage.getItem(key))document.body.appendChild(consentBox);
  consentBox.addEventListener('click',e=>{
    const yes=e.target.closest('[data-yes]'),no=e.target.closest('[data-no]');
    if(!yes&&!no)return;
    consent=!!yes;localStorage.setItem(key,consent?'yes':'no');
    consentBox.remove();if(consent){send('page_view','portfolio');check();}
  });
  const check=()=>{
    if(!consent)return;
    const nodes=[...document.querySelectorAll('.portfolio-section,.main-grid,.cv-footer')];
    const visible=nodes.find(n=>{const r=n.getBoundingClientRect();return r.top<innerHeight*.6&&r.bottom>innerHeight*.3});
    const section=visible?.classList.contains('portfolio-section')?'portfolio':visible?.classList.contains('main-grid')?'cv':'footer';
    if(section!==lastSection){lastSection=section;send('section_view',section)}
    if(section==='portfolio'){
      const active=document.querySelector('#cfStage .cf-item.active .cf-cardlabel b')?.textContent?.trim();
      if(active&&active!==lastProject){lastProject=active;send('project_view',active)}
    }
  };
  let queued=false;
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;check()})}},{passive:true});
  document.getElementById('cfStage')?.addEventListener('click',()=>requestAnimationFrame(check));
  document.querySelectorAll('.cf-arrow').forEach(el=>el.addEventListener('click',()=>requestAnimationFrame(check)));
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a||!consent)return;
    try{const u=new URL(a.href);if(u.origin!==location.origin)send('outbound_click',u.hostname.replace(/[^\w.\-]/g,''))}catch{}
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden'){send('page_hidden',lastSection||'portfolio',Math.min(3600,Math.floor((Date.now()-lastTime)/1000)))}
    else lastTime=Date.now();
  });
  if(consent){send('page_view','portfolio');check()}
})();
