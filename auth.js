(function(){
var s=document.currentScript,URL_=s.getAttribute('data-url'),KEY=s.getAttribute('data-key'),PUB=s.hasAttribute('data-public');
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
 var m=document.getElementById('menu')||document.getElementById('hubback');
 if(m)m.appendChild(wrap);
}
function ready(f){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',f);else f()}
if(PUB){window.sbReady=sb.auth.getSession();return}
sb.auth.getSession().then(function(r){var ses=r&&r.data&&r.data.session;
 if(!ses){location.replace('prihlaseni.html?next='+encodeURIComponent(here()));return}
 show();ready(function(){addUser(ses.user)});
 sb.auth.onAuthStateChange(function(ev){if(ev==='SIGNED_OUT')location.replace('prihlaseni.html?next='+encodeURIComponent(here()))});
}).catch(function(){location.replace('prihlaseni.html?next='+encodeURIComponent(here()))});
})();
