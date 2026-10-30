(function(){var KEY='sg_hk_proto_v1',S={};try{S=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var D,M=document.getElementById('sg');
function ankiBox(c,pause){var b=el('div','anki'+(pause?'':' mini'));b.id=(pause?'anki-':'deck-')+c.code;
 var t=pause?'Anki pauza '+c.code+' – '+c.name:'Balíček k této kapitole';
 b.innerHTML='<div class="ah"><span aria-hidden="true">⭐</span><a href="'+c.apkg+'" download>'+esc(t)+'</a></div><div class="ab">'+(pause?'<div>Teď si v Anki projdi balíček této kapitoly:</div>':'')+'<div class="deck">'+esc(c.deck)+'</div><div><span class="cnt">'+c.cards+' karet</span> · '+c.size+' MB</div><a class="abtn" href="'+c.apkg+'" download>Stáhnout balíček .apkg</a>'+(pause?'<label><input type="checkbox" data-anki="'+c.code+'"'+(S['a'+c.code]?' checked':'')+'> Hotovo – prošel/a jsem balíček v Anki</label>':'')+'</div>';return b}
function mcq(q,id){var d=el('div','q');d.appendChild(el('p','',esc(q[0])));var o=q[1].map(function(t,i){return[t,i]});o.sort(function(a,b){return((a[1]*7+3)%5)-((b[1]*7+3)%5)});
 var fb=el('div','fb');o.forEach(function(x){var b=el('button','btn opt',esc(x[0]));b.type='button';b.onclick=function(){d.querySelectorAll('.opt').forEach(function(z){z.disabled=true});var ok=x[1]===q[2];b.classList.add(ok?'ok':'no');if(!ok)d.querySelectorAll('.opt')[o.findIndex(function(z){return z[1]===q[2]})].classList.add('ok');fb.className='fb '+(ok?'ok':'no');fb.textContent=(ok?'Správně.':'Správně je: '+q[1][q[2]]+'.')+(q[3]?' '+q[3]:'');S[id]=1;save();step()};d.appendChild(b)});d.appendChild(fb);return d}
function cloze(c,id){var d=el('div','q cl'),m=c.match(/\{\{c1::(.*?)\}\}/),ans=m?m[1]:'';var p=el('p','',esc(c.replace(/\{\{c1::.*?\}\}/,'@@')).replace('@@','<input aria-label="doplň" autocomplete="off">'));d.appendChild(p);var inp=p.querySelector('input'),b=el('button','btn','Zkontrolovat'),fb=el('div','fb');b.type='button';
 var norm=function(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')};
 function chk(){var ok=norm(inp.value)&&(norm(ans).indexOf(norm(inp.value))===0&&norm(inp.value).length>=Math.min(4,norm(ans).length)||norm(inp.value)===norm(ans));fb.className='fb '+(ok?'ok':'no');fb.textContent=ok?'Správně: '+ans:'Správně je: '+ans;S[id]=1;save();step()}
 b.onclick=chk;inp.onkeydown=function(e){if(e.key==='Enter')chk()};d.appendChild(b);d.appendChild(fb);return d}
var units=[];
function build(){var tot=0;D.chapters.forEach(function(c,ci){var h=el('h2','','Kapitola '+c.code+' · '+esc(c.name)+'<small>'+esc(c.src)+'</small>');h.id='k'+c.code;M.appendChild(h);
 var g=el('div');g.dataset.ch=ci;M.appendChild(g);g.appendChild(ankiBox(c,false));
 c.steps.forEach(function(s,si){var id=c.code+'_'+si,r=el('section','read');r.innerHTML=s.read+(s.fig?'<figure><img src="'+s.fig.src+'" alt="'+esc(s.fig.cap)+'" loading="lazy"><figcaption>'+esc(s.fig.cap)+'</figcaption></figure>':'');
  var rb=el('button','btn go','Přečteno – k procvičení ↓');rb.type='button';r.appendChild(rb);var pr=el('div','prac');pr.appendChild(el('h3','','Procvič si tenhle úsek'));
  s.ex.forEach(function(x,xi){pr.appendChild(x.kind==='mcq'?mcq(x.q,'x'+id+'_'+xi):cloze(x.q,'x'+id+'_'+xi))});
  rb.onclick=function(){S['r'+id]=1;save();step();pr.scrollIntoView({behavior:'smooth',block:'start'})};
  units.push({r:r,rb:rb,pr:pr,id:id,ex:s.ex.map(function(_,xi){return'x'+id+'_'+xi}),g:g});tot++});
 var end=el('div');end.appendChild(el('div','tips','<b>Shrnutí – zapamatuj si:</b><ul>'+c.tips.map(function(t){return'<li>'+t+'</li>'}).join('')+'</ul>'));
 end.appendChild(el('div','tahak','<h4>📜 Latina z kapitoly</h4><table>'+c.terms.map(function(t){return'<tr><td>'+esc(t[0])+'</td><td class="lat">'+esc(t[1])+'</td></tr>'}).join('')+'</table>'));
 end.appendChild(ankiBox(c,true));units.push({end:end,code:c.code,g:g})});
 var fin=el('div','done','<b>Konec ukázky.</b> Prototyp obsahuje první 3 kapitoly lekce Svaly hlavy a krku. Celá lekce: <a href="../svaly-hlavy-krku.html">Svaly hlavy a krku</a>.');units.push({fin:fin});
 M.addEventListener('change',function(e){var a=e.target.dataset&&e.target.dataset.anki;if(a){S['a'+a]=e.target.checked?1:0;save();step()}})}
function step(){var open=true,n=0,dn=0;units.forEach(function(u){if(u.fin){if(open&&!u.fin.parentNode)M.appendChild(u.fin);return}
 if(u.end){if(open){if(!u.end.parentNode)u.g.appendChild(u.end);n++;if(S['a'+u.code])dn++;else open=false}return}
 n+=2;if(!open){if(u.r.parentNode)u.r.remove();if(u.pr.parentNode)u.pr.remove();return}
 if(!u.r.parentNode)u.g.appendChild(u.r);var read=!!S['r'+u.id];u.rb.hidden=read;if(read){dn++;if(!u.pr.parentNode)u.g.appendChild(u.pr)}else{open=false;return}
 var all=u.ex.every(function(x){return S[x]});if(all)dn++;else open=false});
 var lk=document.getElementById('lock');if(lk)lk.remove();if(!open){lk=el('p','lock','🔒 Další část se odemkne, až dokončíš tuhle.');lk.id='lock';var last=[].slice.call(M.querySelectorAll('section.read,.prac,.anki:not(.mini)')).pop();if(last)last.after(lk)}
 document.querySelector('.bar i').style.width=Math.round(100*dn/Math.max(n,1))+'%'}
function jump(){var h=location.hash.slice(1);if(!h)return;var t=document.getElementById(h);if(t){t.scrollIntoView({block:'center'});t.classList.add('target')}}
document.getElementById('reset').onclick=function(){if(confirm('Začít ukázku znovu?')){localStorage.removeItem(KEY);location.hash='';location.reload()}};
fetch('sg-data.json').then(function(r){return r.json()}).then(function(d){D=d;build();step();jump()});window.addEventListener('hashchange',jump)})();
