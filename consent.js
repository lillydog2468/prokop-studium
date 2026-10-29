(function(){
var s=document.currentScript,ID=s&&s.getAttribute('data-ga');if(!ID)return;
var K='sh_consent_ga';
function load(){if(window.__ga)return;window.__ga=1;var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ID);document.head.appendChild(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',ID,{anonymize_ip:true});}
function get(){try{return localStorage.getItem(K)}catch(e){return null}}
function set(v){try{localStorage.setItem(K,v)}catch(e){}}
function banner(){if(document.getElementById('cbar'))return;var d=document.createElement('div');d.id='cbar';d.setAttribute('role','dialog');d.setAttribute('aria-label','Souhlas s měřením návštěvnosti');
d.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:560px;margin:0 auto;background:#fff;color:#1d2321;border:1px solid #d9dfdc;border-radius:14px;padding:14px 16px;font:14px/1.45 system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:10px;align-items:center';
var p=document.createElement('p');p.style.cssText='margin:0;flex:1 1 260px';p.textContent='Smím anonymně měřit návštěvnost (Google Analytics)? Pomůže mi to zjistit, které lekce se používají.';
var a=document.createElement('button'),r=document.createElement('button');a.textContent='Souhlasím';r.textContent='Odmítnout';
var bs='border-radius:999px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer;';a.style.cssText=bs+'background:#1f6f5c;color:#fff;border:1px solid #1f6f5c';r.style.cssText=bs+'background:transparent;color:#1f6f5c;border:1px solid #c9d1cd';
a.onclick=function(){set('yes');d.remove();load()};r.onclick=function(){set('no');d.remove()};
d.appendChild(p);d.appendChild(r);d.appendChild(a);document.body.appendChild(d);}
function init(){var v=get();if(v==='yes')load();else if(v!=='no')banner();
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-consent-reset]');if(t){e.preventDefault();try{localStorage.removeItem(K)}catch(x){}banner()}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
