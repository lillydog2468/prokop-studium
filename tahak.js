(function(){var d=document;
function A(x){return[].slice.call(x)}
var secs=A(d.querySelectorAll('details.sec'));
var o=d.getElementById('topen'),c=d.getElementById('tclose');
if(o)o.onclick=function(){secs.forEach(function(s){s.open=true})};
if(c)c.onclick=function(){secs.forEach(function(s){s.open=false})};
var saved;window.addEventListener('beforeprint',function(){saved=secs.map(function(s){return s.open});secs.forEach(function(s){s.open=true});});
window.addEventListener('afterprint',function(){if(saved)secs.forEach(function(s,i){s.open=saved[i]});});
var pb=d.getElementById('tprint');if(pb)pb.onclick=function(){window.print();};
A(d.querySelectorAll('.toc a')).forEach(function(a){a.addEventListener('click',function(){var s=d.getElementById(a.getAttribute('href').slice(1));if(s)s.open=true;});});
if(location.hash){var s=d.getElementById(location.hash.slice(1));if(s&&s.tagName==='DETAILS')s.open=true;}
function st(){var n=d.querySelector("header.nav"),t=d.querySelector(".tbar");if(n&&t)t.style.top=(n.querySelector(".navin")||n).offsetHeight+"px";}st();window.addEventListener("resize",st);
})();
