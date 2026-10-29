(function(){var d=document,q=d.getElementById('tq'),b=d.body;
function norm(s){return(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
var secs=[].slice.call(d.querySelectorAll('details.sec')),items=[].slice.call(d.querySelectorAll('.sec .f'));
items.forEach(function(e){e._t=norm(e.textContent);});
var openState=null,tm;
function run(){var v=norm(q.value.trim());if(v.charAt(0)==='-')v=v.slice(1);
 if(!v){items.forEach(function(e){e.classList.remove('hid')});secs.forEach(function(s,i){s.classList.remove('hid');if(openState)s.open=openState[i];});openState=null;d.getElementById('nohit').style.display='none';return;}
 if(!openState)openState=secs.map(function(s){return s.open});var any=0;
 secs.forEach(function(s){var h=0;[].forEach.call(s.querySelectorAll('.f'),function(e){var m=e._t.indexOf(v)>=0;e.classList.toggle('hid',!m);if(m)h++;});
  if(!h&&norm(s.querySelector('summary').textContent).indexOf(v)>=0){h=1;[].forEach.call(s.querySelectorAll('.f'),function(e){e.classList.remove('hid')});}
  s.classList.toggle('hid',!h);if(h){s.open=true;any=1;}});
 d.getElementById('nohit').style.display=any?'none':'block';}
q.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(run,120);});
var qb=d.getElementById('tquiz');qb.addEventListener('click',function(){var on=!b.classList.contains('quiz');b.classList.toggle('quiz',on);qb.setAttribute('aria-pressed',on);qb.textContent=on?'👀 Ukázat koncovky':'🙈 Skrýt koncovky';[].forEach.call(d.querySelectorAll('.e.rev'),function(e){e.classList.remove('rev')});});
d.addEventListener('click',function(ev){var t=ev.target;if(b.classList.contains('quiz')&&t.classList&&t.classList.contains('e'))t.classList.toggle('rev');});
d.addEventListener('keydown',function(ev){var t=ev.target;if((ev.key==='Enter'||ev.key===' ')&&b.classList.contains('quiz')&&t.classList&&t.classList.contains('e')){ev.preventDefault();t.classList.toggle('rev');}});
d.getElementById('topen').onclick=function(){secs.forEach(function(s){s.open=true})};
d.getElementById('tclose').onclick=function(){secs.forEach(function(s){s.open=false})};
var saved;window.addEventListener('beforeprint',function(){saved=secs.map(function(s){return s.open});secs.forEach(function(s){s.open=true});});
window.addEventListener('afterprint',function(){if(saved)secs.forEach(function(s,i){s.open=saved[i]});});
d.getElementById('tprint').onclick=function(){window.print();};
[].forEach.call(d.querySelectorAll('.toc a'),function(a){a.addEventListener('click',function(){var s=d.getElementById(a.getAttribute('href').slice(1));if(s)s.open=true;});});
if(location.hash){var s=d.getElementById(location.hash.slice(1));if(s&&s.tagName==='DETAILS')s.open=true;}
function st(){var n=d.querySelector("header.nav"),t=d.querySelector(".tbar");if(n&&t)t.style.top=(n.querySelector(".navin")||n).offsetHeight+"px";}st();window.addEventListener("resize",st);
})();
