for(const [id,key] of [['lesson','lessonHTML'],['speaker','speakerHTML'],['bilingual-lecture','bilingualHTML'],['revision','revisionHTML']])document.getElementById(id).innerHTML=window[key];
// Reassemble the optimized video from small local segments; no external service is required.
const video=document.querySelector('#video video'),videoLink=document.querySelector('#video a[download][href$=".mp4"]');

async function loadVideo(){
 const manifest=await (await fetch('video/manifest.json?v=15-20261031')).json();
 const parts=new Array(manifest.parts.length);let next=0;
 async function worker(){while(next<manifest.parts.length){let i=next++;const r=await fetch('video/parts/'+manifest.parts[i]);if(!r.ok)throw Error('Video segment unavailable');parts[i]=await r.arrayBuffer()}}
 await Promise.all(Array.from({length:Math.min(5,manifest.parts.length)},worker));
 const blob=new Blob(parts,{type:'video/mp4'});if(blob.size!==manifest.bytes)throw Error('Video size mismatch');
 const url=URL.createObjectURL(blob);video.src=url;videoLink.href=url;videoLink.download='qwen-core-30s-music.mp4';
}
loadVideo().catch(()=>{video.setAttribute('aria-label','视频加载失败，请刷新后重试');videoLink.textContent='视频加载失败，请刷新后重试';});
// Subtitle choice is independent from the page language and uses real video text tracks.
const captionButtons=[...document.querySelectorAll('[data-caption]')];
let captionChoice;try{captionChoice=localStorage.getItem('qwen-captions')}catch{}
if(!['zh','en','off'].includes(captionChoice)){try{captionChoice=localStorage.getItem('qwen-language')==='en'?'en':'zh'}catch{captionChoice='zh'}}
function selectCaption(choice,save=true){captionChoice=choice;for(const track of video.textTracks){track.mode=choice!=='off'&&((choice==='zh'&&track.language.startsWith('zh'))||track.language===choice)?'showing':'disabled'}for(const button of captionButtons)button.setAttribute('aria-pressed',String(button.dataset.caption===choice));if(save)try{localStorage.setItem('qwen-captions',choice)}catch{}}
captionButtons.forEach(button=>button.addEventListener('click',()=>selectCaption(button.dataset.caption)));
video.addEventListener('loadedmetadata',()=>selectCaption(captionChoice,false));
video.textTracks.addEventListener('change',()=>{const active=[...video.textTracks].find(t=>t.mode==='showing');const current=active?(active.language.startsWith('zh')?'zh':active.language==='en'?'en':'off'):'off';if(current!==captionChoice)selectCaption(current)});
selectCaption(captionChoice,false);
