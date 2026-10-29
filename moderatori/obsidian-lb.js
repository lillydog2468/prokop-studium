// Lightbox pro ukázkové obrázky na stránce Obsidian (bez JS fungují odkazy na plný obrázek).
(function(){var lb,img,last;
function close(){if(lb&&!lb.hidden){lb.hidden=true;img.removeAttribute('src');document.body.style.overflow='';last&&last.focus();}}
function open(a){if(!lb){lb=document.createElement('div');lb.id='lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Zvětšený obrázek');
 img=document.createElement('img');var b=document.createElement('button');b.type='button';b.textContent='✕';b.setAttribute('aria-label','Zavřít');
 lb.appendChild(img);lb.appendChild(b);document.body.appendChild(lb);lb.addEventListener('click',close);}
 var s=a.querySelector('img');img.src=a.getAttribute('href');img.alt=s?s.alt:'';last=a;lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('button').focus();}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a.zoom');if(!a||e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();open(a);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});})();
