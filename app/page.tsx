"use client"

import { useEffect, useState } from "react"
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Code2, Download, ExternalLink, Github, Linkedin, Mail, Menu, Play, Sparkles, X, ZoomIn } from "lucide-react"

const bookCover = "/Book-Cover.png"

const statementArt = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_7xd9z77xd9z77xd9-JvgQdyQXxp44AiJZf0c0dMykGiT3vg.jpg"

const portrait = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-z6cBfQRQ4vGN9pRxCZMB9YzlXs9MPZ.jpg"

const projects = [
  { number: "01", title: "Shoreline Dreams", type: "Level design", copy: "A cinematic shoreline environment focused on composition, mood, and environmental storytelling.", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shoreline-dreams-m20hIOXavjSOKizeMep6LfPGIco5ZC.png", videoId: "7mMm2gKIRec" },
  { number: "02", title: "Tranquil Mountains", type: "Level design", copy: "A calm mountain landscape balancing natural composition with immersive world building.", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tranquil-x0xpamynJGTA4RkmDPdFk4V2MzeVrl.png", videoId: "FQtnIpcrBm0" },
  { number: "03", title: "Creepy And Unknown", type: "Level design", copy: "An unsettling environment built with lighting, scale, and careful visual pacing.", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creepy-UwUV4KiGlvtsmJ3LUghn2zdx1ZxDIq.png", videoId: "YKtl5I1P0Cg" },
  { number: "04", title: "Whispers in the Fog", type: "Level design", copy: "A fog-heavy atmospheric scene designed around mystery, depth, and quiet tension.", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whispers-0PYOC1NXmMpGoZdfHA1XQuVObP5bSa.png", videoId: "im9ZugY0Owk" },
  { number: "05", title: "Memory Maze Runner", type: "Game / Work in progress", copy: "A memory-driven maze runner currently in development, built around exploration, tension, and discovery.", image: "/images/2d-environment.png", videoId: "5YbGs-_hGSk" },
  { number: "06", title: "Black Eye", type: "Game / Work in progress", copy: "A dark interactive experience in progress, shaped through atmosphere, movement, and visual storytelling.", image: "/images/the-curse.png", videoId: "nfOynJ1vVy0" },
  { number: "07", title: "2D Game Concept Art", type: "Concept art / 2D game", copy: "From visual concept to playable implementation, bringing a 2D game world from sketch to interaction.", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2dGame%20Design-rOrfvGDEEa3B6zOJCrdtERJal1tOJo.jpeg", videoId: "lZ8cu40dEtw" },
  { number: "08", title: "2D Rope Generator", type: "Editor tool / Unity", copy: "A procedural editor tool for generating flexible 2D rope assets and speeding up game development workflows.", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2rope-hlF8zSWTKDXkYN7tDzCmetBme3hN3k.png", videoId: "AId0MuKHK7c" },
]

const digitalTwins = [
  { number: "01", title: "Pylon Spawning System", type: "Power network / Unity", copy: "A procedural placement tool for transmission pylons with configurable lattice types, spacing calculations, and terrain-aware height adjustment.", image: "/pylon-spawning-system.jpg" },
  { number: "02", title: "Train Simulation System", type: "Railway simulation / Unity", copy: "A route and asset management system for railway networks, covering rolling stock libraries, route planning, and adjustable time-of-day and weather simulation.", image: "/train-simulation-system.jpg" },
  { number: "03", title: "Traffic Simulation System", type: "Urban mobility / Unity", copy: "A city-flow traffic model with live density and speed controls, mixed vehicle types, signal routing, and camera tools for reviewing network behaviour.", image: "/traffic-simulation-system.jpg" },
  { number: "04", title: "Environmental Control System", type: "Weather simulation / Unity", copy: "A weather and time-of-day system driving precipitation, cloud cover, and visibility states across a real-time scene.", image: "/environmental-control-system.jpg" },
]

const skills = ["Unity", "C# / .NET", "Digital Twins", "VR / ML Agents", "React Native", "DBMS", "Level Design", "Editor Tools"]



const playStoreProjects = [{ title: "Box Buddy", type: "Published mobile game", copy: "A mobile 2.5D game developed, optimized, and published on Google Play.", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_sftc1esftc1esftc-4FAjvlMnWmLuxEdSYZYSCIa0b925Ag.jpg", publisherMark: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Highres-LBVjga5I0tFY99Deasau2HF1iksKv0.png", href: "https://play.google.com/store/apps/details?id=com.GameDisaster.BoxBuddy&hl=en&pli=1", developerHref: "https://play.google.com/store/apps/dev?id=5080920650709831944&hl=en" }]

export default function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%")
  const [activeProject, setActiveProject] = useState(0)
  const [carouselPaused, setCarouselPaused] = useState(false)

  useEffect(() => {
    if (carouselPaused) return
    const timer = window.setInterval(() => {
      setActiveProject((current) => (current + 1) % projects.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [carouselPaused])

  const goTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const showProject = (direction: number) => {
    setActiveProject((current) => (current + direction + projects.length) % projects.length)
  }

  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <button className="wordmark" onClick={() => goTo("top")} aria-label="Back to top">AH<span>.</span></button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
          <button onClick={() => goTo("about")}>About</button>
          <button onClick={() => goTo("work")}>Work</button>
          <button onClick={() => goTo("book")}>Book</button>
          <button onClick={() => goTo("resume")}>Resume</button>
          <button onClick={() => goTo("contact")}>Contact</button>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy reveal-up">
          <p className="eyebrow"><span className="status-dot" /> Available for thoughtful collaborations</p>
          <h1>Building worlds<br /><em>that work.</em></h1>
          <p className="hero-intro">Ali Haider is a Simulation Software Engineer crafting interactive 3D systems, digital twins, mobile experiences, and games with Unity.</p>
          <button className="circle-link" onClick={() => goTo("work")} aria-label="Explore selected work"><ArrowDownRight size={21} /></button>
        </div>
        <div className="portrait-wrap reveal-scale">
          <div className="portrait-label">KHI / PK<br />24°51&apos; N 67°00&apos; E</div>
          <img src={portrait} alt="Ali Haider in a denim jacket" className="portrait" />
          <div className="portrait-stamp">SIMULATION<br />SOFTWARE<br />ENGINEER</div>
        </div>
        <div className="hero-index">01 <span>/</span> 04</div>
      </section>

<section className="statement statement-section section-rule" id="about">
  <p className="section-kicker">[ 001 — Profile ]</p>
  <div className="statement-content"><div className="statement-art" style={{ "--zoom-origin": zoomOrigin } as React.CSSProperties} onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width) * 100; const y = ((event.clientY - rect.top) / rect.height) * 100; setZoomOrigin(`${x}% ${y}%`) }}><img src={statementArt} alt="Simulation software engineering competencies and key project areas" /><span className="art-zoom-hint"><ZoomIn size={16} /> Hover to magnify</span></div><div className="statement-copy"><h2>Engineering the space<br />between <span>idea and reality.</span></h2><p className="body-copy">With 3+ years in industry and 4 years building software hands-on, I design scalable real-time systems, immersive environments, and product experiences that make complex ideas feel simple.</p></div></div>
  </section>

      

      <section className="work-section section-rule" id="work">
        <div className="section-heading"><p className="section-kicker">[ 002 — Selected work ]</p><p className="muted">Drag your cursor. Explore the work.</p></div>
        <div className="project-feature">
          <div className="project-media">
            <div className="project-image-wrap"><a className="project-thumbnail-link" href={`https://www.youtube.com/watch?v=${projects[activeProject].videoId}`} target="_blank" rel="noreferrer" aria-label={`Watch ${projects[activeProject].title} on YouTube`}><img className="project-video-thumbnail" src={projects[activeProject].image} alt={`${projects[activeProject].title} project thumbnail`} /><span className="thumbnail-play"><Play size={22} fill="currentColor" /></span><span className="thumbnail-watch">Watch on YouTube <ArrowUpRight size={15} /></span></a><span className="image-count">0{activeProject + 1} / 0{projects.length}</span></div>
          </div>
          <div className="project-aside">
            <div className="project-info"><p className="project-number">{projects[activeProject].number}</p><p className="eyebrow">{projects[activeProject].type}</p><h3>{projects[activeProject].title}</h3><p className="body-copy">{projects[activeProject].copy}</p><a className="text-link" href="https://www.linkedin.com/in/ali-haider-3059671b3/?isSelfProfile=true" target="_blank" rel="noreferrer">View project <ArrowUpRight size={15} /></a></div>
            <div className="carousel-controls" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)} onFocusCapture={() => setCarouselPaused(true)} onBlurCapture={() => setCarouselPaused(false)} aria-label="Project carousel controls"><button className="carousel-arrow" onClick={() => showProject(-1)} aria-label="Previous project"><ArrowLeft size={17} /></button><div className="carousel-dots">{projects.map((project, index) => <button key={project.title} className={index === activeProject ? "carousel-dot active" : "carousel-dot"} onClick={() => setActiveProject(index)} aria-label={`Show ${project.title}`} aria-current={index === activeProject ? "true" : undefined} />)}</div><button className="carousel-arrow" onClick={() => showProject(1)} aria-label="Next project"><ArrowRight size={17} /></button></div>
          </div>
        </div>
      </section>

      <section className="twins-section section-rule" id="twins">
        <div className="section-heading"><p className="section-kicker">[ 003 — Digital twins ]</p><p className="muted">Simulation systems built in Unity</p></div>
        <div className="twins-grid">
          {digitalTwins.map((item) => (
            <article className="twin-card" key={item.title}>
              <div className="twin-media"><img src={item.image} alt={item.title} /></div>
              <div className="twin-copy">
                <p className="project-number">{item.number}</p>
                <p className="eyebrow">{item.type}</p>
                <h3>{item.title}</h3>
                <p className="body-copy">{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="playstore-section section-rule" id="playstore"><div className="section-heading"><p className="section-kicker">[ 004 — Play Store development ]</p><p className="muted">Published apps and games</p></div><div className="playstore-card"><div className="playstore-art"><img src={playStoreProjects[0].image} alt="Box Buddy game world artwork" /><a className="publisher-overlay" href={playStoreProjects[0].developerHref} target="_blank" rel="noreferrer" aria-label="Open Nameless Forge developer page on Google Play"><img src={playStoreProjects[0].publisherMark} alt="Nameless Forge developer logo" /></a></div><div className="playstore-copy"><p className="project-number">01 / 01</p><p className="eyebrow">{playStoreProjects[0].type}</p><h3>{playStoreProjects[0].title}</h3><p className="body-copy">{playStoreProjects[0].copy}</p><p className="account-label">Play Store development account</p><a className="button-link" href={playStoreProjects[0].href} target="_blank" rel="noreferrer">View Play Store listing <ExternalLink size={15} /></a></div></div><div className="carousel-dots single-dot" aria-label="Play Store projects"><span className="carousel-dot active" /></div></section>

      

      <section className="book-section section-rule" id="book"><div className="book-cover" style={{ "--zoom-origin": zoomOrigin } as React.CSSProperties} onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width) * 100; const y = ((event.clientY - rect.top) / rect.height) * 100; setZoomOrigin(`${x}% ${y}%`) }}><img src={bookCover} alt="Awakening of the Dark Blood book cover" /></div><div className="book-details"><p className="section-kicker">[ 005 — Book ]</p><div className="book-mark"><BookOpen size={26} /><span>Published work</span></div><p className="eyebrow">A story by Ali Haider</p><h2>Awakening of<br /><em>the Dark Blood</em></h2><p className="body-copy">A dark, atmospheric journey into the unknown. My published book is available now on Amazon.</p><a className="button-link" href="https://tinyurl.com/AwakeningOfTheDarkBlood" target="_blank" rel="noreferrer">Read on Amazon <ExternalLink size={15} /></a></div></section>

      <section className="resume-section section-rule" id="resume">
        <div className="resume-card">
          <p className="section-kicker">[ 006 — Resume ]</p>
          <div className="resume-grid">
            <h2>Resume</h2>
            <h2 className="resume-skills-title">Skill set.</h2>
            <div className="resume-copy">
              <p className="body-copy">A full overview of my experience across simulation engineering, game development, and published work.</p>
              <div className="resume-actions">
                <a className="button-link" href="/Updated%20Resume.pdf" target="_blank" rel="noreferrer">Open resume <ExternalLink size={15} /></a>
                <a className="text-link" href="/Updated%20Resume.pdf" download>Download PDF <Download size={15} /></a>
              </div>
            </div>
            <div className="resume-skills">
              {skills.map((skill, index) => <div className="skill" key={skill}><span>0{index + 1}</span>{skill}</div>)}
            </div>
            <div className="resume-facts">
              <p className="fact-kicker">At a glance</p>
              <ul className="fact-list">
                <li><strong>7+</strong><span>Years of freelancing and development</span></li>
                <li><strong>4+</strong><span>Years in industry</span></li>
                <li><strong>9</strong><span>Projects delivered</span></li>
                <li><strong>1</strong><span>Published game</span></li>
                <li><strong>1</strong><span>Published book</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="contact section-rule" id="contact"><p className="section-kicker">[ 007 — Let&apos;s connect ]</p><h2>Have a complex idea?<br /><em>Let&apos;s make it real.</em></h2><a className="contact-email" href="mailto:namelessforgex@gmail.com">namelessforgex@gmail.com <ArrowUpRight /></a><div className="contact-footer"><span>Karachi, Pakistan</span><div className="footer-social"><div><a href="https://www.linkedin.com/in/ali-haider-3059671b3/?isSelfProfile=true" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="mailto:namelessforgex@gmail.com" aria-label="Email"><Mail size={17} /></a><a href="https://github.com/haideralix1x1" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a></div></div><span>© 2026 Nameless Forge</span></div></section>
    </main>
  )
}

void [Code2, Play, Sparkles]
void ArrowDownRight
