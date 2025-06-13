import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

// --- Theme System ---
const themes = {
  light: {
    name: "Light",
    bg: "bg-white",
    text: "text-gray-900",
    accent: "text-blue-600",
    nav: "bg-white/95 backdrop-blur-sm",
    indicator: "bg-blue-600",
    card: "bg-gray-100 border border-gray-200 shadow-sm",
    tag: "bg-blue-100 text-blue-700",
    link: "text-blue-600 hover:text-blue-800 transition-colors duration-200",
    muted: "text-gray-500",
    spotlight: (x, y) => `radial-gradient(600px at ${x}px ${y}px, rgba(59, 130, 246, 0.1), transparent 80%)`,
  },
  dark: {
    name: "Dark",
    bg: "bg-slate-950",
    text: "text-slate-200",
    accent: "text-blue-400",
    nav: "bg-slate-900/80 backdrop-blur-sm",
    indicator: "bg-blue-400",
    card: "bg-slate-900/60 border border-slate-800 shadow-sm",
    tag: "bg-blue-500/10 text-blue-400",
    link: "text-blue-400 hover:text-blue-300 transition-colors duration-200",
    muted: "text-slate-400",
    spotlight: (x, y) => `radial-gradient(600px at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
  },
};

const ThemeContext = createContext();
const usePortfolioTheme = () => useContext(ThemeContext);

// --- Utility: Random Quote Generator ---
const QUOTES = [
  "Code is poetry.",
  "Design is intelligence made visible.",
  "Simplicity is the soul of efficiency.",
  "Every interface tells a story.",
  "Creativity is intelligence having fun.",
  "The details are not the details. They make the design.",
  "Let's build something unforgettable."
];
function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// --- Konami Code Easter Egg ---
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
function useKonami(callback) {
  const buffer = useRef([]);
  useEffect(() => {
    const handler = e => {
      buffer.current.push(e.keyCode);
      if (buffer.current.length > KONAMI.length) buffer.current.shift();
      if (KONAMI.every((code, i) => buffer.current[i] === code)) callback();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [callback]);
}

// --- Main Portfolio Component ---
const ElegantPortfolio = () => {
  // Theme logic
  const [theme, setTheme] = useState('light');
  const themeObj = themes[theme];

  // Section/scroll logic
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quote, setQuote] = useState(getRandomQuote());

  // Mouse tracking for spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // --- Data ---
  const projects = [
    {
      name: "FolioXe",
      desc: "A creative marketplace for digital assets built with React and Firebase. Features real-time collaboration and beautiful UI components.",
      tags: ["React", "Firebase", "Tailwind"],
      github: "https://github.com/xabir/folioxe",
      live: "https://folioxe.com",
      featured: true
    },
    {
      name: "Portfolio Website",
      desc: "A modern, responsive portfolio template inspired by clean design principles and smooth interactions.",
      tags: ["Next.js", "TypeScript", "Framer Motion"],
      github: "https://github.com/xabir/portfolio",
      live: "https://yourportfolio.com",
      featured: true
    },
    {
      name: "Task Manager App",
      desc: "A full-stack productivity application with real-time synchronization and team collaboration features.",
      tags: ["Node.js", "React", "MongoDB"],
      github: "https://github.com/xabir/task-manager",
      live: "https://taskapp.com",
      featured: false
    },
    {
      name: "Weather Dashboard",
      desc: "Clean weather application with location-based forecasts and beautiful data visualizations.",
      tags: ["Vue.js", "D3.js", "API Integration"],
      github: "https://github.com/xabir/weather-app",
      live: "https://weather-dash.com",
      featured: false
    }
  ];

  const skills = [
    "JavaScript (ES6+)", "TypeScript", "React", "Next.js", "Vue.js",
    "Node.js", "Python", "Java", "HTML & CSS", "Tailwind CSS",
    "Firebase", "MongoDB", "PostgreSQL", "Git", "Docker"
  ];

  const experiences = [
    {
      title: "Frontend Developer",
      company: "Tech Solutions Inc.",
      period: "2022 — Present",
      description: "Build and maintain React applications for enterprise clients. Collaborate with design teams to implement pixel-perfect, responsive interfaces."
    },
    {
      title: "Full Stack Developer",
      company: "Creative Agency",
      period: "2020 — 2022",
      description: "Developed custom web applications using modern JavaScript frameworks. Led frontend architecture decisions for multiple client projects."
    },
    {
      title: "Junior Developer",
      company: "Startup Co.",
      period: "2019 — 2020",
      description: "Started my professional journey building features for a SaaS platform. Gained experience in agile development and version control."
    }
  ];

  // --- Blog CMS Placeholder (Notion/MDX) ---
  const blogPosts = [
    { title: "How I built this portfolio", tag: "Dev", date: "2024-05-01", excerpt: "A deep dive into the design and code behind my site." },
    { title: "Why I love React", tag: "Dev", date: "2024-04-15", excerpt: "React lets me build magical UIs with ease." },
    { title: "Designing for Emotion", tag: "Design", date: "2024-03-20", excerpt: "How to make interfaces that feel alive." },
  ];

  // --- Render ---
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`min-h-screen ${themeObj.bg} ${themeObj.text} selection:bg-teal-300 selection:text-teal-900 transition-colors duration-500`}>
        {/* Theme Switcher */}
        <div className="fixed top-6 right-6 z-50 flex gap-2">
          {Object.keys(themes).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 rounded-full font-bold text-xs border-2 transition-all ${theme === t ? 'border-teal-300 bg-slate-800 text-teal-300' : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-teal-300 hover:text-teal-300'}`}
            >
              {themes[t].name}
            </button>
          ))}
        </div>

        {/* Spotlight Effect */}
        <div
          className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
          style={{ background: themeObj.spotlight(mousePosition.x, mousePosition.y) }}
        ></div>

        <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-4">
            {/* Left Column - Fixed */}
            <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
              <div>
                {/* Name & Title */}
                <div className="mb-8">
                  <h1 className={`text-4xl font-bold tracking-tight ${themeObj.text} sm:text-5xl`}>
                    Jabir Mahmud
                  </h1>
                  <h2 className={`mt-3 text-lg font-medium tracking-tight ${themeObj.text} sm:text-xl`}>
                    FullStack Developer
                  </h2>
                  <p className={`mt-4 max-w-xs leading-normal ${themeObj.muted}`}>
                    I build pixel-perfect, engaging, and accessible digital experiences.
                  </p>
                </div>
                {/* Navigation */}
                <nav className="nav hidden lg:block" aria-label="In-page jump links">
                  <ul className="mt-16 w-max">
                    {["about", "experience", "projects", "blog"].map((section) => (
                      <li key={section}>
                        <button
                          onClick={() => scrollToSection(section)}
                          className={`group flex items-center py-3 ${activeSection === section ? 'active' : ''}`}
                        >
                          <span className={`nav-indicator mr-4 h-px transition-all ${activeSection === section ? themeObj.indicator + ' w-16' : 'w-8 bg-slate-600 group-hover:w-16 group-hover:' + themeObj.indicator}`}></span>
                          <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors ${activeSection === section ? themeObj.accent : themeObj.muted}`}>
                            {section}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              {/* Social Links */}
              <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
                {[
                  { name: 'GitHub', href: '#', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                  { name: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  { name: 'Twitter', href: '#', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' }
                ].map((social, index) => (
                  <li key={social.name} className="mr-5 text-xs">
                    <a
                      className={`block ${themeObj.link} transition-colors`}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${social.name} (opens in a new tab)`}
                    >
                      <span className="sr-only">{social.name}</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={social.icon} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </header>
            {/* Right Column - Scrollable Content */}
            <main className="pt-24 lg:w-1/2 lg:py-24">
              {/* About Section */}
              <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="About me">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen ${themeObj.nav} px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className={`text-sm font-bold uppercase tracking-widest ${themeObj.accent} lg:sr-only`}>About</h2>
                </div>
                <div className="space-y-4">
                  <p>
                    Back in 2012, I decided to try my hand at creating custom themes and tumbled head first into the rabbit hole of coding and web development. Fast-forward to today, and I've had the privilege of building software for an {" "}
                    <a href="#" className={`font-medium ${themeObj.link} transition-colors`}>advertising agency</a>, a {" "}
                    <a href="#" className={`font-medium ${themeObj.link} transition-colors`}>start-up</a>, and a {" "}
                    <a href="#" className={`font-medium ${themeObj.link} transition-colors`}>digital product studio</a>.
                  </p>
                  <p>
                    My main focus these days is building accessible user interfaces for our customers at {" "}
                    <a href="#" className={`font-medium ${themeObj.link} transition-colors`}>Klaviyo</a>. I most enjoy building software in the sweet spot where design and engineering meet — things that look good but are also built well under the hood.
                  </p>
                  <p>
                    When I'm not at the computer, I'm usually rock climbing, hanging out with my wife and two cats, or running around Hyrule searching for {" "}
                    <span className={`font-medium ${themeObj.accent}`}>Korok seeds</span>.
                  </p>
                </div>
              </section>
              {/* Experience Section */}
              <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Work experience">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen ${themeObj.nav} px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className={`text-sm font-bold uppercase tracking-widest ${themeObj.accent} lg:sr-only`}>Experience</h2>
                </div>
                <div>
                  <ol className="group/list">
                    {experiences.map((exp, index) => (
                      <li key={index} className="mb-12">
                        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                          <header className={`z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide ${themeObj.muted} sm:col-span-2`} aria-label={exp.period}>
                            {exp.period}
                          </header>
                          <div className="z-10 sm:col-span-6">
                            <h3 className={`font-medium leading-snug ${themeObj.text}`}>
                              <div>
                                <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                                <span>
                                  {exp.title} · <span className="inline-block">{exp.company}</span>
                                </span>
                              </div>
                            </h3>
                            <p className="mt-2 text-sm leading-normal">{exp.description}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-12">
                    <a
                      className={`inline-flex items-center font-medium leading-tight ${themeObj.link} font-semibold group`}
                      aria-label="View Full Résumé"
                      href="/resume.pdf"
                    >
                      <span>
                        <span className="border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none">
                          View Full Résumé
                        </span>
                        <span className="whitespace-nowrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </section>
              {/* Projects Section */}
              <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Selected projects">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen ${themeObj.nav} px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className={`text-sm font-bold uppercase tracking-widest ${themeObj.accent} lg:sr-only`}>Projects</h2>
                </div>
                <div>
                  <ol className="group/list">
                    {projects.map((project, index) => (
                      <li key={index} className="mb-12">
                        <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                          <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                          <div className="z-10 sm:col-span-3">
                            <div className="aspect-video rounded border-2 border-slate-200/10 bg-slate-800 p-4">
                              <div className="h-full rounded bg-gradient-to-br from-teal-400/20 to-blue-500/20 flex items-center justify-center">
                                <div className={`text-xs ${themeObj.muted} text-center`}>
                                  <div className={`font-medium ${themeObj.text}`}>{project.name}</div>
                                  <div className="mt-1">Project Preview</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="z-10 sm:col-span-5">
                            <h3 className={`font-medium leading-snug ${themeObj.text}`}>
                              <a href={project.live} target="_blank" rel="noopener noreferrer">
                                <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                                <span>{project.name}</span>
                              </a>
                            </h3>
                            <p className="mt-2 text-sm leading-normal">{project.desc}</p>
                            <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                              {project.tags.map((tag, tagIndex) => (
                                <li key={tagIndex} className="mr-1.5 mt-2">
                                  <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">
                                    {tag}
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 flex items-center gap-2">
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${themeObj.link} transition-colors`}
                                aria-label="GitHub Repository"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                              </a>
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${themeObj.link} transition-colors`}
                                aria-label="Live Project"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-12">
                    <a
                      className={`inline-flex items-center font-medium leading-tight ${themeObj.link} font-semibold group`}
                      aria-label="View Full Project Archive"
                      href="/archive"
                    >
                      <span>
                        <span className="border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none">
                          View Full Project Archive
                        </span>
                        <span className="whitespace-nowrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </section>
              {/* Blog Section (CMS Placeholder) */}
              <section id="blog" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Blog">
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen ${themeObj.nav} px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className={`text-sm font-bold uppercase tracking-widest ${themeObj.accent} lg:sr-only`}>Blog</h2>
                </div>
                <div>
                  <ol className="group/list">
                    {blogPosts.map((post, idx) => (
                      <li key={idx} className="mb-8">
                        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
                          <div className="z-10 sm:col-span-6">
                            <h3 className={`font-medium leading-snug ${themeObj.text}`}>
                              <span>{post.title}</span>
                            </h3>
                            <div className="mt-1 text-xs text-teal-300 font-mono">{post.tag} • {post.date}</div>
                            <p className="mt-2 text-sm leading-normal">{post.excerpt}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-8">
                    <a
                      className={`inline-flex items-center font-medium leading-tight ${themeObj.link} font-semibold group`}
                      aria-label="View All Blog Posts"
                      href="#"
                    >
                      <span>
                        <span className="border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none">
                          View All Blog Posts
                        </span>
                        <span className="whitespace-nowrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </section>
              {/* Footer */}
              {/* <footer className={`max-w-md pb-16 text-sm ${themeObj.muted} sm:pb-0`}>
                <p>
                  Loosely designed in <a href="#" className={`font-medium ${themeObj.link}`}>Figma</a> and coded in{" "}
                  <a href="#" className={`font-medium ${themeObj.link}`}>Visual Studio Code</a> by yours truly. Built with{" "}
                  <a href="#" className={`font-medium ${themeObj.link}`}>React</a> and{" "}
                  <a href="#" className={`font-medium ${themeObj.link}`}>Tailwind CSS</a>, deployed with{" "}
                  <a href="#" className={`font-medium ${themeObj.link}`}>Vercel</a>. All text is set in the{" "}
                  <a href="#" className={`font-medium ${themeObj.link}`}>Inter</a> typeface.
                </p>
              </footer> */}
            </main>
          </div>
        </div>
        {/* Quote Generator */}
        <div className="fixed bottom-8 left-8 z-50 bg-slate-800/80 px-6 py-3 rounded-xl shadow-lg text-teal-300 font-semibold text-base animate-fadein delay-700">
          {quote}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ElegantPortfolio;
