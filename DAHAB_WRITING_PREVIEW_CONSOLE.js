(() => {
'use strict';
const API='DahabWritingTry', BUTTON='dahab-writing-design-button', MODAL='dahab-writing-try-modal';
const ATTR='data-dahab-preview', STORAGE='dahab-writing-preview-session-v3';
const OLD_STORAGE='dahab-writing-preview-session-v2';
const DURATION=120000, COOLDOWN=3600000;
const CSS_URL='https://cdn.jsdelivr.net/gh/aloosh123/dahab-writing-themes@main/all-themes.css';
const THEMES=[{"id":"01","name":"بلاتينيوم كروم","dark":"#424a56","light":"#dce1e7","mid":"#6c7786","ink":"#ffffff"},{"id":"02","name":"الملكي الأزرق","dark":"#0c1d40","light":"#81baff","mid":"#264e8c","ink":"#e9f7ff"},{"id":"03","name":"الذهب الإمبراطوري","dark":"#483008","light":"#ffdd7a","mid":"#ad7520","ink":"#fff7da"},{"id":"04","name":"الماسي الوردي","dark":"#572347","light":"#ffc3e5","mid":"#a6538d","ink":"#fff0fa"},{"id":"05","name":"الزمرد الفاخر","dark":"#0b392d","light":"#98f5c7","mid":"#218b69","ink":"#e5fff2"},{"id":"06","name":"نيون بنفسجي","dark":"#251044","light":"#b78aff","mid":"#6530bf","ink":"#f4eaff"},{"id":"07","name":"أوبسيديان أسود","dark":"#0b0d13","light":"#b7c2d0","mid":"#404653","ink":"#f7f8fb"},{"id":"08","name":"الجليد القطبي","dark":"#1e5274","light":"#d5faff","mid":"#69b9d9","ink":"#ffffff"},{"id":"09","name":"روز غولد","dark":"#693c48","light":"#ffd1c2","mid":"#b97883","ink":"#fff3ed"},{"id":"10","name":"لهيب أحمر","dark":"#541414","light":"#ffab73","mid":"#c43e29","ink":"#fff3e8"},{"id":"11","name":"فضة القمر","dark":"#414653","light":"#e9eefb","mid":"#858da6","ink":"#ffffff"},{"id":"12","name":"أورورا","dark":"#102c4a","light":"#9ce9e4","mid":"#7652b8","ink":"#f2fffc"},{"id":"13","name":"ياقوت أحمر","dark":"#430e26","light":"#ff7d9a","mid":"#a82a53","ink":"#fff0f4"},{"id":"14","name":"سفير سماوي","dark":"#163d64","light":"#c2e8ff","mid":"#347eaf","ink":"#f5fbff"},{"id":"15","name":"نحاس عتيق","dark":"#4a2b21","light":"#f1b887","mid":"#a66c48","ink":"#fff2e7"},{"id":"16","name":"سايبر أخضر","dark":"#062c22","light":"#8bff75","mid":"#20835a","ink":"#e9ffe7"},{"id":"17","name":"مجرة كونية","dark":"#151034","light":"#e2b5ff","mid":"#513a9c","ink":"#fff0ff"},{"id":"18","name":"لؤلؤ أبيض","dark":"#c2c7d3","light":"#ffffff","mid":"#e5e7ef","ink":"#263044"},{"id":"19","name":"غروب برتقالي","dark":"#653017","light":"#ffc17c","mid":"#c75e31","ink":"#fff5e8"},{"id":"20","name":"منتصف الليل","dark":"#090f2a","light":"#91a3e3","mid":"#283969","ink":"#edf2ff"},{"id":"21","name":"فيروز بحري","dark":"#0b4550","light":"#9af2ee","mid":"#289da6","ink":"#e6fffd"},{"id":"22","name":"كرز مخملي","dark":"#48122d","light":"#f7a3bf","mid":"#a84272","ink":"#fff1f7"},{"id":"23","name":"شمس ذهبية","dark":"#6e4209","light":"#fff0a0","mid":"#d9a431","ink":"#fff9e5"},{"id":"24","name":"أرجوان ملكي","dark":"#37165c","light":"#e2b7ff","mid":"#8549ba","ink":"#fff2ff"},{"id":"25","name":"كربون رياضي","dark":"#20252c","light":"#b9e4ee","mid":"#5b7585","ink":"#f1fbff"},{"id":"26","name":"نعناع كريستال","dark":"#245d53","light":"#c8ffe7","mid":"#66bba5","ink":"#f1fff9"},{"id":"27","name":"صحراء ذهبية","dark":"#654a26","light":"#ffe2a3","mid":"#b98a43","ink":"#fff7e8"},{"id":"28","name":"ساكورا","dark":"#61384c","light":"#ffe0ed","mid":"#c986a6","ink":"#fff6fa"},{"id":"29","name":"كهرباء زرقاء","dark":"#102c66","light":"#7ee8ff","mid":"#2d8eea","ink":"#f0fbff"},{"id":"30","name":"تاج الأساطير","dark":"#241c36","light":"#ffe6a2","mid":"#9e77cd","ink":"#fff6df"}];
try { window[API]?.destroy?.(); } catch (_) {}
const q=(s,root=document)=>root.querySelector(s);
const qa=(s,root=document)=>Array.from(root.querySelectorAll(s));
let modal=null, selectedTheme='', selectedUser='', observer=null, timer=null, cssPromise=null, destroyed=false;
let session=null;
try { session=JSON.parse(localStorage.getItem(STORAGE)||localStorage.getItem(OLD_STORAGE)||'null'); } catch (_) {}
if(session && (!session.user || !session.end || !session.theme))session=null;
function state(){let now=Date.now();return session&&now<session.end?'active':session&&now<session.end+COOLDOWN?'cooldown':'ready';}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(session));localStorage.removeItem(OLD_STORAGE);return true;}catch(e){console.warn('[DahabWritingTry] storage',e);return false;}}
function fmt(ms){let x=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0');}
function messages(){return qa('.public_message[data-user]');}
function users(){let seen=new Set(),out=[];for(const el of messages().reverse()){const id=el.getAttribute('data-user'),name=q('.username__wrapper',el)?.textContent.trim();if(id&&name&&!seen.has(id)){seen.add(id);out.push({id,name});}}return out;}
function detectOwn(){const sels=['#my-profile .username__wrapper','#profile-modal .username__wrapper','.my-profile .username__wrapper','.profile-me .username__wrapper'];let name=sels.map(s=>q(s)?.textContent.trim()).find(Boolean);if(!name)return '';let m=users().filter(u=>u.name===name);return m.length===1?m[0].id:'';}
function clear(){qa('.public_message['+ATTR+']').forEach(el=>el.removeAttribute(ATTR));}
function applyTo(el){if(!el.matches?.('.public_message[data-user]'))return;if(state()==='active'&&el.dataset.user===session.user){if(el.getAttribute(ATTR)!==session.theme)el.setAttribute(ATTR,session.theme);}else if(el.hasAttribute(ATTR))el.removeAttribute(ATTR);}
function applyAll(){for(const el of messages())applyTo(el);}
function applyAdded(node){if(node.nodeType!==1)return;if(node.matches?.('.public_message[data-user]'))applyTo(node);node.querySelectorAll?.('.public_message[data-user]').forEach(applyTo);}
function watch(){if(observer)return;const root=q('#chat__body__messages')||q('.chat__body__messages')||q('#chat__body')||document.body;
observer=new MutationObserver(records=>{if(state()!=='active')return;for(const r of records){if(r.type==='childList')r.addedNodes.forEach(applyAdded);else if(r.type==='attributes'&&r.target.matches?.('.public_message[data-user]'))applyTo(r.target);}});
observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['data-user']});}
function unwatch(){observer?.disconnect();observer=null;}
function schedule(){clearTimeout(timer);timer=null;if(state()==='active'){watch();timer=setTimeout(()=>{clear();unwatch();refresh();schedule();},Math.max(1,session.end-Date.now()+20));}else{unwatch();if(state()==='cooldown')timer=setTimeout(()=>{refresh();schedule();},Math.max(1,session.end+COOLDOWN-Date.now()+20));}}
function loadCSS(){if(cssPromise)return cssPromise;
cssPromise=new Promise((resolve,reject)=>{let old=q('#dahab-writing-themes-css');if(old){if(old.sheet){resolve();return;}old.addEventListener('load',resolve,{once:true});old.addEventListener('error',()=>reject(new Error('CSS failed')),{once:true});return;}
let link=document.createElement('link');link.id='dahab-writing-themes-css';link.rel='stylesheet';link.href=CSS_URL;link.onload=resolve;link.onerror=()=>{link.remove();cssPromise=null;reject(new Error('تعذر تحميل ملف التصاميم CSS'));};document.head.appendChild(link);});return cssPromise;}
const css=`
#${MODAL}{position:fixed!important;inset:0!important;z-index:2147483646!important;background:#070b17d9!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:12px!important;direction:rtl!important;font:12px Tahoma,Arial,sans-serif!important}
#${MODAL} *{box-sizing:border-box!important}
#${MODAL} .dw-box{width:min(650px,100%);max-height:92dvh;overflow:auto;background:linear-gradient(155deg,#18223b,#101626);border:1px solid #697a9c;border-radius:16px;color:#fff;padding:14px;box-shadow:0 20px 65px #0009}
#${MODAL} .dw-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
#${MODAL} .dw-head strong{font-size:17px;color:#ffe0a6}
#${MODAL} button,#${MODAL} select{font-family:inherit;cursor:pointer}
#${MODAL} .dw-x{background:#3b4b69;color:#fff;border:0;border-radius:8px;padding:7px 12px}
#${MODAL} .dw-info{font-size:12px;color:#cad6eb;line-height:1.8;margin:7px 0}
#${MODAL} select{width:100%;height:39px;background:#253550;color:#fff;border:1px solid #7286aa;border-radius:8px;padding:6px;margin:5px 0 8px}
#${MODAL} .dw-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}
#${MODAL} .dw-item{background:#263450;color:#fff;border:1px solid #50688c;border-radius:10px;padding:7px;text-align:right;min-width:0}
#${MODAL} .dw-item[aria-pressed=true]{border-color:#ffdb91;outline:2px solid #ffdb91}
#${MODAL} .dw-swatch{height:48px;display:flex;align-items:center;justify-content:center;border-radius:7px;margin-bottom:6px;overflow:hidden}
#${MODAL} .dw-swatch span{font-size:11px;color:white;text-shadow:0 1px 3px #000;background:#0005;padding:3px 5px;border-radius:7px}
#${MODAL} .dw-label{font-size:11px;line-height:1.6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#${MODAL} .dw-code{color:#ffdc96;font-weight:bold;font-size:12px}
#${MODAL} .dw-actions{display:flex;gap:7px;margin-top:12px}
#${MODAL} .dw-actions button{flex:1;padding:10px 5px;border:0;border-radius:8px;background:#435677;color:white;font-weight:bold}
#${MODAL} .dw-actions .dw-start{background:linear-gradient(110deg,#e8b660,#ffe09c);color:#2b1b0b}
#${MODAL} .dw-actions button:disabled{opacity:.5;cursor:not-allowed}
#${MODAL} .dw-status{background:#202e46;padding:9px;border-radius:9px;line-height:1.9;margin-top:10px;color:#f4e1bb}
#${MODAL} .dw-count{font-size:18px;text-align:center;color:#ffe19e;font-weight:bold;padding:9px;border:1px solid #536a90;border-radius:9px;margin:9px 0;background:#19283f;font-variant-numeric:tabular-nums}
#${MODAL} .dw-note{font-size:11px;color:#a9bad6;margin-top:8px;line-height:1.8}
.public_message[${ATTR}]{position:relative!important}
.public_message[${ATTR}]::after{content:'تجربة';position:absolute!important;left:2px!important;bottom:2px!important;right:auto!important;top:auto!important;z-index:6!important;font:700 9px Tahoma,Arial!important;color:#fff!important;background:linear-gradient(120deg,#dc528d,#7734bd)!important;padding:2px 5px!important;border:1px solid #ffe0ef!important;border-radius:5px!important;pointer-events:none!important}
@media(max-width:440px){#${MODAL} .dw-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#${MODAL} .dw-box{padding:10px}}
`;
let style=document.createElement('style');style.id='dahab-writing-try-ui-v3';style.textContent=css;document.head.appendChild(style);
function status(t){let e=modal&&q('.dw-status',modal);if(e)e.textContent=t;}
function refresh(){if(!modal)return;let st=state(),label=q('.dw-count',modal),start=q('.dw-start',modal),select=q('#dw-user',modal);
label.textContent=st==='active'?'⏳ باقي '+fmt(session.end-Date.now())+' — بدّل التصاميم بحرية':st==='cooldown'?'🔒 التجربة القادمة بعد '+fmt(session.end+COOLDOWN-Date.now()):'✨ عندك دقيقتين لتجربة التصاميم';
start.disabled=st!=='ready'||!selectedUser||!selectedTheme;
start.textContent=st==='active'?'التجربة جارية':st==='cooldown'?'انتظر انتهاء الساعة':'ابدأ تجربة دقيقتين';select.disabled=st==='active';
}
function choose(id){if(!THEMES.some(t=>t.id===id))return;selectedTheme=id;
q('.dw-grid',modal)?.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===id)));
if(state()==='active'){session.theme=id;persist();applyAll();status('✓ تم تطبيق التصميم رقم '+id+' فوراً على رسائلك، بدون تصفير الوقت.');}
else if(state()==='cooldown')status('تگدر تشوف النماذج، لكن التجربة انتهت وتنتظر انتهاء الساعة.');
else status('اخترت التصميم رقم '+id+'. اضغط بدء التجربة.');refresh();}
function start(){if(state()!=='ready'||!selectedUser||!selectedTheme)return;
let own=detectOwn();if(own&&selectedUser!==own){status('للمعاينة على رسائلك فقط، اختَر حسابك.');return;}
let els=messages().filter(x=>x.dataset.user===selectedUser);if(!els.length){status('أرسل رسالة بالعام أولاً حتى تظهر المعاينة.');return;}
session={user:selectedUser,theme:selectedTheme,end:Date.now()+DURATION};if(!persist()){session=null;status('تعذر حفظ التجربة بالمتصفح، ما بدأناها.');return;}
applyAll();schedule();status('✓ التجربة شغالة على رسائلك، تگدر تغيّر التصميم فوراً خلال دقيقتين.');refresh();}
function copy(){let t=THEMES.find(x=>x.id===selectedTheme);if(!t){status('اختَر تصميم أولاً.');return;}
let msg='أريد تصميم الكتابة العامة رقم '+t.id+' — '+t.name;
if(navigator.clipboard?.writeText)navigator.clipboard.writeText(msg).then(()=>status('✓ تم نسخ طلب التصميم رقم '+t.id)).catch(()=>prompt('انسخ الطلب:',msg));else prompt('انسخ الطلب:',msg);}
function close(){modal?.remove();modal=null;}
function open(){close();modal=document.createElement('div');modal.id=MODAL;
modal.innerHTML=`<section class="dw-box" role="dialog" aria-modal="true" aria-label="صمم كتابتك"><div class="dw-head"><strong>✦ صمم كتابتك — 30 نموذج</strong><button type="button" class="dw-x" data-action="close">✕</button></div><div class="dw-info">التجربة دقيقتين، تگدر تبدّل بين التصاميم بلا حدود ويظهر التغيير فوراً. إذا حدثت الصفحة، يبقى نفس التصميم والوقت المتبقي. بعدها انتظار 60 دقيقة. المعاينة على متصفحك فقط.</div><label for="dw-user">رسائلك في العام</label><select id="dw-user"></select><div class="dw-count"></div><div class="dw-grid"></div><div class="dw-status">اختَر التصميم وابدأ التجربة.</div><div class="dw-actions"><button type="button" class="dw-start" data-action="start">ابدأ تجربة دقيقتين</button><button type="button" data-action="copy">نسخ رقم التصميم</button></div><div class="dw-note">التصميم دائم فقط بعد تفعيله من الإدارة في CSS العضوية. لا يتم تغيير عضويتك تلقائياً.</div></section>`;
document.body.appendChild(modal);
let select=q('#dw-user',modal),u=users();select.add(new Option('اختر اسمك من رسائل العام...',''));for(let x of u)select.add(new Option(x.name,x.id));
selectedUser=state()==='active'?session.user:(detectOwn()||selectedUser);if(selectedUser&&!u.some(x=>x.id===selectedUser))select.add(new Option('رسائلك السابقة',selectedUser));select.value=selectedUser;
select.addEventListener('change',()=>{selectedUser=select.value;refresh();});
let grid=q('.dw-grid',modal);for(let t of THEMES){let b=document.createElement('button');b.type='button';b.className='dw-item';b.dataset.theme=t.id;b.setAttribute('aria-pressed','false');b.innerHTML='<div class="dw-swatch"><span>✦ اسم العضو</span></div><div class="dw-label"></div><div class="dw-code"></div>';q('.dw-swatch',b).style.background=`linear-gradient(120deg,${t.dark},${t.mid},${t.light})`;q('.dw-label',b).textContent=t.name;q('.dw-code',b).textContent='#'+t.id;grid.appendChild(b);}
selectedTheme=state()==='active'?session.theme:selectedTheme;
if(selectedTheme)grid.querySelector(`[data-theme="${selectedTheme}"]`)?.setAttribute('aria-pressed','true');
modal.addEventListener('click',e=>{let theme=e.target.closest('[data-theme]');if(theme){choose(theme.dataset.theme);return;}let a=e.target.closest('[data-action]')?.dataset.action;if(a==='close'||e.target===modal)close();else if(a==='start')start();else if(a==='copy')copy();});
if(state()==='active')status('التجربة مستمرة من قبل التحديث. اختَر أي تصميم ويتطبق فوراً.');
refresh();let countdown=setInterval(()=>{if(!modal?.isConnected){clearInterval(countdown);return;}refresh();},1000);
loadCSS().then(()=>{if(state()==='active')applyAll();}).catch(e=>status(e.message));}
function addButton(){if(q('#'+BUTTON))return;let explore=q('#open-explore-settings');if(!explore)return;let el=document.createElement('div');el.id=BUTTON;el.className='chat__body__settings_pane__container__button form-control';el.innerHTML='<span><span class="fa fa-paint-brush"></span> صمم كتابتك</span><span>30 نموذج</span>';explore.before(el);}
function clicks(e){if(e.target.closest('#'+BUTTON)){e.preventDefault();open();}else if(e.target.closest('#chat__footer__menu__settings_item')){addButton();queueMicrotask(addButton);}}
document.addEventListener('click',clicks);addButton();
if(state()==='active'){loadCSS().then(()=>{applyAll();watch();}).catch(console.error);}schedule();
function destroy(){destroyed=true;clearTimeout(timer);unwatch();clear();close();q('#'+BUTTON)?.remove();style.remove();document.removeEventListener('click',clicks);delete window[API];}
window[API]={open,close,destroy,getRemaining:()=>state()==='active'?Math.max(0,session.end-Date.now()):state()==='cooldown'?Math.max(0,session.end+COOLDOWN-Date.now()):0};
console.log('✓ Dahab Writing V3 | 120s preview | live switching | refresh recovery | external CSS');
})();
