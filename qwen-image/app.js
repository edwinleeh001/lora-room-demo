import {createTimeline} from './timeline.mjs';
document.querySelector('#lesson').innerHTML=window.lessonHTML;
document.querySelector('#speaker').innerHTML=window.speakerHTML;
document.querySelector('#bilingual-lecture').innerHTML=window.bilingualHTML;
const $=s=>document.querySelector(s), x0=$('#x0'),x1=$('#x1'),pred=$('#pred'),time=$('#time'), play=$('#play');
let pos=0,raf=0,last=0,feedback='';const fmt=n=>Number(n).toFixed(2).replace('-', '−');
function pause(){cancelAnimationFrame(raf);raf=0;last=0;play.textContent='播放'}
function render(){const a=+x0.value,b=+x1.value,v=a-b,t=pos,xt=t*a+(1-t)*b,p=+pred.value;$('#x0val').textContent=fmt(a);$('#x1val').textContent=fmt(b);$('#predval').textContent=fmt(p);$('#tval').textContent=fmt(t);$('#xt').textContent=fmt(xt);$('#velocity').textContent=fmt(v);$('#loss').textContent=fmt((p-v)**2);time.value=t;const scale=x=>60+(x+3)/6*600;$('#noiseDot').setAttribute('cx',scale(b));$('#cleanDot').setAttribute('cx',scale(a));$('#currentDot').setAttribute('cx',scale(xt));$('#noiseLabel').setAttribute('x',scale(b));$('#cleanLabel').setAttribute('x',scale(a));$('#noiseLabel').setAttribute('y',Math.abs(a-b)<.8?48:67);$('#cleanLabel').setAttribute('y',Math.abs(a-b)<.8?89:67);$('#currentLabel').setAttribute('x',scale(xt));$('#line').setAttribute('x1',scale(b));$('#line').setAttribute('x2',scale(a));$('#explain').textContent=`t = ${fmt(t)}：xₜ = ${fmt(t)} × ${fmt(a)} + ${fmt(1-t)} × (${fmt(b)}) = ${fmt(xt)}。目标速度 = ${fmt(a)} − (${fmt(b)}) = ${fmt(v)}。`;$('#feedback').textContent=feedback||'选择你的判断，反馈会按当前参数计算。'}
for(let i=-3;i<=3;i++)$('#ticks').insertAdjacentHTML('beforeend',`<line x1="${60+(i+3)*100}" y1="110" x2="${60+(i+3)*100}" y2="126" stroke="#687e90"/><text x="${60+(i+3)*100}" y="210" text-anchor="middle" fill="#9cb1bb" font-size="14">${i}</text>`);
function invalidate(){pause();pos=0;feedback='';render()}[x0,x1,pred].forEach(e=>e.addEventListener('input',invalidate));time.addEventListener('input',()=>{pause();pos=+time.value;render()});
function tick(ts){if(!raf)return;if(last)pos=Math.min(1,pos+(ts-last)/6000*+$('#speed').value);last=ts;render();if(pos>=1)pause();else raf=requestAnimationFrame(tick)}
play.addEventListener('click',()=>{if(raf){pause();return}if(pos>=1)pos=0;if(matchMedia('(prefers-reduced-motion: reduce)').matches){pos=Math.min(1,pos+.25);render();return}play.textContent='暂停';raf=requestAnimationFrame(tick)});
$('#prev').onclick=()=>{pause();pos=Math.max(0,Math.round((pos-.25)*100)/100);render()};$('#next').onclick=()=>{pause();pos=Math.min(1,Math.round((pos+.25)*100)/100);render()};$('#reset').onclick=()=>{x0.value=2;x1.value=-1;pred.value=2.5;invalidate()};
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{const v={paper:[2,-1,2.5],reverse:[-2,1,-2],equal:[1,1,0]}[b.dataset.preset];[x0.value,x1.value,pred.value]=v;invalidate()});
document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{let delta=+x0.value-(+x1.value),right=delta>0?'rise':delta<0?'fall':'same';feedback=(b.dataset.answer===right?'判断正确。':'再想一想。')+` 当前目标速度 x₀ − x₁ = ${fmt(delta)}，所以 xₜ 随 t ${delta>0?'增加':delta<0?'减少':'不变'}。`;render()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});new IntersectionObserver(([e])=>{if(!e.isIntersecting)pause()},{threshold:.05}).observe($('#lab'));render();
// Reassemble the optimized video from small local segments; no external service is required.
const video=document.querySelector('#video video'),videoLink=document.querySelector('#video a[download][href$=".mp4"]');

async function loadVideo(){
 const manifest=await (await fetch('video/manifest.json')).json();
 const parts=new Array(manifest.parts.length);let next=0;
 async function worker(){while(next<manifest.parts.length){let i=next++;const r=await fetch('video/parts/'+manifest.parts[i]);if(!r.ok)throw Error('Video segment unavailable');parts[i]=await r.arrayBuffer()}}
 await Promise.all(Array.from({length:Math.min(5,manifest.parts.length)},worker));
 const blob=new Blob(parts,{type:'video/mp4'});if(blob.size!==manifest.bytes)throw Error('Video size mismatch');
 const url=URL.createObjectURL(blob);video.src=url;videoLink.href=url;videoLink.download='qwen-image-explainer.mp4';
}
loadVideo().catch(()=>{video.setAttribute('aria-label','视频加载失败，请刷新后重试');videoLink.textContent='视频加载失败，请刷新后重试';});
const metricIds=['a-sem','a-quality','b-sem','b-quality'];
function metricRender(){let vals=metricIds.map(id=>+document.getElementById(id).value);if(vals.some((v,i)=>!Number.isFinite(v)||v<0||v>10||document.getElementById(metricIds[i]).value==='')){$('#metric-note').textContent='请输入 0 到 10 的分数。';return}let [a,b,c,d]=vals,mean=(Math.sqrt(a*b)+Math.sqrt(c*d))/2,other=Math.sqrt((a+c)/2*(b+d)/2);$('#metric-correct').textContent=fmt(mean);$('#metric-other').textContent=fmt(other);$('#metric-formula').textContent=`(√(${a}×${b}) + √(${c}×${d})) / 2`;$('#metric-other-formula').textContent=`√(${fmt((a+c)/2)} × ${fmt((b+d)/2)})`;$('#metric-note').textContent=Math.abs(mean-other)<1e-8?'本组输入下两种结果相同，但不同输入不保证相同。':'这组输入下，两种计算顺序给出不同结果。'}
metricIds.forEach(id=>document.getElementById(id).addEventListener('input',metricRender));$('#metric-reset').onclick=()=>{[9,1,1,9].forEach((v,i)=>document.getElementById(metricIds[i]).value=v);metricRender()};metricRender();
document.querySelector('#revision').innerHTML=window.revisionHTML;
const inferTime=$('#inference-t');
function inferRender(){const a=+x0.value,b=+x1.value,v=+pred.value,t=+inferTime.value,reference=b+t*(a-b),toy=b+t*v;$('#inference-tval').textContent=fmt(t);$('#train-point').textContent=fmt(reference);$('#sample-point').textContent=fmt(toy);$('#inference-explain').textContent=`t=${fmt(t)}：参考位置 ${fmt(reference)}；恒定预测速度 ${fmt(v)} 的教学轨迹 ${fmt(toy)}。两者差 ${fmt(toy-reference)}；真实模型速度不是恒定的。`}
function inferClear(){inferTime.value=0;$('#infer-feedback').textContent='在此恒定速度假设下，选择答案。';inferRender()}
[x0,x1,pred].forEach(e=>e.addEventListener('input',inferClear));inferTime.addEventListener('input',inferRender);
document.querySelectorAll('[data-preset]').forEach(e=>e.addEventListener('click',inferClear));$('#reset').addEventListener('click',inferClear);$('#infer-reset').addEventListener('click',inferClear);
document.querySelectorAll('[data-infer-answer]').forEach(e=>e.addEventListener('click',()=>{$('#infer-feedback').textContent=e.dataset.inferAnswer==='short'?'正确。相同初始噪声下，恒定预测速度较小，走过相同时间后位置低于参考。':'再想一想：初始值相同，恒定预测速度较小，走过相同时间后位置会低于参考。'}));inferRender();
const rewards=['reward-a','reward-b','reward-c'];
function rewardClear(){$('#reward-feedback').textContent='请选择，再试“相同奖励”预设。'}
function rewardRender(){let inputs=rewards.map(id=>document.getElementById(id)),vals=inputs.map(e=>Number(e.value));if(inputs.some(e=>e.value.trim()===''||!e.validity.valid)||vals.some(n=>!Number.isFinite(n))){$('#reward-mean').textContent='—';$('#reward-std').textContent='—';$('#reward-adv').textContent='请输入 −10 到 10 的有效奖励。';$('#reward-explain').textContent='修正输入后会重新计算。';return}let mean=vals.reduce((a,b)=>a+b,0)/3,std=Math.sqrt(vals.reduce((a,b)=>a+(b-mean)**2,0)/3);$('#reward-mean').textContent=fmt(mean);$('#reward-std').textContent=std.toFixed(3);if(std<1e-12){$('#reward-adv').textContent='标准差为 0，归一化未定义';$('#reward-explain').textContent='不能直接除以零；实际实现需要稳定性约定。论文此处未指定具体处理。'}else{$('#reward-adv').textContent=vals.map((v,i)=>`${'ABC'[i]}: ${((v-mean)/std).toFixed(3).replace('-', '−')}`).join('　');$('#reward-explain').textContent='正优势表示高于这组平均，不等于绝对质量已经足够好。'}}
rewards.forEach(id=>document.getElementById(id).addEventListener('input',()=>{rewardClear();rewardRender()}));$('#reward-equal').onclick=()=>{rewards.forEach(id=>document.getElementById(id).value=4);rewardClear();rewardRender()};$('#reward-reset').onclick=()=>{[2,4,6].forEach((n,i)=>document.getElementById(rewards[i]).value=n);rewardClear();rewardRender()};
document.querySelectorAll('[data-reward-answer]').forEach(e=>e.addEventListener('click',()=>{$('#reward-feedback').textContent=e.dataset.rewardAnswer==='zero'?'正确。全部相同时偏差均为零，标准差为零，公式直接归一化无定义。':'再想一想：各奖励都等于均值，因此偏差和标准差均为零。'}));rewardRender();
// Re-render calculated descriptions in the selected language without resetting inputs.
document.addEventListener('qwen-language-change',()=>{render();metricRender();inferRender();rewardRender();play.textContent=raf?'暂停':'播放'});
// Subtitle choice is independent from the page language and uses real video text tracks.
const captionButtons=[...document.querySelectorAll('[data-caption]')];
let captionChoice;try{captionChoice=localStorage.getItem('qwen-captions')}catch{}
if(!['zh','en','off'].includes(captionChoice)){try{captionChoice=localStorage.getItem('qwen-language')==='en'?'en':'zh'}catch{captionChoice='zh'}}
function selectCaption(choice,save=true){captionChoice=choice;for(const track of video.textTracks){track.mode=choice!=='off'&&((choice==='zh'&&track.language.startsWith('zh'))||track.language===choice)?'showing':'disabled'}for(const button of captionButtons)button.setAttribute('aria-pressed',String(button.dataset.caption===choice));if(save)try{localStorage.setItem('qwen-captions',choice)}catch{}}
captionButtons.forEach(button=>button.addEventListener('click',()=>selectCaption(button.dataset.caption)));
video.addEventListener('loadedmetadata',()=>selectCaption(captionChoice,false));
video.textTracks.addEventListener('change',()=>{const active=[...video.textTracks].find(t=>t.mode==='showing');const current=active?(active.language.startsWith('zh')?'zh':active.language==='en'?'en':'off'):'off';if(current!==captionChoice)selectCaption(current)});
selectCaption(captionChoice,false);
