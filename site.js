(function(){'use strict';
var $=function(s){return document.getElementById(s)};
function setTheme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem('sh_theme',t)}catch(e){}var b=$('theme');if(b)b.textContent=t==='dark'?'☀️':'🌙'}
setTheme(document.documentElement.dataset.theme||'light');
if($('theme'))$('theme').onclick=function(){setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')};
var bg=$('burger'),m=$('menu');
if(bg&&m){bg.onclick=function(){var o=m.classList.toggle('open');bg.setAttribute('aria-expanded',o?'true':'false');bg.textContent=o?'✕':'☰'};
 m.addEventListener('click',function(e){if(e.target.closest('a')){m.classList.remove('open');bg.textContent='☰'}})}
if(!document.getElementById('move-notice')){
 var note=document.createElement('p');
 note.id='move-notice';
 note.setAttribute('role','note');
 note.style.cssText='margin:0;padding:8px 16px;background:#1f6f5c;color:#fff;text-align:center;font-size:.92rem;line-height:1.45;visibility:visible';
 note.appendChild(document.createTextNode('Studovna se přesouvá na novou adresu '));
 var link=document.createElement('a');
 link.href='https://prokopdud.github.io/prokop-studium/';
 link.textContent='https://prokopdud.github.io/prokop-studium/';
 link.style.cssText='color:#fff;font-weight:700;text-decoration:underline;overflow-wrap:anywhere';
 note.appendChild(link);
 var nav=document.querySelector('header.nav');
 (nav||document.body).insertBefore(note,(nav||document.body).firstChild);
}
})();
