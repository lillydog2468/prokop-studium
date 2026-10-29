(function(){
var sb=window.sbClient;if(!sb)return;
var q=new URLSearchParams(location.search),h=new URLSearchParams(location.hash.slice(1));
var next=q.get('next')||'index.html';if(!/^[a-z0-9-]+\.html([?#].*)?$/i.test(next))next='index.html';
var $=function(i){return document.getElementById(i)};
function say(id,t,kind){var m=$(id);m.textContent=t||'';m.className='lmsg '+(kind||'');m.hidden=!t}
function cz(err){var m=(err&&(err.code||err.message)||'')+'';
 if(/invalid_credentials|Invalid login/i.test(m))return 'Špatný e-mail nebo heslo.';
 if(/email_not_confirmed|not confirmed/i.test(m))return 'E-mail ještě není potvrzený. Klikni na odkaz v e-mailu, který ti přišel po registraci.';
 if(/user_already_exists|already registered/i.test(m))return 'Účet s tímto e-mailem už existuje. Přihlas se, nebo si obnov heslo.';
 if(/weak_password|at least|Password should/i.test(m))return 'Heslo je moc slabé – použij aspoň 8 znaků.';
 if(/rate|too many|over_email_send_rate_limit/i.test(m))return 'Příliš mnoho pokusů. Zkus to prosím za chvíli znovu.';
 if(/Database error saving|unexpected_failure|pin/i.test(m))return 'Registrace odmítnuta – zadej znovu správný PIN.';
 if(/invalid.*email|email_address_invalid/i.test(m))return 'Zadej platný e-mail.';
 return 'Něco se nepovedlo: '+(err&&err.message||'neznámá chyba');}
function busy(f,on){[].forEach.call(f.querySelectorAll('button'),function(b){b.disabled=on})}
var back=location.origin+location.pathname.replace(/[^/]*$/,'')+'prihlaseni.html?next='+encodeURIComponent(next);
// PIN
var FK='sh_pin_fail';function fails(){try{return JSON.parse(localStorage.getItem(FK)||'{"n":0,"t":0}')}catch(e){return {n:0,t:0}}}
function setFails(o){try{localStorage.setItem(FK,JSON.stringify(o))}catch(e){}}
$('f-pin').onsubmit=function(e){e.preventDefault();var f=this,v=$('pin').value.trim(),st=fails(),wait=st.n>=5?Math.ceil((st.t+30000-Date.now())/1000):0;
 if(wait>0)return say('pmsg','Příliš mnoho špatných pokusů. Zkus to znovu za '+wait+' s.','err');
 if(st.n>=5)st={n:0,t:0};
 if(!v)return say('pmsg','Zadej PIN.','err');busy(f,1);say('pmsg','Ověřuji…');
 sb.rpc('check_pin',{p:v}).then(function(r){if(r.error){busy(f,0);return say('pmsg',cz(r.error),'err')}
  if(!r.data){busy(f,0);st.n++;st.t=Date.now();setFails(st);$('pin').value='';return say('pmsg',st.n>=5?'Špatný PIN. Příliš mnoho pokusů – počkej 30 s.':'Špatný PIN.','err')}
  busy(f,0);setFails({n:0,t:0});unlock(v);$('up-email').focus()})};
function unlock(v){PINV=v;try{sessionStorage.setItem('sh_pin_reg',v)}catch(e){}$('f-pin').hidden=true;$('f-up').hidden=false;$('uh').textContent='Nový účet';say('pmsg','PIN je správný, můžete si vytvořit účet.','ok')}
var PINV=null;try{PINV=sessionStorage.getItem('sh_pin_reg')}catch(e){}if(PINV){$('f-pin').hidden=true;$('f-up').hidden=false;$('uh').textContent='Nový účet';say('pmsg','PIN je správný, můžete si vytvořit účet.','ok')}
// e-mail
$('to-reset').onclick=function(e){e.preventDefault();$('f-reset').hidden=!$('f-reset').hidden;if(!$('f-reset').hidden)$('re-email').value=$('in-email').value};
$('f-in').onsubmit=function(e){e.preventDefault();var f=this;busy(f,1);say('lmsg','Přihlašuji…');
 sb.auth.signInWithPassword({email:$('in-email').value.trim(),password:$('in-pw').value}).then(function(r){busy(f,0);if(r.error)return say('lmsg',cz(r.error),'err');location.replace(next)})};
$('f-up').onsubmit=function(e){e.preventDefault();var f=this,p=$('up-pw').value;if(p!==$('up-pw2').value)return say('umsg','Hesla se neshodují.','err');if(p.length<8)return say('umsg','Heslo musí mít aspoň 8 znaků.','err');busy(f,1);say('umsg','Registruji…');
 sb.auth.signUp({email:$('up-email').value.trim(),password:p,options:{emailRedirectTo:back,data:{pin:PINV||''}}}).then(function(r){busy(f,0);if(r.error)return say('umsg',cz(r.error),'err');
  if(r.data&&r.data.session)return location.replace(next);
  if(r.data&&r.data.user&&r.data.user.identities&&r.data.user.identities.length===0)return say('umsg','Účet s tímto e-mailem už existuje. Přihlas se, nebo si obnov heslo.','err');
  say('umsg','Zkontroluj e-mail a potvrď registraci. Pak se tady přihlas.','ok');f.reset()})};
$('f-reset').onsubmit=function(e){e.preventDefault();var f=this;busy(f,1);say('lmsg','Odesílám…');
 sb.auth.resetPasswordForEmail($('re-email').value.trim(),{redirectTo:back}).then(function(r){busy(f,0);if(r.error)return say('lmsg',cz(r.error),'err');say('lmsg','Pokud účet existuje, poslali jsme ti e-mail s odkazem na nové heslo.','ok')})};
$('f-newpw').onsubmit=function(e){e.preventDefault();var f=this,p=$('np-pw').value;if(p.length<8)return say('nmsg','Heslo musí mít aspoň 8 znaků.','err');busy(f,1);
 sb.auth.updateUser({password:p}).then(function(r){busy(f,0);if(r.error)return say('nmsg',cz(r.error),'err');say('nmsg','Heslo změněno. Přesměrovávám…','ok');setTimeout(function(){location.replace(next)},900)})};
function recov(){$('s-newpw').hidden=false;$('np-pw').focus()}
var recovery=h.get('type')==='recovery';
sb.auth.onAuthStateChange(function(ev){if(ev==='PASSWORD_RECOVERY'){recovery=true;recov()}});
if(h.get('error')||q.get('error')){var d=h.get('error_description')||q.get('error_description')||'';say('lmsg',/expired|invalid/i.test(d)?'Odkaz v e-mailu už vypršel nebo není platný. Přihlas se, nebo si nech poslat nový.':'Potvrzení se nepovedlo: '+d,'err');return}
(window.sbReady||sb.auth.getSession()).then(function(r){var ses=r&&r.data&&r.data.session;
 if(recovery){recov();return}
 if(ses){var conf=h.get('type')==='signup'||h.has('access_token');say('lmsg',conf?'E-mail potvrzen, jsi přihlášen(a). Přesměrovávám…':'Už jsi přihlášen(a) jako '+ses.user.email+'. Přesměrovávám…','ok');setTimeout(function(){location.replace(next)},conf?1200:600);return}
 if(q.get('out'))say('lmsg','Byl(a) jsi odhlášen(a).','ok');else if(q.get('next'))say('lmsg','Pro přístup k materiálům se prosím přihlas.','');});
})();
