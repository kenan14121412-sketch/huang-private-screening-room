import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Clapperboard, Copy, Film, LampDesk, LibraryBig, Moon, PanelsTopLeft, Printer, Radio, Sun, Ticket, Volume2, X } from 'lucide-react'
import works from './works.json'
import { gsap } from './vendor/index.js'
import './style.css'

const IMAGE_ASSETS = {
  ROOM_BG: `${import.meta.env.BASE_URL}screening-room-daylight.png`, // 16:9，完整房间底图
  PROJECTOR_IMG: '',         // 1:1，黑底独立素材
  SCREEN_IMG: '',            // 4:3，黑底独立素材
  CABINET_IMG: '',           // 3:4，黑底独立素材
  TYPEWRITER_IMG: '',        // 1:1，黑底独立素材
  DIRECTOR_CHAIR_IMG: '',    // 1:1，黑底独立素材
}

const RESUME_DATA = {
  name: '黄柏泓',
  email: '2501210927@stu.pku.edu.cn',
  phone: '15389089498',
  wechatQr: '',
  focus: '现代文学与批评理论 · 小说创作 · 数字叙事',
  statement: '我在北京大学研究中国当代文学，也写小说、改编短剧。我关注叙事中的声音、停顿和视角，也尝试把阅读经验转化为可以观看、选择和参与的作品。从文本细读到网页交互，我关心同一个问题：读者在什么时候听见一个人，又在什么时候错过了他？',
  education: [
    ['2025.09 至今', '北京大学 · 中国语言文学系', '中国当代文学 · 硕士研究生'],
    ['2022.09–2025.09', '北京大学 · 中国语言文学系', '汉语言文学 · 本科。相关课程：影片精读、中国当代电影史、中国现代文学史、中国当代文学史等。'],
    ['', '北京大学 · 艺术学院', '文化产业管理。相关课程：中国电影史、文化产业导论、跨文化艺术传播学、信息技术与文化产业等。'],
    ['2021.09–2025.09', '北京大学 · 国家发展研究院', '经济学双学位。相关课程：财务会计、财报分析、行为经济学、中级微观经济学、数字金融等。'],
  ],
  honors: '国家奖学金、北京大学三好学生、北京大学二等奖学金、北京大学社会工作奖等。',
  experience: [
    ['竖屏视频制作与拉片 · 教育口播', '使用剪映、Remotion 制作竖屏内容，按口播字幕时间码编排动效、重点卡片和画面切换，复核图文是否遮挡人脸、是否与口播同步，输出成片。拆解约 4 分钟的竖屏口播视频，按时间码记录构图、剪点、字幕与插图变化，输出复剪方案，标出应保留的停顿及字幕重对齐的位置，并列明手势衔接、AI 镜头口型、手部形变及角色一致性等检查项。'],
    ['影视叙事与跨文化传播 · 课程研究', '比较《阿甘正传》《小丑》等 5 部美国电影的人物动机与情感线索。以《漫长的季节》为例拆解多线悬疑、镜头转场和音乐叙事。以《在远方》《黑神话：悟空》为例，结合受访者反馈分析文化元素的接受差异，在课程论文中提出分众传播思路。'],
  ],
  roles: [
    ['元石科技', '针对 AI 角色扮演类产品进行文风规范与本地化。对照日文小说原文与中日双语场景，整理文风提示词，明确对白比例、接话节奏、情绪推进和角色边界。编写同场景对照示例，供生成角色扮演对话时参照。'],
    ['北京大学艺术与商业研究中心', '撰写北京大学与泡泡玛特联合活动展览策划与方案，提出相关的营销渠道；进行桌游开发相关调研与测评；策划 ArtInsight 大师课安排。'],
    ['北京大学出版社', '参与文学、艺术学、教育学等书稿审读与校对，检查用词、语义衔接和前后一致性，按编辑要求修订。'],
  ],
  practice: [
    ['2021–2022', '北京大学艺术学院学术部 · 部长 / 校团委学术科创部 · 学术委员', '策划校学术交流节艺术展，负责海报制作、人员统筹，参与人流量超 300 人；协助校挑战杯活动推进，负责收集汇总信息，并定期在公众号平台发布；参与策划学院新年晚会活动。'],
    ['2021–2022', '北京大学国家发展研究院学生会实践部 · 干事', '参与策划联合参访泡泡玛特、腾讯等活动。'],
  ],
  skills: ['IELTS 7.0 · 大学英语六级 580。', '剪映、Remotion、Gemini、DeepSeek。'],
  projects: [
    { title:'未名·秋招季', type:'选择驱动网页游戏', art:'autumn', stack:'React · TypeScript · Vite · 分支叙事', body:'在燕园度过十二周秋招。配置简历、投递岗位，在文学初心和就业现实之间做出自己的选择。', preview:`${import.meta.env.BASE_URL}frame-autumn.png`, url:'https://kenan14121412-sketch.github.io/weiming-autumn-site/' },
    { title:'私人放映室', type:'交互简历与作品集', art:'cinema', preview:IMAGE_ASSETS.ROOM_BG, stack:'React · Tailwind CSS · Lucide · Canvas · Web Audio API', body:'用物件组织文学作品、研究和履历。访问者可以自由探索，也可切换至便于快速阅读和打印的简历。', url:import.meta.env.BASE_URL },
  ],
  novels: [
    ['雪线','小说','川西高原 · 记忆与距离','snow'],
    ['回响','小说','都市悬疑 · 心理迷宫','echo'],
    ['沉默无声','小说','校园叙事 · 沉默与旁观','silent'],
    ['息吹（改编）','改编小说','东京盛夏 · 日常的裂隙','breath'],
    ['夜','散文','散文作品','echo'],
    ['城市','诗歌','诗歌作品','silent'],
    ['诊所','诗歌','诗歌作品','breath'],
  ].map(([title,genre,caption,art]) => ({title,genre,caption,art,body:works[title]})),
  paper: {
    title:'从“说书”到“失语”：赵树理〈刘二和与王继圣〉中的声音政治',
    abstract:'从叙事中声音的分配入手，考察谁能开口、谁的声音被转述、谁被迫沉默，并追踪说书式叙事如何使这些差异变得可感。',
    map:['说书传统 · 叙述者如何组织众声','发言位置 · 谁拥有解释事件的权力','失语处境 · 沉默如何形成并被叙述'],
  },
  books: [
    ['《理解媒介》','麦克卢汉','把媒介看作塑造感知与社会关系的形式。读文本时也可以问：声音经过何种形式才抵达读者？'],
    ['《规训与惩罚》','米歇尔·福柯','规训通过日常空间、观察与时间安排发挥作用。学校场景中的座位、考核和公开惩罚，可作为细读的起点。'],
    ['《赵树理文集》','赵树理','沿着说书语调、人物对白与叙述者的转述，追问口语如何进入书面叙事。'],
  ],
  posters: [
    ['短剧改编','九场悬疑短剧','8–10 分钟 · 预计片长','用重复道具埋设伏笔，安排视角切换以及声音线索的出现顺序。','echo'],
    ['竖屏口播','时间码拉片','约 4 分钟 · 拆解样片','逐项记录构图、剪点、字幕与插图变化，标注保留的停顿和需重新对齐的字幕。','breath'],
    ['角色对话','日区 AI 本地化','9 类 · 文风提示词','使用同场景对照例，检查接话节奏、对白比例、情绪推进和角色边界。','silent'],
  ],
  images: IMAGE_ASSETS,
}

const D = RESUME_DATA
const stopMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const sequence = (n) => Array.from({length:n}, (_, i) => i)
const rooms = [
  ['project', '银幕与放映机', '交互项目', Film],
  ['archive', '学术档案柜', '教育与研究', LibraryBig],
  ['desk', '台灯与打字机', '个人陈述', LampDesk],
  ['posters', '海报墙', '幕后手记', PanelsTopLeft],
  ['contact', '场记板与票根', '联系与打印', Clapperboard],
]

function useSound() {
  const [enabled,setEnabled] = useState(false)
  const audio = useRef(null)
  const bed = useRef(null)
  function context() {
    const Audio = window.AudioContext || window.webkitAudioContext
    if (!Audio) return null
    audio.current ||= new Audio()
    return audio.current
  }
  async function toggle() {
    if (bed.current) {
      bed.current.stop()
      bed.current = null
      setEnabled(false)
      return
    }
    try {
      const ctx = context()
      if (!ctx) return
      await ctx.resume()
      if (bed.current) return
      const sample = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = sample.getChannelData(0)
      for (let i=0; i<data.length; i++) {
        const phase = i / ctx.sampleRate
        const flutter = Math.pow((1 + Math.sin(phase * 2 * Math.PI * 18)) / 2, 9)
        data[i] = (Math.random() * 2 - 1) * (0.055 + flutter * 0.17) + Math.sin(phase * 2 * Math.PI * 72) * flutter * 0.055
      }
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      gain.gain.value = 0.19
      source.buffer = sample
      source.loop = true
      source.connect(gain).connect(ctx.destination)
      source.start()
      bed.current = source
      setEnabled(true)
    } catch {
      setEnabled(false)
    }
  }
  function play(kind) {
    const ctx = audio.current
    if (!bed.current || !ctx) return
    const config = { key:[0.05,1700,620,0.1], slide:[0.28,390,110,0.09], clap:[0.12,2350,420,0.33], film:[0.17,750,170,0.11], paper:[0.15,1100,560,0.08] }
    const [length, start, end, level] = config[kind] || config.paper
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1
    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    const time = ctx.currentTime
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(start,time)
    filter.frequency.exponentialRampToValueAtTime(end,time+length)
    gain.gain.setValueAtTime(level,time)
    gain.gain.exponentialRampToValueAtTime(0.001,time+length)
    source.buffer = buffer
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()
  }
  return { enabled, toggle, play }
}

function Art({kind,children}) {
  return <div className={'art '+kind} aria-hidden="true"><i/><b/><em/>{children}</div>
}

function Dust({ motion, onPlate }) {
  const canvas = useRef(null)
  useEffect(() => {
    if (!motion || stopMotion()) return
    const el = canvas.current
    const ctx = el.getContext('2d')
    const stars = sequence(68).map(() => [Math.random(),Math.random(),Math.random(),Math.random()])
    let dx=0,dy=0,frame
    const room = el.parentElement
    const move = e => { const r=room.getBoundingClientRect(); dx=(e.clientX-r.left)/r.width-0.5; dy=(e.clientY-r.top)/r.height-0.5 }
    const reset = () => {dx=0;dy=0}
    const resize = () => {el.width=el.clientWidth*devicePixelRatio;el.height=el.clientHeight*devicePixelRatio}
    function draw(time) {
      ctx.clearRect(0,0,el.width,el.height)
      for (const [x,y,r,a] of stars) {
        const z=(x + time*0.000012*(0.5+r))%1
        const py=onPlate?0.49-z*0.07+(y-0.5)*z*0.18:0.63-z*0.20+(y-0.5)*z*0.39
        const px=onPlate?0.13+z*0.26:0.215+z*0.45
        ctx.beginPath()
        ctx.fillStyle='rgba(255,221,157,'+(0.12+0.48*a)+')'
        ctx.arc((px+dx*r*0.023)*el.width,(py+dy*r*0.05)*el.height,(0.4+r*1.15)*devicePixelRatio,0,Math.PI*2)
        ctx.fill()
      }
      frame=requestAnimationFrame(draw)
    }
    resize()
    const observer=new ResizeObserver(resize)
    observer.observe(el)
    room.addEventListener('pointermove',move)
    room.addEventListener('pointerleave',reset)
    frame=requestAnimationFrame(draw)
    return () => {cancelAnimationFrame(frame);observer.disconnect();room.removeEventListener('pointermove',move);room.removeEventListener('pointerleave',reset)}
  },[motion,onPlate])
  return <canvas className="dust" ref={canvas} aria-hidden="true"/>
}

function Prop({type, label, action, image, onPlate, route, children}) {
  return <button className={'prop '+type+(onPlate && !image?' plate-hotspot':'')} data-route={route} aria-label={label} onClick={action}>
    {image ? <img src={image} alt="" className="prop-image"/> : !onPlate && children}
  </button>
}

function Room({project,index,open,change,lit}) {
  const A=D.images
  const onPlate=Boolean(A.ROOM_BG)
  const room=useRef(null)
  const marker=useRef(null)
  const zoom=useRef(null)
  const opening=useRef(false)
  const activeTarget=useRef(null)
  const targetFor=e=>e.target.closest('button[data-route]')
  function focus(target,scale){
    const r=room.current.getBoundingClientRect()
    const t=target.getBoundingClientRect()
    const x=(t.left+t.width/2-r.left)/r.width*100
    const y=(t.top+t.height/2-r.top)/r.height*100
    if(marker.current){
      marker.current.style.left=(t.left-r.left)/r.width*100+'%'
      marker.current.style.top=(t.top-r.top)/r.height*100+'%'
      marker.current.style.width=t.width/r.width*100+'%'
      marker.current.style.height=t.height/r.height*100+'%'
      marker.current.style.opacity='1'
    }
    if(stopMotion())return
    zoom.current?.kill()
    zoom.current=gsap.to(room.current,{scale,transformOrigin:x+'% '+y+'%',duration:.55,ease:'power2.out',overwrite:'auto'})
  }
  function reset(){
    if(opening.current)return
    activeTarget.current=null
    if(marker.current)marker.current.style.opacity='0'
    zoom.current?.kill()
    zoom.current=gsap.to(room.current,{scale:1,duration:.6,ease:'power2.out',overwrite:'auto'})
  }
  function hover(e){
    if(e.pointerType!=='mouse'||opening.current)return
    const target=targetFor(e)
    if(!target||target===activeTarget.current)return
    activeTarget.current=target
    focus(target,1.16)
  }
  function activate(e){
    const target=targetFor(e)
    if(!target||opening.current)return
    e.preventDefault()
    e.stopPropagation()
    opening.current=true
    activeTarget.current=target
    const next=()=>{open(target.dataset.route,Number(target.dataset.index||0));opening.current=false;marker.current.style.opacity='0';gsap.set(room.current,{scale:1})}
    if(stopMotion()){next();return}
    focus(target,1.16)
    zoom.current?.kill()
    const r=room.current.getBoundingClientRect()
    const t=target.getBoundingClientRect()
    const x=(t.left+t.width/2-r.left)/r.width*100
    const y=(t.top+t.height/2-r.top)/r.height*100
    zoom.current=gsap.timeline({onComplete:next})
      .to(room.current,{scale:1.25,transformOrigin:x+'% '+y+'%',duration:.38,ease:'power2.out'})
      .to(room.current,{scale:1.76,duration:.54,ease:'power2.inOut'})
  }
  useEffect(()=>()=>zoom.current?.kill(),[])
  return <div ref={room} onPointerOver={hover} onPointerOut={e=>{const t=targetFor(e);if(t===activeTarget.current&&!t?.contains(e.relatedTarget))reset()}} onFocusCapture={e=>{const t=targetFor(e);if(t){activeTarget.current=t;focus(t,1.16)}}} onBlurCapture={e=>{if(!room.current?.contains(e.relatedTarget))reset()}} onClickCapture={activate} className={'room '+(A.ROOM_BG?'custom-room':'')} style={A.ROOM_BG?{backgroundImage:'url('+JSON.stringify(A.ROOM_BG)+')'}:undefined}>
    <div className="architecture" aria-hidden="true"><div className="leftwall"/><div className="backwall"/><div className="rightwall"/><div className="floor"/><div className="rug"/><div className="sconce sconce-left"/><div className="sconce sconce-right"/></div>
    {!onPlate&&<div className="beam" aria-hidden="true"/>}
    <Dust motion={!lit} onPlate={onPlate}/><span ref={marker} className="object-marker" aria-hidden="true"/>
    <div className="wall-art frames" aria-label="海报墙">{D.posters.map((p,i)=><button key={p[0]} className="frame" data-route="posters" data-index={i+1} aria-label={'放大海报 · '+p[0]} onClick={()=>open('posters',i+1)}>{!onPlate&&<Art kind={p[4]}/>}</button>)}</div>
    <Prop onPlate={onPlate} type="screen" route="project" label="查看放映项目" action={()=>open('project')} image={A.SCREEN_IMG}>
      <span className="curtain curtain-left"/><span className="curtain curtain-right"/>
    </Prop>
    <button className="projection" data-route="project" onClick={()=>open('project')} aria-label={'查看《'+project.title+'》'} key={project.title}>
      <ProjectFrame project={project}/>
    </button>
    <Prop onPlate={onPlate} type="projector" route="project" label="数字项目" action={()=>open('project')} image={A.PROJECTOR_IMG}>
      <span className="projector-reels"><i/><i/></span><span className="projector-body"/><span className="tripod"/>
    </Prop>
    <Prop onPlate={onPlate} type="cabinet" route="archive" label="打开学术档案" action={()=>open('archive')} image={A.CABINET_IMG}>
      <span className="drawer-grid">{sequence(12).map(i=><i key={i}/>)}</span>
    </Prop>
    <button className="literary-books" data-route="shelf" onClick={()=>open('shelf')} aria-label="文学作品集"></button><div className="bookcase" aria-label="书架">{D.books.map((book,i)=><button key={book[0]} data-route="book" data-index={i} aria-label={book[0]+'学术批注'} title={book[0]} onClick={()=>open('book',i)}>{onPlate?null:book[0].slice(1,-1)}</button>)}</div>
    <Prop onPlate={onPlate} type="desk" route="desk" label="打开打字机" action={()=>open('desk')} image={A.TYPEWRITER_IMG}>
      <span className="desk-leg"/><span className="desktop"/><span className="lamp"/><span className="typewriter"/>
    </Prop>
    <span className="plate-clapper" aria-hidden="true"/><Prop onPlate={onPlate} type="chair" route="contact" label="场记板 · 联系我" action={()=>open('contact')} image={A.DIRECTOR_CHAIR_IMG}>
      <span className="chair-back">导演席</span><span className="chair-legs"/><span className="clapper"><i/></span>
    </Prop>
    <Prop onPlate={onPlate} type="tickets" route="ticket" label="打印 VIP 观影券" action={()=>open('ticket')}><span aria-hidden="true">ADMIT ONE</span></Prop>
    <div className="room-reels"><button onClick={()=>change(-1)} aria-label="上一卷"><ChevronLeft/></button><span>胶片 {String(index+1).padStart(2,'0')} / {String(D.projects.length).padStart(2,'0')}</span><button onClick={()=>change(1)} aria-label="下一卷"><ChevronRight/></button></div>
  </div>
}

function Resume({copy,print,contact,read}) {
  return <article className="resume">
    <header className="resume-head"><div><p>个人简历</p><h1>{D.name}</h1><p>{D.focus}</p><div className="resume-contacts"><a href={'mailto:'+D.email}>{D.email}</a><a href={'tel:'+D.phone}>{D.phone}</a></div></div>
    <div className="resume-actions"><button onClick={()=>copy(D.email+' / '+D.phone)}><Copy size={16}/>复制联系方式</button><button onClick={()=>print('resume')}><Printer size={16}/>打印 / 导出 PDF</button><button onClick={()=>contact('contact')}>联系我 <ArrowUpRight size={15}/></button></div></header>
    <section><h2>教育经历</h2>{D.education.map(([date,title,desc])=><div className="cv-row" key={title}><h3>{title}<small>{date}</small></h3><p>{desc}</p></div>)}</section>
    <section><h2>荣誉奖励</h2><p>{D.honors}</p></section>
    <section><h2>其他经历</h2>{D.experience.map(([title,desc])=><div className="cv-row" key={title}><h3>{title}</h3><p>{desc}</p></div>)}</section>
    <section><h2>实习经历</h2>{D.roles.map(([title,desc])=><div className="cv-row" key={title}><h3>{title}</h3><p>{desc}</p></div>)}</section>
    <section><h2>实践经历</h2>{D.practice.map(([date,title,desc])=><div className="cv-row" key={title}><h3>{title}<small>{date}</small></h3><p>{desc}</p></div>)}</section>
    <section><h2>语言与工具</h2>{D.skills.map(t=><p key={t}>{t}</p>)}</section>
    <section className="resume-actions"><h2>文学作品</h2><div className="resume-links">{D.novels.map((n,i)=><button key={n.title} onClick={()=>read('novel',i)}>{n.title} <ArrowUpRight size={14}/></button>)}</div></section>
  </article>
}

function Poster({poster,play}) {
  const [flipped,setFlipped]=useState(false)
  return <button className={'poster-card '+(flipped?'flipped':'')} aria-pressed={flipped} aria-label={poster[0]+'，翻阅海报'} onClick={()=>{play('paper');setFlipped(!flipped)}}>
    <span className="poster-inner">
      <span className="poster-face" aria-hidden={flipped}><Art kind={poster[4]}/><span>{poster[1]}</span><strong>{poster[0]}</strong><small>点击翻阅手记 ↻</small></span>
      <span className="poster-face poster-back" aria-hidden={!flipped}><small>幕后手记</small><strong>{poster[0]}</strong><span>{poster[3]}</span><small>{poster[2]}</small></span>
    </span>
  </button>
}

function ProjectFrame({project}) {
  return project.preview ? <img className="project-frame" src={project.preview} alt="" draggable="false"/> : <Art kind={project.art}/>
}

function ProjectDetails({project,reel,change,close}) {
  const [playing,setPlaying]=useState(false)
  const external=project.url!=='/'
  return <>
    <div className={'project-visual '+(playing?'playing':'')}>
      {playing?<iframe src={project.url} title={project.title} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerPolicy="no-referrer" allowFullScreen/>:
        <><ProjectFrame project={project}/>{external?<button className="play-project" onClick={()=>setPlaying(true)}><Film size={18}/>在银幕内游玩</button>:<span>{project.type}</span>}</>}
    </div>
    <p>{project.body}</p>
    <div className="modal-actions">
      <div className="project-links">
        {external?<a className="ink-button" href={project.url} target="_blank" rel="noreferrer">打开原站 <ArrowUpRight size={16}/></a>:<button className="ink-button" onClick={close}>返回放映室 <ArrowUpRight size={16}/></button>}
        {playing&&<button className="text-button" onClick={()=>setPlaying(false)}>结束放映</button>}
      </div>
      <div className="reel-actions"><button onClick={()=>change(-1)} aria-label="上一卷胶片"><ArrowLeft size={17}/></button><span>{reel+1} / {D.projects.length}</span><button onClick={()=>change(1)} aria-label="下一卷胶片"><ArrowRight size={17}/></button></div>
    </div>
  </>
}

function Desk({play}) {
  const [count,setCount]=useState(0)
  const playRef=useRef(play)
  playRef.current=play
  useEffect(()=>{
    if(stopMotion()){setCount(D.statement.length);return}
    const timer=setInterval(()=>setCount(c=>{
      const next=Math.min(c+1,D.statement.length)
      if(next===D.statement.length)clearInterval(timer)
      return next
    }),27)
    return ()=>clearInterval(timer)
  },[])
  useEffect(()=>{if(count>0 && count<D.statement.length && count%3===0 && !stopMotion())playRef.current('key')},[count])
  return <div className="typed"><p aria-hidden="true">{D.statement.slice(0,count)}<span className="cursor"/></p><p className="sr-only">{D.statement}</p>{count<D.statement.length&&<button className="text-button" onClick={()=>setCount(D.statement.length)}>显示全文</button>}</div>
}

function TicketBody({serial,print}) {
  return <div className="vip-ticket"><div className="ticket-main"><Ticket size={29}/><p className="eyebrow">PRIVATE SCREENING · VIP</p><h2>私人放映室</h2><p className="ticket-name">{D.name}</p><p>{D.education[0][1]} · {D.education[0][2]}</p><p>{D.focus}</p><p>{D.email}</p><button className="ink-button" onClick={()=>print('ticket')}><Printer size={16}/>打印 / 导出 PDF</button></div><div className="ticket-stub"><span>观影编号</span><strong>{serial}</strong><i/></div></div>
}



function Cover({novel}) {
  const subtitles={'雪线':['Snowline','Distance / Memory'],'回响':['Echoes','Voice / Silence'],'沉默无声':['Unspoken','Witness / Absence'],'息吹（改编）':['Breath','Everyday / Fracture'],'夜':['Night','Window / Moon'],'城市':['The City','Rain / Reflection'],'诊所':['Clinic','Inside / Outside']}
  const words=subtitles[novel.title]
  return <div className="editorial-cover">
    <div className={'cover-image image-top '+novel.art}><Art kind={novel.art}/></div>
    <span className="cover-category">{novel.genre} · 黄柏泓作品</span>
    <strong className="cover-title">{novel.title}</strong><em className="cover-english">{words[0]}</em>
    <span className="cover-rule"/><span className="cover-subtitle">{words[1]}</span>
    <div className={'cover-image image-bottom '+novel.art}><Art kind={novel.art}/></div>
    <span className="cover-author">{D.name}</span>
  </div>
}


function FanGallery({items,renderItem,initial=0,label}) {
  const rail=useRef(null)
  const [current,setCurrent]=useState(initial)
  const drag=useRef(null)
  const dragged=useRef(false)
  const activeIndex=useRef(initial)
  const total=items.length
  function go(index,instant=false){
    const el=rail.current
    const target=el?.children[Math.max(0,Math.min(index,total-1))]
    if(!target||!el.clientWidth||!target.offsetWidth)return
    el.scrollTo({left:target.offsetLeft-(el.clientWidth-target.offsetWidth)/2,behavior:instant||stopMotion()?'instant':'smooth'})
  }
  useEffect(()=>{
    const el=rail.current
    let frame
    const update=()=>{
      if(!el.clientWidth)return
      const center=el.scrollLeft+el.clientWidth/2
      let nearest=0,distance=Infinity
      Array.from(el.children).forEach((item,i)=>{
        const delta=(item.offsetLeft+item.offsetWidth/2-center)/item.offsetWidth
        const clamped=Math.max(-2.4,Math.min(delta,2.4))
        item.style.setProperty('--fan-angle',clamped*12+'deg')
        item.style.setProperty('--fan-y',Math.min(Math.abs(delta)*20,55)+'px')
        item.style.setProperty('--fan-scale',1-Math.min(Math.abs(delta)*.075,.18))
        item.style.zIndex=String(20-Math.round(Math.abs(delta)*4))
        if(Math.abs(delta)<distance){nearest=i;distance=Math.abs(delta)}
      })
      activeIndex.current=nearest
      setCurrent(nearest)
    }
    const scroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)}
    const resize=()=>{go(activeIndex.current,true);update()}
    const wheel=e=>{
      if(Math.abs(e.deltaY)<=Math.abs(e.deltaX)||e.ctrlKey)return
      const end=el.scrollWidth-el.clientWidth
      if((e.deltaY<0&&el.scrollLeft>1)||(e.deltaY>0&&el.scrollLeft<end-1)){
        e.preventDefault()
        el.scrollLeft+=e.deltaY
      }
    }
    const observer=new ResizeObserver(resize)
    observer.observe(el)
    el.addEventListener('scroll',scroll,{passive:true})
    el.addEventListener('wheel',wheel,{passive:false})
    go(initial,true)
    update()
    return ()=>{observer.disconnect();cancelAnimationFrame(frame);el.removeEventListener('scroll',scroll);el.removeEventListener('wheel',wheel)}
  },[total,initial])
  return <div className="fan-gallery" aria-label={label}>
    <div className="fan-rail" ref={rail} tabIndex={0} aria-label={label+'，拖动或使用左右方向键'}
      onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1))}}}
      onClickCapture={e=>{if(dragged.current){e.preventDefault();e.stopPropagation();dragged.current=false}}}
      onPointerDown={e=>{dragged.current=false;if(e.pointerType==='mouse'&&e.button===0)drag.current={x:e.clientX,left:rail.current.scrollLeft}}}
      onPointerMove={e=>{if(!drag.current||e.buttons!==1)return;const dx=drag.current.x-e.clientX;if(Math.abs(dx)>6){dragged.current=true;rail.current.classList.add('dragging');rail.current.setPointerCapture(e.pointerId)}if(dragged.current)rail.current.scrollLeft=drag.current.left+dx}}
      onPointerUp={e=>{drag.current=null;rail.current.classList.remove('dragging');if(rail.current.hasPointerCapture(e.pointerId))rail.current.releasePointerCapture(e.pointerId)}}
      onPointerCancel={()=>{drag.current=null;rail.current.classList.remove('dragging')}}>
      {items.map((item,i)=><article className="fan-item" key={item.title}>{renderItem(item,i)}</article>)}
    </div>
    <nav className="fan-controls" aria-label="切换展示作品">
      <button aria-label="上一件作品" disabled={current===0} onClick={()=>go(current-1)}><ArrowLeft size={19}/></button>
      <span aria-live="polite">{items[current]?.title} <small>{current+1} / {total}</small></span>
      <button aria-label="下一件作品" disabled={current===total-1} onClick={()=>go(current+1)}><ArrowRight size={19}/></button>
    </nav>
    <p className="fan-hint">{total>1?'拖动浏览 · 点击打开':'点击打开'}</p>
  </div>
}

function Shelf({open}) {
  const [category,setCategory]=useState('原创小说')
  const list=D.novels.map((n,index)=>({...n,index})).filter(n=>category==='原创小说'?n.genre==='小说':category==='改编小说'?n.genre==='改编小说':['散文','诗歌'].includes(n.genre))
  return <div className="collection">
    <nav className="collection-tabs">{['原创小说','改编小说','散文与诗歌'].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</nav>
    <FanGallery key={category} label={category} items={list} initial={list.length>2?1:0}
      renderItem={n=><button className="edition" onClick={()=>open('novel',n.index)} aria-label={'阅读'+n.title}><Cover novel={n}/><span className="fan-caption">{n.caption}</span></button>}/>
  </div>
}

function Book({novel,play,back}) {
  const [opened,setOpened]=useState(false)
  const [page,setPage]=useState(0)
  const [pages,setPages]=useState([])
  const [singlePage,setSinglePage]=useState(()=>window.matchMedia('(max-width: 600px)').matches)
  const [turning,setTurning]=useState(false)
  const cover=useRef(null)
  const opening=useRef(false)
  const paper=useRef(null)
  const measure=useRef(null)
  const overlay=useRef(null)
  const gesture=useRef(null)
  const animation=useRef(null)
  const offset=useRef(0)
  useEffect(()=>{
    const media=window.matchMedia('(max-width: 600px)')
    const update=()=>setSinglePage(media.matches)
    media.addEventListener('change',update)
    return ()=>media.removeEventListener('change',update)
  },[])
  useEffect(()=>{
    const el=measure.current
    const paginate=()=>{
      const text=novel.body
      const result=[]
      let cursor=0
      while(cursor<text.length){
        let lo=1,hi=Math.min(1800,text.length-cursor),best=1
        while(lo<=hi){
          const mid=Math.floor((lo+hi)/2)
          el.textContent=text.slice(cursor,cursor+mid)
          if(el.scrollHeight<=el.clientHeight){best=mid;lo=mid+1}else hi=mid-1
        }
        const chunk=text.slice(cursor,cursor+best)
        result.push({text:chunk,start:cursor})
        cursor+=best
      }
      el.textContent=''
      setPages(result)
      const current=Math.max(0,result.findIndex((p,i)=>p.start<=offset.current&&(!result[i+1]||result[i+1].start>offset.current)))
      setPage(singlePage?current:current-current%2)
    }
    const observer=new ResizeObserver(paginate)
    observer.observe(el)
    paginate()
    return ()=>{observer.disconnect();animation.current?.kill()}
  },[novel.body,singlePage])
  function turn(direction){
    const next=page+direction*(singlePage?1:2)
    if(turning||next<0||next>=pages.length)return
    offset.current=pages[next].start
    play('paper')
    if(stopMotion()){setPage(next);return}
    setTurning(true)
    const sheet=overlay.current
    sheet.textContent=pages[page+(singlePage?0:1)]?.text||pages[page].text
    gsap.set(sheet,{autoAlpha:1,rotationY:0,transformOrigin:direction>0?'left center':'right center'})
    setPage(next)
    animation.current=gsap.to(sheet,{rotationY:direction>0?-95:95,duration:.48,ease:'power2.inOut',onComplete:()=>{gsap.set(sheet,{autoAlpha:0});setTurning(false)}})
  }
  function touchEnd(e){
    if(!gesture.current)return
    const dx=e.clientX-gesture.current.x,dy=e.clientY-gesture.current.y
    gesture.current=null
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)turn(dx<0?1:-1)
  }
  return <div className="reading-room" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();turn(1)}if(e.key==='ArrowLeft'){e.preventDefault();turn(-1)}}}>
    <button className="back-collection" onClick={back}><ArrowLeft size={16}/>返回作品集</button>
    <div className="pagination-probe page-copy" ref={measure} aria-hidden="true"/>
    {!opened?<button ref={cover} className="edition reader-cover" onClick={()=>{if(opening.current)return;opening.current=true;play('paper');animation.current=gsap.to(cover.current,{rotationY:-105,autoAlpha:0,duration:stopMotion()?0:.5,ease:'power2.inOut',onComplete:()=>setOpened(true)})}}><Cover novel={novel}/><span className="open-instruction">点击封面翻开</span></button>:
    <div className="reading-spread" onPointerDown={e=>gesture.current={x:e.clientX,y:e.clientY}} onPointerUp={touchEnd}>
      <div className="physical-page left-page" ref={paper} tabIndex={0} aria-label="小说正文，可使用左右方向键翻页">
        <header>{novel.title} · {novel.genre}</header><div className="page-copy">{pages[page]?.text}</div><footer>{page+1}</footer>
      </div>
      {!singlePage&&<div className="physical-page right-page" tabIndex={0} aria-label="小说正文右页">
        <header>{D.name} · 作品集</header><div className="page-copy">{pages[page+1]?.text||' '}</div><footer>{page+2<=pages.length?page+2:''}</footer>
      </div>}
      <div ref={overlay} className="turning-sheet page-copy" aria-hidden="true"/>
      <button className="page-corner" onClick={()=>turn(1)} disabled={page+(singlePage?1:2)>=pages.length||turning} aria-label="翻动右下角至下一页"/>
    </div>}
    {opened&&<nav className="reader-controls" aria-label="翻页"><button onClick={()=>turn(-1)} disabled={page===0||turning}><ChevronLeft size={18}/>上一页</button><span aria-live="polite">{singlePage?`${page+1} / ${pages.length}`:`${page+1}–${Math.min(page+2,pages.length)} / ${pages.length}`}</span><button onClick={()=>turn(1)} disabled={page+(singlePage?1:2)>=pages.length||turning}>下一页<ChevronRight size={18}/></button></nav>}
  </div>
}


function ObjectGallery({selection,open,copy,print,serial,play}) {
  const [detail,setDetail]=useState(null)
  const {type,index=0}=selection
  let cards=[]
  if(type==='project')cards=D.projects.map((p,i)=>({title:p.title,label:p.type,body:p.body,visual:<ProjectFrame project={p}/>,action:()=>open('project',i)}))
  if(type==='archive')cards=[
    {title:'教育经历',label:'履历',body:'北京大学 · 中国语言文学系',content:<div className="timeline">{D.education.map(([d,t,b])=><section key={t}><small>{d}</small><h3>{t}</h3><p>{b}</p></section>)}</div>},
    {title:'学术研究',label:'现代文学与批评理论',body:D.paper.title,content:<><h3>{D.paper.title}</h3><p className="rubric">选题提要 · 展示草稿</p><p>{D.paper.abstract}</p>{D.paper.map.map(t=><p key={t}>{t}</p>)}</>},
    {title:'实习与协作',label:'经历',body:'出版社书稿审读与校对、学术活动组织',content:<>{D.roles.map(([t,b])=><section key={t}><h3>{t}</h3><p>{b}</p></section>)}</>}
  ]
  if(type==='book')cards=D.books.map(([t,a,b])=>({title:t,label:a,body:b,content:<><h3>{t}</h3><p>{b}</p></>}))
  if(type==='desk')cards=[
    {title:'个人陈述',label:'关于我',body:'文学研究、小说创作与数字叙事',content:<Desk play={play}/>},
    {title:'项目与实践',label:'创作经历',body:'短剧、竖屏视频、AI 角色对话与影视叙事',content:<>{D.experience.map(([t,b])=><section key={t}><h3>{t}</h3><p>{b}</p></section>)}</>},
    {title:'语言与工具',label:'能力',body:'语言能力与创作工具',content:<>{D.skills.map(t=><p key={t}>{t}</p>)}</>}
  ]
  if(type==='posters')cards=D.posters.map((p,i)=>({title:p[0],label:p[1],body:p[2],visual:<Art kind={p[4]}/>,action:()=>open('posters',i+1)}))
  if(type==='contact'||type==='ticket')cards=[
    {title:'邮箱',label:'联系',body:D.email,content:<><a href={'mailto:'+D.email}>{D.email}</a><button className="ink-button" onClick={()=>copy(D.email)}><Copy size={16}/>复制邮箱</button></>},
    {title:'电话',label:'联系',body:D.phone,content:<><a href={'tel:'+D.phone}>{D.phone}</a><button className="ink-button" onClick={()=>copy(D.phone)}><Copy size={16}/>复制电话</button></>},
    {title:'完整简历',label:'打印与保存',body:'教育、项目、经历、语言与工具',content:<Resume copy={copy} print={print} contact={open} read={open}/>},
    {title:'VIP 观影券',label:'打印与保存',body:'领取带有专属观影编号的简历摘要',content:<TicketBody serial={serial} print={print}/>}
  ]

  const initial=type==='ticket'?3:type==='posters'?Math.max(0,index-1):type==='book'?index:cards.length>2?1:0
  if(detail!==null)return <div className="gallery-detail"><button className="back-collection" onClick={()=>setDetail(null)}><ArrowLeft size={16}/>返回{galleryTitle(type)}</button><h3>{cards[detail].title}</h3>{cards[detail].content}</div>
  return <FanGallery label={galleryTitle(type)} items={cards} initial={initial} renderItem={(card,i)=>
    <button className={'display-sheet sheet-'+type+' tone-'+i} onClick={()=>card.action?card.action():setDetail(i)}>
      <span className="sheet-category">{card.label}</span>
      <h3>{card.title}</h3>
      <div className={'sheet-art '+(!card.visual?'sheet-typography':'')}>{card.visual||<><span>{['Archive','Notes','Collected','Edition'][i%4]}</span><em>{galleryTitle(type)}</em><i/></>}</div>
      <p>{card.body}</p>
      <span className="sheet-footer">{D.name}<ArrowUpRight size={16}/></span>
    </button>}/>
}

function galleryTitle(type){
  return {project:'数字项目',archive:'教育与学术',book:'阅读批注',desk:'关于我',posters:'幕后手记',contact:'联系与简历',ticket:'联系与简历'}[type]
}

function Entrance({done}) {
  const stage=useRef(null)
  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.timeline({onComplete:done})
        .fromTo('.entrance-title',{opacity:0,y:14},{opacity:1,y:0,duration:.6})
        .to('.entrance-door.left',{rotationY:-105,duration:1.4,ease:'power2.inOut'},.8)
        .to('.entrance-door.right',{rotationY:105,duration:1.4,ease:'power2.inOut'},.8)
        .to('.entrance-title',{opacity:0,duration:.4},.8)
        .fromTo('.entrance-room',{scale:.83},{scale:1.1,duration:1.6,ease:'power2.inOut'},.9)
        .to(stage.current,{opacity:0,duration:.45},2.25)
    },stage)
    return ()=>ctx.revert()
  },[])
  return <div className="entrance" ref={stage}><div className="entrance-room" style={{backgroundImage:'url('+D.images.ROOM_BG+')'}}/><div className="entrance-door left"/><div className="entrance-door right"/><div className="entrance-title"><small>{D.name} · 私人放映室</small><h1>Private<br/><em>Screening.</em></h1></div><button onClick={done}>跳过入场 <ArrowRight size={16}/></button></div>
}

function App() {
  const [entering,setEntering]=useState(()=>!stopMotion())
  const [lit,setLit]=useState(false)
  const [reel,setReel]=useState(0)
  const [modal,setModal]=useState(null)
  const [toast,setToast]=useState('')
  const [clap,setClap]=useState(false)
  const [printMode,setPrintMode]=useState('resume')
  const [serial]=useState(()=>('VIP-'+crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(7,'0')))
  const dialog=useRef(null)
  const toastTimer=useRef(null)
  const clapTimer=useRef(null)
  const previousFocus=useRef(null)
  const sound=useSound()
  const project=D.projects[reel]
  const active=Boolean(modal)

  function explore(type,index=0){if(type==='shelf')open(type);else open('gallery',{type,index})}
  function change(direction){setReel(r=>(r+direction+D.projects.length)%D.projects.length);sound.play('film')}
  function open(type,index=0){
    if(type==='project')setReel(index)
    if(!active) previousFocus.current=document.activeElement
    if(type==='contact'||(type==='gallery'&&index.type==='contact')){
      setClap(true)
      clearTimeout(clapTimer.current)
      clapTimer.current=setTimeout(()=>{setClap(false);setModal({type,index})},stopMotion()?0:250)
    }else setModal({type,index})
    sound.play(({contact:'clap',archive:'slide',book:'slide',desk:'key',project:'film'})[type==='gallery'?index.type:type]||'paper')
  }
  useEffect(()=>{
    if(!active)return
    dialog.current.showModal()
    const old=document.body.style.overflow
    document.body.style.overflow='hidden'
    return ()=>{document.body.style.overflow=old;dialog.current?.close();previousFocus.current?.focus()}
  },[active])
  useEffect(()=>{
    if(active){dialog.current.scrollTop=0;dialog.current.querySelector('.modal-close')?.focus()}
  },[modal,active])
  useEffect(()=>()=>{clearTimeout(toastTimer.current);clearTimeout(clapTimer.current)},[])
  async function copy(value){
    clearTimeout(toastTimer.current)
    try {
      if(navigator.clipboard) await navigator.clipboard.writeText(value)
      else {
        const field=document.createElement('textarea')
        field.value=value
        const parent=dialog.current?.open?dialog.current:document.body
        parent.append(field)
        field.select()
        const copied=document.execCommand('copy')
        field.remove()
        if(!copied) throw Error('Clipboard unavailable')
      }
      setToast('已复制到剪贴板')
    }catch{setToast('复制失败，可以直接选中联系方式复制')}
    toastTimer.current=setTimeout(()=>setToast(''),2700)
  }
  function switchLight(next) {
    setLit(next)
    window.scrollTo({top:0,behavior:'instant'})
  }
  useEffect(()=>{
    const resetPrint=()=>setPrintMode('resume')
    window.addEventListener('afterprint',resetPrint)
    return ()=>window.removeEventListener('afterprint',resetPrint)
  },[])
  function print(mode){
    setPrintMode(mode)
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.print()))
  }
  const kind=modal?.type
  const novel=D.novels[modal?.index??0]
  const book=D.books[modal?.index??0]
  const modalTitle={project:project.title,archive:'学术档案',book:book?.[0],desk:'个人陈述',posters:'幕后手记',contact:'联系方式',ticket:'VIP 观影券',novel:novel?.title,shelf:'文学作品集',gallery:galleryTitle(modal?.index?.type)}[kind]
  return <div className={'app '+(lit?'lit ':'')+(clap?'clapping':'')}>
    {entering&&<Entrance done={()=>setEntering(false)}/>}
    <header className="topbar"><a className="brand" href="#top" onClick={()=>switchLight(false)}><span className="brand-icon"><Film size={20}/></span><span className="brand-name">私人放映室<small>Private <em>Screening.</em></small></span></a>
      <div className="controls flex items-center"><button onClick={sound.toggle} aria-pressed={sound.enabled} aria-label={sound.enabled?'关闭环境音':'开启环境音'}>{sound.enabled?<Volume2 size={17}/>:<Radio size={17}/>}<span>{sound.enabled?'环境音开':'环境音关'}</span></button><button className="light-switch" onClick={()=>switchLight(!lit)} aria-pressed={lit}>{lit?<Moon size={17}/>:<Sun size={17}/>}<span>{lit?'返回放映室':'阅览简历'}</span></button></div>
    </header>
    <main id="top">
      <div hidden={lit} inert={lit||undefined} className="screening">
        <div className="theater"><div><div className="room-wrap" tabIndex={0} aria-label="可横向滚动的放映室场景"><Room project={project} index={reel} open={explore} change={change} lit={lit}/></div><p className="swipe-note">左右滑动探索房间 <ArrowRight size={13}/></p></div>
</div>
        <footer><span>私人放映室 · {D.name}</span><button onClick={()=>switchLight(true)}>阅览简历 <ArrowUpRight size={13}/></button></footer>
      </div>
      {lit&&<div className="resume-view"><Resume copy={copy} print={print} contact={open} read={open}/></div>}
    </main>
    <dialog ref={dialog} className={'modal '+(kind||'')} aria-labelledby="modal-title" onCancel={e=>{e.preventDefault();setModal(null)}} onClick={e=>{if(e.target===dialog.current){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)setModal(null)}}}>
      {active&&<><div className="modal-top"><div><p className="eyebrow">私人放映室</p><h2 id="modal-title">{modalTitle}</h2></div><button className="modal-close" onClick={()=>setModal(null)} aria-label="关闭"><X size={22}/></button></div><div className="modal-content">
      {kind==='gallery'&&<ObjectGallery key={modal.index.type} selection={modal.index} open={open} copy={copy} print={print} serial={serial} play={sound.play}/>}
      {kind==='project'&&<><button className="back-collection" onClick={()=>explore('project')}><ArrowLeft size={16}/>返回数字项目</button><ProjectDetails key={project.title} project={project} reel={reel} change={change} close={()=>setModal(null)}/></>}
      {kind==='archive'&&<div className="loan-card"><h3>教育经历</h3><ol className="timeline">{D.education.map(([date,title,desc])=><li key={title}><small>{date}</small><h4>{title}</h4><p>{desc}</p></li>)}</ol><h3>学术专题</h3><h4>{D.paper.title}</h4><p className="rubric">选题提要 · 展示草稿</p><p>{D.paper.abstract}</p><ol className="argument">{D.paper.map.map(t=><li key={t}>{t}</li>)}</ol><h3>书架批注</h3><div className="tabs">{D.books.map((b,i)=><button key={b[0]} onClick={()=>open('book',i)}>{b[0]}</button>)}</div></div>}
      {kind==='book'&&<><p className="rubric">{book[1]} · 阅读批注</p><p>{book[2]}</p><button className="text-button" onClick={()=>open('archive')}><ArrowLeft size={16}/>返回学术档案</button></>}
      {kind==='desk'&&<Desk play={sound.play}/>}
      {kind==='posters'&&(modal.index===0?<div className="posters-grid">{D.posters.map(p=><Poster key={p[0]} poster={p} play={sound.play}/>)}</div>:<div className="poster-selected"><Poster key={modal.index} poster={D.posters[modal.index-1]} play={sound.play}/><button className="text-button" onClick={()=>explore('posters')}><ArrowLeft size={16}/>查看全部海报</button></div>)}
      {kind==='contact'&&<div className="contact-lines"><span className="contact-name">{D.name}</span><div><a href={'mailto:'+D.email}>{D.email}</a><button onClick={()=>copy(D.email)}><Copy size={16}/>复制邮箱</button></div><div><a href={'tel:'+D.phone}>{D.phone}</a><button onClick={()=>copy(D.phone)}><Copy size={16}/>复制电话</button></div>{D.wechatQr?<figure><img alt="微信二维码" src={D.wechatQr}/><figcaption>微信</figcaption></figure>:<p className="muted">微信二维码待补充</p>}<button className="ink-button" onClick={()=>open('ticket')}><Ticket size={16}/>领取观影券</button></div>}
      {kind==='ticket'&&<TicketBody serial={serial} print={print}/>}
      {kind==='shelf'&&<Shelf open={open}/>}
      {kind==='novel'&&<Book key={novel.title} novel={novel} play={sound.play} back={()=>open('shelf')}/>}
      </div><div role="status" className="modal-toast">{toast}</div></>}
    </dialog>
    {!active&&toast&&<div role="status" className="toast">{toast}</div>}
    <div className="print-only" aria-hidden="true">{printMode==='resume'?<Resume copy={copy} print={print} contact={open} read={open}/>:<TicketBody serial={serial} print={print}/>}</div>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
