(function(){var b=document.getElementById('tplay');if(!b)return;var f=document.createElement('div');f.id='tframe';f.setAttribute('aria-hidden','true');document.body.appendChild(f);
function u(){document.documentElement.classList.toggle('trun',b.textContent.indexOf('⏸')>-1)}new MutationObserver(u).observe(b,{childList:true,characterData:true,subtree:true});u();})();
