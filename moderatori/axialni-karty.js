(function(){
'use strict';
var D=window.AXIAL_KARTY;
if(!D)return;
var KEY='anat_axial_karty_hotovo_v1';
var S={};try{S=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){S={}}
S.ex=S.ex||{};
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));localStorage.setItem('sh_last',JSON.stringify('axialni-system-karty'))}catch(e){}}
save();
function mark(id){S.ex[id]={ok:1,n:1};save()}
function el(tag,cls,html){var n=document.createElement(tag);if(cls)n.className=cls;if(html!=null)n.innerHTML=html;return n}
function watchImgs(root){
  root.querySelectorAll('img').forEach(function(img){
    img.addEventListener('error',function(){
      var name=(img.getAttribute('src')||'').split('/').pop();
      var box=document.createElement('div');
      box.className='ph';
      box.textContent='Obrázek chybí: '+name;
      img.replaceWith(box);
    });
  });
}
function cloze(text){
  var re=/\{\{c(\d+)::([\s\S]*?)\}\}/g, last=0, m, html='', answers=[], i=0;
  while((m=re.exec(text))){
    html+=text.slice(last,m.index);
    html+='<button type="button" class="gap" data-i="'+i+'">_____</button>';
    answers.push(m[2]); i++; last=m.index+m[0].length;
  }
  html+=text.slice(last);
  return {html:html, answers:answers};
}
function revealGaps(box, answers){
  box.querySelectorAll('.gap').forEach(function(b){
    b.classList.add('on');
    b.textContent=answers[+b.dataset.i];
  });
}
function occHtml(field){
  var re=/\{\{c(\d+)::image-occlusion:rect:left=([0-9.]+):top=([0-9.]+):width=([0-9.]+):height=([0-9.]+)[^}]*\}\}/g;
  var m, rects=[];
  while((m=re.exec(field||''))){
    rects.push({n:m[1], l:+m[2], t:+m[3], w:+m[4], h:+m[5]});
  }
  return rects;
}
function cardShell(note, deckName){
  var art=el('article','karta');
  art.id='n'+note.id;
  var meta=el('div','meta','<span class="tag">'+deckName+'</span> <span class="sub">'+note.model+'</span>');
  art.appendChild(meta);
  return art;
}
function addExtra(art, html, noteId){
  if(!html)return;
  var b=el('button','pri'); b.type='button'; b.textContent='Ukázat Rub extra';
  var box=el('div','back'); box.hidden=true; box.innerHTML=html; watchImgs(box);
  b.onclick=function(){box.hidden=false; b.hidden=true; mark(noteId)};
  art.appendChild(b); art.appendChild(box);
}
var nav=document.getElementById('aknav');
var root=document.getElementById('decks');
var total=0;
D.decks.forEach(function(deck, di){
  total+=deck.notes.length;
  var a=document.createElement('a'); a.href='#d'+di; a.textContent=deck.name+' · '+deck.notes.length;
  nav.appendChild(a);
  var h=document.createElement('h2'); h.id='d'+di; h.textContent=deck.name;
  root.appendChild(h);
  deck.notes.forEach(function(note){
    var f=note.fields, art=cardShell(note, deck.name);
    if(note.model==='Základní'||note.model==='Základní (napsat odpověď)'){
      var front=el('div','front', f['Líc']||'');
      var back=el('div','back', f['Rub']||''); back.hidden=true;
      var b=el('button','pri'); b.type='button'; b.textContent='Ukázat rub';
      b.onclick=function(){back.hidden=false; b.hidden=true; mark(note.id)};
      art.appendChild(front); art.appendChild(b); art.appendChild(back); watchImgs(art);
    }else if(note.model==='Doplňovačka'||note.model==='Doplňovačka-49d0a'){
      var c=cloze(f['Text']||'');
      var q=el('div','front', c.html);
      q.querySelectorAll('.gap').forEach(function(btn){
        btn.onclick=function(){btn.classList.add('on'); btn.textContent=c.answers[+btn.dataset.i]; mark(note.id)};
      });
      art.appendChild(q);
      var all=el('button',''); all.type='button'; all.textContent='Vyplnit všechny mezery';
      all.onclick=function(){revealGaps(q,c.answers); mark(note.id)};
      art.appendChild(all);
      addExtra(art, f['Rub extra'], note.id);
      watchImgs(art);
    }else if(note.model==='Okluze obrázku'){
      if(f['Záhlaví']) art.appendChild(el('div','front', f['Záhlaví']));
      var occ=el('div','occ', f['Obrázek']||'');
      occHtml(f['Okluze']).forEach(function(r){
        var box=document.createElement('div');
        box.className='r';
        box.style.left=(r.l*100)+'%';
        box.style.top=(r.t*100)+'%';
        box.style.width=(r.w*100)+'%';
        box.style.height=(r.h*100)+'%';
        box.textContent=r.n;
        occ.appendChild(box);
      });
      art.appendChild(occ);
      if(f['Komentář']) art.appendChild(el('div','sub', f['Komentář']));
      addExtra(art, f['Rub extra'], note.id);
      if(!(f['Rub extra']||'').trim()){
        var b=el('button',''); b.type='button'; b.textContent='Označit jako prohlédnuté';
        b.onclick=function(){mark(note.id); b.disabled=true};
        art.appendChild(b);
      }
      watchImgs(art);
    }
    root.appendChild(art);
  });
});
var lead=document.getElementById('lead');
if(lead) lead.textContent=D.deck+' · '+total+' karet v '+D.decks.length+' hotových subdeckech. Jen pro moderátory a správce. Veřejná lekce axiálního systému se nemění.';
})();
