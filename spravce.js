(function(){
function $(i){return document.getElementById(i)}
function say(id,t,k){var e=$(id);e.textContent=t;e.className='lmsg'+(k?' '+k:'');e.hidden=!t}
function err(e){var m=(e&&e.message)||'';if(/oprávnění|42501|permission/i.test(m))return 'Nemáš oprávnění.';return m||'Něco se nepovedlo.'}
var sb=window.sbClient;
window.sbIsAdmin.then(function(ok){if(!ok)return;init()});
function loadPin(){return sb.rpc('admin_get_pin').then(function(r){if(r.error)return say('amsg',err(r.error),'err');var d=r.data&&r.data[0];if(d){$('a-pin').textContent=d.value;$('a-enf').checked=!!d.enforce_signup}})}
function loadUsers(){return sb.rpc('admin_list_users').then(function(r){if(r.error)return say('rmsg',err(r.error),'err');var tb=$('a-users');tb.textContent='';
 (r.data||[]).forEach(function(u){var tr=document.createElement('tr');
  [u.email,new Date(u.created_at).toLocaleDateString('cs-CZ'),u.role==='admin'?'správce':'uživatel'].forEach(function(t){var td=document.createElement('td');td.textContent=t;tr.appendChild(td)});
  var td=document.createElement('td'),b=document.createElement('button');b.className='btn';b.type='button';b.textContent=u.role==='admin'?'Odebrat správce':'Udělat správcem';
  b.addEventListener('click',function(){b.disabled=true;sb.rpc('admin_set_role',{target:u.user_id,new_role:u.role==='admin'?'user':'admin'}).then(function(x){if(x.error){say('rmsg',err(x.error),'err');b.disabled=false}else{say('rmsg','Role změněna.','ok');loadUsers()}})});
  td.appendChild(b);tr.appendChild(td);tb.appendChild(tr)})})}
function init(){loadPin();loadUsers();
 $('f-apin').addEventListener('submit',function(ev){ev.preventDefault();var v=$('a-newpin').value.trim();if(v.length<2)return say('amsg','PIN musí mít aspoň 2 znaky.','err');
  sb.rpc('admin_set_pin',{new:v}).then(function(r){if(r.error)return say('amsg',err(r.error),'err');$('a-newpin').value='';say('amsg','PIN změněn.','ok');loadPin()})});
 $('a-enf').addEventListener('change',function(){var c=$('a-enf').checked;sb.rpc('admin_set_enforce',{on_:c}).then(function(r){if(r.error){$('a-enf').checked=!c;return say('amsg',err(r.error),'err')}say('amsg',c?'Registrace vyžaduje PIN.':'Registrace teď PIN nevyžaduje.','ok')})});
}
})();
