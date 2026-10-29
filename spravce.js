(function(){
function $(i){return document.getElementById(i)}
function say(id,t,k){var e=$(id);e.textContent=t;e.className='lmsg'+(k?' '+k:'');e.hidden=!t}
function err(e){var m=(e&&e.message)||'';if(/oprávnění|42501|permission/i.test(m))return 'Nemáš oprávnění.';return m||'Něco se nepovedlo.'}
var sb=window.sbClient;
var ADMIN=false;window.sbRole.then(function(r){if(r!=='admin'&&r!=='moderator')return;ADMIN=r==='admin';init()});
function loadPin(){return sb.rpc('admin_get_pin').then(function(r){if(r.error)return say('amsg',err(r.error),'err');var d=r.data&&r.data[0];if(d){$('a-pin').textContent=d.value;$('a-enf').checked=!!d.enforce_signup}})}
function loadUsers(){return sb.rpc('admin_list_users').then(function(r){if(r.error)return say('rmsg',err(r.error),'err');var tb=$('a-users');tb.textContent='';
 (r.data||[]).forEach(function(u){var tr=document.createElement('tr');
  [u.email,new Date(u.created_at).toLocaleDateString('cs-CZ'),({admin:'správce',moderator:'moderátor'})[u.role]||'uživatel'].forEach(function(t){var td=document.createElement('td');td.textContent=t;tr.appendChild(td)});
  var td=document.createElement('td');if(ADMIN){var sel=document.createElement('select');sel.setAttribute('aria-label','Role pro '+u.email);
  [['user','Uživatel'],['moderator','Moderátor'],['admin','Správce']].forEach(function(o){var op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(u.role===o[0])op.selected=true;sel.appendChild(op)});
  sel.addEventListener('change',function(){var nv=sel.value;sel.disabled=true;sb.rpc('admin_set_role',{target:u.user_id,new_role:nv}).then(function(x){sel.disabled=false;if(x.error){sel.value=u.role;say('rmsg',err(x.error),'err')}else{say('rmsg','Role změněna.','ok');loadUsers()}})});td.appendChild(sel)}
  tr.appendChild(td);tb.appendChild(tr)})})}
function init(){if(!ADMIN){var th=document.querySelector('.atbl thead th:last-child');if(th)th.textContent=''}var rn=document.getElementById('a-role');if(rn)rn.textContent=ADMIN?'Jsi správce: můžeš měnit role.':'Jsi moderátor: můžeš spravovat PIN a vidět uživatele, role mění jen správce.';loadPin();loadUsers();
 $('f-apin').addEventListener('submit',function(ev){ev.preventDefault();var v=$('a-newpin').value.trim();if(v.length<2)return say('amsg','PIN musí mít aspoň 2 znaky.','err');
  sb.rpc('admin_set_pin',{new:v}).then(function(r){if(r.error)return say('amsg',err(r.error),'err');$('a-newpin').value='';say('amsg','PIN změněn.','ok');loadPin()})});
 $('a-enf').addEventListener('change',function(){var c=$('a-enf').checked;sb.rpc('admin_set_enforce',{on_:c}).then(function(r){if(r.error){$('a-enf').checked=!c;return say('amsg',err(r.error),'err')}say('amsg',c?'Registrace vyžaduje PIN.':'Registrace teď PIN nevyžaduje.','ok')})});
}
})();
