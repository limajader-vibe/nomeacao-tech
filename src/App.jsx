import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  PieChart, Calendar, CheckCircle, Clock, Target, BookOpen, 
  Layers, ChevronDown, Folder, ChevronRight, PlayCircle, 
  RefreshCcw, Save, Trash2, Moon, Sun, ShoppingCart, ExternalLink, GripVertical, Plus, Pencil, Settings,
  Edit, AlertTriangle, ChevronUp, Flame, Trophy, TrendingUp, Activity, Award, ListPlus, ArrowRight, ArrowLeft, BarChart2,
  CalendarDays, LayoutGrid, BrainCircuit, ShieldAlert, Download, Sliders, Lock, LogOut,
  Filter, Play, Pause, Coffee, PartyPopper, X, Menu, Minus, Upload, Palette
} from 'lucide-react';

// --- FIREBASE CLOUD STORAGE SETUP ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const canvasConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : null;

const myFirebaseConfig = {
  apiKey: "AIzaSyDQNSDxWrhWryoL8tpTsa8NDT33RY8wq1w",
  authDomain: "nomeacao-tech.firebaseapp.com",
  projectId: "nomeacao-tech",
  storageBucket: "nomeacao-tech.firebasestorage.app",
  messagingSenderId: "613255880556",
  appId: "1:613255880556:web:6127f456517970e8b81d49"
};

const firebaseConfig = canvasConfigStr ? JSON.parse(canvasConfigStr) : myFirebaseConfig;

let app, auth, db;
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "COLE_AQUI_SUA_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase Init Error:", e);
}

const appIdStr = typeof __app_id !== 'undefined' ? String(__app_id) : 'nomeacao-tech-prod';
const safeAppId = encodeURIComponent(appIdStr).replace(/\./g, '_'); 

const getStorage = (key, defaultValue) => {
  try { 
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (e) { return defaultValue; }
};
const setStorage = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} };

const initialConfig = { 
  appName: 'Nomeação.Tech',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png',
  userName: 'Futuro Nomeado',
  levelSound: 'mario',
  appTheme: 'default',
  concurso: 'Base de TI (Iniciantes)', 
  cargo: 'Tribunais', 
  banca: 'Principais (CEBRASPE, FCC, FGV)', 
  horasDia: 4,
  revBom: 7,
  revFacil: 15
};

// MOTOR DE TEMAS: Retrocompatível e 100% Cyberpunk/Dark Mode
export const THEMES = {
  default: {
    name: 'Azul Foco (Padrão)',
    sidebar: 'from-blue-700 to-indigo-900 dark:bg-[#0d1526]',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    activeTab: 'bg-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-white',
    icon: 'text-indigo-500 dark:text-indigo-500',
    bg: 'bg-indigo-500 dark:bg-indigo-500',
    lightBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    headerBg: 'bg-indigo-100/60 dark:bg-[#0d1526]', 
    border: 'border-indigo-200/60 dark:border-white/5',
    text: 'text-indigo-600 dark:text-indigo-400',
    solidText: 'text-white',
    
    primaryText: 'text-indigo-600 dark:text-indigo-400',
    brightText: 'text-indigo-500 dark:text-indigo-500',
    bgSolid: 'bg-indigo-500',
    bgHover: 'hover:bg-indigo-600',
    bgSuperLight: 'bg-indigo-50 dark:bg-indigo-500/10',
    borderLight: 'border-indigo-200 dark:border-indigo-500/20',
    borderSolid: 'border-indigo-500 dark:border-indigo-500',
    borderLeft: 'border-l-indigo-500 dark:border-l-indigo-500',
    ring: 'focus:ring-indigo-500 ring-indigo-500',
    shadow: 'shadow-indigo-500/20',
    shadowHover: 'hover:shadow-indigo-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]',
    iconGlow: 'shadow-[0_0_30px_rgba(99,102,241,0.15)]',
    confetti: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981']
  },
  esmeralda: {
    name: 'Esmeralda (Aprovação)',
    sidebar: 'from-emerald-700 to-teal-900 dark:bg-[#0d1526]',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    activeTab: 'bg-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-white',
    icon: 'text-emerald-500 dark:text-emerald-500',
    bg: 'bg-emerald-500 dark:bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    headerBg: 'bg-emerald-100/60 dark:bg-[#0d1526]', 
    border: 'border-emerald-200/60 dark:border-white/5',
    text: 'text-emerald-600 dark:text-emerald-400',
    solidText: 'text-white',
    
    primaryText: 'text-emerald-600 dark:text-emerald-400',
    brightText: 'text-emerald-500 dark:text-emerald-500',
    bgSolid: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    bgSuperLight: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderLight: 'border-emerald-200 dark:border-emerald-500/20',
    borderSolid: 'border-emerald-500 dark:border-emerald-500',
    borderLeft: 'border-l-emerald-500 dark:border-l-emerald-500',
    ring: 'focus:ring-emerald-500 ring-emerald-500',
    shadow: 'shadow-emerald-500/20',
    shadowHover: 'hover:shadow-emerald-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    iconGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    confetti: ['#10b981', '#34d399', '#059669', '#3b82f6']
  },
  caveira: {
    name: 'Caveira (Laranja Tático)',
    sidebar: 'from-slate-900 to-black dark:bg-[#0d1526]',
    button: 'bg-orange-500 hover:bg-orange-600 text-slate-900 font-bold',
    activeTab: 'bg-orange-500 dark:bg-orange-500/10 dark:text-orange-400 text-slate-900 font-black',
    icon: 'text-orange-500 dark:text-orange-500',
    bg: 'bg-orange-500 dark:bg-orange-500',
    lightBg: 'bg-orange-50 dark:bg-orange-500/10',
    headerBg: 'bg-orange-100/60 dark:bg-[#0d1526]', 
    border: 'border-orange-200/60 dark:border-white/5',
    text: 'text-orange-600 dark:text-orange-400',
    solidText: 'text-slate-900 font-black',

    primaryText: 'text-orange-600 dark:text-orange-400',
    brightText: 'text-orange-500 dark:text-orange-500',
    bgSolid: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    bgSuperLight: 'bg-orange-50 dark:bg-orange-500/10',
    borderLight: 'border-orange-200 dark:border-orange-500/20',
    borderSolid: 'border-orange-500 dark:border-orange-500',
    borderLeft: 'border-l-orange-500 dark:border-l-orange-500',
    ring: 'focus:ring-orange-500 ring-orange-500',
    shadow: 'shadow-orange-500/20',
    shadowHover: 'hover:shadow-orange-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]',
    iconGlow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
    confetti: ['#f97316', '#f59e0b', '#ef4444', '#eab308']
  },
  retaFinal: {
    name: 'Reta Final (Vermelho Alerta)',
    sidebar: 'from-red-700 to-rose-900 dark:bg-[#0d1526]',
    button: 'bg-rose-600 hover:bg-rose-700 text-white',
    activeTab: 'bg-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-white',
    icon: 'text-rose-500 dark:text-rose-500',
    bg: 'bg-rose-500 dark:bg-rose-500',
    lightBg: 'bg-rose-50 dark:bg-rose-500/10',
    headerBg: 'bg-rose-100/60 dark:bg-[#0d1526]', 
    border: 'border-rose-200/60 dark:border-white/5',
    text: 'text-rose-600 dark:text-rose-400',
    solidText: 'text-white',

    primaryText: 'text-rose-600 dark:text-rose-400',
    brightText: 'text-rose-500 dark:text-rose-500',
    bgSolid: 'bg-rose-500',
    bgHover: 'hover:bg-rose-600',
    bgSuperLight: 'bg-rose-50 dark:bg-rose-500/10',
    borderLight: 'border-rose-200 dark:border-rose-500/20',
    borderSolid: 'border-rose-500 dark:border-rose-500',
    borderLeft: 'border-l-rose-500 dark:border-l-rose-500',
    ring: 'focus:ring-rose-500 ring-rose-500',
    shadow: 'shadow-rose-500/20',
    shadowHover: 'hover:shadow-rose-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]',
    iconGlow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    confetti: ['#f43f5e', '#e11d48', '#be123c', '#fb7185']
  }
};

const playLevelUpSound = (soundType) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, type, startTime, duration, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    if (soundType === 'mario') {
      playTone(987.77, 'square', 0, 0.1, 0.1);    
      playTone(1318.51, 'square', 0.1, 0.4, 0.1); 
    } else if (soundType === 'arcade') {
      const notes = [330, 440, 554, 659, 880];
      notes.forEach((f, i) => playTone(f, 'square', i * 0.08, 0.2, 0.08));
    } else if (soundType === 'modern') {
      playTone(659.25, 'sine', 0, 0.15, 0.3);
      playTone(1318.51, 'sine', 0.15, 0.4, 0.3);
    } else if (soundType === 'epic') {
      playTone(392.00, 'triangle', 0, 0.15, 0.3); 
      playTone(392.00, 'triangle', 0.15, 0.15, 0.3); 
      playTone(392.00, 'triangle', 0.30, 0.15, 0.3); 
      playTone(523.25, 'triangle', 0.45, 0.6, 0.4);  
      playTone(392.00, 'triangle', 0.80, 0.15, 0.3); 
      playTone(523.25, 'triangle', 0.95, 0.8, 0.4);  
    } else { 
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((f, i) => playTone(f, 'sine', i * 0.08, 0.8, 0.2));
    }
  } catch (e) { console.warn('Áudio não suportado.', e); }
};

const initialEdital = [
  {
    id: 'bloco-gerais', nome: 'Conhecimentos Gerais (Base)', icone: 'Layers',
    disciplinas: [
      { id: 'port', nome: 'Língua Portuguesa', cor: 'text-rose-700 bg-rose-100', 
        assuntos: [{ id: 'port_1', titulo: 'Compreensão de Textos', temp: '🔥 QUENTE', linkTec: '', indent: 0 }] 
      }
    ]
  }
];

export const LEVELS_MAP = [
  { nivel: 1, titulo: 'Sobrevivente', min: 0, max: 100 },
  { nivel: 2, titulo: 'Aspirante a TI', min: 100, max: 300 },
  { nivel: 3, titulo: 'Fundação Sólida', min: 300, max: 600 },
  { nivel: 4, titulo: 'Caçador de Bancas', min: 600, max: 1000 },
  { nivel: 5, titulo: 'Mestre da Base', min: 1000, max: 2000 },
  { nivel: 6, titulo: 'Estrategista', min: 2000, max: 4000 },
  { nivel: 7, titulo: 'Futuro Nomeado', min: 4000, max: 10000 }
];

// ==========================================
// COMPONENTES ISOLADOS E OTIMIZADOS
// ==========================================

const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction, themeColors }) => (
  <div className="bg-white dark:bg-[#111e36] border border-slate-200 dark:border-white/5 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center mt-8 shadow-sm">
    <div className={`w-20 h-20 ${themeColors.bgSuperLight} rounded-full flex items-center justify-center mb-6 ${themeColors.iconGlow}`}>
      <Icon className={`w-10 h-10 ${themeColors.brightText}`} />
    </div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-base text-slate-500 dark:text-white/40 mb-8 text-center max-w-sm">{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className={`${themeColors.bgSolid} ${themeColors.bgHover} text-white px-8 py-3.5 rounded-xl text-sm font-bold cursor-pointer transition-all shadow-lg ${themeColors.shadowHover}`}>
        {actionLabel}
      </button>
    )}
  </div>
);

const SectionHeader = ({ overline, title, subtitle, icon: Icon, extra, themeColors }) => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200/60 dark:border-white/5 pb-5 gap-4">
    <div>
      {overline && <span className={`text-[10px] font-black ${themeColors.brightText} tracking-widest uppercase mb-1.5 block`}>{overline}</span>}
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
        {Icon && <Icon className={`w-8 h-8 ${themeColors.brightText}`} />}
        {title}
      </h2>
      {subtitle && <p className="text-slate-500 dark:text-white/30 mt-2 text-base font-medium">{subtitle}</p>}
    </div>
    {extra && <div className="w-full md:w-auto">{extra}</div>}
  </header>
);

function PomodoroWidget({ themeColors, handleAutoLog, addXP, triggerConfetti }) {
  const FOCUS_TIME = 50 * 60; 
  const BREAK_TIME = 10 * 60; 
  const [pomodoroTime, setPomodoroTime] = useState(FOCUS_TIME);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const [isPomodoroBreak, setIsPomodoroBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isPomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => { setPomodoroTime((time) => time - 1); }, 1000);
    } else if (isPomodoroActive && pomodoroTime === 0) {
      if (!isPomodoroBreak) {
         handleAutoLog(50 / 60); 
         addXP(20);
         triggerConfetti(); 
         setIsPomodoroBreak(true);
         setPomodoroTime(BREAK_TIME);
      } else {
         setIsPomodoroBreak(false);
         setPomodoroTime(FOCUS_TIME);
         setIsPomodoroActive(false);
      }
    }
    return () => clearInterval(interval);
  }, [isPomodoroActive, pomodoroTime, isPomodoroBreak, handleAutoLog, addXP, triggerConfetti]);

  const togglePomodoro = () => setIsPomodoroActive(!isPomodoroActive);
  const resetPomodoro = () => { setIsPomodoroActive(false); setIsPomodoroBreak(false); setPomodoroTime(FOCUS_TIME); };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalTime = isPomodoroBreak ? BREAK_TIME : FOCUS_TIME;
  const progressPerc = ((totalTime - pomodoroTime) / totalTime) * 100;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPerc / 100) * circumference;

  return (
    <div className="flex items-center justify-between bg-white dark:bg-[#111e36] border border-slate-200/60 dark:border-white/5 p-5 rounded-3xl shadow-sm mb-8">
       <div className="flex items-center gap-5">
         
         <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-white/5" />
              <circle 
                cx="40" cy="40" r={radius} 
                stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray={circumference} strokeDashoffset={offset} 
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-linear ${isPomodoroActive && !isPomodoroBreak ? `${themeColors.brightText} ${themeColors.glow}` : isPomodoroBreak ? 'text-emerald-500' : 'text-slate-300 dark:text-white/20'}`} 
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center ${isPomodoroActive && !isPomodoroBreak ? 'animate-pulse' : ''}`}>
               {isPomodoroBreak ? <Coffee className="w-6 h-6 text-emerald-500" /> : <Clock className={`w-6 h-6 ${isPomodoroActive ? themeColors.brightText : 'text-slate-400 dark:text-slate-500'}`} />}
            </div>
         </div>

         <div>
           <h3 className="font-extrabold text-lg text-slate-800 dark:text-white leading-none mb-1.5">{isPomodoroBreak ? 'Pausa Ativa' : 'Foco Profundo'}</h3>
           <span className="text-sm text-slate-500 dark:text-white/40 font-medium">50min Foco / 10min Pausa</span>
         </div>
       </div>
       
       <div className="flex items-center gap-6 pr-4">
         <span className={`font-mono text-5xl font-black tracking-tighter w-36 text-center tabular-nums ${isPomodoroActive && !isPomodoroBreak ? themeColors.brightText : isPomodoroBreak ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
           {formatTime(pomodoroTime)}
         </span>
         <div className="flex gap-3">
           <button onClick={togglePomodoro} className={`p-4 rounded-2xl shadow-lg transition-all hover:scale-105 cursor-pointer ${isPomodoroActive ? 'bg-slate-800 text-white dark:bg-white/10 dark:hover:bg-white/20' : `${themeColors.bgSolid} ${themeColors.bgHover} text-white ${themeColors.shadow}`}`}>
             {isPomodoroActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
           </button>
           <button onClick={resetPomodoro} className="p-4 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-white/60 rounded-2xl transition-all hover:scale-105 cursor-pointer" title="Reiniciar">
             <RefreshCcw className="w-6 h-6" />
           </button>
         </div>
       </div>
    </div>
  );
}

const CircularProgress = ({ percent, themeColors }) => {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const colorClass = percent === 100 ? 'text-emerald-500' : themeColors.primaryText;

  return (
    <div className="relative flex items-center justify-center w-6 h-6 shrink-0 opacity-80">
      <svg className="w-6 h-6 transform -rotate-90">
        <circle cx="12" cy="12" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-200 dark:text-white/10" />
        <circle cx="12" cy="12" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`transition-all duration-1000 ${colorClass}`} />
      </svg>
      {percent === 100 && <div className="absolute w-3.5 h-3.5 bg-white dark:bg-[#0d1526] rounded-full flex items-center justify-center"><CheckCircle className={`w-3.5 h-3.5 text-emerald-500 bg-white dark:bg-[#0d1526] rounded-full`} /></div>}
    </div>
  );
};

const ModalEditor = ({ assunto, onSave, onCancel, themeColors }) => {
  const [titulo, setTitulo] = useState(assunto.titulo || '');
  const [link, setLink] = useState(assunto.linkTec || '');
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 dark:bg-[#0d1526]/80 backdrop-blur-sm animate-in fade-in p-4">
      <div className="bg-white dark:bg-[#111e36] p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md animate-in zoom-in-95">
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-5">Editar Assunto</h3>
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase ml-1 tracking-widest">Título do Assunto</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className={`w-full p-3.5 text-sm rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} mt-1 transition-colors`} placeholder="Ex: Atributos do Ato Administrativo" autoFocus />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase ml-1 tracking-widest">Link de Questões (Opcional)</label>
            <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className={`w-full p-3.5 text-sm rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} mt-1 transition-colors`} placeholder="https://tecconcursos..." />
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={() => onSave(titulo, link)} className={`${themeColors.bgSolid} ${themeColors.bgHover} text-white px-5 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer w-full`}>Guardar</button>
          <button onClick={onCancel} className="bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:dark:bg-white/10 px-5 py-3.5 rounded-xl text-sm font-bold transition-colors cursor-pointer w-full">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const ConfettiOverlay = ({ fire, themeColors }) => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (fire > 0) {
      const colors = themeColors?.confetti || ['#f97316', '#f59e0b', '#10b981', '#3b82f6'];
      const newParticles = Array.from({ length: 120 }).map((_, i) => ({
        id: i, left: Math.random() * 100, delay: Math.random() * 0.5, duration: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)], size: 6 + Math.random() * 10, tilt: Math.random() * 360
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [fire, themeColors]);

  if (particles.length === 0) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style>{`@keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg) skewX(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg) skewX(45deg); opacity: 0; } }`}</style>
      {particles.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.left}%`, top: '-10%', width: `${p.size}px`, height: `${p.size * 1.5}px`, backgroundColor: p.color, animation: `confetti-fall ${p.duration}s cubic-bezier(.37,0,.63,1) forwards ${p.delay}s`, transform: `rotate(${p.tilt}deg)` }} />
      ))}
    </div>
  );
};

const LevelUpModal = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/80 dark:bg-[#0d1526]/90 backdrop-blur-md animate-in fade-in duration-300 px-4">
      <div className="bg-white dark:bg-[#111e36] p-8 md:p-12 rounded-[2rem] shadow-2xl border border-amber-500/30 max-w-sm w-full text-center transform transition-all animate-in zoom-in-90 duration-500 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 animate-spin-slow pointer-events-none" style={{ animationDuration: '20s' }}>
           <div className="w-[150%] h-32 bg-amber-500 absolute rotate-0 blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="w-32 h-32 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(245,158,11,0.2)] border border-amber-200 dark:border-amber-500/20">
            <Award className="w-16 h-16 text-amber-500" />
          </div>
          <h2 className="text-5xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">Nível {data.nivel}!</h2>
          <p className="text-slate-500 dark:text-white/50 mb-8 font-medium">A sua consistência foi recompensada.</p>
          <div className="bg-slate-50 dark:bg-[#0d1526] p-5 rounded-2xl border border-slate-200 dark:border-white/5 mb-8">
            <span className="block text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1.5">Nova Patente</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{data.titulo}</span>
          </div>
          <button onClick={onClose} className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black transition-all shadow-lg hover:shadow-orange-500/30 text-lg flex items-center justify-center gap-2 cursor-pointer">
            <PartyPopper className="w-5 h-5"/> Continuar Foco
          </button>
        </div>
      </div>
    </div>
  );
};

const LevelMapModal = ({ onClose, currentXp }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/80 dark:bg-[#0d1526]/80 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div className="bg-white dark:bg-[#111e36] p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full cursor-pointer transition-colors"><X className="w-5 h-5"/></button>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Trophy className="text-amber-500 w-7 h-7"/> Jornada de Aprovação</h3>
        <p className="text-sm text-slate-500 dark:text-white/40 mb-8">Acompanhe os níveis e a experiência (XP) necessária.</p>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {LEVELS_MAP.map(lvl => {
            const isCurrent = currentXp >= lvl.min && currentXp < lvl.max;
            const isPast = currentXp >= lvl.max;
            return (
              <div key={lvl.nivel} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isCurrent ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/20 shadow-sm' : isPast ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 opacity-80' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-transparent opacity-50'}`}>
                <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black text-lg ${isCurrent ? 'bg-amber-500 text-white' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-[#0d1526] text-slate-400 dark:text-white/30 border dark:border-white/5'}`}>
                  {isPast ? <CheckCircle className="w-6 h-6"/> : lvl.nivel}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-lg leading-tight mb-0.5 ${isCurrent ? 'text-amber-700 dark:text-amber-400' : isPast ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-white/60'}`}>{lvl.titulo}</h4>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/40 tracking-wider">{lvl.min} a {lvl.max} XP</p>
                </div>
                {isCurrent && <div className="text-[10px] font-black uppercase text-amber-500 bg-white dark:bg-[#0d1526] px-2.5 py-1 rounded border border-amber-200 dark:border-amber-500/20">Atual</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TELA DE AUTENTICAÇÃO (LOGIN/REGISTO)
// ==========================================
const AuthScreen = ({ auth, themeColors }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!isLogin && accessCode !== 'APROVADO2026') {
      setError('Código de convite inválido. Acesso restrito ao Comandante.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.message.includes('auth/invalid-credential')) {
        setError('E-mail ou palavra-passe incorretos.');
      } else if (err.message.includes('email-already-in-use')) {
        setError('Este e-mail já possui uma conta. Faça login.');
      } else if (err.message.includes('weak-password')) {
        setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro ao conectar à Nuvem.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1526] flex flex-col items-center justify-center p-4 text-slate-200 animate-in fade-in">
      <div className="bg-[#111e36] p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-white/5 relative overflow-hidden">
        
        <div className={`w-20 h-20 ${themeColors.bgSuperLight} ${themeColors.brightText} flex items-center justify-center rounded-full mx-auto mb-6`}>
          <Lock className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">Nomeação.Tech</h2>
        <p className="text-white/40 text-center mb-10 text-sm px-4">
          {isLogin ? 'Faça login para sincronizar a sua Trilha e Sprints em qualquer dispositivo.' : 'Crie a sua conta gratuita para salvar os seus estudos na Nuvem.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block ml-1">O seu E-mail</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)} 
              className={`w-full p-4 rounded-xl bg-[#0d1526] border border-white/5 text-white outline-none ${themeColors.ring} transition-colors shadow-inner`} 
              placeholder="estudante@concursos.com" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block ml-1">Palavra-passe</label>
            <input 
              type="password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)} 
              className={`w-full p-4 rounded-xl bg-[#0d1526] border border-white/5 text-white outline-none ${themeColors.ring} transition-colors shadow-inner font-black tracking-widest`} 
              placeholder="••••••••" 
            />
          </div>
          
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className={`text-[10px] font-bold uppercase tracking-widest ${themeColors.brightText} mb-2 block ml-1 flex items-center gap-1.5`}><ShieldAlert className="w-3.5 h-3.5"/> Código de Convite</label>
              <input 
                type="text" required={!isLogin} value={accessCode} onChange={e => setAccessCode(e.target.value)} 
                className={`w-full p-4 rounded-xl bg-[#0d1526] border ${themeColors.borderLight} ${themeColors.brightText} outline-none ${themeColors.ring} transition-colors shadow-inner font-black tracking-widest uppercase`} 
                placeholder="Insira o código secreto..." 
              />
            </div>
          )}
          
          {error && <p className="text-red-400 text-sm font-bold bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3"><AlertTriangle className="w-5 h-5 shrink-0"/>{error}</p>}

          <button type="submit" disabled={loading} className={`w-full ${themeColors.bgSolid} ${themeColors.bgHover} text-white font-black py-4 rounded-xl transition-all mt-6 shadow-lg ${themeColors.shadowHover} disabled:opacity-50 cursor-pointer`}>
            {loading ? 'A conectar...' : (isLogin ? 'Entrar no Sistema' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-6">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm font-bold text-white/40 hover:text-white transition-colors cursor-pointer">
            {isLogin ? 'Não tem conta? Clique para criar' : 'Já tem conta? Clique para entrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ABA DASHBOARD / CENTRO DE COMANDO
// ==========================================
function TabDashboard({ config, progressPerc, gamification, setGamification, dailyLogs, setDailyLogs, userLevel, themeColors, reviewStats, dailyReviewStats, edital, activeSubjectIds, userProgress, pendingReviewsCount, setActiveTab, customSprint }) {
  const today = new Date().toLocaleDateString();
  const todayHours = dailyLogs[today] || 0;
  
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [editHoursValue, setEditHoursValue] = useState(todayHours);

  useEffect(() => {
    setEditHoursValue(todayHours);
  }, [todayHours]);

  const handleSaveHours = () => {
    const val = parseFloat(editHoursValue);
    if (!isNaN(val) && val >= 0) {
      setDailyLogs(prev => ({ ...prev, [today]: val }));
      if (val >= config.horasDia && gamification.lastActiveDate !== today) {
        setGamification(prev => ({ ...prev, streak: prev.streak + 1, lastActiveDate: today }));
      }
    }
    setIsEditingHours(false);
  };

  const radarData = [];
  edital.forEach(b => b.disciplinas.forEach(d => {
    const totalDisc = d.assuntos.length; if (totalDisc === 0) return;
    let completedDisc = 0;
    d.assuntos.forEach(a => { const p = userProgress[a.id]; if (p?.estudado) completedDisc++; if (p?.questoes) completedDisc++; if (p?.revisado) completedDisc++; });
    const percDisc = Math.round((completedDisc / (totalDisc * 3)) * 100);
    radarData.push({ id: d.id, nome: d.nome, perc: percDisc, cor: d.cor });
  }));

  const todayObj = new Date(); todayObj.setHours(23, 59, 59, 999);
  const currentDayOfWeek = todayObj.getDay();
  const daysToLookBack = (16 * 7) + currentDayOfWeek; 
  const heatmapDays = [];
  for (let i = daysToLookBack; i >= 0; i--) {
    const d = new Date(todayObj); d.setDate(todayObj.getDate() - i);
    const dateStr = d.toLocaleDateString(); const hours = dailyLogs[dateStr] || 0;
    let colorClass = 'bg-slate-100 dark:bg-[#0d1526] border border-transparent dark:border-white/5'; 
    if (hours > 0 && hours < config.horasDia * 0.5) colorClass = 'bg-emerald-200 dark:bg-emerald-900/40';
    else if (hours >= config.horasDia * 0.5 && hours < config.horasDia) colorClass = 'bg-emerald-300 dark:bg-emerald-800/60';
    else if (hours >= config.horasDia && hours < config.horasDia * 1.5) colorClass = 'bg-emerald-500 dark:bg-emerald-500';
    else if (hours >= config.horasDia * 1.5) colorClass = 'bg-emerald-700 dark:bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)] scale-[1.05] z-10'; 
    heatmapDays.push({ date: dateStr, hours, colorClass });
  }

  const last14Days = Array.from({length: 14}).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return { dateObj: d, dateStr: d.toLocaleDateString(), dayLabel: d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase() };
  }).reverse(); 
  
  const maxHoursLogged = Math.max(...last14Days.map(d => dailyLogs[d.dateStr] || 0));
  const maxHours = Math.max(maxHoursLogged, config.horasDia * 1.2, 2); 
  const avgHours = (last14Days.reduce((acc, curr) => acc + (dailyLogs[curr.dateStr] || 0), 0) / 14).toFixed(1);

  const lineChartPoints = last14Days.map(day => {
    const stats = dailyReviewStats[day.dateStr];
    let rate = 0;
    if (stats) {
      const total = (stats.facil || 0) + (stats.bom || 0) + (stats.dificil || 0);
      if (total > 0) rate = (((stats.facil || 0) + (stats.bom || 0)) / total) * 100;
    }
    return rate;
  });
  
  const xStep = 100 / 13;
  const polylineStr = lineChartPoints.map((val, idx) => `${idx * xStep},${100 - val}`).join(' ');

  const totalReviews = reviewStats?.facil + reviewStats?.bom + reviewStats?.dificil || 0;
  const successRate = totalReviews > 0 ? (((reviewStats.facil + reviewStats.bom) / totalReviews) * 100).toFixed(1) : 0;

  // Lógica Dinâmica da Saudação e Status
  const formattedDate = new Intl.DateTimeFormat('pt-PT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).replace(/\./g, '');
  
  const hour = new Date().getHours();
  let greeting = 'Boa noite';
  if (hour >= 5 && hour < 12) greeting = 'Bom dia';
  else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
  
  const firstName = config.userName ? config.userName.split(' ')[0] : 'Concurseiro';

  const activeSprintItems = customSprint?.slice(0, 2) || [];
  
  let statusText = '';
  if (pendingReviewsCount > 0 && activeSprintItems.length > 0) {
     statusText = `Você tem ${pendingReviewsCount} revisão(ões) em atraso e ${activeSprintItems.length} matéria(s) na Mesa de Foco.`;
  } else if (pendingReviewsCount > 0) {
     statusText = `Você tem ${pendingReviewsCount} avaliação(ões) em atraso na sua memória.`;
  } else if (activeSprintItems.length > 0) {
     statusText = `A sua memória está blindada! Você tem ${activeSprintItems.length} matéria(s) na Mesa de Foco hoje.`;
  } else {
     statusText = `Tudo limpo! A sua memória está em dia e não há missões ativas.`;
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      
      {/* NOVO CABEÇALHO PERSONALIZADO E NEXT ACTION CARD */}
      <div className="mb-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>Painel</span> <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20"></span> <span>{formattedDate.toUpperCase()}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">
              {greeting}, {firstName}.
            </h2>
            <p className="text-base text-slate-500 dark:text-white/60 font-medium">
              {statusText}
            </p>
          </div>
          
          <div className={`hidden md:flex border ${themeColors.borderLight} rounded-2xl p-4 flex-col items-center justify-center ${themeColors.bgSuperLight} shadow-sm min-w-[120px]`}>
            <span className={`text-[10px] font-black ${themeColors.brightText} tracking-widest uppercase mb-1`}>Progresso</span>
            <span className={`text-3xl font-black ${themeColors.brightText} leading-none`}>{progressPerc}%</span>
          </div>
        </div>

        {/* CARTÃO DE PRÓXIMA AÇÃO (Next Action) */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-6 md:p-8 border border-slate-200/60 dark:border-white/5 shadow-sm relative overflow-hidden group">
          {/* Decoração sutil de fundo */}
          <div className="absolute right-0 top-0 opacity-5 dark:opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             {pendingReviewsCount > 0 ? <BrainCircuit className="w-64 h-64 text-red-500" /> : activeSprintItems.length > 0 ? <Target className={`w-64 h-64 ${themeColors.brightText}`} /> : <CheckCircle className="w-64 h-64 text-emerald-500" />}
          </div>

          {pendingReviewsCount > 0 ? (
            <div className="relative z-10">
              <span className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest mb-3"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> REVISÕES CRÍTICAS</span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Limpar Motor de Revisão</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 mb-6 max-w-lg">O algoritmo detetou tópicos evaporando da sua memória de longo prazo. Recupere-os antes de avançar.</p>
              <button onClick={() => setActiveTab('revisoes')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center">
                Iniciar Revisões <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : activeSprintItems.length > 0 ? (
            <div className="relative z-10">
              <span className={`flex items-center gap-2 text-[10px] font-black ${themeColors.brightText} uppercase tracking-widest mb-3`}><div className={`w-2 h-2 rounded-full ${themeColors.bgSolid} animate-pulse`}></div> SPRINT DO DIA</span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 truncate max-w-2xl">{activeSprintItems.map(i => i.assTitulo).join(' • ')}</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 mb-6 max-w-lg">A sua mesa de foco está configurada. Entre na zona e cumpra as missões de hoje.</p>
              <button onClick={() => setActiveTab('cronograma')} className={`${themeColors.bgSolid} ${themeColors.bgHover} text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${themeColors.shadowHover} flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center`}>
                Entrar na Mesa de Foco <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative z-10">
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> MISSÃO CUMPRIDA</span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ofensiva Diária Garantida</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 mb-6 max-w-lg">Não há missões pendentes. Planeje os próximos passos para manter a consistência.</p>
              <button onClick={() => setActiveTab('planner')} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center border border-slate-200 dark:border-white/10">
                Planejar Próxima Semana <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LINHA 1: KPIs PREMIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cartão 1: Domínio */}
        <div className={`bg-white dark:bg-[#111e36] rounded-[2rem] p-6 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col relative overflow-hidden border-l-4 ${themeColors.borderLeft}`}>
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-black text-slate-500 dark:text-white/40 uppercase tracking-widest mt-1">Domínio da Trilha</p>
            <div className={`p-2.5 rounded-xl border ${themeColors.borderLight} ${themeColors.bgSuperLight}`}>
              <TrendingUp className={`w-5 h-5 ${themeColors.brightText}`}/>
            </div>
          </div>
          <div className="flex-1 flex items-baseline gap-1 mt-2">
            <span className="text-5xl font-black text-slate-800 dark:text-white leading-none">{progressPerc}</span>
            <span className="text-2xl font-black text-slate-400 dark:text-white/30">%</span>
          </div>
          <div className="mt-8">
            <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0d1526] rounded-full overflow-hidden mb-3">
              <div className={`h-full ${themeColors.bgSolid} transition-all duration-1000`} style={{ width: `${progressPerc}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-wide">do edital dominado</p>
          </div>
        </div>

        {/* Cartão 2: Horas (Fixo Sky Blue para Semântica SaaS) */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-6 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col relative overflow-hidden border-l-4 border-l-sky-500 dark:border-l-sky-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-black text-slate-500 dark:text-white/40 uppercase tracking-widest mt-1">Horas de Hoje</p>
            <div className="p-2.5 rounded-xl border border-sky-200 dark:border-sky-500/20 bg-sky-50/50 dark:bg-sky-500/5">
              <Clock className="w-5 h-5 text-sky-500"/>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-2 mt-2 relative min-h-[48px]">
            {isEditingHours ? (
              <div className="flex items-center gap-1">
                <input 
                  type="number" step="0.5" min="0" autoFocus 
                  value={editHoursValue} onChange={e => setEditHoursValue(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSaveHours()} onBlur={handleSaveHours} 
                  className="w-24 text-5xl font-black text-slate-800 dark:text-white bg-transparent border-b-2 border-sky-500 outline-none pb-1" 
                />
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5 group cursor-pointer" onClick={() => setIsEditingHours(true)} title="Editar horas manuais">
                <span className="text-5xl font-black text-slate-800 dark:text-white leading-none transition-colors group-hover:text-sky-500">{todayHours.toFixed(1)}</span>
                <span className="text-lg font-bold text-slate-400 dark:text-white/30">/ {config.horasDia}h</span>
                <Pencil className="w-4 h-4 text-slate-300 dark:text-white/20 group-hover:text-sky-500 opacity-0 group-hover:opacity-100 transition-all ml-1 mb-1" />
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0d1526] rounded-full overflow-hidden mb-3">
              <div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: `${Math.min((todayHours / config.horasDia) * 100, 100)}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-wide">meta diária: {config.horasDia}h</p>
          </div>
        </div>

        {/* Cartão 3: XP (Fixo Amber para Semântica SaaS) */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-6 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col relative overflow-hidden border-l-4 border-l-amber-500 dark:border-l-amber-500">
          <Trophy className="absolute -right-6 -bottom-6 w-40 h-40 text-slate-50 dark:text-white/[0.02] pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-xs font-black text-slate-500 dark:text-white/40 uppercase tracking-widest mt-1">XP Acumulado</p>
            <div className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5">
              <Award className="w-5 h-5 text-amber-500"/>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center mt-2 relative z-10">
            <span className="text-5xl font-black text-amber-500 leading-none drop-shadow-sm">{gamification.xp.toLocaleString()}</span>
          </div>
          
          <div className="mt-8 flex items-center gap-3 relative z-10">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1.5 rounded-lg">
              <Flame className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black tracking-widest">{gamification.streak} dias</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-wide">Nível {userLevel.nivel} · {userLevel.titulo}</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-8 border border-slate-200/60 dark:border-white/5 shadow-sm flex flex-col h-full min-h-[300px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><BarChart2 className={`w-5 h-5 text-sky-500`}/> Esforço Diário</h3>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-1">Média últimos 14d: <strong className="text-slate-700 dark:text-white">{avgHours}h/dia</strong></p>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 mt-auto pt-4 relative">
            <div className="absolute w-full border-t border-dashed border-sky-500/30 flex items-center justify-end pr-1" style={{ bottom: `${(config.horasDia / maxHours) * 100}%` }}>
              <span className="text-[10px] font-bold text-sky-500 bg-white dark:bg-[#111e36] px-1.5 -translate-y-1/2">Meta: {config.horasDia}h</span>
            </div>
            {last14Days.map((day, i) => {
              const hours = dailyLogs[day.dateStr] || 0;
              const heightPerc = (hours / maxHours) * 100;
              const isToday = i === 13;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <div className="w-full h-40 flex items-end justify-center relative">
                    <div className={`w-full max-w-[24px] rounded-t-lg transition-all duration-700 ease-out hover:opacity-80 ${isToday ? 'bg-sky-500' : 'bg-slate-100 dark:bg-[#0d1526] border dark:border-white/5'} relative`} style={{ height: `${heightPerc}%`, minHeight: hours > 0 ? '8px' : '0' }}>
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black px-2 py-1 rounded pointer-events-none transition-opacity z-10 shadow-sm">{hours > 0 ? `${hours}h` : '0h'}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black mt-3 uppercase ${isToday ? 'text-sky-500' : 'text-slate-400 dark:text-white/30'}`}>{day.dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* UX 3: Evolução da Retenção */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-8 border border-slate-200/60 dark:border-white/5 shadow-sm flex flex-col h-full min-h-[300px]">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-1"><BrainCircuit className="w-5 h-5 text-emerald-500"/> Retenção de Memória</h3>
          <p className="text-xs text-slate-500 dark:text-white/40 mb-8 flex justify-between">
            <span>Gráfico de Evolução (Últimos 14 Dias).</span>
            <span className="font-bold text-emerald-500">Precisão Total: {successRate}%</span>
          </p>
          
          {totalReviews === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-white/20 text-sm">
              <PieChart className="w-12 h-12 mb-4 opacity-30"/>
              <p>Faça revisões para gerar o gráfico.</p>
            </div>
          ) : (
            <div className="flex flex-col flex-1 relative">
               <div className="flex-1 relative w-full h-full">
                 {/* Y Axis Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between">
                    <div className="w-full border-t border-dashed border-slate-100 dark:border-white/5 flex justify-start"><span className="text-[9px] font-bold text-slate-400 dark:text-white/30 -translate-y-1/2 bg-white dark:bg-[#111e36] pr-2">100%</span></div>
                    <div className="w-full border-t border-dashed border-slate-100 dark:border-white/5 flex justify-start"><span className="text-[9px] font-bold text-slate-400 dark:text-white/30 -translate-y-1/2 bg-white dark:bg-[#111e36] pr-2">50%</span></div>
                    <div className="w-full border-t border-dashed border-slate-100 dark:border-white/5 flex justify-start"><span className="text-[9px] font-bold text-slate-400 dark:text-white/30 -translate-y-1/2 bg-white dark:bg-[#111e36] pr-2">0%</span></div>
                 </div>
                 
                 {/* The Line Chart SVG */}
                 <div className="absolute inset-0 pt-2 pb-2 pl-8">
                   <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      <polyline 
                        points={polylineStr}
                        fill="none" 
                        stroke="url(#lineGradient)" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="drop-shadow-[0_4px_6px_rgba(16,185,129,0.4)]"
                      />
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      {/* Dots on the line */}
                      {lineChartPoints.map((val, idx) => {
                         if (val === 0) return null; // Skip days with no data
                         return (
                           <circle 
                              key={idx} 
                              cx={idx * xStep} 
                              cy={100 - val} 
                              r="2" 
                              fill="white" 
                              stroke="#10b981" 
                              strokeWidth="1.5" 
                           >
                              <title>Dia {last14Days[idx].dateStr}: {val.toFixed(1)}%</title>
                           </circle>
                         );
                      })}
                   </svg>
                 </div>
               </div>
               
               {/* X Axis Labels */}
               <div className="flex justify-between mt-4 text-[9px] font-black text-slate-400 dark:text-white/30 pl-8">
                 {last14Days.map((d, i) => (
                    i % 2 === 0 ? <span key={i} className={i === 13 ? "text-emerald-500" : ""}>{d.dayLabel}</span> : <span key={i}></span>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-8 border border-slate-200/60 dark:border-white/5 shadow-sm flex flex-col h-full min-h-[300px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-3">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><CalendarDays className="w-5 h-5 text-emerald-500"/> Mapa de Constância</h3>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-1">Últimos 3 meses.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">
              <span>Menos</span>
              <div className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-[#0d1526] border dark:border-white/5"></div>
              <div className="w-3.5 h-3.5 rounded bg-emerald-200 dark:bg-emerald-900/40"></div>
              <div className="w-3.5 h-3.5 rounded bg-emerald-300 dark:bg-emerald-800/60"></div>
              <div className="w-3.5 h-3.5 rounded bg-emerald-500 dark:bg-emerald-500"></div>
              <div className="w-3.5 h-3.5 rounded bg-emerald-700 dark:bg-emerald-400"></div>
              <span>Mais</span>
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar pb-2 flex-1 flex items-center">
            <div className="min-w-max flex gap-2 mx-auto">
              <div className="grid grid-rows-7 gap-1.5 text-[10px] font-black text-slate-400 dark:text-white/30 pr-3 text-right">
                <div className="h-4 flex items-center justify-end">D</div><div className="h-4 flex items-center justify-end">S</div><div className="h-4 flex items-center justify-end">T</div><div className="h-4 flex items-center justify-end">Q</div><div className="h-4 flex items-center justify-end">Q</div><div className="h-4 flex items-center justify-end">S</div><div className="h-4 flex items-center justify-end">S</div>
              </div>
              <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                {heatmapDays.map((day, idx) => (<div key={idx} title={`${day.date}: ${day.hours.toFixed(1)}h estudadas`} className={`w-4 h-4 rounded transition-all hover:scale-125 cursor-pointer relative ${day.colorClass}`}></div>))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-white/5 p-8 flex flex-col h-full max-h-[320px]">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2 shrink-0"><Filter className={`w-5 h-5 ${themeColors.brightText}`}/> Raio-X por Disciplina</h3>
          <div className="space-y-5 flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {radarData.length === 0 ? <div className="text-sm text-slate-400 dark:text-white/30 flex items-center justify-center h-full">Nenhuma disciplina cadastrada.</div> : radarData.map(disc => (
              <div key={disc.id} className="group">
                <div className="flex justify-between items-end mb-2.5">
                  <span className={`text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-3 group-hover:${themeColors.brightText} transition-colors`}>{disc.nome}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white shrink-0 tabular-nums">{disc.perc}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-[#0d1526] rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 rounded-full ${disc.perc === 100 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : themeColors.bgSolid}`} style={{width: `${disc.perc}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABA 1: EDITAL VERTICALIZADO (LIPOASPIRAÇÃO)
// ==========================================
function TabDisciplinas({ edital, setEdital, progress, setUserProgress, toggleSprintItem, customSprint, resetProgress, themeColors, setActiveTab, addXP, triggerVisualFlash, flashElementId }) {
  const [expanded, setExpanded] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newTopic, setNewTopic] = useState({ discId: '', titulo: '', linkTec: '' });
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [bulkInput, setBulkInput] = useState({ discId: null, text: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedDiscId, setSelectedDiscId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Nova Funcionalidade: Edição Inline (Duplo Clique)
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineEditValue, setInlineEditValue] = useState('');
  
  // Apenas a Árvore e Seleção em Massa
  const [expandedTopics, setExpandedTopics] = useState({});
  const [selectedAssuntosBulk, setSelectedAssuntosBulk] = useState(new Set());
  
  // Controle Visual de Drag & Drop Integrado (4D: Vertical + Horizontal)
  const [dragTargetIndex, setDragTargetIndex] = useState(null);
  const [dragTargetIndent, setDragTargetIndent] = useState(0);
  const dragItem = useRef(null); 

  useEffect(() => {
    if (!selectedDiscId && edital.length > 0 && edital[0].disciplinas.length > 0) {
      setSelectedDiscId(edital[0].disciplinas[0].id);
    }
  }, [edital, selectedDiscId]);

  useEffect(() => {
    setSearchTerm('');
  }, [selectedDiscId]);

  const toggleNode = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleExpandAll = () => {
    const allExpanded = {};
    edital.forEach(b => { allExpanded[b.id] = true; });
    setExpanded(allExpanded);
  };
  const handleCollapseAll = () => {
    setExpanded({});
  };
  
  // --- NOVAS FUNÇÕES PARA EXPANDIR/RECOLHER TÓPICOS DA DISCIPLINA ---
  const handleExpandAllTopics = () => {
    if(!activeDisc) return;
    const allExpanded = {};
    activeDisc.assuntos.forEach(a => { if((a.indent || 0) === 0) allExpanded[a.id] = true; });
    setExpandedTopics(allExpanded);
  };
  
  const handleCollapseAllTopics = () => {
    setExpandedTopics({});
  };

  const handleEditBlocoNome = (blocoId, newNome) => { setEdital(prev => prev.map(b => b.id === blocoId ? { ...b, nome: newNome } : b)); };
  const handleDeleteBlocoClick = (blocoId) => {
    if (confirmDeleteId === `bloco_${blocoId}`) { setEdital(prev => prev.filter(b => b.id !== blocoId)); setConfirmDeleteId(null); } 
    else { setConfirmDeleteId(`bloco_${blocoId}`); setTimeout(() => setConfirmDeleteId(null), 3000); }
  };
  const handleAddBloco = () => {
    const newId = `b_${Date.now()}`; const newBloco = { id: newId, nome: 'Novo Bloco', icone: 'Layers', disciplinas: [] };
    setEdital(prev => [...prev, newBloco]); setExpanded(prev => ({ ...prev, [newId]: true }));
  };
  const handleEditDiscNome = (blocoId, discId, newNome) => { setEdital(prev => prev.map(b => b.id === blocoId ? { ...b, disciplinas: b.disciplinas.map(d => d.id === discId ? { ...d, nome: newNome } : d) } : b)); };
  const handleDeleteDisciplinaClick = (blocoId, discId) => {
    if (confirmDeleteId === `disc_${discId}`) { 
      setEdital(prev => prev.map(b => b.id === blocoId ? { ...b, disciplinas: b.disciplinas.filter(d => d.id !== discId) } : b)); 
      if(selectedDiscId === discId) setSelectedDiscId(null);
      setConfirmDeleteId(null); 
    } 
    else { setConfirmDeleteId(`disc_${discId}`); setTimeout(() => setConfirmDeleteId(null), 3000); }
  };
  const handleAddDisciplina = (blocoId) => {
    const newDisc = { id: `d_${Date.now()}`, nome: 'Nova Disciplina', cor: 'text-indigo-700 bg-indigo-100', assuntos: [] };
    setEdital(prev => prev.map(b => b.id === blocoId ? { ...b, disciplinas: [...b.disciplinas, newDisc] } : b));
  };

  // Funções de Arrastar 4D com Rastreio de Eixo X
  const handleDragStart = (e, position, discId, currentIndent) => { 
    dragItem.current = { position, discId, initialX: e.clientX, initialIndent: currentIndent || 0 }; 
    setDragTargetIndex(position);
    setDragTargetIndent(currentIndent || 0);
    e.dataTransfer.effectAllowed = "move"; 
    if (e.dataTransfer.setData) e.dataTransfer.setData('text/plain', position); 
  };
  
  const handleDragOver = (e, position, discId) => { 
    e.preventDefault(); 
    if (!dragItem.current || dragItem.current.discId !== discId) return;

    if (dragTargetIndex !== position) {
      setDragTargetIndex(position);
    }

    const deltaX = e.clientX - dragItem.current.initialX;
    const calculatedIndent = Math.max(0, Math.min(3, dragItem.current.initialIndent + Math.floor(deltaX / 35)));

    if (calculatedIndent !== dragTargetIndent) {
      setDragTargetIndent(calculatedIndent);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); 
    if (!dragItem.current) return; 
    
    const discId = dragItem.current.discId; 
    const dragIdx = dragItem.current.position; 
    const dropIdx = dragTargetIndex;
    const finalIndent = dragTargetIndent;
    
    dragItem.current = null; 
    setDragTargetIndex(null);
    setDragTargetIndent(0);
    
    if (dragIdx === null || dropIdx === null) return;

    setEdital(prevEdital => prevEdital.map(bloco => ({ 
      ...bloco, 
      disciplinas: bloco.disciplinas.map(disc => { 
        if (disc.id === discId) { 
          const newAssuntos = [...disc.assuntos]; 
          const draggedTopic = { ...newAssuntos[dragIdx], indent: finalIndent }; 
          newAssuntos.splice(dragIdx, 1); 
          newAssuntos.splice(dropIdx, 0, draggedTopic); 
          return { ...disc, assuntos: newAssuntos }; 
        } 
        return disc; 
      }) 
    })));
  };

  const handleMoveAssuntoManual = (discId, assId, direction) => {
    setEdital(prev => prev.map(b => ({
      ...b, disciplinas: b.disciplinas.map(d => {
        if (d.id === discId) {
          const assuntos = [...d.assuntos];
          const idx = assuntos.findIndex(a => a.id === assId);
          if (idx < 0 || idx + direction < 0 || idx + direction >= assuntos.length) return d;
          
          const temp = assuntos[idx];
          assuntos[idx] = assuntos[idx + direction];
          assuntos[idx + direction] = temp;
          return { ...d, assuntos };
        }
        return d;
      })
    })));
  };

  const handleDeleteClick = (discId, assId) => {
    if (confirmDeleteId === assId) { setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => { if(d.id === discId) return { ...d, assuntos: d.assuntos.filter(a => a.id !== assId) }; return d; }) }))); setConfirmDeleteId(null); } 
    else { setConfirmDeleteId(assId); setTimeout(() => setConfirmDeleteId(null), 3000); }
  };
  const handleIndent = (discId, assId, delta) => {
    setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => { if (d.id === discId) { return { ...d, assuntos: d.assuntos.map(a => { if (a.id === assId) { const currentIndent = a.indent || 0; const newIndent = Math.max(0, Math.min(3, currentIndent + delta)); return { ...a, indent: newIndent }; } return a; }) }; } return d; }) })));
  };

  const handleAddTopic = (discId) => {
    if(!newTopic.titulo) return; const newAssId = `t_${Date.now()}`;
    setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => { if(d.id === discId) return { ...d, assuntos: [...d.assuntos, { id: newAssId, titulo: newTopic.titulo, temp: '⭐ NOVO', linkTec: newTopic.linkTec, indent: 0 }] }; return d; }) })));
    setNewTopic({ discId: '', titulo: '', linkTec: '' });
  };
  
  const handleBulkAdd = (discId) => {
    if (!bulkInput.text.trim()) return; const lines = bulkInput.text.split('\n').filter(line => line.trim() !== ''); if (lines.length === 0) return;
    const newAssuntos = lines.map((line, idx) => ({ id: `t_${Date.now()}_${idx}`, titulo: line.trim(), temp: '⭐ NOVO', linkTec: '', indent: 0 }));
    setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => { if(d.id === discId) { return { ...d, assuntos: [...d.assuntos, ...newAssuntos] }; } return d; }) })));
    setBulkInput({ discId: null, text: '' });
  };

  const startEditTopic = (assunto) => { setEditingTopicId(assunto.id); };
  const saveEditTopic = (discId, assId, novoTitulo, novoLink) => {
    if (!novoTitulo) return; 
    setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => { if (d.id === discId) return { ...d, assuntos: d.assuntos.map(a => a.id === assId ? { ...a, titulo: novoTitulo, linkTec: novoLink } : a) }; return d; }) }))); 
    setEditingTopicId(null);
  };

  const toggleBulkSelect = (id) => {
    const newSet = new Set(selectedAssuntosBulk);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedAssuntosBulk(newSet);
  };
  const handleBulkDelete = () => {
    if(window.confirm(`Excluir ${selectedAssuntosBulk.size} itens selecionados?`)){
       setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => {
          if (d.id === selectedDiscId) return { ...d, assuntos: d.assuntos.filter(a => !selectedAssuntosBulk.has(a.id)) };
          return d;
       })})));
       setSelectedAssuntosBulk(new Set());
    }
  };
  const handleBulkIndent = (delta) => {
    setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => {
       if (d.id === selectedDiscId) {
          return { ...d, assuntos: d.assuntos.map(a => {
             if (selectedAssuntosBulk.has(a.id)) return { ...a, indent: Math.max(0, Math.min(3, (a.indent || 0) + delta)) };
             return a;
          })};
       }
       return d;
    })})));
  };

  const isFullyMastered = useCallback((assId) => { const p = progress[assId]; return p?.estudado && p?.questoes && p?.revisado; }, [progress]);
  
  const getSimpleStatus = (assId, isInSprint) => {
    const mastered = isFullyMastered(assId);
    const p = progress[assId];
    const started = p?.estudado || p?.questoes || p?.revisado;

    if (mastered) return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
    if (isInSprint) return <PlayCircle className="w-5 h-5 text-blue-500 shrink-0" />;
    if (started) return <Activity className="w-5 h-5 text-amber-500 shrink-0" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-white/10 shrink-0"></div>;
  };

  const activeBloco = edital.find(b => b.disciplinas.some(d => d.id === selectedDiscId));
  const activeDisc = activeBloco?.disciplinas.find(d => d.id === selectedDiscId);
  const isMobileDetailView = !!activeDisc;
  
  const filteredAssuntos = useMemo(() => {
    if (!activeDisc) return [];
    return activeDisc.assuntos.filter(a => {
      const matchesSearch = a.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      return true;
    });
  }, [activeDisc, searchTerm]);

  const shouldApplyCollapse = searchTerm === '';
  const displayAssuntos = useMemo(() => {
    if (!shouldApplyCollapse) return filteredAssuntos;
    
    const visible = [];
    let currentParentId = null;
    filteredAssuntos.forEach((assunto) => {
      if (assunto.indent === 0) {
        currentParentId = assunto.id;
        visible.push(assunto);
      } else {
        if (!currentParentId || expandedTopics[currentParentId]) visible.push(assunto);
      }
    });
    return visible;
  }, [filteredAssuntos, shouldApplyCollapse, expandedTopics]);

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in pb-10">
      
      <SectionHeader 
        overline="Planejamento" 
        title="Edital Verticalizado" 
        subtitle="A sua Biblioteca. Onde a magia da organização acontece." 
        icon={Folder}
        themeColors={themeColors}
        extra={
          <button onClick={() => { setIsEditing(!isEditing); setEditingTopicId(null); setBulkInput({discId: null, text: ''}); setSelectedAssuntosBulk(new Set()); setInlineEditingId(null); }} className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors w-full sm:w-auto shadow-sm cursor-pointer ${isEditing ? `${themeColors.bgSolid} ${themeColors.bgHover} text-white ${themeColors.shadowHover}` : `bg-white dark:bg-[#111e36] text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/60 dark:border-white/10`}`}>
            {isEditing ? <Save className="w-5 h-5"/> : <Edit className="w-5 h-5"/>}{isEditing ? 'Concluir Gestão' : 'Gerenciar Matérias'}
          </button>
        }
      />

      {isEditing && (
        <div className="bg-amber-50 dark:bg-[#111e36] border border-amber-200 dark:border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="text-sm text-amber-800 dark:text-white/60 leading-relaxed flex-1"><strong>Modo Edição Ativo:</strong> Arraste e solte (Vertical e Horizontal). Faça <strong className="underline">duplo clique</strong> num nome para editá-lo. Pressione <kbd className="bg-amber-100 dark:bg-white/10 px-1 rounded text-amber-900 dark:text-white">Enter</kbd> para guardar.</div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO ISOLADO */}
      {editingTopicId && activeDisc && (
        <ModalEditor 
          assunto={activeDisc.assuntos.find(a => a.id === editingTopicId)} 
          onSave={(titulo, link) => saveEditTopic(activeDisc.id, editingTopicId, titulo, link)} 
          onCancel={() => setEditingTopicId(null)} 
          themeColors={themeColors}
        />
      )}

      <div className="flex flex-col md:flex-row gap-6 items-start flex-1 min-h-[600px] relative">
        
        {/* COLUNA ESQUERDA: MÓDULOS */}
        <div className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0 bg-white dark:bg-[#111e36] rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-white/5 p-5 md:sticky md:top-6 ${isMobileDetailView ? 'hidden md:flex' : 'flex'} flex-col max-h-[85vh] overflow-hidden`}>
          <div className="flex items-center justify-between mb-4 px-2 shrink-0 border-b border-slate-100 dark:border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5 text-slate-400 dark:text-white/40" />
              <h3 className="font-black text-sm text-slate-600 dark:text-white/60 uppercase tracking-wider">Módulos</h3>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-[#0d1526] rounded-xl p-1">
              <button onClick={handleExpandAll} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer" title="Expandir Tudo ( + )">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={handleCollapseAll} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer" title="Recolher Tudo ( - )">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-4 mt-2">
            {edital.map((bloco, bIndex) => (
              <div key={bloco.id} className="mb-2">
                <div onClick={() => !isEditing && toggleNode(bloco.id)} className={`group flex items-center gap-2 p-2.5 rounded-xl transition-colors ${!isEditing ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5' : ''}`}>
                  <div onClick={(e) => { if(isEditing) { e.stopPropagation(); toggleNode(bloco.id); } }} className="cursor-pointer shrink-0">
                    {expanded[bloco.id] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </div>
                  <Layers className={`w-4 h-4 ${themeColors.brightText} shrink-0 opacity-70`}/>
                  
                  {isEditing ? (
                     <div className="flex-1 flex items-center gap-2">
                        {inlineEditingId === bloco.id ? (
                           <input 
                              autoFocus 
                              value={inlineEditValue} 
                              onChange={(e) => setInlineEditValue(e.target.value)} 
                              onBlur={() => { if(inlineEditValue.trim()) handleEditBlocoNome(bloco.id, inlineEditValue); setInlineEditingId(null); }} 
                              onKeyDown={(e) => { if(e.key === 'Enter') { if(inlineEditValue.trim()) handleEditBlocoNome(bloco.id, inlineEditValue); setInlineEditingId(null); } if(e.key === 'Escape') setInlineEditingId(null); }} 
                              className={`flex-1 font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white bg-transparent border-b ${themeColors.borderSolid} outline-none w-full`} 
                           />
                        ) : (
                           <span onDoubleClick={(e) => { e.stopPropagation(); setInlineEditValue(bloco.nome); setInlineEditingId(bloco.id); }} className="flex-1 font-black text-xs text-slate-600 dark:text-white/80 uppercase tracking-wider truncate cursor-text" title="Duplo clique para editar">{bloco.nome}</span>
                        )}
                        <Pencil onClick={() => { setInlineEditValue(bloco.nome); setInlineEditingId(bloco.id); }} className={`w-3.5 h-3.5 text-slate-400 hover:${themeColors.brightText} cursor-pointer opacity-0 group-hover:opacity-100`} />
                        <Trash2 onClick={() => handleDeleteBlocoClick(bloco.id)} className="w-3.5 h-3.5 text-red-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100" />
                     </div>
                  ) : (
                    <span className="flex-1 font-black text-xs text-slate-600 dark:text-white/80 uppercase tracking-wider truncate">{bloco.nome}</span>
                  )}
                </div>

                {expanded[bloco.id] && (
                  <div className="pl-6 pr-1 space-y-1.5 mt-2 border-l-2 border-slate-100 dark:border-white/5 ml-4">
                    {bloco.disciplinas.map((disc, dIndex) => {
                      const totalAssuntosDisc = disc.assuntos.length;
                      const concluidosAssuntosDisc = disc.assuntos.filter(a => isFullyMastered(a.id)).length;
                      const isSelected = selectedDiscId === disc.id;
                      const progressoCircular = totalAssuntosDisc === 0 ? 0 : Math.round((concluidosAssuntosDisc / totalAssuntosDisc) * 100);
                      
                      return (
                        <div key={disc.id} onClick={() => !isEditing && setSelectedDiscId(disc.id)} className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${isSelected && !isEditing ? `${themeColors.bgSuperLight} ${themeColors.primaryText} border ${themeColors.borderLight} shadow-sm` : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent text-slate-600 dark:text-white/60'}`}>
                          
                          <CircularProgress percent={progressoCircular} themeColors={themeColors} />
                          
                          {isEditing ? (
                             <div className="flex-1 flex items-center gap-2">
                               {inlineEditingId === disc.id ? (
                                  <input 
                                     autoFocus 
                                     value={inlineEditValue} 
                                     onChange={(e) => setInlineEditValue(e.target.value)} 
                                     onBlur={() => { if(inlineEditValue.trim()) handleEditDiscNome(bloco.id, disc.id, inlineEditValue); setInlineEditingId(null); }} 
                                     onKeyDown={(e) => { if(e.key === 'Enter') { if(inlineEditValue.trim()) handleEditDiscNome(bloco.id, disc.id, inlineEditValue); setInlineEditingId(null); } if(e.key === 'Escape') setInlineEditingId(null); }} 
                                     className={`font-bold text-sm flex-1 bg-transparent border-b ${themeColors.borderSolid} outline-none text-slate-800 dark:text-white w-full`} 
                                  />
                               ) : (
                                  <span onDoubleClick={(e) => { e.stopPropagation(); setInlineEditValue(disc.nome); setInlineEditingId(disc.id); }} className="font-bold text-sm flex-1 truncate cursor-text" title="Duplo clique para editar">{disc.nome}</span>
                               )}
                               <Pencil onClick={() => { setInlineEditValue(disc.nome); setInlineEditingId(disc.id); }} className={`w-3.5 h-3.5 text-slate-400 hover:${themeColors.brightText} cursor-pointer opacity-0 group-hover:opacity-100`} />
                               <Trash2 onClick={() => handleDeleteDisciplinaClick(bloco.id, disc.id)} className="w-3.5 h-3.5 text-red-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100" />
                             </div>
                          ) : (
                            <span className="font-bold text-sm flex-1 truncate">{disc.nome}</span>
                          )}
                          
                          {!isEditing && (
                            <span className={`text-[10px] font-black shrink-0 px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/60 dark:bg-[#0d1526]' : 'bg-slate-100 dark:bg-white/5'}`}>
                              {concluidosAssuntosDisc}/{totalAssuntosDisc}
                            </span>
                          )}
                        </div>
                      )
                    })}
                    
                    {isEditing && (
                      <div className="pt-2">
                        <button onClick={() => handleAddDisciplina(bloco.id)} className={`w-full flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-white/40 hover:${themeColors.brightText} p-2 rounded-xl transition-colors cursor-pointer`}>
                          <Plus className="w-4 h-4"/> Add Disciplina
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="pt-5 border-t border-slate-100 dark:border-white/5 mt-auto shrink-0">
              <button onClick={handleAddBloco} className={`w-full flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-white/50 hover:${themeColors.brightText} dark:hover:${themeColors.brightText} bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl transition-colors border-2 border-dashed border-slate-300 dark:border-white/10 cursor-pointer`}>
                <Layers className="w-4 h-4"/> Criar Novo Bloco
              </button>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: LISTA MINIMALISTA */}
        <div className={`flex-1 bg-white dark:bg-[#111e36] rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-white/5 p-5 md:p-8 ${!isMobileDetailView ? 'hidden md:flex' : 'flex'} flex-col min-h-[500px] relative`}>
          
          {!activeDisc ? (
             <EmptyState 
                icon={BookOpen}
                title="Biblioteca de Matérias"
                message="Navegue pelo índice à esquerda. Aqui você tem a visão limpa e estruturada de cada tópico do seu edital."
                themeColors={themeColors}
             />
          ) : (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="mb-6 border-b border-slate-100 dark:border-white/5 pb-5">
                <button onClick={() => setSelectedDiscId(null)} className={`md:hidden flex items-center gap-1.5 text-sm font-bold ${themeColors.brightText} mb-4 cursor-pointer hover:underline`}>
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 mb-3 flex-wrap">
                   <Layers className="w-3.5 h-3.5" />
                   <span className="truncate max-w-[150px]">{activeBloco?.nome}</span>
                   <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                   <span className={`${themeColors.brightText} truncate`}>{activeDisc.nome}</span>
                </div>
                
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3`}>
                    {activeDisc.nome}
                    
                    {/* BOTÕES DE EXPANDIR E RECOLHER TODOS */}
                    <div className="flex bg-slate-100 dark:bg-[#0d1526] rounded-xl p-1 shrink-0 ml-2">
                      <button onClick={handleExpandAllTopics} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer" title="Expandir Todos">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button onClick={handleCollapseAllTopics} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer" title="Recolher Todos">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </h3>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-slate-500 dark:text-white/60 bg-slate-100 dark:bg-white/5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/5">
                      {activeDisc.assuntos.filter(a => isFullyMastered(a.id)).length} de {activeDisc.assuntos.length} Concluídos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
                {displayAssuntos.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-white/40 text-center p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center">
                    Nenhum assunto encontrado.
                  </div>
                ) : (
                  displayAssuntos.map((assunto) => {
                    const trueIndex = activeDisc.assuntos.findIndex(x => x.id === assunto.id);
                    const isInSprint = customSprint.some(item => item.assId === assunto.id);
                    const mastered = isFullyMastered(assunto.id);
                    
                    const isParent = (assunto.indent || 0) === 0;
                    const hasChildren = isParent && activeDisc.assuntos[trueIndex + 1]?.indent > 0;
                    const isSelectedBulk = selectedAssuntosBulk.has(assunto.id);
                    
                    const isBeingDragged = dragItem.current?.discId === activeDisc.id && dragItem.current?.position === trueIndex;
                    const isDropTarget = dragTargetIndex === trueIndex && !isBeingDragged;

                    return (
                        <div key={assunto.id} className="relative">
                          {/* LINHA GUIA DE DROP 4D */}
                          {isDropTarget && isEditing && (
                            <div
                              className={`absolute top-0 left-0 h-1 ${themeColors.bgSolid} rounded-full z-20 transition-all duration-200 ${themeColors.glow} pointer-events-none`}
                              style={{
                                marginLeft: `${dragTargetIndent * 1.5 + 0.75}rem`,
                                width: `calc(100% - ${dragTargetIndent * 1.5 + 0.75}rem)`
                              }}
                            />
                          )}

                          <div 
                            draggable={isEditing} 
                            onDragStart={(e) => handleDragStart(e, trueIndex, activeDisc.id, assunto.indent)} 
                            onDragOver={(e) => handleDragOver(e, trueIndex, activeDisc.id)} 
                            onDrop={handleDrop} 
                            style={{ marginLeft: isBeingDragged ? `${dragTargetIndent * 1.5}rem` : (assunto.indent && shouldApplyCollapse ? `${assunto.indent * 1.5}rem` : '0') }} 
                            className={`
                              group flex items-center py-2.5 px-3 transition-all duration-200 border-b border-slate-100 dark:border-white/5 
                              ${isEditing ? 'cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg'} 
                              ${isParent && !isBeingDragged ? 'mt-4 border-t border-t-slate-200 dark:border-t-white/10 pt-4' : ''} 
                              ${isSelectedBulk ? `${themeColors.bgSuperLight}` : ''}
                              ${isBeingDragged ? `opacity-40 scale-[0.98] border-dashed border-2 ${themeColors.borderSolid} z-10 bg-white dark:bg-[#0d1526]` : ''}
                            `}
                          >
                            <div className="flex items-center gap-3 w-full">
                              
                              {/* Checkbox de Seleção ou Ícone de Rato no Modo Edição */}
                              {isEditing ? (
                                 <div className="flex items-center gap-2">
                                   <input type="checkbox" checked={isSelectedBulk} onChange={() => toggleBulkSelect(assunto.id)} className={`w-4 h-4 rounded cursor-pointer border-slate-300 dark:border-white/10 ${themeColors.brightText} ${themeColors.ring} shrink-0 bg-transparent`} />
                                   <GripVertical className="w-4 h-4 text-slate-300 dark:text-white/20 shrink-0" />
                                 </div>
                              ) : (
                                 getSimpleStatus(assunto.id, isInSprint)
                              )}
                            
                              <div 
                                className={`flex-1 flex items-center overflow-hidden ${hasChildren && shouldApplyCollapse && !isEditing ? 'cursor-pointer' : ''}`}
                                onClick={(e) => {
                                  if (!isEditing && hasChildren && shouldApplyCollapse) {
                                    e.stopPropagation();
                                    setExpandedTopics(prev => ({...prev, [assunto.id]: !prev[assunto.id]}));
                                  }
                                }}
                              >
                                <div className="flex items-center gap-2 overflow-hidden w-full">
                                  {hasChildren && shouldApplyCollapse && !isEditing && (
                                    <div className={`p-0.5 rounded shrink-0 transition-colors ${expandedTopics[assunto.id] ? themeColors.primaryText : 'text-slate-400 dark:text-white/40'}`}>
                                      {expandedTopics[assunto.id] ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
                                    </div>
                                  )}
                                  
                                  {/* Edição Inline do Título do Assunto */}
                                  {isEditing && inlineEditingId === assunto.id ? (
                                    <input 
                                      autoFocus 
                                      value={inlineEditValue} 
                                      onChange={(e) => setInlineEditValue(e.target.value)} 
                                      onBlur={() => { if(inlineEditValue.trim()) saveEditTopic(activeDisc.id, assunto.id, inlineEditValue, assunto.linkTec); setInlineEditingId(null); }} 
                                      onKeyDown={(e) => { 
                                        if(e.key === 'Enter') { 
                                          e.preventDefault();
                                          if(inlineEditValue.trim()) saveEditTopic(activeDisc.id, assunto.id, inlineEditValue, assunto.linkTec); 
                                          setInlineEditingId(null); 
                                        } 
                                        if(e.key === 'Escape') setInlineEditingId(null); 
                                      }} 
                                      className={`flex-1 bg-transparent border-b ${themeColors.borderSolid} outline-none text-slate-800 dark:text-white font-medium text-sm w-full`} 
                                    />
                                  ) : (
                                    <span 
                                      onDoubleClick={(e) => { if(isEditing) { e.stopPropagation(); setInlineEditValue(assunto.titulo); setInlineEditingId(assunto.id); } }}
                                      className={`truncate transition-colors ${mastered && !isEditing ? 'line-through text-slate-400 dark:text-white/30' : (isParent ? 'font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm' : 'font-medium text-slate-700 dark:text-white/80 text-sm')} ${isEditing ? 'cursor-text' : ''}`}
                                      title={isEditing ? "Duplo clique para editar" : ""}
                                    >
                                      {assunto.titulo}
                                    </span>
                                  )}
                                  
                                  {assunto.linkTec && !isEditing && (
                                    <a href={assunto.linkTec} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className={`opacity-0 group-hover:opacity-100 text-slate-400 hover:${themeColors.brightText} transition-opacity`} title="Abrir Caderno TEC">
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                              
                              {/* ACÇÕES DE HOVER (Visão Padrão) */}
                              {!isEditing && (
                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity shrink-0">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); if (mastered && !isInSprint) resetProgress(assunto.id); toggleSprintItem(activeDisc.id, assunto.id, activeDisc.nome, assunto.titulo, assunto.temp, assunto.linkTec); }} 
                                    className={`text-xs font-bold px-2 py-1.5 rounded border shadow-sm cursor-pointer ${isInSprint ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : mastered ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : `bg-white dark:bg-[#0d1526] ${themeColors.brightText} ${themeColors.borderLight} hover:${themeColors.bgSuperLight}`}`}
                                  >
                                    {isInSprint ? 'Na Sprint' : (mastered ? 'Refazer' : '+ Sprint')}
                                  </button>
                                  <button onClick={() => startEditTopic(assunto)} className={`p-1.5 text-slate-400 hover:${themeColors.brightText}`} title="Editar Tópico Inteiro"><Pencil className="w-3.5 h-3.5"/></button>
                                </div>
                              )}

                              {/* ACÇÕES DE HOVER (Modo Edição - Botões Manuais) */}
                              {isEditing && (
                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 shrink-0 transition-opacity bg-slate-50/80 dark:bg-[#0d1526]/80 p-1.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                                  <button onClick={() => handleMoveAssuntoManual(activeDisc.id, assunto.id, -1)} disabled={trueIndex === 0 || isBeingDragged} className="p-1 text-sky-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded disabled:opacity-30 cursor-pointer" title="Subir"><ChevronUp className="w-4 h-4"/></button>
                                  <button onClick={() => handleMoveAssuntoManual(activeDisc.id, assunto.id, 1)} disabled={trueIndex === activeDisc.assuntos.length - 1 || isBeingDragged} className="p-1 text-sky-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded disabled:opacity-30 cursor-pointer" title="Descer"><ChevronDown className="w-4 h-4"/></button>
                                  
                                  <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1"></div>
                                  
                                  <button onClick={() => handleIndent(activeDisc.id, assunto.id, -1)} disabled={!assunto.indent || !shouldApplyCollapse || isBeingDragged} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer" title="Recuar"><ArrowLeft className="w-3.5 h-3.5"/></button>
                                  <button onClick={() => handleIndent(activeDisc.id, assunto.id, 1)} disabled={(assunto.indent || 0) >= 3 || !shouldApplyCollapse || isBeingDragged} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer" title="Avançar"><ArrowRight className="w-3.5 h-3.5"/></button>
                                  
                                  <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1"></div>
                                  
                                  <button onClick={() => startEditTopic(assunto)} className={`p-1 text-slate-400 hover:${themeColors.brightText} cursor-pointer`} title="Editar Link/Mais"><Settings className="w-3.5 h-3.5"/></button>
                                  <button onClick={() => handleDeleteClick(activeDisc.id, assunto.id)} className={`p-1 ${confirmDeleteId === assunto.id ? 'text-red-600' : 'text-slate-400 hover:text-red-500'} cursor-pointer`} title="Excluir"><Trash2 className="w-3.5 h-3.5"/></button>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                    );
                  })
                )}
              </div>

              {/* UX 4: Bulk Actions Floating Bar */}
              {isEditing && selectedAssuntosBulk.size > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-[#0d1526] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-8 border border-slate-700 dark:border-white/10">
                  <span className="font-bold text-xs bg-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap">{selectedAssuntosBulk.size} selecionados</span>
                  <div className="w-px h-6 bg-slate-600 dark:bg-white/10"></div>
                  <button onClick={() => handleBulkIndent(-1)} className="p-2 hover:bg-slate-700 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Recuar Todos"><ArrowLeft className="w-4 h-4"/></button>
                  <button onClick={() => handleBulkIndent(1)} className="p-2 hover:bg-slate-700 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer" title="Avançar Todos"><ArrowRight className="w-4 h-4"/></button>
                  <div className="w-px h-6 bg-slate-600 dark:bg-white/10"></div>
                  <button onClick={handleBulkDelete} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300 cursor-pointer" title="Excluir Selecionados"><Trash2 className="w-4 h-4"/></button>
                </div>
              )}

              {isEditing && (
                <div className="mt-4 pt-5 border-t border-slate-100 dark:border-white/5 shrink-0">
                  <div className={`bg-amber-50 dark:bg-[#0d1526] border ${themeColors.borderLight} rounded-2xl p-5 flex flex-col gap-4 shadow-sm`}>
                    {bulkInput.discId === activeDisc.id ? (
                      <div className="flex flex-col gap-3 animate-in fade-in">
                        <h4 className={`text-xs font-black uppercase ${themeColors.brightText} flex items-center gap-2 tracking-widest`}><ListPlus className="w-4 h-4"/> Importação Rápida</h4>
                        <textarea rows="4" placeholder="Cole a lista de assuntos aqui... Ex:&#10;Modelagem de Dados&#10;Normalização" value={bulkInput.text} onChange={(e) => setBulkInput({ discId: activeDisc.id, text: e.target.value })} className={`w-full p-4 text-sm rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#111e36] text-slate-800 dark:text-white outline-none ${themeColors.ring} resize-none transition-colors`} />
                        <div className="flex gap-3 mt-1">
                          <button onClick={() => handleBulkAdd(activeDisc.id)} className={`${themeColors.bgSolid} ${themeColors.bgHover} text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md`}>Gerar Assuntos</button>
                          <button onClick={() => setBulkInput({ discId: null, text: '' })} className="bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:dark:bg-white/10 px-6 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <Plus className={`w-5 h-5 ${themeColors.brightText} shrink-0 hidden sm:block`}/>
                          <input 
                            type="text" 
                            placeholder="Adicionar assunto e pressionar Enter..." 
                            value={newTopic.discId === activeDisc.id ? newTopic.titulo : ''} 
                            onChange={(e) => setNewTopic({...newTopic, discId: activeDisc.id, titulo: e.target.value})} 
                            onKeyDown={(e) => { if(e.key === 'Enter') handleAddTopic(activeDisc.id); }}
                            className={`flex-1 w-full p-3.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111e36] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors`} 
                          />
                          <button onClick={() => handleAddTopic(activeDisc.id)} className={`${themeColors.bgSolid} ${themeColors.bgHover} text-white px-6 py-3.5 rounded-xl text-sm font-bold w-full sm:w-auto transition-all cursor-pointer shadow-md`}>Adicionar</button>
                        </div>
                        <button onClick={() => setBulkInput({ discId: activeDisc.id, text: '' })} className={`w-full border border-dashed ${themeColors.borderLight} ${themeColors.primaryText} hover:${themeColors.bgSuperLight} px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1`}>
                          <ListPlus className="w-4 h-4"/> Colar Índice Completo
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABA: BACKLOG DE SPRINTS (METAS DA SEMANA)
// ==========================================
function TabPlanner({ customSprint, setCustomSprint, sprintsCompleted, setActiveTab, themeColors, progress, toggleProgress, flashElementId }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newSprint = [...customSprint];
      const draggedItemContent = newSprint.splice(dragItem.current, 1)[0];
      newSprint.splice(dragOverItem.current, 0, draggedItemContent);
      setCustomSprint(newSprint);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };

  const sprintGroups = [];
  for (let i = 0; i < customSprint.length; i += 2) sprintGroups.push(customSprint.slice(i, i + 2));

  const activeSprint = sprintGroups.length > 0 ? sprintGroups[0] : null;
  const backlogSprints = sprintGroups.length > 1 ? sprintGroups.slice(1) : [];

  return (
    <div className="space-y-6 animate-in fade-in text-left h-full pb-10">
      
      <SectionHeader 
        overline="Estratégia" 
        title="Backlog de Sprints" 
        subtitle="O que for agendado aqui será executado na Mesa de Foco." 
        icon={LayoutGrid}
        themeColors={themeColors}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-1/3 bg-slate-50 dark:bg-[#111e36] rounded-[2rem] p-6 border border-slate-200/60 dark:border-white/5 min-h-[400px]">
          <h3 className={`font-black text-slate-600 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2 text-sm`}><ListPlus className={`w-5 h-5 ${themeColors.brightText}`}/> Fila de Sprints ({backlogSprints.length})</h3>
          
          <div className="space-y-5">
            {backlogSprints.length === 0 ? (
               <EmptyState 
                  icon={LayoutGrid}
                  title="Fila Vazia"
                  message="Vá ao Edital Verticalizado para enviar matérias para cá."
                  actionLabel="Ir para Edital"
                  onAction={() => setActiveTab('disciplinas')}
                  themeColors={themeColors}
               />
            ) : (
              backlogSprints.map((group, groupIdx) => (
                <div key={groupIdx} className="bg-white dark:bg-[#0d1526] p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-white/5 transition-colors">
                   <div className="text-[10px] font-bold text-slate-400 dark:text-white/40 mb-3 uppercase tracking-widest flex justify-between"><span>Sprint {sprintsCompleted + groupIdx + 2}</span></div>
                   {group.map((item, localIdx) => {
                     const globalIdx = 2 + (groupIdx * 2) + localIdx;
                     const isDragging = draggedIndex === globalIdx;
                     return (
                       <div 
                         key={item.assId} 
                         draggable
                         onDragStart={(e) => handleDragStart(e, globalIdx)}
                         onDragEnter={(e) => handleDragEnter(e, globalIdx)}
                         onDragEnd={handleDragEnd}
                         onDragOver={(e) => e.preventDefault()}
                         className={`mb-2 last:mb-0 flex items-start gap-2.5 cursor-move hover:bg-slate-50 dark:hover:bg-white/5 p-2.5 rounded-xl transition-all border border-transparent dark:hover:${themeColors.borderLight} ${isDragging ? `opacity-40 border-dashed ${themeColors.borderSolid} scale-[0.98]` : ''}`}
                       >
                         <GripVertical className="w-4 h-4 shrink-0 text-slate-300 dark:text-white/20 mt-0.5" />
                         <div>
                           <span className="block text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest truncate">{item.discNome}</span>
                           <span className="block text-sm font-bold text-slate-700 dark:text-white/80 leading-tight mt-0.5">{item.assTitulo}</span>
                         </div>
                       </div>
                     )
                   })}
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`w-full lg:w-1/3 ${themeColors.bgSuperLight} rounded-[2rem] p-6 border ${themeColors.borderLight} min-h-[400px]`}>
           <h3 className={`font-black ${themeColors.brightText} uppercase tracking-wider mb-6 flex items-center gap-2 text-sm`}><PlayCircle className="w-5 h-5"/> Em Curso (Hoje)</h3>
           {activeSprint ? (
             <div className={`bg-white dark:bg-[#0d1526] p-6 rounded-2xl shadow-md border-2 ${themeColors.borderLight}`}>
                 <div className={`text-[10px] font-bold ${themeColors.brightText} mb-4 uppercase tracking-widest`}>Sprint {sprintsCompleted + 1}</div>
                 {activeSprint.map((item, localIdx) => {
                   const globalIdx = localIdx;
                   const isDragging = draggedIndex === globalIdx;
                   return (
                     <div 
                       key={item.assId} 
                       draggable
                       onDragStart={(e) => handleDragStart(e, globalIdx)}
                       onDragEnter={(e) => handleDragEnter(e, globalIdx)}
                       onDragEnd={handleDragEnd}
                       onDragOver={(e) => e.preventDefault()}
                       className={`mb-3 last:mb-0 flex items-start gap-3 cursor-move bg-slate-50 dark:bg-[#111e36] p-3.5 rounded-xl transition-all border border-slate-200 dark:border-white/5 hover:${themeColors.borderSolid} shadow-sm ${isDragging ? `opacity-40 border-dashed ${themeColors.borderSolid} scale-[0.98]` : ''}`}
                     >
                       <GripVertical className={`w-4 h-4 shrink-0 mt-0.5 opacity-50 ${themeColors.brightText}`} />
                       <div>
                         <span className="block text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest truncate">{item.discNome}</span>
                         <span className="block text-sm font-bold text-slate-800 dark:text-white leading-tight mt-1">{item.assTitulo}</span>
                       </div>
                     </div>
                   )
                 })}
                 <button onClick={() => setActiveTab('cronograma')} className={`mt-6 w-full ${themeColors.bgSolid} ${themeColors.bgHover} font-bold text-sm py-3.5 rounded-xl transition-all cursor-pointer text-white shadow-md`}>Ir para Mesa de Foco</button>
              </div>
           ) : (
             <div className={`text-sm ${themeColors.brightText} opacity-80 p-8 border-2 border-dashed ${themeColors.borderLight} rounded-2xl flex items-center justify-center text-center h-48 font-medium`}>Nenhuma Sprint ativada hoje.</div>
           )}
        </div>

        <div className="w-full lg:w-1/3 bg-emerald-50 dark:bg-emerald-500/5 rounded-[2rem] p-6 border border-emerald-200/60 dark:border-emerald-500/20 min-h-[400px]">
           <h3 className="font-black text-emerald-700 dark:text-emerald-500 uppercase tracking-wider mb-6 flex items-center gap-2 text-sm"><CheckCircle className="w-5 h-5"/> Vitórias</h3>
           <div className="bg-white dark:bg-[#0d1526] p-8 rounded-2xl shadow-sm border border-emerald-200/60 dark:border-white/5 flex flex-col items-center justify-center h-48">
             <Trophy className="w-12 h-12 text-emerald-500 mb-3" />
             <span className="text-5xl font-black text-emerald-600 dark:text-white leading-none mb-1">{sprintsCompleted}</span>
             <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Sprints Fechadas</span>
           </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABA 4: MESA DE FOCO (SPRINTS DIÁRIAS)
// ==========================================
function TabCronograma({ customSprint, setCustomSprint, sprintsCompleted, setSprintsCompleted, setActiveTab, progress, toggleProgress, addXP, triggerConfetti, themeColors, handleAutoLog, flashElementId, pendingReviewsCount }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newSprint = [...customSprint];
      const draggedItemContent = newSprint.splice(dragItem.current, 1)[0];
      newSprint.splice(dragOverItem.current, 0, draggedItemContent);
      setCustomSprint(newSprint);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };

  const sprintGroups = [];
  for (let i = 0; i < customSprint.length; i += 2) sprintGroups.push(customSprint.slice(i, i + 2));

  const handleCompleteSprint = () => {
    if (!showConfirm) {
      setShowConfirm(true); setTimeout(() => setShowConfirm(false), 3000); return;
    }
    setSprintsCompleted(prev => prev + 1); setCustomSprint(prev => prev.slice(2)); 
    addXP(50); triggerConfetti(); setShowConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in text-left pb-10">
      
      <SectionHeader 
        overline="Execução" 
        title="Mesa de Foco" 
        subtitle="Ocultámos as distrações. Marque os passos e ganhe +50 XP." 
        icon={Target}
        themeColors={themeColors}
        extra={
          <button disabled={sprintGroups.length === 0} onClick={handleCompleteSprint} className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${showConfirm ? `${themeColors.bgSolid} text-white shadow-lg ${themeColors.shadowHover}` : 'bg-emerald-500 text-white disabled:opacity-50 shadow-md hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20'}`}>
            <CheckCircle className="w-5 h-5" /> {showConfirm ? 'Confirmar Fecho (+50 XP)' : 'Concluir Sprint'}
          </button>
        }
      />

      {/* WIDGET POMODORO */}
      <PomodoroWidget themeColors={themeColors} handleAutoLog={handleAutoLog} addXP={addXP} triggerConfetti={triggerConfetti} />

      {/* SPRINTS */}
      {sprintGroups.length === 0 && pendingReviewsCount === 0 ? (
        <EmptyState 
           icon={ShoppingCart}
           title="Fila Vazia!"
           message="Você completou as missões de hoje. Vá ao Planejamento adicionar novas metas."
           actionLabel="Ir para Edital"
           onAction={() => setActiveTab('disciplinas')}
           themeColors={themeColors}
        />
      ) : (
        <div className="grid gap-6 mt-6">
          
          {/* SPRINT 0 - AQUECIMENTO (Aparece se houver revisões) */}
          {pendingReviewsCount > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/5 border border-red-200 dark:border-red-500/20 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-sm ring-1 ring-red-500/10 mb-2 relative animate-in slide-in-from-top-4">
               <div className="p-6 w-full md:w-28 shrink-0 flex flex-col items-center justify-center font-black border-b md:border-b-0 md:border-r border-red-200 dark:border-red-500/20 bg-red-500 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-red-100">Sprint</span>
                  <span className="text-5xl mt-1">0</span>
               </div>
               <div className="p-6 flex-1 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-2xl shrink-0"><BrainCircuit className="w-8 h-8 text-red-500" /></div>
                     <div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1 block">Aquecimento Diário Obrigatório</span>
                       <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Limpar Motor de Revisões</h4>
                       <p className="text-sm text-slate-600 dark:text-white/50">Recupere {pendingReviewsCount} tópicos críticos esquecidos antes de avançar na matéria nova.</p>
                     </div>
                  </div>
                  <button onClick={() => setActiveTab('revisoes')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg hover:shadow-red-500/30 w-full md:w-auto shrink-0 whitespace-nowrap cursor-pointer">
                     Iniciar Aquecimento
                  </button>
               </div>
            </div>
          )}

          {sprintGroups.map((group, idx) => {
            const sprintNum = sprintsCompleted + idx + 1;
            const isActive = idx === 0;

            return (
              <div key={sprintNum} className={`bg-white dark:bg-[#0d1526] rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-slate-200/80 dark:border-white/5 shadow-sm transition-all ${isActive ? `ring-2 ${themeColors.ring} shadow-lg ${themeColors.shadowHover} scale-[1.01]` : 'opacity-90'}`}>
                
                {/* Lado Destaque / Marcação da Sprint */}
                <div className={`p-6 w-full md:w-28 shrink-0 flex flex-col items-center justify-center font-black border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-white/5 ${isActive ? `${themeColors.bgSolid} text-white` : 'bg-slate-50 dark:bg-[#111e36] text-slate-400 dark:text-white/40'}`}>
                  <span className="text-[10px] uppercase tracking-widest">Sprint</span><span className="text-5xl mt-1">{sprintNum}</span>
                  {isActive && <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-md mt-3 font-bold tracking-wider text-white">HOJE</span>}
                </div>
                
                <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.map((item, localIdx) => {
                    const globalIdx = (idx * 2) + localIdx;
                    const isDragging = draggedIndex === globalIdx;
                    const isEstudado = progress[item.assId]?.estudado || false;
                    const isQuestoes = progress[item.assId]?.questoes || false;
                    const isRevisado = progress[item.assId]?.revisado || false;
                    const isFlashing = flashElementId === item.assId;

                    return (
                      <div 
                        key={item.assId} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, globalIdx)}
                        onDragEnter={(e) => handleDragEnter(e, globalIdx)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`rounded-2xl p-6 flex flex-col relative transition-all duration-300 cursor-move ${isFlashing ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 ring-2 ring-emerald-400 scale-[1.02]' : isActive ? `bg-white dark:bg-[#111e36] border border-slate-200 dark:border-white/10 shadow-sm` : 'bg-slate-50 dark:bg-[#111e36]/50 border border-slate-200 dark:border-white/5'} ${isDragging ? `opacity-40 border-dashed ${themeColors.borderSolid} scale-95 z-10` : 'hover:shadow-md'}`}
                      >
                        <div className="absolute top-5 right-12 text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-white transition-colors" title="Arrastar e Soltar">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <button onClick={() => setCustomSprint(p => p.filter(i => i.assId !== item.assId))} className="absolute top-5 right-4 text-slate-300 dark:text-white/20 hover:text-red-500 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-5 h-5"/></button>
                        
                        <span className={`text-[10px] font-black uppercase tracking-widest text-slate-500 dark:${themeColors.brightText} mb-2 pr-14`}>{item.discNome}</span>
                        <p className="font-bold text-lg text-slate-800 dark:text-white mb-6 pr-10 leading-tight">{item.assTitulo}</p>
                        
                        {/* Checkboxes */}
                        <div className="mt-auto space-y-3 pt-5 border-t border-slate-100 dark:border-white/5">
                          <label className={`flex items-center gap-3.5 cursor-pointer transition-colors ${isEstudado ? themeColors.primaryText : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'}`}>
                            <input type="checkbox" checked={isEstudado} onChange={() => toggleProgress(item.assId, 'estudado')} disabled={!isActive} className={`w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0 border-slate-300 dark:border-white/20 bg-transparent ${themeColors.primaryText} ${themeColors.ring}`} />
                            <span className="font-bold text-xs uppercase tracking-wide">1. Teoria</span>
                          </label>

                          <label className={`flex items-center gap-3.5 cursor-pointer transition-colors ${isQuestoes ? themeColors.primaryText : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'}`}>
                            <input type="checkbox" checked={isQuestoes} onChange={() => toggleProgress(item.assId, 'questoes')} disabled={!isActive || !isEstudado} className={`w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0 border-slate-300 dark:border-white/20 bg-transparent ${themeColors.primaryText} ${themeColors.ring}`} />
                            <span className="font-bold text-xs uppercase tracking-wide">2. Questões</span>
                          </label>

                          <label className={`flex items-center gap-3.5 cursor-pointer transition-colors ${isRevisado ? themeColors.primaryText : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'}`}>
                            <input type="checkbox" checked={isRevisado} onChange={() => toggleProgress(item.assId, 'revisado')} disabled={!isActive || !isQuestoes} className={`w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0 border-slate-300 dark:border-white/20 bg-transparent ${themeColors.primaryText} ${themeColors.ring}`} />
                            <span className="font-bold text-xs uppercase tracking-wide">3. Revisão Auto</span>
                          </label>
                          
                          {item.linkTec && isActive && (
                            <a href={item.linkTec} target="_blank" rel="noopener noreferrer" className={`mt-5 flex items-center justify-center gap-2 w-full py-3 text-xs font-bold rounded-xl ${themeColors.bgSuperLight} ${themeColors.primaryText} transition-all shadow-sm cursor-pointer hover:${themeColors.bgSolid} hover:text-white dark:hover:${themeColors.bgSolid} dark:hover:text-white`}>
                              <ExternalLink className="w-4 h-4" /> Resolver no TEC
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {/* Placeholder */}
                  {group.length === 1 && (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200/60 dark:border-white/5 flex flex-col items-center justify-center text-slate-400 dark:text-white/30 opacity-60 p-6 min-h-[200px]">
                      <Target className="w-8 h-8 mb-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Slot Livre</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ABA 5: MOTOR DE REVISÃO (AGORA COM SM-2 LIGHT)
// ==========================================
function TabRevisaoInteligente({ progress, handleReviewFeedback, edital, activeSubjectIds, themeColors, flashElementId, projectConfig }) {
  let todosAssuntos = [];
  edital.forEach(b => b.disciplinas.forEach(d => {
    d.assuntos.forEach(a => todosAssuntos.push({...a, discNome: d.nome}))
  }));

  const now = new Date().getTime();

  // CORREÇÃO TÁTICA: O filtro agora avalia ESTRITAMENTE o nextReviewTimestamp
  const revisoesPendentes = todosAssuntos.filter(a => {
    if (!activeSubjectIds.has(a.id)) return false;
    const p = progress[a.id];
    if (!p?.estudado) return false;
    if (p.nextReviewTimestamp && p.nextReviewTimestamp <= now) return true;
    return false;
  });

  const revisoesConcluidas = todosAssuntos.filter(a => {
    if (!activeSubjectIds.has(a.id)) return false;
    const p = progress[a.id];
    return p?.estudado && p?.revisado && p?.nextReviewTimestamp && p.nextReviewTimestamp > now;
  });

  const getFormattedReviewDate = (timestamp) => {
    const diff = Math.ceil((timestamp - now) / (1000 * 3600 * 24));
    const revDate = new Date(timestamp);
    const day = String(revDate.getDate()).padStart(2, '0');
    const month = String(revDate.getMonth() + 1).padStart(2, '0');
    const dateStr = `${day}/${month}`;

    if (diff === 1) return `${dateStr} (Amanhã)`;
    return `${dateStr} (em ${diff} dias)`;
  };

  // Motor Multiplicador de Retenção Dinâmico
  const getNextIntervalDays = (assId, feedbackType) => {
    const currentInterval = progress[assId]?.reviewInterval || 0;
    if (feedbackType === 'dificil') return 1;
    if (feedbackType === 'bom') {
      return currentInterval <= 1 ? (projectConfig.revBom || 7) : Math.min(365, Math.round(currentInterval * 2));
    }
    if (feedbackType === 'facil') {
      return currentInterval <= 1 ? (projectConfig.revFacil || 15) : Math.min(365, Math.round(currentInterval * 2.5));
    }
    return 1;
  };

  return (
    <div className="space-y-6 animate-in fade-in text-left pb-10">
      
      <SectionHeader 
        overline="Retenção" 
        title="Motor de Revisão" 
        subtitle="Memória ativa guiada por espaçamento ótimo. Avalie os tópicos abaixo." 
        icon={BrainCircuit}
        themeColors={themeColors}
      />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-6 border-b border-red-100 dark:border-red-900/30 pb-3">
            <AlertTriangle className="w-5 h-5"/> Tópicos a Revisar (Hoje)
          </h3>
          <div className="space-y-4">
            {revisoesPendentes.length === 0 ? (
               <EmptyState 
                  icon={CheckCircle}
                  title="Memória em Dia!"
                  message="Nenhum tópico pendente de revisão para hoje."
                  themeColors={themeColors}
               />
            ) : (
              revisoesPendentes.map((data) => {
                const isFlashing = flashElementId === data.id;
                
                // Calcula os dias dinâmicos para a interface
                const daysBom = getNextIntervalDays(data.id, 'bom');
                const daysFacil = getNextIntervalDays(data.id, 'facil');

                return (
                  <div key={data.id} className={`bg-white dark:bg-[#111e36] border p-6 rounded-2xl shadow-sm flex flex-col gap-4 border-l-4 transition-all duration-300 ${isFlashing ? 'border-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 scale-[1.02]' : 'border-slate-200/60 dark:border-white/5 border-l-red-500 hover:shadow-md'}`}>
                    <div className="flex justify-between items-start">
                      <div className="pr-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/40 tracking-widest block mb-1.5">{data.discNome}</span>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{data.titulo}</h4>
                      </div>
                      {data.linkTec && (
                        <a href={data.linkTec} target="_blank" rel="noreferrer" title="Abrir Caderno TEC" className={`p-3 rounded-xl bg-slate-50 dark:bg-[#0d1526] ${themeColors.brightText} hover:scale-110 transition-transform cursor-pointer shrink-0 shadow-sm border border-slate-100 dark:border-white/5`}>
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    
                    {/* BOTÕES INLINE DE REVISÃO COM DIAS DINÂMICOS */}
                    <div className="grid grid-cols-3 gap-3 mt-3 pt-5 border-t border-slate-100 dark:border-white/5">
                      <button onClick={() => handleReviewFeedback(data.id, 'dificil')} className="py-3 px-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex flex-col items-center gap-1 cursor-pointer border border-red-100 dark:border-red-500/20">
                        <span>Difícil</span><span className="text-[9px] font-bold opacity-70 tracking-widest">Amanhã</span>
                      </button>
                      <button onClick={() => handleReviewFeedback(data.id, 'bom')} className="py-3 px-2 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white dark:bg-amber-500/10 dark:hover:bg-amber-600 dark:text-amber-400 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex flex-col items-center gap-1 cursor-pointer border border-amber-100 dark:border-amber-500/20">
                        <span>Bom</span><span className="text-[9px] font-bold opacity-70 tracking-widest">{daysBom} Dias</span>
                      </button>
                      <button onClick={() => handleReviewFeedback(data.id, 'facil')} className="py-3 px-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:bg-emerald-500/10 dark:hover:bg-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex flex-col items-center gap-1 cursor-pointer border border-emerald-100 dark:border-emerald-500/20">
                        <span>Fácil</span><span className="text-[9px] font-bold opacity-70 tracking-widest">{daysFacil} Dias</span>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-6 border-b border-emerald-100 dark:border-emerald-900/30 pb-3">
            <Calendar className="w-5 h-5"/> Agendados
          </h3>
          <div className="space-y-4">
            {revisoesConcluidas.length === 0 ? (
               <EmptyState 
                  icon={Clock}
                  title="Sem Agendamentos"
                  message="Quando classificar revisões, elas aparecerão aqui."
                  themeColors={themeColors}
               />
            ) : (
              revisoesConcluidas
                .sort((a, b) => progress[a.id].nextReviewTimestamp - progress[b.id].nextReviewTimestamp)
                .map((data) => {
                  const p = progress[data.id];
                  const isFlashing = flashElementId === data.id;
                  return (
                    <div key={data.id} className={`bg-slate-50 dark:bg-[#111e36] border p-5 rounded-2xl flex justify-between items-center transition-all duration-300 ${isFlashing ? 'border-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 opacity-100 scale-[1.02]' : 'border-slate-200/60 dark:border-white/5 opacity-80 hover:opacity-100'}`}>
                      <div className="truncate pr-4">
                        <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-white/40 tracking-widest mb-1.5">{data.discNome}</span>
                        <h4 className="font-bold text-slate-700 dark:text-white text-sm truncate">{data.titulo}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-black text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg whitespace-nowrap">{getFormattedReviewDate(p.nextReviewTimestamp)}</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABA NOVA: PAINEL DE CONTROLE (ADMINISTRAÇÃO)
// ==========================================
function TabAdmin({ auth, config, setConfig, userProgress, setUserProgress, gamification, setGamification, edital, setEdital, customSprint, setCustomSprint, initialEdital, sprintsCompleted, setSprintsCompleted, dailyLogs, setDailyLogs, reviewStats, dailyReviewStats, setDailyReviewStats, themeColors, playLevelUpSound }) {
  const [localConfig, setLocalConfig] = useState({
    ...config,
    revBom: config.revBom || 7,
    revFacil: config.revFacil || 15
  });
  
  const [saveStatus, setSaveStatus] = useState('');
  const [confirmResetProgress, setConfirmResetProgress] = useState(false);
  const [confirmFactoryReset, setConfirmFactoryReset] = useState(false);

  const handleSave = () => {
    setConfig(localConfig);
    setSaveStatus('Configurações salvas com sucesso!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      config: localConfig,
      progress: userProgress,
      gamification: gamification,
      sprints: customSprint,
      edital: edital,
      logs: dailyLogs,
      reviewStats: reviewStats,
      dailyReviewStats: dailyReviewStats,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Backup_NomeacaoTech_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.config) { setConfig(data.config); setLocalConfig(data.config); }
        if (data.progress) setUserProgress(data.progress);
        if (data.gamification) setGamification(data.gamification);
        if (data.sprints) setCustomSprint(data.sprints);
        if (data.edital) setEdital(data.edital);
        if (data.logs) setDailyLogs(data.logs);
        if (data.dailyReviewStats) setDailyReviewStats(data.dailyReviewStats);
        
        alert('🎉 Dados restaurados com sucesso na Nuvem! O seu progresso está a salvo.');
      } catch (err) {
        alert('❌ Erro ao ler o arquivo. Certifique-se de que é um arquivo de backup válido (.json).');
      }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  const handleResetProgress = () => {
    if (confirmResetProgress) {
      setUserProgress({});
      setGamification(prev => ({ ...prev, xp: 0, streak: 0 }));
      setCustomSprint([]);
      setSprintsCompleted(0);
      setDailyReviewStats({});
      setConfirmResetProgress(false);
      alert("Progresso, gamificação e fila de sprints foram limpos!");
    } else {
      setConfirmResetProgress(true);
      setTimeout(() => setConfirmResetProgress(false), 3000);
    }
  };

  const handleFactoryReset = () => {
    if (confirmFactoryReset) {
      setUserProgress({});
      setGamification(prev => ({ ...prev, xp: 0, streak: 0 }));
      setCustomSprint([]);
      setSprintsCompleted(0);
      setDailyLogs({});
      setDailyReviewStats({});
      setEdital(initialEdital);
      setConfirmFactoryReset(false);
      alert("Sistema restaurado para o Padrão de Fábrica.");
    } else {
      setConfirmFactoryReset(true);
      setTimeout(() => setConfirmFactoryReset(false), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in text-left pb-10">
      
      <SectionHeader 
        overline="Sistema" 
        title="Painel de Controle" 
        subtitle="Personalize o seu sistema, ajuste o algoritmo e faça backups." 
        icon={Settings}
        themeColors={themeColors}
        extra={
          <button onClick={handleSave} className={`w-full md:w-auto ${themeColors.bgSolid} ${themeColors.bgHover} text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg ${themeColors.shadowHover} transition-all cursor-pointer`}>
            <Save className="w-5 h-5"/> Salvar Alterações
          </button>
        }
      />

      {saveStatus && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 p-5 rounded-2xl font-bold flex items-center gap-3 shadow-sm animate-in slide-in-from-top-4">
          <CheckCircle className="w-6 h-6"/> {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BLOCO 1: PERSONALIZAÇÃO VISUAL E UX */}
        <div className="bg-white dark:bg-[#111e36] p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-8 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
            <Palette className={`w-5 h-5 ${themeColors.brightText}`}/> Identidade & UX
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Seu Nome / Apelido</label>
                <input 
                  type="text" 
                  value={localConfig.userName || ''} 
                  onChange={e => setLocalConfig({...localConfig, userName: e.target.value})}
                  className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Som de Subida de Nível</label>
                <div className="flex gap-2">
                  <select 
                    value={localConfig.levelSound || 'chimes'} 
                    onChange={e => setLocalConfig({...localConfig, levelSound: e.target.value})}
                    className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors cursor-pointer`}
                  >
                    <option value="mario" className="dark:bg-[#0d1526] dark:text-white">Moeda Super Mario (Nostalgia)</option>
                    <option value="chimes" className="dark:bg-[#0d1526] dark:text-white">Sinos Mágicos (Suave)</option>
                    <option value="arcade" className="dark:bg-[#0d1526] dark:text-white">Arcade 8-bits (Retro)</option>
                    <option value="modern" className="dark:bg-[#0d1526] dark:text-white">Notificação Moderna (Limpa)</option>
                    <option value="epic" className="dark:bg-[#0d1526] dark:text-white">Trombetas de Vitória (Épico)</option>
                  </select>
                  <button 
                    onClick={() => playLevelUpSound(localConfig.levelSound || 'chimes')}
                    className={`p-4 bg-slate-100 dark:bg-white/5 ${themeColors.brightText} rounded-xl hover:scale-105 transition-all cursor-pointer`}
                    title="Testar Som"
                  >
                    <Play size={20} className="fill-current" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Nome do App / Sistema</label>
                <input 
                  type="text" 
                  value={localConfig.appName} 
                  onChange={e => setLocalConfig({...localConfig, appName: e.target.value})}
                  className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Tema do Sistema (Cores)</label>
                <select 
                  value={localConfig.appTheme || 'default'} 
                  onChange={e => setLocalConfig({...localConfig, appTheme: e.target.value})}
                  className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors cursor-pointer font-bold`}
                >
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <option key={key} value={key} className="dark:bg-[#0d1526] dark:text-white">{theme.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">URL da Logo (Imagem)</label>
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] flex items-center justify-center overflow-hidden shrink-0 p-1">
                  <img src={localConfig.logoUrl} alt="Preview" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-contain" />
                </div>
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={localConfig.logoUrl} 
                  onChange={e => setLocalConfig({...localConfig, logoUrl: e.target.value})}
                  className={`flex-1 p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors text-sm font-mono`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO 2: CONFIGURAÇÕES DE ESTUDO */}
        <div className="bg-white dark:bg-[#111e36] p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-8 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
            <Target className={`w-5 h-5 ${themeColors.brightText}`}/> Configurações do Foco
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Concurso Alvo</label>
              <input 
                type="text" 
                value={localConfig.concurso} 
                onChange={e => setLocalConfig({...localConfig, concurso: e.target.value})}
                className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors`}
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Cargo</label>
              <input 
                type="text" 
                value={localConfig.cargo} 
                onChange={e => setLocalConfig({...localConfig, cargo: e.target.value})}
                className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors`}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Banca</label>
              <input 
                type="text" 
                value={localConfig.banca} 
                onChange={e => setLocalConfig({...localConfig, banca: e.target.value})}
                className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors`}
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Meta Diária (Horas)</label>
              <input 
                type="number" 
                step="0.5"
                value={localConfig.horasDia} 
                onChange={e => setLocalConfig({...localConfig, horasDia: parseFloat(e.target.value)})}
                className={`w-full md:w-1/2 p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors font-black text-xl`}
              />
            </div>
          </div>
        </div>

        {/* BLOCO 3: MOTOR DE RETENÇÃO (LEITNER) */}
        <div className="bg-white dark:bg-[#111e36] p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
            <Sliders className="w-5 h-5 text-emerald-500"/> Intervalos Base (1ª Revisão)
          </h3>
          <p className="text-sm text-slate-500 dark:text-white/50 mb-6 leading-relaxed">Defina a base em dias para quando avaliar um tópico pela primeira vez. Dali em diante, o algoritmo SM-2 encarrega-se de multiplicar o espaçamento na proporção ideal.</p>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block mb-2">1º Base "BOM"</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1"
                  value={localConfig.revBom} 
                  onChange={e => setLocalConfig({...localConfig, revBom: parseInt(e.target.value)})}
                  className="w-full p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 outline-none focus:border-amber-500 transition-colors font-black text-center text-xl"
                />
                <span className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Dias</span>
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block mb-2">1º Base "FÁCIL"</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="2"
                  value={localConfig.revFacil} 
                  onChange={e => setLocalConfig({...localConfig, revFacil: parseInt(e.target.value)})}
                  className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 outline-none focus:border-emerald-500 transition-colors font-black text-center text-xl"
                />
                <span className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Dias</span>
              </div>
            </div>
            <p className="col-span-2 text-[10px] text-slate-400 dark:text-white/30 mt-2 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">Nota: Avaliar "Difícil" sempre recomeça o espaçamento do zero (revisão marcada para o dia seguinte).</p>
          </div>
        </div>

        {/* BLOCO 4: BACKUP DE DADOS */}
        <div className="bg-white dark:bg-[#111e36] p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
              <Download className="w-5 h-5 text-purple-500"/> Backup & Segurança
            </h3>
            <p className="text-sm text-slate-500 dark:text-white/50 mb-8 leading-relaxed">Exporte todo o seu progresso, arsenal de matérias e níveis de XP para um arquivo de segurança no seu dispositivo.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleExportBackup}
              className="w-full py-4 rounded-xl font-bold text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2 border border-purple-200 dark:border-purple-500/20 cursor-pointer shadow-sm"
            >
              <Download className="w-5 h-5"/> Exportar Meus Dados (.JSON)
            </button>
            
            <label className={`w-full py-4 rounded-xl font-bold text-sm bg-slate-50 dark:bg-[#0d1526] text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 cursor-pointer shadow-sm`}>
              <Upload className="w-5 h-5 opacity-70"/> Restaurar Backup Antigo (.JSON)
              <input type="file" accept=".json" className="hidden" onChange={handleImportBackup} />
            </label>
          </div>
        </div>

        {/* BLOCO 5: ZONA DE PERIGO (DANGER ZONE) */}
        <div className="lg:col-span-2 bg-red-50 dark:bg-red-500/5 p-8 rounded-[2rem] border border-red-200/60 dark:border-red-500/10 shadow-sm mt-4">
          <h3 className="text-lg font-black text-red-700 dark:text-red-500 mb-8 flex items-center gap-2 border-b border-red-200 dark:border-red-500/20 pb-4">
            <ShieldAlert className="w-5 h-5"/> Zona de Risco (Gestão Crítica)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#111e36] p-6 rounded-2xl border border-red-100 dark:border-white/5 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Limpar Progresso</h4>
                <p className="text-sm text-slate-500 dark:text-white/40 mb-8 leading-relaxed">Zera todas as marcações de estudo, níveis, XP e revisões. O seu Edital Verticalizado será <strong className="text-slate-700 dark:text-white">mantido</strong>.</p>
              </div>
              <button 
                onClick={handleResetProgress}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${confirmResetProgress ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent dark:border-red-500/20'}`}
              >
                {confirmResetProgress ? 'Tem certeza? Clique para Limpar' : 'Zerar Progresso e Gamificação'}
              </button>
            </div>

            <div className="bg-white dark:bg-[#111e36] p-6 rounded-2xl border border-red-100 dark:border-white/5 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Restaurar Padrão de Fábrica</h4>
                <p className="text-sm text-slate-500 dark:text-white/40 mb-8 leading-relaxed">Aviso: Isto apaga <strong className="text-red-500">TUDO</strong>. O progresso e qualquer matéria que tenha adicionado serão destruídos.</p>
              </div>
              <button 
                onClick={handleFactoryReset}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${confirmFactoryReset ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent dark:border-red-500/20'}`}
              >
                {confirmFactoryReset ? 'APAGAR TUDO DEFINITIVAMENTE' : 'Restaurar Sistema a Zero'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE RAIZ (APP)
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [confettiFire, setConfettiFire] = useState(0);
  const [levelUpData, setLevelUpData] = useState(null);
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [flashElementId, setFlashElementId] = useState(null); 

  const [projectConfig, setProjectConfig] = useState(initialConfig);
  const [edital, setEdital] = useState(initialEdital);
  const [userProgress, setUserProgress] = useState({});
  const [customSprint, setCustomSprint] = useState([]);
  const [sprintsCompleted, setSprintsCompleted] = useState(0);
  const [gamification, setGamification] = useState({ xp: 0, streak: 0, lastActiveDate: '' });
  const [dailyLogs, setDailyLogs] = useState({});
  const [reviewStats, setReviewStats] = useState(() => getStorage('nomeacao_prod_review_stats', { facil: 0, bom: 0, dificil: 0 }));
  const [dailyReviewStats, setDailyReviewStats] = useState(() => getStorage('nomeacao_daily_reviews', {})); 

  const themeColors = THEMES[projectConfig.appTheme] || THEMES.default;

  useEffect(() => {
    if (!auth) {
      setIsCloudReady(true);
      return;
    }
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      signInWithCustomToken(auth, __initial_auth_token).catch(e => console.error(e));
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsCloudReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    try {
      const docRef = doc(db, 'artifacts', safeAppId, 'users', user.uid, 'appData', 'main');
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.config) setProjectConfig(data.config);
          if (data.edital) setEdital(data.edital);
          if (data.userProgress) setUserProgress(data.userProgress);
          if (data.customSprint) setCustomSprint(data.customSprint);
          if (data.sprintsCompleted !== undefined) setSprintsCompleted(data.sprintsCompleted);
          if (data.gamification) setGamification(data.gamification);
          if (data.dailyLogs) setDailyLogs(data.dailyLogs);
          if (data.reviewStats) setReviewStats(data.reviewStats);
          if (data.dailyReviewStats) setDailyReviewStats(data.dailyReviewStats);
          if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
        }
        setIsCloudReady(true);
      }, (err) => {
        console.error("Erro sincronização", err);
        setIsCloudReady(true);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setIsCloudReady(true);
    }
  }, [user]);

  const saveToCloud = async (key, value) => {
    if (!user || !db || !isCloudReady) return;
    try {
      await setDoc(doc(db, 'artifacts', safeAppId, 'users', user.uid, 'appData', 'main'), { [key]: value }, { merge: true });
    } catch (e) {}
  };

  useEffect(() => { saveToCloud('isDarkMode', isDarkMode); }, [isDarkMode, isCloudReady]);
  useEffect(() => { saveToCloud('config', projectConfig); }, [projectConfig, isCloudReady]);
  useEffect(() => { saveToCloud('edital', edital); }, [edital, isCloudReady]);
  useEffect(() => { saveToCloud('userProgress', userProgress); }, [userProgress, isCloudReady]);
  useEffect(() => { saveToCloud('customSprint', customSprint); }, [customSprint, isCloudReady]);
  useEffect(() => { saveToCloud('sprintsCompleted', sprintsCompleted); }, [sprintsCompleted, isCloudReady]);
  useEffect(() => { saveToCloud('gamification', gamification); }, [gamification, isCloudReady]);
  useEffect(() => { saveToCloud('dailyLogs', dailyLogs); }, [dailyLogs, isCloudReady]);
  useEffect(() => { 
    setStorage('nomeacao_prod_review_stats', reviewStats);
    saveToCloud('reviewStats', reviewStats); 
  }, [reviewStats, isCloudReady]);
  useEffect(() => { 
    setStorage('nomeacao_daily_reviews', dailyReviewStats);
    saveToCloud('dailyReviewStats', dailyReviewStats); 
  }, [dailyReviewStats, isCloudReady]);

  const calculateLevel = (xp) => {
    const levelFound = LEVELS_MAP.find(l => xp >= l.min && xp < l.max);
    if (levelFound) return levelFound;
    return LEVELS_MAP[LEVELS_MAP.length - 1]; 
  };

  const userLevel = calculateLevel(gamification.xp);
  const prevLevelRef = useRef(userLevel.nivel);

  useEffect(() => {
    const currentLevel = userLevel.nivel;
    if (gamification.xp === 0) {
      prevLevelRef.current = 1;
    } else if (currentLevel > prevLevelRef.current) {
      setLevelUpData(userLevel);
      setConfettiFire(f => f + 1);
      if (isCloudReady) playLevelUpSound(projectConfig.levelSound);
      prevLevelRef.current = currentLevel;
    }
  }, [gamification.xp, userLevel, projectConfig.levelSound, isCloudReady]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    if (gamification.lastActiveDate !== today) {
      const lastDate = new Date(gamification.lastActiveDate.split('/').reverse().join('-'));
      const currentDate = new Date(today.split('/').reverse().join('-'));
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      let newStreak = gamification.streak;
      if (diffDays > 1 && gamification.lastActiveDate !== '') newStreak = 0; 
      setGamification(prev => ({ ...prev, streak: newStreak }));
    }
  }, [gamification.lastActiveDate, gamification.streak]);

  const triggerConfetti = () => setConfettiFire(f => f + 1);
  
  const triggerVisualFlash = (id) => {
    setFlashElementId(id);
    setTimeout(() => setFlashElementId(null), 800);
  };

  const addXP = useCallback((amount) => { setGamification(prev => ({ ...prev, xp: prev.xp + amount })); }, []);

  const handleAutoLog = useCallback((hoursToAdd) => {
    const today = new Date().toLocaleDateString();
    setDailyLogs(prev => {
      const currentHours = prev[today] || 0;
      return { ...prev, [today]: currentHours + hoursToAdd };
    });
    setGamification(prev => {
      const currentHours = dailyLogs[today] || 0;
      if ((currentHours + hoursToAdd) >= projectConfig.horasDia && prev.lastActiveDate !== today) {
        return { ...prev, streak: prev.streak + 1, lastActiveDate: today };
      } else if (prev.lastActiveDate !== today) {
        return { ...prev, lastActiveDate: today };
      }
      return prev;
    });
  }, [dailyLogs, projectConfig.horasDia]);

  // Função core do Algoritmo Multiplicador Dinâmico (SM-2 Light) + Reset à Meia-Noite
  const handleReviewFeedback = (assId, feedbackType) => {
    setReviewStats(prev => ({ ...prev, [feedbackType]: (prev[feedbackType] || 0) + 1 }));
    
    const today = new Date().toLocaleDateString();
    setDailyReviewStats(prev => {
      const current = prev[today] || { facil: 0, bom: 0, dificil: 0 };
      return { ...prev, [today]: { ...current, [feedbackType]: current[feedbackType] + 1 } };
    });

    setUserProgress(prev => {
      const current = prev[assId] || {};
      const now = new Date();
      let currentInterval = current.reviewInterval || 0;
      let newInterval = 1;

      if (feedbackType === 'dificil') {
        newInterval = 1; 
      } else if (feedbackType === 'bom') {
        newInterval = currentInterval <= 1 ? (projectConfig.revBom || 7) : Math.round(currentInterval * 2);
      } else if (feedbackType === 'facil') {
        newInterval = currentInterval <= 1 ? (projectConfig.revFacil || 15) : Math.round(currentInterval * 2.5);
      }
      
      newInterval = Math.min(newInterval, 365);

      addXP(15); 
      triggerVisualFlash(assId);
      
      // O Segredo da Meia-Noite: Forçamos a hora da próxima revisão para as 00:00:00 do dia alvo
      const nextReviewDate = new Date(now);
      nextReviewDate.setDate(now.getDate() + newInterval);
      nextReviewDate.setHours(0, 0, 0, 0); // Vira a meia-noite exatamente!
      
      return { 
        ...prev, 
        [assId]: { 
          ...current, 
          revisado: true, 
          lastReviewedTimestamp: now.getTime(), 
          nextReviewTimestamp: nextReviewDate.getTime(),
          reviewInterval: newInterval 
        } 
      };
    });
  };

  const toggleProgress = (assId, type) => {
    setUserProgress(prev => {
      const current = prev[assId] || {};
      const newState = { ...current, [type]: !current[type] };
      if (type === 'estudado' && !newState.estudado) { newState.questoes = false; newState.revisado = false; }
      if (type === 'questoes' && !newState.questoes) { newState.revisado = false; }
      if (type === 'revisado') {
        if (newState.revisado) {
          const now = new Date();
          
          // O Segredo da Meia-Noite: A 1ª revisão agendada pela caixa cai exatamente amanhã às 00:00:00
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          
          newState.lastReviewedTimestamp = now.getTime();
          newState.nextReviewTimestamp = tomorrow.getTime();
          newState.reviewInterval = 1; 
          addXP(10);
        } else {
          newState.lastReviewedTimestamp = null;
          newState.nextReviewTimestamp = null;
          newState.reviewInterval = 0;
        }
      }
      triggerVisualFlash(assId);
      return { ...prev, [assId]: newState };
    });
  };

  const resetProgress = (assId) => { setUserProgress(prev => ({ ...prev, [assId]: { estudado: false, questoes: false, revisado: false, lastReviewedTimestamp: null, nextReviewTimestamp: null, reviewInterval: 0 } })); };

  const toggleSprintItem = (discId, assId, discNome, assTitulo, temp, linkTec) => {
    setCustomSprint(prev => {
      const exists = prev.find(item => item.assId === assId);
      if (exists) return prev.filter(item => item.assId !== assId);
      triggerVisualFlash(assId);
      return [...prev, { discId, assId, discNome, assTitulo, temp, linkTec }];
    });
  };

  const activeSubjectIds = new Set();
  edital.forEach(b => b.disciplinas.forEach(d => d.assuntos.forEach(a => activeSubjectIds.add(a.id))));

  const now = new Date().getTime();
  
  // CORREÇÃO: Contagem rigorosa de pendências (apenas com base no Timestamp da meia-noite)
  const pendingReviewsCount = Object.entries(userProgress).filter(([id, data]) => {
    if (!activeSubjectIds.has(id)) return false;
    if (!data.estudado) return false;
    if (data.nextReviewTimestamp && data.nextReviewTimestamp <= now) return true;
    return false;
  }).length;

  const totalAssuntos = activeSubjectIds.size;
  const totalCheckboxes = totalAssuntos * 3; 
  const completedCheckboxes = Object.entries(userProgress).reduce((acc, [assId, data]) => {
    if (!activeSubjectIds.has(assId)) return acc;
    return acc + (data.estudado ? 1 : 0) + (data.questoes ? 1 : 0) + (data.revisado ? 1 : 0);
  }, 0);
  const progressPerc = totalCheckboxes === 0 ? 0 : Math.round((completedCheckboxes / totalCheckboxes) * 100);

  const navPhases = [
    { phase: 'Cockpit', items: [
      { id: 'dashboard', icon: Activity, label: 'Centro de Comando' }
    ]},
    { phase: 'Planejamento', id: 'planejamento', items: [
      { id: 'disciplinas', icon: Folder, label: 'Edital Verticalizado' },
      { id: 'planner', icon: LayoutGrid, label: 'Backlog de Sprints' }
    ]},
    { phase: 'Execução', id: 'acao', items: [
      { id: 'cronograma', icon: Target, label: 'Mesa de Foco' }, 
      { id: 'revisoes', icon: BrainCircuit, label: 'Motor de Revisão', badge: pendingReviewsCount }
    ]},
    { phase: 'Sistema', id: 'sistema', items: [
      { id: 'admin', icon: Settings, label: 'Painel de Controle' }
    ]}
  ];

  if (!isCloudReady) {
    return (
      <div className="min-h-screen bg-[#0d1526] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold animate-pulse text-white/50 tracking-widest uppercase text-[10px]">A sincronizar com a Base de Dados...</h2>
      </div>
    );
  }

  if (auth && !user) {
    return <AuthScreen auth={auth} themeColors={themeColors} />;
  }

  const mobileNavItems = [
    { id: 'dashboard', icon: Activity, label: 'Painel' },
    { id: 'disciplinas', icon: Folder, label: 'Edital' },
    { id: 'planner', icon: LayoutGrid, label: 'Backlog' },
    { id: 'cronograma', icon: Target, label: 'Foco', badge: customSprint.length > 0 ? customSprint.length : 0 },
    { id: 'revisoes', icon: BrainCircuit, label: 'Revisões', badge: pendingReviewsCount }
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.4); border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
      
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col md:flex-row font-sans transition-colors duration-300 relative">
        <ConfettiOverlay fire={confettiFire} themeColors={themeColors} />
        <LevelUpModal data={levelUpData} onClose={() => setLevelUpData(null)} />
        {showLevelMap && <LevelMapModal currentXp={gamification.xp} onClose={() => setShowLevelMap(false)} />}

        {/* MOBILE TOP HEADER */}
        <div className={`md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0d1526] shadow-md border-b border-slate-200 dark:border-white/5 z-20 sticky top-0 transition-colors duration-500`}>
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm p-1`}>
              <img src={projectConfig.logoUrl} alt="Logo" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest truncate max-w-[150px]`}>Olá, {projectConfig.userName.split(' ')[0]}</span>
              <h2 className={`font-black text-sm leading-tight tracking-tight truncate max-w-[150px] text-slate-800 dark:text-white`}>{projectConfig.appName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 bg-slate-50 dark:bg-[#111e36] hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-full transition-colors cursor-pointer shadow-sm`}>
              {isDarkMode ? <Sun className={`w-4 h-4 ${themeColors.brightText}`} /> : <Moon className={`w-4 h-4 text-slate-600`} />}
            </button>
          </div>
        </div>

        {/* SIDEBAR DESKTOP */}
        <aside className={`hidden md:flex w-[280px] bg-white dark:bg-[#0d1526] shadow-xl flex-col z-10 shrink-0 border-r border-slate-200/80 dark:border-white/5 sticky top-0 h-screen overflow-hidden transition-colors duration-300`}>
          <div className={`p-6 bg-slate-50/50 dark:bg-transparent border-b border-slate-200/80 dark:border-white/5 relative transition-colors duration-500 shrink-0`}>
            
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`absolute top-6 right-6 p-2 bg-white dark:bg-[#111e36] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-full transition-colors cursor-pointer shadow-sm text-slate-500 dark:text-white/40 z-10`}>
              {isDarkMode ? <Sun className={`w-4 h-4 ${themeColors.brightText}`} /> : <Moon className={`w-4 h-4 text-slate-600`} />}
            </button>

            <div className="flex items-center gap-4 min-w-0 mb-8 pr-10 mt-1">
              <div className={`w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm p-1.5`}>
                <img src={projectConfig.logoUrl} alt="Logo" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest truncate max-w-[120px]`}>Olá, {projectConfig.userName.split(' ')[0]}</span>
                <h2 className={`font-black text-lg tracking-tight truncate text-slate-800 dark:text-white`} title={projectConfig.appName}>{projectConfig.appName}</h2>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className={`text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest leading-tight mb-1 truncate`}>{projectConfig.concurso}</p>
                <h3 className={`text-lg font-black leading-tight truncate mb-3 text-slate-800 dark:text-white`}>{projectConfig.cargo}</h3>
                
                <div className="flex flex-col xl:flex-row gap-2 w-full mb-2">
                  <span className={`flex flex-1 items-center justify-center gap-1.5 bg-white dark:bg-[#111e36] px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-bold text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/5 shadow-sm truncate`} title={projectConfig.banca}>
                    {projectConfig.banca}
                  </span>
                  <span className={`flex shrink-0 items-center justify-center gap-1.5 bg-white dark:bg-[#111e36] px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-bold text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/5 shadow-sm`}>
                    <Target size={12} className={themeColors.brightText} /> {projectConfig.horasDia}h
                  </span>
                </div>
              </div>

              <div onClick={() => setShowLevelMap(true)} className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-[#111e36] border border-slate-200 dark:border-white/5 p-4 transition-all hover:shadow-md cursor-pointer shadow-sm`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <Award size={24} className={`${themeColors.brightText} ${themeColors.glow} group-hover:scale-110 transition-transform duration-300`} />
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 dark:text-white leading-none">Lvl {userLevel.nivel}</span>
                      <span className="text-[9px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest mt-1 truncate max-w-[90px]">{userLevel.titulo}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1 ${themeColors.primaryText} ${themeColors.bgSuperLight} px-2 py-1 rounded border ${themeColors.borderLight} flex-shrink-0`}>
                      <Flame size={12} className="fill-current animate-pulse" />
                      <span className="text-[10px] font-black">{gamification.streak}</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className={`absolute left-0 top-0 h-full ${themeColors.bgSolid} transition-all duration-1000 ease-out`} style={{ width: `${(gamification.xp / userLevel.max) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar flex flex-col bg-transparent">
            {navPhases.map((phaseGroup, pIdx) => (
              <div key={pIdx} className={pIdx > 0 ? "pt-5" : ""}>
                <h3 className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-3 px-3 text-left">{phaseGroup.phase}</h3>
                <div className="space-y-1.5">
                  {phaseGroup.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all font-bold text-sm cursor-pointer ${isActive ? `${themeColors.bgSuperLight} ${themeColors.primaryText} border ${themeColors.borderLight} shadow-sm` : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}>
                        <IconComponent className={`w-5 h-5 ${isActive ? themeColors.brightText : 'opacity-50'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.id === 'cronograma' && customSprint.length > 0 && <span className={`bg-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border dark:border-emerald-500/30 text-white text-[10px] font-black px-2 py-0.5 rounded-full`}>{customSprint.length}</span>}
                        {item.badge > 0 && <span className={`bg-red-500 dark:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/30 animate-pulse text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm`}>{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {user && (
            <div className="p-5 border-t border-slate-200/80 dark:border-white/5 bg-transparent mt-auto shrink-0">
              <button onClick={() => { if(window.confirm('Tem certeza que deseja sair do sistema?')) { auth && signOut(auth); } }} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:border-red-500/20 border border-transparent transition-all font-bold text-sm cursor-pointer">
                <LogOut className="w-4 h-4" /> Sair do Sistema
              </button>
            </div>
          )}
        </aside>

        {/* CONTENT AREA EXPANDIDA */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto pb-28 md:pb-10 text-left transition-all duration-300 relative">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full transition-all duration-500 h-full flex flex-col">
            {activeTab === 'dashboard' && <TabDashboard config={projectConfig} progressPerc={progressPerc} gamification={gamification} setGamification={setGamification} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} userLevel={userLevel} themeColors={themeColors} reviewStats={reviewStats} dailyReviewStats={dailyReviewStats} edital={edital} activeSubjectIds={activeSubjectIds} userProgress={userProgress} pendingReviewsCount={pendingReviewsCount} setActiveTab={setActiveTab} customSprint={customSprint} />}
            {activeTab === 'disciplinas' && <TabDisciplinas edital={edital} setEdital={setEdital} progress={userProgress} setUserProgress={setUserProgress} toggleSprintItem={toggleSprintItem} customSprint={customSprint} resetProgress={resetProgress} themeColors={themeColors} setActiveTab={setActiveTab} addXP={addXP} triggerVisualFlash={triggerVisualFlash} flashElementId={flashElementId} />}
            {activeTab === 'planner' && <TabPlanner customSprint={customSprint} setCustomSprint={setCustomSprint} sprintsCompleted={sprintsCompleted} setActiveTab={setActiveTab} themeColors={themeColors} progress={userProgress} toggleProgress={toggleProgress} flashElementId={flashElementId} />}
            {activeTab === 'cronograma' && <TabCronograma customSprint={customSprint} setCustomSprint={setCustomSprint} sprintsCompleted={sprintsCompleted} setSprintsCompleted={setSprintsCompleted} setActiveTab={setActiveTab} progress={userProgress} toggleProgress={toggleProgress} addXP={addXP} triggerConfetti={triggerConfetti} themeColors={themeColors} handleAutoLog={handleAutoLog} flashElementId={flashElementId} pendingReviewsCount={pendingReviewsCount} />}
            {activeTab === 'revisoes' && <TabRevisaoInteligente progress={userProgress} handleReviewFeedback={handleReviewFeedback} edital={edital} activeSubjectIds={activeSubjectIds} themeColors={themeColors} flashElementId={flashElementId} projectConfig={projectConfig} />}
            {activeTab === 'admin' && <TabAdmin auth={auth} config={projectConfig} setConfig={setProjectConfig} userProgress={userProgress} setUserProgress={setUserProgress} gamification={gamification} setGamification={setGamification} edital={edital} setEdital={setEdital} customSprint={customSprint} setCustomSprint={setCustomSprint} initialEdital={initialEdital} sprintsCompleted={sprintsCompleted} setSprintsCompleted={setSprintsCompleted} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} reviewStats={reviewStats} dailyReviewStats={dailyReviewStats} setDailyReviewStats={setDailyReviewStats} themeColors={themeColors} playLevelUpSound={playLevelUpSound} />}
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#0d1526] border-t border-slate-200 dark:border-white/5 flex justify-between items-end px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
          {mobileNavItems.map(item => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full py-1.5 gap-1 relative transition-colors ${isActive ? themeColors.brightText : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70'}`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? `${themeColors.bgSuperLight} scale-110` : ''}`}>
                  <IconComponent className={`w-6 h-6 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                </div>
                <span className={`text-[9px] font-bold tracking-tight transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 h-0 overflow-hidden translate-y-2'}`}>
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className="absolute top-0 right-1/4 translate-x-1/2 -translate-y-1/4 bg-red-500 dark:bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#0d1526] shadow-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

      </div>
    </div>
  );
}