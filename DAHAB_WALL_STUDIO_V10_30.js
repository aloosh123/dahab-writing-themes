(() => {
'use strict';
const API='__dahabWallStudio', STYLE='dahab-wall-member-preview-css', UI='dahab-wall-studio-ui', MODAL='dahab-wall-studio-modal', BTN='dahab-wall-wall-button', PREVIEW_STYLE='dahab-wall-live-preview-css';
window[API]?.destroy?.();
  const themes=[
    ['أونيكس ذهبي','#15141a','#d9b66d','#fff2d2','#30291f','#211d23'],
    ['بلاتينيوم','#181e29','#b7d2e9','#edf8ff','#273a50','#202c3b'],
    ['ياقوت ملكي','#25131e','#f080a5','#ffe2eb','#53243b','#311a29'],
    ['زمرد فاخر','#0c2522','#69d9b2','#e0fff2','#174a3e','#13332e'],
    ['أماثيست','#22152e','#c5a0ff','#f5e9ff','#51346e','#301e42'],
    ['روز غولد','#2c1d24','#e9b3a0','#ffede5','#68423f','#3b272b'],
    ['كحلي ذهبي','#101d36','#e7c580','#f8efd8','#30466c','#192b49'],
    ['ثلج لؤلؤي','#f1f4fa','#6985a8','#1e3047','#d9e3f2','#e8edf6'],
    ['أسود كروم','#101317','#aab7c8','#f5f7fa','#34414e','#1e252d'],
    ['لافندر','#28213a','#d5c0ff','#f8f2ff','#594977','#342b4b'],
    ['نحاس عتيق','#251b16','#e6a86e','#ffe8cd','#62412c','#33241c'],
    ['أزرق كهربائي','#101b34','#78b9ff','#e7f5ff','#244f84','#192c4c'],
    ['توتي مخملي','#2d172a','#e7a0d2','#ffe8f7','#65355d','#3d2039'],
    ['تيتانيوم','#25272c','#cbd0d8','#ffffff','#4d525b','#32353c'],
    ['فيروزي داكن','#10272b','#6ad8df','#e3fcff','#275961','#183b42'],
    ['شمبانيا','#f8f1e5','#aa7b43','#382c23','#e7d4b7','#f2e5d1'],
    ['شفق النجوم', '#201633', '#e8a9ff', '#fff2ff', '#684079', '#322047'],
    ['هالة القمر', '#111f39', '#b6dfff', '#f3fbff', '#45648a', '#203553'],
    ['بريق الألماس', '#18202b', '#dceaff', '#ffffff', '#52677f', '#2a3646'],
    ['لهب الياقوت', '#2b121b', '#ff7994', '#fff1f3', '#85334a', '#441d2c'],
    ['نجوم الذهب', '#231a13', '#ffd67c', '#fff8dc', '#78582c', '#3a2b1c'],
    ['مجرة البنفسج', '#180f2e', '#ac93ff', '#f4edff', '#503e8d', '#261c4b'],
    ['شرارة فيروز', '#0e2a2e', '#72fff1', '#edfffc', '#276e72', '#17454b'],
    ['ورود مضيئة', '#301b29', '#ffb3d9', '#fff3fa', '#814d6c', '#46273a'],
    ['فضة لامعة', '#1e2429', '#e2e8f1', '#ffffff', '#6d7c8b', '#343d46'],
    ['وميض أزرق', '#0b1e38', '#65c5ff', '#e9f8ff', '#236aa5', '#153557'],
    ['تاج ملكي', '#24182c', '#f1c66f', '#fff7e3', '#79568a', '#392344'],
    ['لؤلؤ وردي', '#f8e9ee', '#d97b9c', '#4e253a', '#e8b9ca', '#f3dbe4'],
    ['مطر النجوم', '#101b2b', '#9de1ff', '#f3fcff', '#325779', '#1d314a'],
    ['أورورا ساحرة', '#102c2b', '#9dffc5', '#f2fff7', '#437c75', '#1b4845']
  ];

const STORE='dahab-wall-preview-v7', DURATION=120000, COOLDOWN=3600000;
let selectedUser='', selectedTheme=-1, filter='', timer=null, session=null;
try {session=JSON.parse(localStorage.getItem(STORE)||'null')}catch{}
function save(){try{localStorage.setItem(STORE,JSON.stringify(session))}catch{}}
function active(){return session && Date.now()<session.start+DURATION}
function cooling(){return session && Date.now()>=session.start+DURATION && Date.now()<session.start+DURATION+COOLDOWN}
function remaining(){return active()?session.start+DURATION-Date.now():cooling()?session.start+DURATION+COOLDOWN-Date.now():0}
function clock(ms){const n=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`}
if(active()){selectedUser=session.user;selectedTheme=session.theme}
else if(session && !cooling()){session=null;save()}

const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wall='#chat__body__wall_pane';
function members(){
 const m=new Map();
 $$(wall+' .wall_post[data-user]').forEach(post=>{
  const id=post.getAttribute('data-user');if(!id||m.has(id))return;
  const name=post.querySelector('.wall_post__name .username__wrapper')?.textContent?.trim()||'عضو بدون اسم';
  const img=post.querySelector('.wall_post__avatar img')?.getAttribute('src')||'';
  m.set(id,{id,name,img});
 });return [...m.values()];
}
const shapes=[
 // radius, avatar-radius, avatar-size, name-radius, name-border, button-radius, button-shape, avatar-shadow
 ['18px','50%',38,'12px','1px solid', '10px','solid','0 0 0 2px'],
 ['8px','8px',35,'4px','0 solid','4px','solid','none'],
 ['22px','15px',40,'30px','2px solid','25px','solid','0 0 0 3px'],
 ['4px','50%',34,'2px','0 solid','50%','outline','0 0 0 2px'],
 ['16px','4px',37,'10px','1px solid','5px','solid','none'],
 ['28px','50%',42,'4px','0 solid','14px','outline','0 0 0 3px'],
 ['10px','18px',36,'16px','2px solid','3px','solid','none'],
 ['20px','50%',32,'30px','0 solid','24px','outline','0 0 0 2px'],
 ['5px','6px',40,'2px','1px solid','5px','outline','none'],
 ['26px','40%',38,'18px','0 solid','16px','solid','0 0 0 3px'],
 ['14px','50%',36,'3px','2px solid','50%','solid','0 0 0 2px'],
 ['6px','10px',33,'24px','1px solid','4px','outline','none'],
 ['24px','50%',41,'12px','0 solid','18px','solid','0 0 0 3px'],
 ['3px','3px',36,'3px','2px solid','3px','outline','none'],
 ['17px','50%',39,'25px','1px solid','12px','solid','0 0 0 2px'],
 ['12px','14px',34,'6px','0 solid','25px','outline','none']
];
function cssFor(i,user,previewOnly=false){
 if(i<0||!user)return '';
 const [name,bg,accent,ink,edge,soft]=themes[i];
 const [cardRadius,avatarRadius,avatarSize,nameRadius,nameBorder,btnRadius,btnType,avatarShadow]=shapes[i%shapes.length];
 const s=`${previewOnly ? "#dws-preview" : wall} .wall_post[data-user="${CSS.escape(user)}"]`;
 const light=i===7||i===15||i===27;
 const chipBg= i%4===0?`linear-gradient(120deg,${edge},${soft})`:i%4===1?'transparent':i%4===2?accent:soft;
 const chipInk=i%4===2?bg:ink;
 const btnBg=btnType==='outline'?'transparent':`linear-gradient(135deg,${edge},${soft})`;
 const special=i>=16;const motif=(i-16)%7;
 const deco=special ? (motif===0?'✦  ✧  ✦':motif===1?'☾  ✧':motif===2?'✧  ✦':motif===3?'✦  ✧':motif===4?'★  ✦  ★':motif===5?'✧  ✶': '✦  ✧') : '';
 const stripe=special?(motif%2===0?'right':'left'):null;
 return `/* DAHAB WALL V10 — ${name} — ${user} */
${s}{box-sizing:border-box!important;position:relative!important;overflow:hidden!important;max-width:100%!important;margin-block:8px!important;padding:10px 12px!important;background:linear-gradient(${i%2?160:125}deg,${soft},${bg} 78%)!important;border:${i%3===1?'2px':'1px'} solid ${accent}a0!important;border-radius:${cardRadius}!important;box-shadow:inset 0 1px 0 ${accent}24,0 3px 12px #00000014!important;color:${ink}!important}
${special?`${s}::before{content:"${deco}"!important;pointer-events:none!important;position:absolute!important;top:5px!important;${stripe}:9px!important;z-index:1!important;font:700 13px Arial!important;letter-spacing:4px!important;color:${accent}!important;opacity:.72!important;text-shadow:0 0 7px ${accent}55!important} ${s}::after{content:""!important;pointer-events:none!important;position:absolute!important;${stripe}:0!important;top:14%!important;bottom:14%!important;width:${motif===2?3:2}px!important;background:linear-gradient(transparent,${accent}c0,transparent)!important;box-shadow:0 0 9px ${accent}66!important}`:''}
${s} .wall_post__avatar{margin:0 0 5px 8px!important}
${s} .wall_post__avatar img{width:${avatarSize}px!important;height:${avatarSize}px!important;object-fit:cover!important;border-radius:${avatarRadius}!important;border:${i%4===1?'1px':'2px'} solid ${accent}!important;box-shadow:${avatarShadow==='none'?'none':avatarShadow+' '+accent+'55'}!important}
${s} .wall_post__name{margin:0 0 5px!important;line-height:1.5!important;font-size:12px!important;color:${accent}!important;font-weight:700!important}
${s} .wall_post__name .username__wrapper{display:inline-block!important;max-width:calc(100% - 8px)!important;overflow-wrap:anywhere!important;padding:${i%3===0?'2px 7px':'1px 6px'}!important;font-size:inherit!important;line-height:1.45!important;vertical-align:middle!important;background:${chipBg}!important;color:${chipInk}!important;border:${nameBorder} ${accent}a0!important;border-radius:${nameRadius}!important;box-shadow:${i%4===1?'none':`inset 0 1px 0 ${accent}22`}!important}
${s} .wall_post__name .username__icon{max-height:16px!important;vertical-align:middle!important}
${s} .wall_post__body{box-sizing:border-box!important;clear:both!important;width:100%!important;margin:5px 0 7px!important;padding:2px 0!important;background:transparent!important;color:${ink}!important;border:0!important;border-radius:0!important;font-size:13px!important;line-height:1.85!important;overflow-wrap:anywhere!important;box-shadow:none!important}
${s} .wall_post__body>span{color:inherit!important}
${s} .wall_post__footer{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:${i%3===0?5:7}px!important;margin-top:7px!important;padding:7px 0 0!important;border-top:1px solid ${accent}40!important;background:transparent!important}
${s} .wall_post__footer>button{float:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:${i%4===3?30:34}px!important;min-height:${i%4===3?27:29}px!important;padding:5px 8px!important;background:${btnBg}!important;border:1px solid ${accent}a0!important;border-radius:${btnRadius}!important;color:${accent}!important;font-size:12px!important;line-height:1.2!important;box-shadow:${i%4===0?`inset 0 1px 0 ${accent}33`:'none'}!important;text-shadow:none!important}
${s} .wall_post__footer .wall_post__body__comments{color:${btnType==='outline'?accent:ink}!important}
${s} .wall_post__footer .wall_post__body__heart{color:${accent}!important}
${s} .wall_post__footer .wall_post__body__remove{margin-inline-start:auto!important;opacity:.85!important}
${s} .wall_post__time{color:${accent}!important;opacity:.85!important;font-size:10px!important;margin-top:5px!important}
@media(max-width:480px){${s}{padding:9px 10px!important}}`;
}
function updatePreviewStyle(){
 let st=$('#'+PREVIEW_STYLE);
 if(selectedTheme<0||!selectedUser){st?.remove();return}
 if(!st){st=document.createElement('style');st.id=PREVIEW_STYLE;document.head.append(st)}
 st.textContent=cssFor(selectedTheme,selectedUser,true);
}
function apply(){
 let st=$('#'+STYLE);
 if(!active()||session.theme<0||!session.user){st?.remove();renderStatus();renderPreview();return}
 if(!st){st=document.createElement('style');st.id=STYLE;document.head.append(st)}
 st.textContent=cssFor(session.theme,session.user);
 renderStatus();renderPreview();
}
function renderStatus(){
 const el=$('#dws-status');if(!el)return;
 if(cooling()){el.textContent='انتهت التجربة • الانتظار المتبقي: '+clock(remaining());return}
 if(active()){
  const current=members().find(x=>x.id===session.user)?.name||'العضو';
  el.textContent='✓ مُطبّق على '+current+' • المتبقي '+clock(remaining())+' • اختَر عضواً آخر واضغط تطبيق للتبديل';return;
 }
 el.textContent=selectedUser&&selectedTheme>=0?'المعاينة جاهزة • اضغط «تطبيق التصميم» للبدء':'اختر العضو والتصميم ثم اضغط تطبيق';
}
function renderMembers(){const el=$('#dws-members');if(!el)return;const list=members().filter(x=>x.name.toLowerCase().includes(filter.toLowerCase())||x.id.includes(filter));el.innerHTML=list.length?list.map(x=>`<button type="button" data-member="${esc(x.id)}" class="dws-member ${x.id===selectedUser?'on':''}"><img src="${esc(x.img)}" alt=""><span>${esc(x.name)}</span><small>${$$(wall+' .wall_post[data-user="'+x.id+'"]').length}</small></button>`).join(''):'<div class="dws-empty">ماكو أعضاء ظاهرين بالحائط. افتح الحائط حتى تظهر المنشورات.</div>';}
function renderPreview(){
 const box=$('#dws-preview');if(!box)return;
 const post=selectedUser ? $$(wall+' .wall_post[data-user]').find(p=>p.getAttribute('data-user')===selectedUser) : null;
 box.replaceChildren();
 if(!post){const msg=document.createElement('div');msg.className='dws-empty';msg.textContent='اختار عضو من القائمة حتى تشوف منشور حقيقي من منشوراته هنا';box.append(msg);updatePreviewStyle();return;}
 const clone=post.cloneNode(true);
 clone.removeAttribute('id');
 clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
 clone.querySelectorAll('iframe,video,audio').forEach(el=>el.remove());
 clone.querySelectorAll('button, a, input, textarea, video, audio, iframe').forEach(el=>{
   if(el.matches('button, a, input, textarea'))el.setAttribute('tabindex','-1');
   if(el.matches('button'))el.disabled=true;
 });
 box.append(clone);updatePreviewStyle();
}
function renderThemes(){const el=$('#dws-themes');if(!el)return;el.innerHTML=themes.map((t,i)=>`<button type="button" data-theme="${i}" class="dws-theme ${selectedTheme===i?'on':''}" style="--bg:${t[1]};--ac:${t[2]};--ink:${t[3]};--ed:${t[4]};--soft:${t[5]}"><span class="dws-chip" style="border-radius:${['50px','4px','12px','0px'][i%4]};border-width:${i%3===0?2:0}px">${i>=16?'✦ ':''}اسم العضو</span><span class="dws-theme-name">${i>=16?'✧ ':''}${esc(t[0])}</span></button>`).join('');}
function open(){
 if($('#'+MODAL)){renderMembers();renderThemes();renderStatus();renderPreview();return}
 const div=document.createElement('div');div.id=MODAL;div.dir='rtl';div.innerHTML=`<div class="dws-dialog" role="dialog" aria-modal="true" aria-label="استوديو تصاميم الحائط"><div class="dws-head"><div><strong>✦ استوديو تصاميم الحائط</strong><small>دقيقتان للتجربة ثم انتظار ساعة • المعاينة فورية والتطبيق بزر</small></div><button type="button" data-act="close" aria-label="إغلاق">×</button></div><div class="dws-cols"><section><div class="dws-label">الأعضاء من منشورات الحائط <button type="button" data-act="refresh">↻ تحديث</button></div><input id="dws-search" placeholder="بحث باسم العضو..." autocomplete="off"><div id="dws-members"></div><div class="dws-preview-label">معاينة منشور العضو</div><div id="dws-preview"></div></section><section><div class="dws-label">التصاميم الفاخرة • ${themes.length} نموذج</div><div id="dws-themes"></div></section></div><div class="dws-foot"><span id="dws-status"></span><div><button type="button" data-act="apply" class="dws-apply">تطبيق التصميم</button><button type="button" data-act="copy">نسخ رقم التصميم</button><button type="button" data-act="reset">إرجاع الأصلي</button><button type="button" data-act="close">إغلاق</button></div></div></div>`;
 document.body.append(div);renderMembers();renderThemes();renderStatus();renderPreview();
 div.addEventListener('click',async e=>{
  if(e.target===div){div.remove();return}
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.member){selectedUser=b.dataset.member;renderMembers();renderPreview();renderStatus();return}
  if(b.dataset.theme!==undefined){selectedTheme=+b.dataset.theme;renderThemes();renderPreview();renderStatus();return}
  switch(b.dataset.act){case'apply':{if(cooling()){alert('لا يمكن بدء تجربة جديدة قبل انتهاء الانتظار: '+clock(remaining()));return}if(!selectedUser||selectedTheme<0){alert('اختار العضو والتصميم أولاً');return}if(!active())session={start:Date.now(),user:selectedUser,theme:selectedTheme};else {session.user=selectedUser;session.theme=selectedTheme}save();apply();renderMembers();renderThemes();startTimer();break}case'close':div.remove();break;case'refresh':renderMembers();renderPreview();break;case'reset':selectedTheme=-1;if(active()){session.theme=-1;save()}apply();renderThemes();renderStatus();renderPreview();break;case'copy':{if(selectedTheme<0){alert('اختار التصميم أولاً');return}const number=String(selectedTheme+1);try{await navigator.clipboard.writeText(number);b.textContent='تم نسخ رقم '+number+' ✓';setTimeout(()=>{if(b.isConnected)b.textContent='نسخ رقم التصميم'},1500)}catch{prompt('انسخ رقم التصميم:',number)}break}}
 });
 $('#dws-search').addEventListener('input',e=>{filter=e.target.value;renderMembers()});
}
function startTimer(){
 if(timer)clearInterval(timer);
 if(!session)return;
 timer=setInterval(()=>{
   if(!active()){apply();}
   if(!active() && !cooling()){clearInterval(timer);timer=null;session=null;save()}
   renderStatus();
 },1000);
}
if(active()){apply();startTimer()}else if(cooling())startTimer();
function insertButton(){
 const anchor=$(wall+' .wall-leaderboard-open');
 if(!anchor)return false;
 let wrap=$('#dahab-wall-actions-v9');
 if(!wrap){
   wrap=document.createElement('div');wrap.id='dahab-wall-actions-v9';
   anchor.parentNode.insertBefore(wrap,anchor);
 }
 if(anchor.parentNode!==wrap)wrap.append(anchor);
 let b=$('#'+BTN);
 if(!b){b=document.createElement('button');b.type='button';b.id=BTN;b.innerHTML='<span class="fa fa-magic" aria-hidden="true"></span> تصاميم الحائط';b.setAttribute('aria-label','فتح استوديو تصاميم الحائط');}
 if(b.parentNode!==wrap)wrap.append(b);
 return true;
}
const ui=document.createElement('style');ui.id=UI;ui.textContent=`
#dahab-wall-actions-v9{display:flex!important;align-items:stretch!important;gap:6px!important;width:calc(100% - 16px)!important;max-width:100%!important;margin:8px auto!important;direction:rtl!important;box-sizing:border-box!important}
#dahab-wall-actions-v9>.wall-leaderboard-open,#dahab-wall-actions-v9>#${BTN}{flex:1 1 0!important;min-width:0!important;width:50%!important;max-width:none!important;min-height:36px!important;position:relative!important;inset:auto!important;float:none!important;margin:0!important;padding:6px 4px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;border-radius:10px!important;font:700 12px Tahoma,Arial,sans-serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;cursor:pointer!important;box-sizing:border-box!important}
#dahab-wall-actions-v9>.wall-leaderboard-open{background:linear-gradient(145deg,#372744,#201d32)!important;color:#f5d9a5!important;border:1px solid #9876a0!important;box-shadow:inset 0 1px 0 #ffffff16!important}
#dahab-wall-actions-v9>#${BTN}{background:linear-gradient(135deg,#574074,#2c2546)!important;color:#f8e8ff!important;border:1px solid #b89ad2!important;box-shadow:inset 0 1px 0 #ffffff20!important}
#dahab-wall-actions-v9>#${BTN}:active{filter:brightness(1.12)}
@media(max-width:350px){#dahab-wall-actions-v9>.wall-leaderboard-open,#dahab-wall-actions-v9>#${BTN}{font-size:10px!important;gap:3px!important}}

#${MODAL}{position:fixed!important;inset:0!important;z-index:2147483645!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#07070bc9!important;padding:12px!important;font:13px Tahoma,Arial,sans-serif!important;color:#f5efff!important}
#${MODAL} *{box-sizing:border-box!important}
#${MODAL} .dws-dialog{width:min(760px,100%)!important;max-height:90dvh!important;display:flex!important;flex-direction:column!important;background:linear-gradient(145deg,#211a2d,#11121c)!important;border:1px solid #8b7198!important;border-radius:17px!important;box-shadow:0 18px 60px #0009!important;overflow:hidden!important}
#${MODAL} .dws-head{padding:14px 17px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;border-bottom:1px solid #554563!important}
#${MODAL} .dws-head strong{display:block!important;font-size:16px!important;color:#f3d9aa!important}
#${MODAL} .dws-head small{display:block!important;color:#bbb0c7!important;margin-top:5px!important}
#${MODAL} button{cursor:pointer!important;font-family:inherit!important}
#${MODAL} .dws-head button{background:#493b54!important;color:white!important;border:0!important;border-radius:8px!important;width:30px!important;height:30px!important;font-size:22px!important}
#${MODAL} .dws-cols{display:grid!important;grid-template-columns:minmax(180px,0.85fr) minmax(0,1.4fr)!important;gap:13px!important;padding:14px!important;min-height:0!important;overflow:auto!important}
#${MODAL} section{min-width:0!important}
#${MODAL} .dws-label{font-weight:bold!important;color:#e7d7ee!important;margin-bottom:9px!important;display:flex!important;justify-content:space-between!important;align-items:center!important}
#${MODAL} .dws-label button{background:#443950!important;color:white!important;border:0!important;border-radius:6px!important;padding:5px!important}
#${MODAL} #dws-search{width:100%!important;padding:10px!important;background:#272437!important;border:1px solid #695b7b!important;border-radius:9px!important;color:white!important;margin-bottom:8px!important;outline:none!important}
#${MODAL} #dws-members{max-height:200px!important;overflow:auto!important;display:flex!important;flex-direction:column!important;gap:5px!important}
#${MODAL} .dws-member{width:100%!important;display:flex!important;align-items:center!important;gap:8px!important;padding:6px 8px!important;border:1px solid #4d445d!important;border-radius:9px!important;background:#292537!important;color:#eee!important;text-align:right!important;min-height:42px!important}
#${MODAL} .dws-member.on{border-color:#e2bf83!important;background:#4a3a4b!important}
#${MODAL} .dws-member img{width:29px!important;height:29px!important;object-fit:cover!important;border-radius:50%!important;flex-shrink:0!important}
#${MODAL} .dws-member span{flex:1!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:12px!important;font-weight:500!important;line-height:1.4!important}
#${MODAL} .dws-member small{color:#d2bd9d!important}
#${MODAL} #dws-themes{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
#${MODAL} .dws-theme{min-width:0!important;min-height:76px!important;padding:9px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:space-between!important;text-align:right!important;background:linear-gradient(125deg,var(--soft),var(--bg))!important;border:1px solid var(--ac)!important;border-radius:12px!important;color:var(--ink)!important}
#${MODAL} .dws-theme.on{outline:2px solid #fff!important;outline-offset:-4px!important}
#${MODAL} .dws-chip{display:inline-block!important;background:var(--ed)!important;border:1px solid var(--ac)!important;color:var(--ink)!important;padding:3px 7px!important;border-radius:7px!important;font-size:11px!important}
#${MODAL} .dws-theme-name{color:var(--ac)!important;font-weight:bold!important;font-size:12px!important}
#${MODAL} .dws-foot{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;flex-wrap:wrap!important;padding:12px 14px!important;border-top:1px solid #554563!important}
#${MODAL} #dws-status{font-size:11px!important;color:#d7c8df!important}
#${MODAL} .dws-foot>div{display:flex!important;gap:6px!important;flex-wrap:wrap!important}
#${MODAL} .dws-foot button.dws-apply{background:linear-gradient(135deg,#b99860,#e5cb96)!important;color:#251a15!important;border:1px solid #f0d6a2!important;font-weight:700!important}#${MODAL} .dws-foot button{border:1px solid #85718d!important;background:#40334e!important;color:white!important;border-radius:8px!important;padding:8px 10px!important}
#${MODAL} .dws-preview-label{font-size:12px!important;font-weight:bold!important;color:#e8d1a2!important;margin:12px 0 8px!important}
#${MODAL} #dws-preview{width:100%!important;min-height:85px!important;max-height:290px!important;overflow:auto!important;background:#eae8ed!important;border-radius:12px!important;padding:7px!important;direction:rtl!important;isolation:isolate!important}
#${MODAL} #dws-preview .wall_post{width:100%!important;max-width:100%!important;margin:0!important;float:none!important;display:flow-root!important;box-sizing:border-box!important;min-height:80px!important}
#${MODAL} #dws-preview .wall_post__body{display:block!important}
#${MODAL} #dws-preview button,#${MODAL} #dws-preview a{pointer-events:none!important;cursor:default!important}
#${MODAL} #dws-preview img{max-width:100%}
#${MODAL} .dws-empty{padding:15px!important;color:#ddd!important}
@media(max-width:540px){#${MODAL} .dws-cols{grid-template-columns:1fr!important}#${MODAL} #dws-members{max-height:135px!important}#${MODAL} .dws-dialog{max-height:94dvh!important}}
`;document.head.append(ui);
function onClick(e){if(e.target.closest('#'+BTN)){e.preventDefault();e.stopPropagation();open()}}
function onKey(e){if((e.key==='Enter'||e.key===' ')&&e.target.closest('#'+BTN)){e.preventDefault();open()}}
document.addEventListener('click',onClick,true);document.addEventListener('keydown',onKey,true);
insertButton();
const observer=new MutationObserver(()=>{if(insertButton())observer.disconnect()});
if(!insertButton())observer.observe(document.body,{childList:true,subtree:true});
function destroy(){if(timer)clearInterval(timer);observer.disconnect();document.removeEventListener('click',onClick,true);document.removeEventListener('keydown',onKey,true);$('#'+MODAL)?.remove();$('#'+BTN)?.remove();const wrap=$('#dahab-wall-actions-v9');if(wrap){const leader=wrap.querySelector('.wall-leaderboard-open');if(leader)wrap.parentNode.insertBefore(leader,wrap);wrap.remove()}$('#'+STYLE)?.remove();$('#'+PREVIEW_STYLE)?.remove();ui.remove();delete window[API]}
window[API]={open,reset:()=>{selectedTheme=-1;if(active()){session.theme=-1;save()}apply();renderPreview()},destroy,css:()=>cssFor(selectedTheme,selectedUser),members,getRemaining:remaining};
console.log('✅ استوديو الحائط V10: 30 تصميم وزر بجانب مبدعين الجدار. __dahabWallStudio.open()');
})();
