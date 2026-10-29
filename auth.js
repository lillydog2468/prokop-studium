(function(){
var s=document.currentScript,URL_=s.getAttribute('data-url'),KEY=s.getAttribute('data-key'),PUB=s.hasAttribute('data-public'),ADM=s.hasAttribute('data-admin')||s.hasAttribute('data-staff');
var H0=location.hash+'&'+location.search;window.sbRecovery=/(^|[#&?])type=recovery(&|$)/.test(H0);window.sbInitHash=location.hash;
var sb=window.supabase.createClient(URL_,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit'}});
window.sbClient=sb;sb.auth.onAuthStateChange(function(ev){if(ev==='PASSWORD_RECOVERY'){window.sbRecovery=true;if(window.sbOnRecovery)window.sbOnRecovery()}});
function here(){var p=location.pathname.split('/').pop()||'index.html';return p+location.search+location.hash}
function show(){document.documentElement.classList.remove('gated')}
function addUser(user){
 var wrap=document.createElement('span');wrap.className='uauth';
 var e=document.createElement('span');e.className='uemail';e.textContent=user.email;
 var a=document.createElement('a');a.href='#';a.id='logout';a.textContent='Odhlásit';
 a.addEventListener('click',function(ev){ev.preventDefault();try{localStorage.removeItem('sh_pin_ok')}catch(x){}sb.auth.signOut().catch(function(){}).then(function(){location.replace('prihlaseni.html?out=1')})});
 var c=document.createElement('a');c.href='prihlaseni.html?zmena=1&next='+encodeURIComponent(here());c.className='uchpw';c.textContent='Změnit heslo';
 var bt=document.createElement('button');bt.type='button';bt.className='ubtn';bt.setAttribute('aria-expanded','false');bt.setAttribute('aria-haspopup','true');bt.textContent='👤 Účet';
 var dd=document.createElement('span');dd.className='umenu';dd.appendChild(e);dd.appendChild(c);dd.appendChild(a);
 bt.addEventListener('click',function(ev){ev.stopPropagation();var o=wrap.classList.toggle('open');bt.setAttribute('aria-expanded',o?'true':'false')});
 document.addEventListener('click',function(ev){if(!wrap.contains(ev.target)){wrap.classList.remove('open');bt.setAttribute('aria-expanded','false')}});
 document.addEventListener('keydown',function(ev){if(ev.key==='Escape'){wrap.classList.remove('open');bt.setAttribute('aria-expanded','false')}});
 wrap.appendChild(bt);wrap.appendChild(dd);
 window.sbIsStaff.then(function(ok){if(!ok)return;var g=document.createElement('a');g.href='spravce.html';g.className='uadmin';g.textContent='Správa';dd.insertBefore(g,c)});
 var m=document.getElementById('menu')||document.getElementById('hubback');
 if(m)m.appendChild(wrap);
}
function noperm(){if(!/[?&]noperm=1/.test(location.search))return;var n=document.createElement('p');n.className='lmsg err nperm';n.setAttribute('role','alert');n.textContent='Nemáš oprávnění.';var m=document.querySelector('main')||document.body;m.insertBefore(n,m.firstChild)}
function ready(f){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',f);else f()}
window.sbRole=Promise.resolve('user');window.sbIsAdmin=Promise.resolve(false);window.sbIsStaff=Promise.resolve(false);
if(PUB){window.sbReady=sb.auth.getSession();return}
sb.auth.getSession().then(function(r){var ses=r&&r.data&&r.data.session;
 if(!ses){location.replace('prihlaseni.html?next='+encodeURIComponent(here()));return}
 window.sbRole=sb.rpc('my_role').then(function(r){return (!r.error&&r.data)||'user'},function(){return 'user'});
 window.sbIsAdmin=window.sbRole.then(function(r){return r==='admin'});window.sbIsStaff=window.sbRole.then(function(r){return r==='admin'||r==='moderator'});
 if(ADM){window.sbIsStaff.then(function(ok){if(!ok){location.replace('index.html?noperm=1');return}show()})}else show();
 ready(function(){addUser(ses.user);noperm()});
 sb.auth.onAuthStateChange(function(ev){if(ev==='SIGNED_OUT')location.replace('prihlaseni.html?next='+encodeURIComponent(here()))});
}).catch(function(){location.replace('prihlaseni.html?next='+encodeURIComponent(here()))});
})();
