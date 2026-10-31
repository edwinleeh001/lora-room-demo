import {createTimeline} from './timeline.mjs';
document.querySelector('#lesson').innerHTML=window.lessonHTML;
document.querySelector('#speaker').innerHTML=window.speakerHTML;
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
 const parts=await Promise.all(manifest.parts.map(async name=>{const r=await fetch('video/parts/'+name);if(!r.ok)throw Error('Video segment unavailable');return r.arrayBuffer()}));
 const blob=new Blob(parts,{type:'video/mp4'});if(blob.size!==manifest.bytes)throw Error('Video size mismatch');
 const url=URL.createObjectURL(blob);video.src=url;videoLink.href=url;videoLink.download='qwen-image-explainer.mp4';
}
loadVideo().catch(()=>{video.setAttribute('aria-label','视频加载失败，请刷新后重试');videoLink.textContent='视频加载失败，请刷新后重试';});
const metricIds=['a-sem','a-quality','b-sem','b-quality'];
function metricRender(){let vals=metricIds.map(id=>+document.getElementById(id).value);if(vals.some((v,i)=>!Number.isFinite(v)||v<0||v>10||document.getElementById(metricIds[i]).value==='')){$('#metric-note').textContent='请输入 0 到 10 的分数。';return}let [a,b,c,d]=vals,mean=(Math.sqrt(a*b)+Math.sqrt(c*d))/2,other=Math.sqrt((a+c)/2*(b+d)/2);$('#metric-correct').textContent=fmt(mean);$('#metric-other').textContent=fmt(other);$('#metric-formula').textContent=`(√(${a}×${b}) + √(${c}×${d})) / 2`;$('#metric-other-formula').textContent=`√(${fmt((a+c)/2)} × ${fmt((b+d)/2)})`;$('#metric-note').textContent=Math.abs(mean-other)<1e-8?'本组输入下两种结果相同，但不同输入不保证相同。':'这组输入下，两种计算顺序给出不同结果。'}
metricIds.forEach(id=>document.getElementById(id).addEventListener('input',metricRender));$('#metric-reset').onclick=()=>{[9,1,1,9].forEach((v,i)=>document.getElementById(metricIds[i]).value=v);metricRender()};metricRender();
