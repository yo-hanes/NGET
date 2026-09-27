import{useEffect,useRef,useState}from'react';
import{Bell,Camera,CheckCircle2,ChevronRight,Gift,Home,IdCard,MapPin,Mic,Navigation,ShieldCheck,Upload,UserRound,X}from'lucide-react';

const disasters=[['Flood','🌊'],['Landslide','⛰️'],['Drought','☀️'],['Earthquake','〰️']];
const advisories=[{level:'URGENT',title:'Baro River flood warning',body:'Move to higher ground if you are within 2 km of the river.',time:'12 min ago'},{level:'ADVISORY',title:'Heavy rainfall expected',body:'Gambella and surrounding zones · next 24 hours',time:'2 hrs ago'}];

export default function App(){
 const[tg,setTg]=useState(null),[tab,setTab]=useState('home'),[category,setCategory]=useState('Flood'),[media,setMedia]=useState([]),[location,setLocation]=useState(null),[recording,setRecording]=useState(false),[seconds,setSeconds]=useState(0),[sent,setSent]=useState(false);const timer=useRef();
 useEffect(()=>{const webApp=window.Telegram?.WebApp;if(webApp){webApp.ready();webApp.expand();setTg(webApp);webApp.setHeaderColor?.('secondary_bg_color');if(webApp.initData)fetch('/api/auth/telegram',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:webApp.initData})}).catch(()=>{})}} ,[]);
 useEffect(()=>{if(recording)timer.current=setInterval(()=>setSeconds(v=>v+1),1000);else clearInterval(timer.current);return()=>clearInterval(timer.current)},[recording]);
 const user=tg?.initDataUnsafe?.user; const name=user?.first_name||'Abebe';
 const locate=()=>navigator.geolocation?.getCurrentPosition(p=>setLocation(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),()=>setLocation('Gambella, Ethiopia'));
 const upload=e=>setMedia([...e.target.files]);
 const submit=()=>{setSent(true);tg?.HapticFeedback?.notificationOccurred('success');setTimeout(()=>setSent(false),3500)};
 return <div className="app">
  <header><div className="brand"><span>ነ</span><div><b>Negarit</b><small>Field Reporter</small></div></div><button className="icon"><Bell size={20}/><i/></button></header>
  <main>
   {tab==='home'&&<><section className="welcome"><div><small>SELAM, {name.toUpperCase()}</small><h1>Help your community<br/>stay <em>one step ahead.</em></h1></div><div className="avatar">{user?.photo_url?<img src={user.photo_url}/>:<UserRound/>}<i/></div></section>
   <section className="trust"><ShieldCheck/><div><b>Trusted Reporter</b><span>Level 4 · 94% confidence</span></div><label>VERIFIED</label></section>
   <div className="section-title"><div><h2>Quick disaster report</h2><p>What are you seeing right now?</p></div><span>STEP 1 OF 3</span></div>
   <div className="categories">{disasters.map(([d,e])=><button key={d} className={category===d?'active':''} onClick={()=>setCategory(d)}><b>{e}</b><span>{d}</span>{category===d&&<CheckCircle2/>}</button>)}</div>
   <div className="report-card">
    <div className="card-head"><div className="mini-icon"><Camera/></div><div><h3>Add evidence</h3><p>Photo, video, or voice report</p></div><span>OPTIONAL</span></div>
    <div className="actions">
     <label className="upload"><input type="file" accept="image/*,video/*" multiple onChange={upload}/><Upload/><b>{media.length?`${media.length} file${media.length>1?'s':''} added`:'Photo / Video'}</b><small>AI verified</small></label>
     <button className={recording?'voice recording':'voice'} onClick={()=>setRecording(!recording)}><Mic/><b>{recording?`Recording 0:${String(seconds).padStart(2,'0')}`:'Voice note'}</b><small>{recording?'Tap to finish':'5 languages'}</small></button>
    </div>
    <button className="location" onClick={locate}><div><Navigation/><span><b>{location||'Use my current location'}</b><small>{location?'GPS coordinates captured':'Most accurate · GPS'}</small></span></div>{location?<CheckCircle2/>:<ChevronRight/>}</button>
    <button className="submit" onClick={submit}>Submit {category} report <ChevronRight/></button>
   </div>
   <div className="rewards"><Gift/><div><small>YOUR IMPACT</small><b>350 MB earned</b><span>7 verified contributions</span></div><button onClick={()=>setTab('alerts')}>View rewards</button></div></>}
   {tab==='id'&&<Identity name={name}/>} {tab==='alerts'&&<Alerts/>}
  </main>
  <nav><button className={tab==='home'?'active':''} onClick={()=>setTab('home')}><Home/><span>Report</span></button><button className={tab==='id'?'active':''} onClick={()=>setTab('id')}><IdCard/><span>My ID</span></button><button className={tab==='alerts'?'active':''} onClick={()=>setTab('alerts')}><Bell/><span>Alerts</span><i/></button></nav>
  {sent&&<div className="toast"><CheckCircle2/><div><b>Report submitted</b><span>High-confidence queue bypass applied</span></div><button onClick={()=>setSent(false)}><X/></button></div>}
 </div>
}
function Identity({name}){return <section className="page"><small className="eyebrow">TRUSTED COUNTER PORTAL</small><h1>Your volunteer ID</h1><div className="id-card"><div className="id-top"><span>ነ</span><b>NEGARIT</b><ShieldCheck/></div><div className="id-person"><div className="portrait"><UserRound/></div><div><small>DIGITAL VOLUNTEER</small><h2>{name} Tesfaye</h2><p>ID · NG-ET-28491</p></div></div><div className="confidence"><CheckCircle2/><span><b>High-Confidence Queue Bypass</b><small>Active on all reports</small></span></div><Qr/></div><div className="info"><MapPin/><div><b>Smart Box drop-offs</b><p>Show or scan this QR at any Negarit Smart Box to verify your drop-off and receive rewards.</p></div></div></section>}
function Qr(){return <div className="qr-wrap"><div className="qr">{Array.from({length:81},(_,i)=><i key={i} className={(i*7+i%5)%3===0?'on':''}/>)}</div><div><b>Scan to verify</b><small>Updated just now</small></div></div>}
function Alerts(){return <section className="page"><small className="eyebrow">LOCALIZED FOR GAMBELLA</small><h1>Alerts & rewards</h1>{advisories.map(a=><article className="advisory" key={a.title}><div><span className={a.level}>{a.level}</span><small>{a.time}</small></div><h3>{a.title}</h3><p>{a.body}</p></article>)}<h2 className="history-title">Reward history</h2>{[['50 MB','Smart Box drop-off','Today'],['50 MB','Verified flood report','24 Jul'],['100 MB','Priority field update','18 Jul']].map(x=><div className="reward-row" key={x[1]}><Gift/><div><b>{x[1]}</b><small>{x[2]}</small></div><strong>+{x[0]}</strong></div>)}</section>}
