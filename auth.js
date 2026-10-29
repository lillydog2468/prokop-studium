(function(){
var s=document.currentScript,URL_=s.getAttribute('data-url'),KEY=s.getAttribute('data-key'),PUB=s.hasAttribute('data-public'),ADM=s.hasAttribute('data-admin');
var sb=window.supabase.createClient(URL_,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit'}});
window.sbClient=sb;
function here(){var p=location.pathname.split('/').pop()||'index.html';return p+location.search+location.hash}
function show(){document.documentElement.classList.remove('gated')}
function addUser(user){
 var wrap=document.createElement('span');wrap.className='uauth';
 var e=document.createElement('span');e.className='uemail';e.textContent=user.email;
 var a=document.createElement('a');a.href='#';a.id='logout';a.textContent='Odhlásit';
 a.addEventListener('click',function(ev){ev.preventDefault();try{localStorage.removeItem('sh_pin_ok')}catch(x){}sb.auth.signOut().catch(function(){}).then(function(){location.replace('prihlaseni.html?out=1')})});
 wrap.appendChild(e);wrap.appendChild(a);
 window.sbIsAdmin.then(function(ok){if(!ok)return;var g=document.createElement('a');g.href='spravce.html';g.className='uadmin';g.textContent='Správa';wrap.insertBefore(g,e)});
 var m=document.getElementById('menu')||document.getElementById('hubback');
 if(m)m.appendChild(wrap);
}
function noperm(){if(!/[?&]noperm=1/.test(location.search))return;var n=document.createElement('p');n.className='lmsg err nperm';n.setAttribute('role','alert');n.textContent='Nemáš oprávnění.';var m=document.querySelector('main')||document.body;m.insertBefore(n,m.firstChild)}
function ready(f){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',f);else f()}
window.sbIsAdmin=Promise.resolve(false);
if(PUB){window.sbReady=sb.auth.getSession();return}
sb.auth.getSession().then(function(r){var ses=r&&r.data&&r.data.session;
 if(!ses){location.replace('prihlaseni.html?next='+encodeURIComponent(here()));return}
 window.sbIsAdmin=sb.rpc('is_admin').then(function(r){return !r.error&&r.data===true},function(){return false});
 if(ADM){window.sbIsAdmin.then(function(ok){if(!ok){location.replace('index.html?noperm=1');return}show()})}else show();
 ready(function(){addUser(ses.user);noperm()});
 sb.auth.onAuthStateChange(function(ev){if(ev==='SIGNED_OUT')location.replace('prihlaseni.html?next='+encodeURIComponent(here()))});
}).catch(function(){location.replace('prihlaseni.html?next='+encodeURIComponent(here()))});
})();
