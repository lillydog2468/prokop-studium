(function(){var d=document,q=d.getElementById('tq'),b=d.body,R=d.getElementById('tres'),nh=d.getElementById('nohit');
function norm(s){return(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function A(x){return[].slice.call(x)}
var secs=A(d.querySelectorAll('details.sec')),items=A(d.querySelectorAll('.sec .f'));
items.forEach(function(e){e._t=norm(e.textContent);});
// prvky mimo sekce (TOC, řádky Lekce/Zdroje, poznámka) – při hledání skryté
var outer=A(d.querySelectorAll('.toc,.fix')).concat(A(d.querySelectorAll('.f')).filter(function(e){return !e.closest('.sec')}));
// nadpisy skupin v sekcích (h3/h4 + .wl) – skryjí se, když pod nimi nic není
var heads=A(d.querySelectorAll('.sec .sb h3,.sec .sb h4'));heads.forEach(function(h){h._h=h.innerHTML;});
var wls=A(d.querySelectorAll('.sec .wl'));wls.forEach(function(p){var w=p.querySelector('.wh');w._h=w.innerHTML;});
// rejstřík slov z oddílu 6 + vzory z 2b
var G={feminina:'f.',maskulina:'m.',neutra:'n.'},words=[],models={};
heads.forEach(function(h){if(h.tagName==='H4'){var k=norm(h.textContent).split(/[ ,]/)[0];if(k&&!models[k])models[k]=h;}});
wls.forEach(function(p){var h=p.previousElementSibling;while(h&&h.tagName!=='H3')h=h.previousElementSibling;
 var dek=h?h.textContent.replace(/\s*\(.*$/,'').replace(/\s*–.*$/,'').trim():'',g=G[p.querySelector('.wh').textContent.replace(/\s*\(.*$/,'')]||'';
 A(p.querySelectorAll('.w')).forEach(function(w){var i=w.querySelector('i'),lat=i?i.textContent:'',cz=w.textContent.slice(w.textContent.indexOf('–')+1).replace(/\s*\(\d+\)\s*$/,'').trim();
  var hw=norm(lat.split(',')[0].trim());words.push({el:w,lat:lat,cz:cz,dek:dek,g:g,hw:hw,nl:norm(lat),nc:norm(cz),m:models[hw]});});});
// modely, které v oddílu 6 nejsou
Object.keys(models).forEach(function(k){if(!words.some(function(w){return w.hw===k})){var t=models[k].textContent,ix=t.indexOf('–');
 words.push({el:models[k],lat:t.slice(0,ix).replace(/\s+[mfn]\.\s*$/,'').trim(),cz:t.slice(ix+1).trim(),dek:'vzor',g:(t.match(/\s([mfn]\.)\s*–/)||[])[1]||'',hw:k,nl:norm(t.slice(0,ix)),nc:norm(t.slice(ix+1)),m:models[k]});}});
function score(w,v){if(w.hw===v)return 0;if(w.hw.indexOf(v)===0)return 1;var cw=w.nc.split(/[^a-z0-9]+/);
 if(cw.indexOf(v)>=0)return 2;if(cw.some(function(x){return x.indexOf(v)===0}))return 3;if(w.nl.split(/[^a-z0-9]+/).some(function(x){return x.indexOf(v)===0}))return 3;
 if(w.hw.indexOf(v)>=0)return 4;if(w.nl.indexOf(v)>=0||w.nc.indexOf(v)>=0)return 5;return -1;}
// zvýraznění (<mark>) bez ohledu na diakritiku
var marked=[];
function unmark(){marked.forEach(function(m){var p=m.parentNode;if(!p)return;p.replaceChild(d.createTextNode(m.textContent),m);p.normalize();});marked=[];}
function mark(root,v){var tw=d.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false),ns=[],n;while((n=tw.nextNode()))ns.push(n);
 ns.forEach(function(t){var s=t.nodeValue,map=[],ns2='';for(var i=0;i<s.length;i++){var c=norm(s[i]);for(var j=0;j<c.length;j++){ns2+=c[j];map.push(i);}}
  var at=ns2.indexOf(v);if(at<0)return;var a=map[at],z=map[at+v.length-1]+1,r=t.splitText(a);r.splitText(z-a);var m=d.createElement('mark');m.textContent=r.nodeValue;r.parentNode.replaceChild(m,r);marked.push(m);});}
function label(w){return w.lat+(w.g?' '+w.g:'');}
function go(w){var t=w.m||w.el,s=t.closest('details');if(s)s.open=true;
 if(w.m&&w.m.classList.contains('hid')){q.value='';run();s=w.m.closest('details');if(s)s.open=true;}
 var bar=d.querySelector('.tbar'),off=(getComputedStyle(bar).position==='sticky'?bar.offsetHeight:0)+(d.querySelector('header.nav')||{offsetHeight:0}).offsetHeight+12;
 window.scrollTo(0,t.getBoundingClientRect().top+window.pageYOffset-off);t.classList.add('flash');setTimeout(function(){t.classList.remove('flash')},1600);}
var openState=null,tm;
function run(){var raw=norm(q.value.trim()),v=raw.charAt(0)==='-'?raw.slice(1):raw;unmark();
 outer.forEach(function(e){e.classList.toggle('hid',!!v)});
 if(!v){items.forEach(function(e){e.classList.remove('hid')});heads.forEach(function(h){h.classList.remove('hid');h.innerHTML=h._h});
  wls.forEach(function(p){p.classList.remove('hid');p.querySelector('.wh').innerHTML=p.querySelector('.wh')._h});
  secs.forEach(function(s,i){s.classList.remove('hid');if(openState)s.open=openState[i];});openState=null;nh.style.display='none';R.classList.add('hid');R.innerHTML='';return;}
 if(!openState)openState=secs.map(function(s){return s.open});var any=0;
 secs.forEach(function(s){var h=0;A(s.querySelectorAll('.f')).forEach(function(e){var m=e._t.indexOf(v)>=0;e.classList.toggle('hid',!m);if(m)h++;});
  var hs=A(s.querySelectorAll('.sb h3,.sb h4'));
  if(!h&&norm(s.querySelector('summary').textContent).indexOf(v)>=0){h=1;A(s.querySelectorAll('.f')).forEach(function(e){e.classList.remove('hid')});hs.forEach(function(x){x.classList.remove('hid')});}
  else{// skupiny slov
   A(s.querySelectorAll('.wl')).forEach(function(p){var n=p.querySelectorAll('.w:not(.hid)').length,wh=p.querySelector('.wh');p.classList.toggle('hid',!n);wh.innerHTML=wh._h.replace(/\(\d+\)/,'('+n+')');});
   // nadpis je vidět, pokud sám odpovídá nebo pod ním (do dalšího nadpisu stejné/vyšší úrovně) něco je
   hs.forEach(function(x){var lvl=x.tagName,e=x.nextElementSibling,c=0;
    while(e&&!(e.tagName==='H3'||(lvl==='H4'&&e.tagName==='H4'))){if(e.classList.contains('f')?!e.classList.contains('hid'):e.querySelector('.f:not(.hid)'))c+=e.classList.contains('wl')?e.querySelectorAll('.w:not(.hid)').length:1;e=e.nextElementSibling;}
    if(lvl==='H3'&&e&&e.tagName==='H4'){}// h3 s podnadpisy: spočítat i přes h4
    if(lvl==='H3'){var e2=x.nextElementSibling;c=0;while(e2&&e2.tagName!=='H3'){if(e2.matches('.f:not(.hid),.wl:not(.hid),.tw,.co,ul')&&(e2.matches('.f')||e2.querySelector('.f:not(.hid)')))c+=e2.classList.contains('wl')?e2.querySelectorAll('.w:not(.hid)').length:1;e2=e2.nextElementSibling;}}
    var self=norm(x.textContent).indexOf(v)>=0&&lvl==='H4';x.classList.toggle('hid',!c&&!self);x.innerHTML=x._h.replace(/– \d+ slov/,'– '+c+' slov');});}
  s.classList.toggle('hid',!h);if(h){s.open=true;any=1;}});
 items.forEach(function(e){if(!e.classList.contains('hid'))mark(e,v)});heads.forEach(function(x){if(!x.classList.contains('hid'))mark(x,v)});
 // panel výsledků
 var res=[];if(raw.charAt(0)!=='-')words.forEach(function(w){var sc=score(w,v);if(sc>=0)res.push([sc,w]);});
 res.sort(function(a,c){return a[0]-c[0]||a[1].hw.length-c[1].hw.length||a[1].hw.localeCompare(c[1].hw)});
 R.innerHTML='';if(res.length){var hd=d.createElement('div');hd.className='rh';hd.textContent='Nalezeno '+res.length+(res.length>30?' (zobrazeno 30)':'');R.appendChild(hd);
  var ol=d.createElement('ol');res.slice(0,30).forEach(function(r){var w=r[1],li=d.createElement('li'),bt=d.createElement('button');bt.type='button';bt.className='r';
   var l=d.createElement('span');l.className='rl';l.textContent=label(w);var m=d.createElement('span');m.className='rm';m.textContent=' · '+w.dek+(w.m?' · 📖 vzor':'');
   bt.appendChild(l);bt.appendChild(d.createTextNode(' – '+w.cz));bt.appendChild(m);mark(bt,v);marked=marked.filter(function(x){return !bt.contains(x)});
   bt.addEventListener('click',function(){go(w)});li.appendChild(bt);ol.appendChild(li);});R.appendChild(ol);R.classList.remove('hid');}else R.classList.add('hid');
 nh.style.display=any||res.length?'none':'block';}
q.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(run,120);});
q.addEventListener('keydown',function(ev){if(ev.key==='Enter'){var f=R.querySelector('button.r');if(f){ev.preventDefault();f.click();}}else if(ev.key==='Escape'){q.value='';run();}});
var qb=d.getElementById('tquiz');qb.addEventListener('click',function(){var on=!b.classList.contains('quiz');b.classList.toggle('quiz',on);qb.setAttribute('aria-pressed',on);qb.textContent=on?'👀 Ukázat koncovky':'🙈 Skrýt koncovky';A(d.querySelectorAll('.e.rev')).forEach(function(e){e.classList.remove('rev')});});
d.addEventListener('click',function(ev){var t=ev.target.closest&&ev.target.closest('.e');if(b.classList.contains('quiz')&&t)t.classList.toggle('rev');});
d.addEventListener('keydown',function(ev){var t=ev.target;if((ev.key==='Enter'||ev.key===' ')&&b.classList.contains('quiz')&&t.classList&&t.classList.contains('e')){ev.preventDefault();t.classList.toggle('rev');}});
d.getElementById('topen').onclick=function(){secs.forEach(function(s){s.open=true})};
d.getElementById('tclose').onclick=function(){secs.forEach(function(s){s.open=false})};
var saved;window.addEventListener('beforeprint',function(){saved=secs.map(function(s){return s.open});secs.forEach(function(s){s.open=true});});
window.addEventListener('afterprint',function(){if(saved)secs.forEach(function(s,i){s.open=saved[i]});});
d.getElementById('tprint').onclick=function(){window.print();};
A(d.querySelectorAll('.toc a')).forEach(function(a){a.addEventListener('click',function(){var s=d.getElementById(a.getAttribute('href').slice(1));if(s)s.open=true;});});
if(location.hash){var s=d.getElementById(location.hash.slice(1));if(s&&s.tagName==='DETAILS')s.open=true;}
function st(){var n=d.querySelector("header.nav"),t=d.querySelector(".tbar");if(n&&t)t.style.top=(n.querySelector(".navin")||n).offsetHeight+"px";}st();window.addEventListener("resize",st);
})();
