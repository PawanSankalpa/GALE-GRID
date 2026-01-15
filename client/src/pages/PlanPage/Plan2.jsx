import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, Timer, Play, Pause, RotateCw, Trophy, Flame, Zap, Target, BookOpen, MessageCircle, Dumbbell, Star, ArrowRight, Calendar, Brain, DollarSign, Lightbulb, Rocket, Users, TrendingUp, Mail, Linkedin, Globe, AlertTriangle, XCircle, CheckCircle2, ExternalLink, Copy, Download, FileText, Briefcase, Building2, Handshake, Scale, Clock, Shield, Award, BarChart3, UserPlus, Settings, Wrench, AlertCircle } from 'lucide-react';
import './Plan2.css';

const motivationalQuotes = [
  "Pawan, most freelancers send 100 generic proposals and quit. You will send 500 personalized ones if needed. Persistence wins.",
  "Rejection is data. Every 'no' teaches you how to craft the next 'yes'. Keep going.",
  "Your edge: You think in psychology + marketing + pixel-perfect detail. 99% don't. Use it relentlessly.",
  "Overdeliver on every project. One happy client = 3 referrals. That's how real agencies grow.",
  "Systems turn chaos into $10k months. Build them early, refine forever.",
  "Scaling starts with saying no to bad clients and yes to processes.",
  "You're not competing with average. You're building something premium. Act like it every day.",
  "Failure is guaranteed if you stop. Success is inevitable if you don't."
];

const Plan = () => {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? JSON.parse(saved) : {};
  });

  const [timerSeconds, setTimerSeconds] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [pushupsToday, setPushupsToday] = useState(() => localStorage.getItem('pushupsToday') ? parseInt(localStorage.getItem('pushupsToday')) : 0);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const intervalRef = useRef(null);

  useEffect(() => localStorage.setItem('completedTasks', JSON.stringify(completedTasks)), [completedTasks]);
  useEffect(() => localStorage.setItem('pushupsToday', pushupsToday.toString()), [pushupsToday]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsBreak(prev === 1 && !isBreak);
            if (!isBreak) setSessionCount(c => c + 1);
            return isBreak ? 50 * 60 : 10 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  useEffect(() => setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]), [sessionCount]);

  const toggleTask = (id) => setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const resetTimer = () => { setIsRunning(false); setIsBreak(false); setTimerSeconds(50 * 60); };
  const addPushups = (n) => setPushupsToday(prev => prev + n);

  const totalTasks = 218;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const overallProgress = Math.round((completedCount / totalTasks) * 100);

  const [openSections, setOpenSections] = useState({
    routine: true, phase0: true, phase1: true, phase2: true, phase3: true, phase4: true,
    systems: true, mistakes: true, marketing: true, skills: true, english: true
  });

  const toggleSection = (s) => setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));

  return (
    <div className="mentor-dashboard">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-card">
          <h1 className="hero-title">Pawan’s Premium Web Agency Mentor Dashboard</h1>
          <p className="hero-subtitle">Realistic path from $0 to $100k+/year — no fluff, no shortcuts, just systems and execution</p>
          <div className="quote-card">
            <Star size={28} />
            <p className="quote-text">“{quote}”</p>
          </div>
          <div className="progress-grid">
            <div className="progress-ring">
              <svg viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray={`${overallProgress}, 100`} />
              </svg>
              <div className="ring-text">{overallProgress}% Complete</div>
            </div>
            <div className="stats-grid">
              <div className="stat"><Flame size={24} /><span>{sessionCount} Sessions Today</span></div>
              <div className="stat"><Dumbbell size={24} /><span>{pushupsToday} Pushups</span></div>
              <div className="stat"><Trophy size={24} /><span>{completedCount}/{totalTasks} Tasks</span></div>
              <div className="stat"><DollarSign size={24} /><span>Goal: $5k/month by July 2026</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timer */}
      <section className="timer-section">
        <div className="timer-card">
          <h2><Timer size={32} /> Mentor Timer (50/10)</h2>
          <div className="timer-display">{formatTime(timerSeconds)}</div>
          <p className="timer-status">{isBreak ? "BREAK — Move, stretch, pushups" : "FOCUS — One task at a time"}</p>
          <div className="timer-controls">
            <button onClick={() => setIsRunning(!isRunning)} className="btn-primary"><Play size={20} /> {isRunning ? 'Pause' : 'Start'}</button>
            <button onClick={resetTimer} className="btn-secondary"><RotateCw size={20} /> Reset</button>
          </div>
          {isBreak && (
            <div className="break-actions">
              <button onClick={() => addPushups(15)} className="btn-small">+15 Pushups</button>
              <button onClick={() => addPushups(25)} className="btn-small">+25 Pushups</button>
            </div>
          )}
        </div>
      </section>

      {/* Daily Routine */}
      <section className="mentor-section">
        <div className="section-header" onClick={() => toggleSection('routine')}>
          <h2><Calendar size={28} /> Daily Routine (Dubai Uni Balance)</h2>
          {openSections.routine ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
        {openSections.routine && (
          <div className="task-list">
            <div className="task-item"><input type="checkbox" checked={completedTasks['r1'] || false} onChange={() => toggleTask('r1')} /><span>6:30 AM wake — cold shower + 5 min mobility</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['r2'] || false} onChange={() => toggleTask('r2')} /><span>Bus: English podcast (BBC Learning English)</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['r3'] || false} onChange={() => toggleTask('r3')} /><span>Uni classes — full attention</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['r4'] || false} onChange={() => toggleTask('r4')} /><span>Evening: 3–5 focused agency sessions</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['r5'] || false} onChange={() => toggleTask('r5')} /><span>Before bed: Review tomorrow's 3 priority tasks</span></div>
          </div>
        )}
      </section>

      {/* Phase 0: Jan 14–25 Launch */}
      <section className="mentor-section">
        <div className="section-header" onClick={() => toggleSection('phase0')}>
          <h2><Rocket size={28} /> Phase 0: Launch Premium Agency Site (Jan 14–25)</h2>
          {openSections.phase0 ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
        {openSections.phase0 && (
          <div className="task-list">
            <div className="subheader">Core Principle: Your site must scream "premium direct developer" — no templates, no generic copy</div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p0-1'] || false} onChange={() => toggleTask('p0-1')} /><span>Finalize hero: "Direct full-stack developer delivering psychological UX that converts"</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p0-2'] || false} onChange={() => toggleTask('p0-2')} /><span>Bento grid: All cards with images + large overlay text (as previous version)</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p0-3'] || false} onChange={() => toggleTask('p0-3')} /><span>Portfolio: 3 detailed case studies with psychology explanations</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p0-4'] || false} onChange={() => toggleTask('p0-4')} /><span>Contact + Calendly integration</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p0-5'] || false} onChange={() => toggleTask('p0-5')} /><span>Deploy + domain (pawan.studio or similar)</span></div>
            <div className="tip">Tip: Test on mobile first. 70% of clients view on phone.</div>
          </div>
        )}
      </section>

      {/* Phase 1: First $2,000/month */}
      <section className="mentor-section">
        <div className="section-header" onClick={() => toggleSection('phase1')}>
          <h2><DollarSign size={28} /> Phase 1: First Clients ($500–$2,000 projects)</h2>
          {openSections.phase1 ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
        {openSections.phase1 && (
          <div className="task-list">
            <div className="subheader">Reality: Expect 100–200 proposals for first client. This is normal.</div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p1-1'] || false} onChange={() => toggleTask('p1-1')} /><span>Daily: 10 personalized Upwork proposals (15 min research each)</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p1-2'] || false} onChange={() => toggleTask('p1-2')} /><span>LinkedIn: 20 targeted connections/day + message</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['p1-3'] || false} onChange={() => toggleTask('p1-3')} /><span>Overdeliver on first 3 projects → testimonials</span></div>
            <div className="tip">Winning Proposal Formula: 1. Specific pain point 2. Free audit suggestion 3. Mini case study 4. Clear price/timeline 5. Question to continue conversation</div>
            <div className="warning">Common mistake: Generic proposals. Never send without client-specific research.</div>
          </div>
        )}
      </section>

      {/* Phase 2: Systems Building ($2k–$10k/month) */}
      <section className="mentor-section">
        <div className="section-header" onClick={() => toggleSection('phase2')}>
          <h2><Settings size={28} /> Phase 2: Build Bulletproof Systems</h2>
          {openSections.phase2 ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
        {openSections.phase2 && (
          <div className="task-list">
            <div className="subheader">Systems = Freedom. Without them, you stay stuck at $3k/month forever.</div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['sys1'] || false} onChange={() => toggleTask('sys1')} /><span>Client Onboarding: Notion template (discovery questions, timeline, payments)</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['sys2'] || false} onChange={() => toggleTask('sys2')} /><span>Project Management: Notion dashboard with phases (Discovery → Wireframe → Design → Dev → Launch)</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['sys3'] || false} onChange={() => toggleTask('sys3')} /><span>Invoicing: Stripe + automated reminders</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['sys4'] || false} onChange={() => toggleTask('sys4')} /><span>Feedback system: Post-project survey → testimonial request</span></div>
            <div className="tip">Reality: Most freelancers burn out because no systems. You will automate early.</div>
          </div>
        )}
      </section>

      {/* Phase 3: Scaling ($10k+/month + Hiring) */}
      <section className="mentor-section">
        <div className="section-header" onClick={() => toggleSection('phase3')}>
          <h2><UserPlus size={28} /> Phase 3: Scale & Hire (When at consistent $8k+/month)</h2>
          {openSections.phase3 ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
        {openSections.phase3 && (
          <div className="task-list">
            <div className="subheader">Only scale when systems are perfect and you have repeat/referral clients.</div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['scale1'] || false} onChange={() => toggleTask('scale1')} /><span>Hire first junior developer (Upwork Pakistan/Philippines — $8–12/hr)</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['scale2'] || false} onChange={() => toggleTask('scale2')} /><span>Train on your exact process (record Loom videos)</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['scale3'] || false} onChange={() => toggleTask('scale3')} /><span>You focus only on sales + design — delegate dev</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['scale4'] || false} onChange={() => toggleTask('scale4')} /><span>Build agency brand: Content marketing, YouTube, niche authority</span></div>
            <div className="warning">Biggest mistake: Hiring too early before profitable systems.</div>
          </div>
        )}
      </section>

      {/* Common Mistakes to Avoid */}
      <section className="mentor-section">
        <div className="section-header" onClick={() => toggleSection('mistakes')}>
          <h2><AlertTriangle size={28} /> Critical Mistakes That Kill 99% of Agencies</h2>
          {openSections.mistakes ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
        {openSections.mistakes && (
          <div className="task-list">
            <div className="warning-item"><XCircle size={20} /><span>Underpricing to "get experience" — trains bad clients</span></div>
            <div className="warning-item"><XCircle size={20} /><span>Taking every client — say no to scope creepers</span></div>
            <div className="warning-item"><XCircle size={20} /><span>No contracts — always use simple contract (Rocket Lawyer template)</span></div>
            <div className="warning-item"><XCircle size={20} /><span>Working without 50% upfront — cashflow kills agencies</span></div>
            <div className="warning-item"><XCircle size={20} /><span>Giving away free work beyond initial audit</span></div>
          </div>
        )}
      </section>

      {/* Marketing Mastery */}
      <section className="mentor-section">
        <div className="section-header" onClick={() => toggleSection('marketing')}>
          <h2><TrendingUp size={28} /> Marketing Mastery — Beat 99% of Freelancers</h2>
          {openSections.marketing ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
        {openSections.marketing && (
          <div className="task-list">
            <div className="tip">Top 1% win by being specific, fast, and human.</div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['m1'] || false} onChange={() => toggleTask('m1')} /><span>15 min research per proposal — mention exact site issues</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['m2'] || false} onChange={() => toggleTask('m2')} /><span>Always give 1–2 free specific suggestions</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['m3'] || false} onChange={() => toggleTask('m3')} /><span>Response time under 2 hours</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['m4'] || false} onChange={() => toggleTask('m4')} /><span>Video proposals (Loom) for $2k+ jobs</span></div>
            <div className="task-item"><input type="checkbox" checked={completedTasks['m5'] || false} onChange={() => toggleTask('m5')} /><span>Niche down hard — become the go-to for one industry</span></div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Plan;