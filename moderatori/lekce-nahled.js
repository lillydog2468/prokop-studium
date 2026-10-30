// Náhled: u Svalů hlavy a krku spojí study session a lekci (study guide) do jedné karty. Jen pro moderátory.
(function(){var box=document.getElementById('lessons');if(!box)return;
function fix(){box.querySelectorAll('[data-href]').forEach(function(c){var h=c.getAttribute('data-href');if(h.indexOf('../')!==0)c.setAttribute('data-href','../'+h)});
 box.querySelectorAll('a[href^="anki/"]').forEach(function(a){a.setAttribute('href','../'+a.getAttribute('href'))});
 var c=box.querySelector('[data-href*="svaly-hlavy-krku"]');if(!c||c.querySelector('.duo'))return;
 var h3=c.querySelector('h3');if(h3)h3.insertAdjacentHTML('afterend','<div class="duo" style="display:grid;gap:6px;margin:6px 0 8px"><a href="svaly-hlavy-krku-study-guide.html" style="display:block;padding:7px 10px;border:1px solid #cfe3e3;border-radius:8px;background:#f2f8f8;text-decoration:none;color:inherit"><b>📖 Lekce (study guide)</b><br><small>Čti → procvič → Anki pauza, 8 kapitol</small></a><a href="../svaly-hlavy-krku.html" style="display:block;padding:7px 10px;border:1px solid #e3e6e8;border-radius:8px;text-decoration:none;color:inherit"><b>✏️ Study session</b><br><small>Procvičování, obrázky, videa, zápočtový test</small></a></div>');
 c.querySelectorAll('.duo a').forEach(function(a){a.addEventListener('click',function(e){e.stopPropagation()})})}
new MutationObserver(fix).observe(box,{childList:true});fix()})();
