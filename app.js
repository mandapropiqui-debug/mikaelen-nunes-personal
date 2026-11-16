(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const NS='http://www.w3.org/2000/svg';
const WA='558694062835';
const wa=l=>`https://api.whatsapp.com/send?phone=${WA}&text=${encodeURIComponent(l.join('\n'))}`;
const ic=(n,c='ic')=>`<svg class="${c}"><use href="#i-${n}"/></svg>`;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const ease=(f)=>{let r;const loop=()=>{r=f()?requestAnimationFrame(loop):0};cancelAnimationFrame(r);loop()};

/* ---------- barra com anilhas ---------- */
function bar(svg,n){
  const H=[108,98,88,78,68,58],C=['#ffffff','#cdb8f0','#ffffff','#b79be6','#ffffff','#cdb8f0'];
  let s='<g class="bg"><rect x="10" y="60" width="320" height="10" rx="5" fill="#fff" opacity=".85"/><rect x="150" y="57" width="40" height="16" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>';
  s+='<rect x="94" y="40" width="9" height="50" rx="3" fill="#fff"/><rect x="237" y="40" width="9" height="50" rx="3" fill="#fff"/>';
  for(let k=0;k<n;k++){
    const h=H[k],y=65-h/2,xl=90-(k+1)*14,xr=250+k*14;
    s+=`<rect class="plate" data-k="${k}" x="${xl}" y="${y}" width="11" height="${h}" rx="4" fill="${C[k]}"/><rect class="plate" data-k="${k}" x="${xr}" y="${y}" width="11" height="${h}" rx="4" fill="${C[k]}"/>`;
  }
  svg.innerHTML=s+'</g>';
  return{add:k=>$$('.plate[data-k="'+k+'"]',svg).forEach(p=>p.classList.add('on')),
    lift:()=>$('.bg',svg).classList.add('lift'),clear:()=>$$('.plate',svg).forEach(p=>p.classList.remove('on'))};
}

/* ---------- abertura ---------- */
const intro=$('#intro');let istep=0;
const ib=bar($('#ibar'),2);
document.documentElement.style.overflow='hidden';
function closeIntro(){
  if(intro.classList.contains('out'))return;
  intro.classList.add('out');document.documentElement.style.overflow='';
  setTimeout(()=>intro.remove(),1700);
}
$('#skip').onclick=closeIntro;
$('#load').onclick=()=>{
  if(istep>1)return;
  ib.add(istep);istep++;
  $$('.dots i').forEach((d,i)=>d.classList.toggle('on',i<=istep));
  if(istep===1)$('#load span').textContent='Colocar a segunda anilha';
  else{$('#load span').textContent='Barra carregada';ib.lift();setTimeout(closeIntro,1000)}
};

/* ---------- menu ---------- */
const menu=$('#menu'),links=$$('#menu a'),secs=$$('main section');
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const id=e.target.id;
  links.forEach(a=>{const on=a.getAttribute('href')==='#'+id;a.classList.toggle('on',on);
    if(on){const ul=a.closest('ul');ul.scrollTo({left:a.offsetLeft-ul.clientWidth/2+a.clientWidth/2,behavior:'smooth'})}});
  menu.classList.toggle('lt',e.target.dataset.th==='dark');
}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>so.observe(s));
menu.classList.add('lt');

/* ---------- revelar + contagem ---------- */
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}}),{threshold:.1});
$$('.rev').forEach(e=>ro.observe(e));
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);
  const t=+e.target.dataset.c,pre=e.target.dataset.pre||'',t0=performance.now();
  (function f(n){const p=clamp((n-t0)/1600,0,1);e.target.textContent=pre+Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
$$('[data-c]').forEach(e=>co.observe(e));

/* ---------- TRIAGEM ---------- */
const A={};let T=0;
const tb=bar($('#tbar'),6);
const prog=$('#prog');prog.innerHTML='<i></i>'.repeat(6);
const qs=$$('#tri .q');
function mark(){$$('i',prog).forEach((d,i)=>{d.className=i<T?'on':i===T?'cur':''});$('#tcount').textContent=T<6?`Pergunta ${T+1} de 6`:'Pronto: raspe a carta'}
mark();
function next(){
  tb.add(T);T++;mark();
  qs.forEach(q=>q.classList.remove('cur'));
  if(T<6){qs[T].classList.add('cur');init[T]&&init[T]()}else{showResult()}
}
const init={};

/* Q1 arco */
const OBJ=['Emagrecer','Hipertrofia','Correr melhor','Bem-estar','Gestação ou pós-parto'];
(()=>{
  const arc=$('#arc'),wh=$('.wheel',arc),STEP=26;let rot=0,sel=0,moved=0;
  const els=OBJ.map((t,i)=>{const b=document.createElement('button');b.type='button';b.className='opt';b.textContent=t;b.setAttribute('role','option');
    wh.appendChild(b);return b});
  function draw(){els.forEach((b,i)=>{b.style.transform=`rotate(${i*STEP+rot}deg)`;const d=Math.abs(i*STEP+rot);b.style.opacity=clamp(1-d/80,.12,1)});
    sel=clamp(Math.round(-rot/STEP),0,OBJ.length-1);els.forEach((b,i)=>{b.classList.toggle('sel',i===sel);b.setAttribute('aria-selected',i===sel)})}
  function go(t){ease(()=>{rot+=(t-rot)*.18;draw();return Math.abs(t-rot)>.1})}
  let x0,r0,t0,v=0,down=false;
  arc.onpointerdown=e=>{down=true;x0=e.clientX;r0=rot;t0=performance.now();v=0;moved=0;arc.setPointerCapture(e.pointerId)};
  arc.onpointermove=e=>{if(!down)return;const dx=e.clientX-x0;moved=Math.max(moved,Math.abs(dx));const n=clamp(r0+dx*.33,-(OBJ.length-1)*STEP-8,8);v=(n-rot);rot=n;draw()};
  arc.onpointerup=arc.onpointercancel=e=>{if(!down)return;down=false;
    if(moved<6){const el=document.elementFromPoint(e.clientX,e.clientY),o=el&&el.closest&&el.closest('.opt');if(o){go(-els.indexOf(o)*STEP);return}}
    go(clamp(Math.round((rot+v*6)/STEP)*STEP,-(OBJ.length-1)*STEP,0))};
  draw();
  $('[data-ok]',qs[0]).onclick=()=>{A.obj=sel;next()};
})();

/* Q2 régua */
const TEMPO=[['0','Nunca treinei'],['<6m','Menos de 6 meses'],['6–12m','6 a 12 meses'],['1–2a','1 a 2 anos'],['2–3a','2 a 3 anos'],['3a+','Mais de 3 anos']];
init[1]=()=>{
  const r=$('#ruler'),rv=$('#rv');let ti=2;
  if(!r.children.length)TEMPO.forEach((t,i)=>{const d=document.createElement('div');d.className='tick';d.textContent=t[0];d.onclick=()=>r.scrollTo({left:i*76,behavior:'smooth'});r.appendChild(d)});
  const upd=()=>{ti=clamp(Math.round(r.scrollLeft/76),0,5);$$('.tick',r).forEach((t,i)=>t.classList.toggle('sel',i===ti));rv.textContent=TEMPO[ti][1]};
  r.onscroll=upd;r.scrollLeft=2*76;upd();
  let dn=false,x0,s0;
  r.onpointerdown=e=>{if(e.pointerType!=='mouse')return;dn=true;x0=e.clientX;s0=r.scrollLeft;r.style.scrollSnapType='none';r.setPointerCapture(e.pointerId)};
  r.onpointermove=e=>{if(dn)r.scrollLeft=s0-(e.clientX-x0)};
  r.onpointerup=()=>{if(!dn)return;dn=false;r.style.scrollSnapType='';r.scrollTo({left:ti*76,behavior:'smooth'})};
  r.onkeydown=e=>{if(e.key==='ArrowRight')r.scrollBy({left:76,behavior:'smooth'});if(e.key==='ArrowLeft')r.scrollBy({left:-76,behavior:'smooth'})};
  $('[data-ok]',qs[1]).onclick=()=>{A.tempo=ti;next()};
};

/* Q3 dial */
init[2]=()=>{
  const d=$('#dial');let v=3;
  const R=88,c=108,pt=(a,r=R)=>[c+r*Math.sin(a*Math.PI/180),c-r*Math.cos(a*Math.PI/180)];
  const arcp=(a0,a1)=>{const p0=pt(a0),p1=pt(a1);return`M${p0[0]} ${p0[1]}A${R} ${R} 0 ${a1-a0>180?1:0} 1 ${p1[0]} ${p1[1]}`};
  let dots='';for(let i=0;i<7;i++){const p=pt(-135+i*45,R+14);dots+=`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#fff" opacity=".7"/>`}
  d.innerHTML=`<svg viewBox="0 0 216 216"><circle cx="108" cy="108" r="100" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.35)"/><path d="${arcp(-135,135)}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="10" stroke-linecap="round"/><path id="da" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>${dots}<circle id="dk" r="15" fill="#fff" stroke="#9B7BD6" stroke-width="5"/></svg><div class="num"><span id="dn">3</span><small>dias por semana</small></div>`;
  const da=$('#da',d),dk=$('#dk',d),dn=$('#dn',d);
  const set=n=>{v=clamp(n,1,7);const a=-135+(v-1)*45;da.setAttribute('d',arcp(-135,a+.01));const p=pt(a);dk.setAttribute('cx',p[0]);dk.setAttribute('cy',p[1]);dn.textContent=v;d.setAttribute('aria-valuenow',v)};
  set(3);let dn_=false;
  const fromPt=e=>{const b=d.getBoundingClientRect(),x=e.clientX-b.left-b.width/2,y=e.clientY-b.top-b.height/2;let a=Math.atan2(x,-y)*180/Math.PI;
    if(a<-135&&a>-180)a=-135;if(a>135)a=135;if(a<=-180+1&&a>=-180)a=-135;set(Math.round((a+135)/45)+1)};
  d.onpointerdown=e=>{dn_=true;d.setPointerCapture(e.pointerId);fromPt(e)};d.onpointermove=e=>{if(dn_)fromPt(e)};d.onpointerup=d.onpointercancel=()=>dn_=false;
  d.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowUp')set(v+1);if(e.key==='ArrowLeft'||e.key==='ArrowDown')set(v-1)};
  $('[data-ok]',qs[2]).onclick=()=>{A.dias=v;next()};
};

/* Q4 cartas */
init[3]=()=>{
  const deck=$('#deck');deck.innerHTML='';
  const D=[['lesao','Você sente dor ou já teve uma lesão que limita o seu treino hoje?'],['tere','Você está em Teresina e quer treinar presencialmente?']];
  const cards=D.map((d,i)=>{const c=document.createElement('div');c.className='sw'+(i?' back':'');c.style.zIndex=10-i;c.innerHTML=`<em class="n">NÃO</em><em class="y">SIM</em>${d[1]}`;deck.appendChild(c);return c});
  let idx=0;
  const top=()=>cards[idx];
  function fly(yes){
    const c=top();if(!c)return;A[D[idx][0]]=yes;c.classList.remove('drag');c.style.transform=`translateX(${yes?420:-420}px) rotate(${yes?24:-24}deg)`;c.style.opacity=0;
    idx++;const n=cards[idx];if(n){n.classList.remove('back');n.style.transform=''}
    if(idx>=D.length)setTimeout(next,500);
  }
  $('#swy').onclick=()=>fly(true);$('#swn').onclick=()=>fly(false);
  let x0=0,dn=false;
  deck.onpointerdown=e=>{if(!top())return;dn=true;x0=e.clientX;top().classList.add('drag');deck.setPointerCapture(e.pointerId)};
  deck.onpointermove=e=>{if(!dn||!top())return;const dx=e.clientX-x0,c=top();c.style.transform=`translateX(${dx}px) rotate(${dx*.07}deg)`;$('.y',c).style.opacity=clamp(dx/90,0,1);$('.n',c).style.opacity=clamp(-dx/90,0,1)};
  deck.onpointerup=deck.onpointercancel=e=>{if(!dn||!top())return;dn=false;const dx=e.clientX-x0,c=top();
    if(Math.abs(dx)>90)fly(dx>0);else{c.classList.remove('drag');c.style.transform='';$('.y',c).style.opacity=0;$('.n',c).style.opacity=0}};
};

/* Q5 semanas */
init[4]=()=>{
  const wk=$('#wk'),wv=$('#wv');wk.innerHTML='';let w=12;
  const bars=[];for(let i=0;i<21;i++){const b=document.createElement('i');b.style.height=(26+i*3.4)+'%';wk.appendChild(b);bars.push(b)}
  const set=n=>{w=clamp(n,4,24);bars.forEach((b,i)=>b.classList.toggle('on',i<=w-4));wv.textContent=w+' semanas';wk.setAttribute('aria-valuenow',w)};
  set(12);let dn=false;
  const fp=e=>{const b=wk.getBoundingClientRect();set(4+Math.round(clamp((e.clientX-b.left)/b.width,0,1)*20))};
  wk.onpointerdown=e=>{dn=true;wk.setPointerCapture(e.pointerId);fp(e)};wk.onpointermove=e=>{if(dn)fp(e)};wk.onpointerup=wk.onpointercancel=()=>dn=false;
  wk.onkeydown=e=>{if(e.key==='ArrowRight')set(w+1);if(e.key==='ArrowLeft')set(w-1)};
  $('[data-ok]',qs[4]).onclick=()=>{A.sem=w;next()};
};

/* Q6 carta que vira */
const TRAVA=['Falta de tempo','Falta de constância','Não sei por onde começar','Medo de me lesionar'];
init[5]=()=>{
  const f=$('#flip'),b=$('#flipb');f.classList.remove('on');
  b.innerHTML=TRAVA.map((t,i)=>`<button type="button" data-i="${i}">${t}</button>`).join('');
  $('#flipf').onclick=()=>f.classList.add('on');
  $$('button',b).forEach(x=>x.onclick=()=>{A.trava=+x.dataset.i;next()});
};

/* resultado + raspadinha */
const PL={bi:['Bimestral','2 meses','R$ 350,00','em até 2x'],tri:['Trimestral','3 meses','R$ 500,00','em até 3x'],se:['Semestral','6 meses','R$ 900,00','em até 6x']};
function showResult(){
  const res=$('#res');res.classList.add('cur');
  const g=A.obj===4;let route,pl=null;
  if(g)route='Conversa direta com a Mikaelen';
  else if(A.tere)route='Atendimento presencial';
  else{pl=A.sem<=8?PL.bi:A.sem<=12?PL.tri:PL.se;route='Consultoria on-line · '+pl[0]}
  const rows=[['Objetivo',OBJ[A.obj]],['Tempo de treino',TEMPO[A.tempo][1]],['Dias por semana',A.dias],['Dor ou lesão',A.lesao?'Sim':'Não'],['Em Teresina',A.tere?'Sim':'Não'],['Compromisso',A.sem+' semanas'],['Maior trava',TRAVA[A.trava]]];
  let note=g?'Gestação e pós-parto pedem conversa direta: a Mikaelen avalia o seu momento antes de qualquer coisa. ':'';
  if(A.lesao)note+='Você marcou dor ou lesão. Conte isso a ela na conversa, pois a avaliação inicial é dela. ';
  note+='Orientação de por onde começar. Não é diagnóstico, prescrição nem promessa de resultado.';
  $('#rbody').innerHTML=`<span class="kick" style="color:#7050A0">${ic('barbell-fill')}Seu caminho sugerido</span><h3>${route}</h3>${pl?`<p style="font-weight:600;margin-top:4px">${pl[1]} por ${pl[2]}, ${pl[3]}</p>`:''}<ul>${rows.map(r=>`<li><b>${r[0]}</b><span>${r[1]}</span></li>`).join('')}</ul><p class="note">${note}</p>`;
  const msg=['Olá, Mikaelen!','Vim pelo seu site e montei minha barra.',`Objetivo: ${OBJ[A.obj]}`,`Tempo de treino: ${TEMPO[A.tempo][1]}`,`Dias por semana: ${A.dias}`,`Dor ou lesão: ${A.lesao?'sim':'não'}`,`Estou em Teresina: ${A.tere?'sim':'não'}`,`Compromisso: ${A.sem} semanas`,`Maior trava: ${TRAVA[A.trava]}`,`Caminho sugerido: ${route}`,'Podemos conversar?'];
  let h=`<a class="btn" href="${wa(msg)}" target="_blank" rel="noopener">${ic('whatsapp-logo-fill')}Enviar minhas respostas a ela</a>`;
  if(pl)h+=`<a class="btn ghost" href="https://www.mfitpersonal.com.br/p/m9d" target="_blank" rel="noopener">${ic('barbell-fill')}Ver a consultoria no MFIT</a>`;
  h+=`<button class="btn ghost" type="button" id="redo">${ic('arrow-counter-clockwise')}Montar de novo</button>`;
  const acts=$('#acts');acts.innerHTML=h;acts.classList.remove('show');
  $('#redo').onclick=()=>{T=0;tb.clear();res.classList.remove('cur');qs[0].classList.add('cur');mark();$('#coat').classList.remove('gone')};
  scratch();
}
function scratch(){
  const cv=$('#coat'),box=cv.parentElement,acts=$('#acts');
  cv.classList.remove('gone');
  const dpr=Math.min(2,devicePixelRatio||1),W=box.clientWidth,H=box.clientHeight;
  cv.width=W*dpr;cv.height=H*dpr;const x=cv.getContext('2d');x.scale(dpr,dpr);x.globalCompositeOperation='source-over';
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#5d3d8f');g.addColorStop(.5,'#9B7BD6');g.addColorStop(1,'#2B1A4A');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=2;for(let r=30;r<Math.max(W,H);r+=26){x.beginPath();x.arc(W/2,H/2,r,0,7);x.stroke()}
  x.fillStyle='#fff';x.textAlign='center';x.font='700 34px Cormorant,serif';x.fillText('Raspe aqui',W/2,H/2-4);x.font='500 15px Hanken Grotesk,sans-serif';x.fillText('Passe o dedo para ver o seu caminho',W/2,H/2+26);
  x.globalCompositeOperation='destination-out';
  const GX=20,GY=14,seen=new Set();let dn=false,lx,ly,n=0;
  const hit=(px,py)=>{for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const cx=Math.floor((px+i*22)/W*GX),cy=Math.floor((py+j*22)/H*GY);if(cx>=0&&cx<GX&&cy>=0&&cy<GY)seen.add(cx+','+cy)}};
  const done=()=>{cv.classList.add('gone');acts.classList.add('show');const s=$('#skipS');s&&s.remove()};
  const pos=e=>{const b=cv.getBoundingClientRect();return[e.clientX-b.left,e.clientY-b.top]};
  cv.onpointerdown=e=>{dn=true;cv.setPointerCapture(e.pointerId);[lx,ly]=pos(e);x.beginPath();x.arc(lx,ly,20,0,7);x.fill();hit(lx,ly)};
  cv.onpointermove=e=>{if(!dn)return;const[px,py]=pos(e);x.lineWidth=40;x.lineCap='round';x.beginPath();x.moveTo(lx,ly);x.lineTo(px,py);x.stroke();lx=px;ly=py;hit(px,py);if(++n%4===0&&seen.size/(GX*GY)>.5)done()};
  cv.onpointerup=cv.onpointercancel=()=>dn=false;
  if(!$('#skipS')){const s=document.createElement('button');s.id='skipS';s.type='button';s.className='btn ghost';s.style.cssText='min-height:44px;margin-top:10px;width:100%';s.textContent='Revelar sem raspar';s.onclick=done;box.after(s)}
}

/* ---------- SOBRE: rolagem ---------- */
const ring=$('#ring'),tl=$('#tl'),tfill=$('#tfill'),sts=$$('.st',tl);
let tick=false;
function onScroll(){
  tick=false;
  ring.style.transform=`rotate(${scrollY*.18}deg)`;
  const r=tl.getBoundingClientRect(),vh=innerHeight,p=clamp((vh*.62-r.top)/r.height,0,1);
  tfill.style.height=(p*100)+'%';
  sts.forEach(s=>s.classList.toggle('on',s.offsetTop+16<p*r.height));
}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* ---------- ANTES E DEPOIS: lenticular ---------- */
const SETS=[['Pós-parto · perfil','ba1',540/1080],['Pós-parto · frente','ba2',540/1080],['Aluno · frente','ba3',720/1034],['Aluno · costas','ba4',720/1036],['Aluno · perfil','ba5',720/1036]];
const lent=$('#lent'),ang=$('#ang'),tabs=$('#tabs'),NF=24;let cur=0,aV=0,auto=!reduce,facets=[];
for(let i=0;i<NF;i++){const f=document.createElement('div');f.className='fc';f.style.left=(i*100/NF)+'%';f.style.width=`calc(${100/NF}% + .6px)`;
  f.innerHTML='<i class="A"></i><i class="B"></i><i class="pr"></i>';lent.appendChild(f);facets.push(f)}
function setLent(k){
  cur=k;const s=SETS[k];
  $$('.tab',tabs).forEach((t,i)=>t.classList.toggle('on',i===k));
  facets.forEach((f,i)=>{const pos=(i/(NF-1)*100)+'% 0';[['A','a'],['B','b']].forEach(([c,sfx])=>{const e=$('.'+c,f);e.style.backgroundImage=`url(img/${s[1]}${sfx}.webp)`;e.style.backgroundSize=NF*100+'% 100%';e.style.backgroundPosition=pos})});
  size();
}
function size(){const s=SETS[cur];const w=Math.min(360,innerWidth-40,innerHeight*.74*s[2]);lent.style.width=w+'px';lent.style.aspectRatio=s[2]}
function paint(a){
  aV=a;ang.value=Math.round(a*100);
  facets.forEach((f,i)=>{let th=.12+.76*(i/(NF-1));if(i%2)th=1-th;const m=clamp((a-th)*7+.5,0,1);
    $('.B',f).style.opacity=m;$('.pr',f).style.opacity=(.25+.75*(1-Math.abs(m-.5)*2)).toFixed(2)});
  $('.l1',lent).style.opacity=1-a;$('.l2',lent).style.opacity=a;
}
SETS.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='tab';b.textContent=s[0];b.onclick=()=>setLent(i);tabs.appendChild(b)});
addEventListener('resize',size);
setLent(2);paint(0);
let t0=performance.now(),vis=false;
(function loop(n){if(auto&&vis)paint((Math.sin((n-t0)/1600-1.2)+1)/2);requestAnimationFrame(loop)})(t0);
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(lent);
const stop=()=>auto=false;
ang.oninput=()=>{stop();paint(ang.value/100)};
let ld=false;const lp=e=>{const b=lent.getBoundingClientRect();paint(clamp((e.clientX-b.left)/b.width,0,1))};
lent.onpointerdown=e=>{stop();ld=true;lent.setPointerCapture(e.pointerId);lp(e)};
lent.onpointermove=e=>{if(ld||e.pointerType==='mouse'){stop();lp(e)}};
lent.onpointerup=lent.onpointercancel=()=>ld=false;

/* pilha de fotos */
const stack=$('#stack'),PH=['duo53','duo86','duo87','duo71','run39','run41'];
let order=PH.map((p,i)=>i);
const sc=PH.map(p=>{const d=document.createElement('div');d.className='sc';d.innerHTML=`<img src="img/${p}.webp" alt="Aluno e Mikaelen, jornada de treino" loading="eager">`;stack.appendChild(d);return d});
function layout(){order.forEach((id,pos)=>{const e=sc[id];e.style.zIndex=20-pos;e.style.opacity=pos>3?0:1;e.style.transform=`translate(${pos?(pos%2?10:-10)*pos*.6:0}px,${pos*6}px) rotate(${pos?(pos%2?1:-1)*(2+pos*1.6):0}deg) scale(${1-pos*.035})`})}
layout();
sc.forEach((e,id)=>{let dn=false,x0,y0,dx=0,dy=0;
  e.onpointerdown=ev=>{if(order[0]!==id)return;dn=true;x0=ev.clientX;y0=ev.clientY;e.classList.add('drag');e.setPointerCapture(ev.pointerId)};
  e.onpointermove=ev=>{if(!dn)return;dx=ev.clientX-x0;dy=ev.clientY-y0;e.style.transform=`translate(${dx}px,${dy}px) rotate(${dx*.08}deg)`};
  e.onpointerup=e.onpointercancel=()=>{if(!dn)return;dn=false;e.classList.remove('drag');
    if(Math.hypot(dx,dy)>60||(dx===0&&dy===0)){order.push(order.shift());e.style.transform=`translate(${dx*3}px,${dy*3}px) rotate(${dx*.2}deg)`;e.style.opacity=0;setTimeout(layout,260)}else layout();dx=dy=0}});

/* ---------- RESULTADOS: stories ---------- */
const SL=[['art3','O antes era um começo.',1],['art4','O depois é reflexo da escolha diária.',1],['art5','Constância faz acontecer.',1],['art6','O resultado é consequência.',1],['duo2','Dois alunos, quase 30 kg de gordura a menos somados.',0],['run39','E um amor novo pela corrida.',0],['run41','Treino, dieta e constância na rotina.',0]];
const sv=$('#sv'),svb=$('#svbars');let si=0,sp=0,paused=false,svVis=false,sl=[];
SL.forEach((s,i)=>{const d=document.createElement('div');d.className='sl'+(s[2]?' ct':'');d.innerHTML=`${s[2]?`<img class="bgb" src="img/${s[0]}.webp" alt="">`:''}<img class="fg" src="img/${s[0]}.webp" alt="${s[1]}" loading="eager"><div class="cap">${s[1]}</div>`;sv.insertBefore(d,svb);sl.push(d);svb.insertAdjacentHTML('beforeend','<i><b></b></i>')});
const bs=$$('b',svb);
function show(i){si=(i+SL.length)%SL.length;sp=0;sl.forEach((d,k)=>{d.classList.toggle('on',k===si);if(k===si){const im=$('.fg',d);im.style.animation='none';void im.offsetWidth;im.style.animation=''}});bs.forEach((b,k)=>b.style.transform=`scaleX(${k<si?1:0})`)}
show(0);
let last=performance.now();
(function st(n){const dt=n-last;last=n;if(svVis&&!paused){sp+=dt/4800;if(sp>=1)show(si+1);bs[si].style.transform=`scaleX(${sp})`}requestAnimationFrame(st)})(last);
new IntersectionObserver(e=>svVis=e[0].isIntersecting,{threshold:.4}).observe(sv);
$('#tzl').onclick=()=>show(si-1);$('#tzr').onclick=()=>show(si+1);
sv.onpointerdown=()=>paused=true;sv.onpointerup=sv.onpointerleave=sv.onpointercancel=()=>paused=false;

/* ---------- GESTANTES ---------- */
const GC=[['g59','Podem e devem treinar','“Mulheres grávidas não só podem, como devem sim treinar!”, frase que a Mikaelen publica no Instagram.'],
['g32','Para a mamãe e para o bebê','Mamãe: melhora a postura, reduz dores lombares, ajuda no controle do ganho de peso, aumenta a disposição e prepara o corpo para o parto e o pós-parto. Bebê: melhor oxigenação e fluxo sanguíneo.'],
['g56','Prevenção','A atividade física regular, diária ou ao menos 3 vezes por semana, pode ajudar a prevenir doenças comuns na gestação, como diabetes gestacional e hipertensão.'],
['g57','Autocuidado','Cãibras, fadiga muscular e cansaço podem ser amenizados com uma rotina de treinos.'],
['g58','Controle do peso','Controlar o peso na gestação é importante para a saúde da mãe e do bebê. A alimentação também merece atenção maior nessa fase.'],
['ges28','Gestante Atleta','Certificado entregue às alunas ao fim da jornada de treinos durante a gravidez.']];
$('#cards').innerHTML=GC.map((c,i)=>`<div class="fc2" role="button" tabindex="0" aria-label="${c[1]}: toque para virar"><div class="fl"><div class="face f"><img src="img/${c[0]}.webp" alt="${c[1]}" loading="eager"><span class="tg">${ic('arrows-left-right')}</span></div><div class="face b"><div><b>${c[1]}</b>${c[2]}</div></div></div></div>`).join('');
$$('.fc2').forEach(c=>{const t=()=>c.classList.toggle('on');c.onclick=t;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}}});

/* ---------- PLANOS ---------- */
const PLAN=[['Bimestral','2 meses','350','2'],['Trimestral','3 meses','500','3'],['Semestral','6 meses','900','6']];
$('#plans').innerHTML=PLAN.map(p=>`<article class="pl"><h3>${p[0]}</h3><div class="pr">R$ ${p[2]}<small> · ${p[1]}, em até ${p[3]}x</small></div><ul><li>${ic('check')}Treino individualizado e periodizado</li><li>${ic('check')}Acompanhamento por WhatsApp</li><li>${ic('check')}Suporte pelo aplicativo</li></ul><div class="row"><a class="btn" href="${wa(['Olá, Mikaelen!',`Quero o Plano ${p[0]} (${p[1]}).`,`Valor: R$ ${p[2]},00 em até ${p[3]}x.`,'Como eu começo?'])}" target="_blank" rel="noopener">${ic('whatsapp-logo-fill')}Quero o ${p[0]}</a><a class="btn ghost" href="https://www.mfitpersonal.com.br/p/m9d" target="_blank" rel="noopener">Ver no MFIT</a></div></article>`).join('')+
`<article class="pl pant"><span class="flag">Em destaque</span><div class="cover"><img src="img/pant46.webp" alt="Mochila PANT" loading="eager"><b>PANT</b></div><h3 style="font-size:30px;font-weight:700">Programa de Acompanhamento Nutricional e Treinamento</h3><div class="pr" style="color:#7050A0">R$ 179,90</div><ul><li>${ic('check')}E-book com estratégias alimentares e treinos completos</li><li>${ic('check')}Para homens e mulheres, de iniciantes a avançados</li><li>${ic('check')}Treinos com vídeos explicativos e sugestão de cardios</li></ul><div class="co">${ic('user-fill')}<span><b>Nutrição:</b> Lucas Almeida, nutricionista (@lucasalmeida.nutricionista)<br><b>Treino:</b> Mikaelen Nunes</span></div><a class="btn vi" href="https://go.hotmart.com/H96151090C?dp=1" target="_blank" rel="noopener">${ic('shopping-bag-fill')}Conhecer o PANT na Hotmart</a></article>`;
$$('.pl').forEach(p=>{
  p.onpointermove=e=>{if(e.pointerType==='touch')return;const b=p.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;p.style.transform=`perspective(700px) rotateY(${(x-.5)*8}deg) rotateX(${(.5-y)*8}deg)`;p.style.setProperty('--mx',x*100+'%');p.style.setProperty('--my',y*100+'%')};
  p.onpointerleave=()=>p.style.transform='';
});
const plo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.animate([{transform:'translateY(30px)',opacity:0},{transform:'none',opacity:1}],{duration:700,easing:'cubic-bezier(.2,.8,.2,1)',delay:e.target.dataset.d|0});plo.unobserve(e.target)}}),{threshold:.15});
$$('.pl').forEach((p,i)=>{p.dataset.d=i*90;plo.observe(p)});

/* ---------- FEEDBACKS ---------- */
const FB=[['lohgoms','Arrasaaaaram!!!','Post da jornada dos dois alunos · nov/2025'],['maissfeitosa','Mamãe fitness','Post do antes e depois pós-parto · out/2024'],['rossanacristie','Ela tem o shape delaaaa','Post do antes e depois pós-parto · out/2024'],['lvsampaio1','a melhor!!','Post da consultoria on-line · mar/2023'],['biologo.no.direito','Verdade','Post da consultoria on-line · set/2023']];
const card=f=>`<div class="fb"><div class="who"><span class="av">${f[0][0].toUpperCase()}</span>@${f[0]}</div><p>“${f[1]}”</p><small>${f[2]}<br>Comentário público no Instagram</small></div>`;
const rowHtml=a=>a.map(card).join('');
$('#mq1 .tr').innerHTML=rowHtml(FB)+rowHtml(FB);
$('#mq2 .tr').innerHTML=rowHtml(FB.slice().reverse())+rowHtml(FB.slice().reverse());

/* ---------- FAQ em chat ---------- */
const dts=$$('#faqsrc dt'),dds=$$('#faqsrc dd');
const log=$('#log'),qsEl=$('#qs');let busy=false,asked=0;
dts.forEach((dt,i)=>{const b=document.createElement('button');b.type='button';b.className='qb';b.textContent=dt.textContent;b.onclick=()=>ask(i,b);qsEl.appendChild(b)});
function ask(i,btn){
  if(busy||btn.classList.contains('done'))return;busy=true;btn.classList.add('done');asked++;
  const me=document.createElement('div');me.className='bb me';me.textContent=dts[i].textContent;log.appendChild(me);
  const her=document.createElement('div');her.className='bb her';her.innerHTML='<div class="ty"><i></i><i></i><i></i></div>';log.appendChild(her);
  setTimeout(()=>{const t=dds[i].textContent;her.textContent='';let k=0;const iv=setInterval(()=>{k+=2;her.textContent=t.slice(0,k);if(k>=t.length){clearInterval(iv);busy=false;
    if(asked===dts.length){const c=document.createElement('a');c.className='btn';c.href=wa(['Olá, Mikaelen!','Li as dúvidas no seu site e quero conversar.']);c.target='_blank';c.rel='noopener';c.innerHTML=ic('whatsapp-logo-fill')+'Falar com ela no WhatsApp';log.appendChild(c)}}},reduce?1:16)},reduce?10:900);
}
let faqOpened=false;
new IntersectionObserver(e=>{if(e[0].isIntersecting&&!faqOpened){faqOpened=true;setTimeout(()=>ask(0,qsEl.children[0]),500)}},{threshold:.35}).observe($('#chat'));
})();
