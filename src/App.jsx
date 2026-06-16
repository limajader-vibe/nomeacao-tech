import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  PieChart, Calendar, CheckCircle, Clock, Target, BookOpen, 
  Layers, FileText, ChevronDown, Folder, FolderOpen, ChevronRight, PlayCircle, 
  RefreshCcw, Save, Trash2, Moon, Sun, ShoppingCart, ExternalLink, GripVertical, Plus, Link, Pencil, Settings,
  Edit, AlertTriangle, ChevronUp, Flame, Trophy, TrendingUp, Activity, Award, ListPlus, ArrowRight, ArrowLeft, BarChart2,
  Thermometer, CalendarDays, LayoutGrid, BrainCircuit, Eye, Zap, Image as ImageIcon, ShieldAlert, Download, Sliders, Lock, LogOut,
  UnfoldVertical, FoldVertical, FilePlus, Upload, Filter, Play, Pause, Coffee, PartyPopper, X, Menu, Search, Minus
} from 'lucide-react';

// --- FIREBASE CLOUD STORAGE SETUP ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Configuração Automática do Canvas ou Manual (Para o seu Vercel)
const canvasConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : null;

// 👇 CONCURSEIRO: MANTENHA AQUI AS SUAS CHAVES DO FIREBASE 👇
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

// Sanitização robusta para o ID do documento
const appIdStr = typeof __app_id !== 'undefined' ? String(__app_id) : 'nomeacao-tech-prod';
const safeAppId = encodeURIComponent(appIdStr).replace(/\./g, '_'); 

// --- CONFIGURAÇÃO INICIAL E TEMAS ---
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

export const THEMES = {
  default: {
    name: 'Azul Foco (Padrão)',
    sidebar: 'from-blue-700 to-indigo-900 dark:from-slate-800 dark:to-slate-950',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    activeTab: 'bg-indigo-600 dark:bg-indigo-500 text-white',
    icon: 'text-indigo-500',
    bg: 'bg-indigo-500',
    lightBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    headerBg: 'bg-indigo-100/60 dark:bg-indigo-950/40', 
    border: 'border-indigo-200/60 dark:border-indigo-800/50',
    text: 'text-indigo-600 dark:text-indigo-400',
    solidText: 'text-white'
  },
  esmeralda: {
    name: 'Esmeralda (Aprovação)',
    sidebar: 'from-emerald-700 to-teal-900 dark:from-slate-800 dark:to-slate-950',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    activeTab: 'bg-emerald-600 dark:bg-emerald-500 text-white',
    icon: 'text-emerald-500',
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    headerBg: 'bg-emerald-100/60 dark:bg-teal-950/40', 
    border: 'border-emerald-200/60 dark:border-emerald-800/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    solidText: 'text-white'
  },
  caveira: {
    name: 'Caveira (Preto/Dourado)',
    sidebar: 'from-slate-900 to-black dark:from-black dark:to-slate-950',
    button: 'bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold',
    activeTab: 'bg-amber-500 dark:bg-amber-500 text-slate-900 font-black',
    icon: 'text-amber-500',
    bg: 'bg-amber-500',
    lightBg: 'bg-amber-50 dark:bg-amber-900/20',
    headerBg: 'bg-amber-100/60 dark:bg-amber-950/40', 
    border: 'border-amber-200/60 dark:border-amber-800/50',
    text: 'text-amber-600 dark:text-amber-400',
    solidText: 'text-slate-900 font-black'
  },
  retaFinal: {
    name: 'Reta Final (Vermelho Alerta)',
    sidebar: 'from-red-700 to-rose-900 dark:from-slate-800 dark:to-slate-950',
    button: 'bg-rose-600 hover:bg-rose-700 text-white',
    activeTab: 'bg-rose-600 dark:bg-rose-500 text-white',
    icon: 'text-rose-500',
    bg: 'bg-rose-500',
    lightBg: 'bg-rose-50 dark:bg-rose-900/20',
    headerBg: 'bg-rose-100/60 dark:bg-rose-950/40', 
    border: 'border-rose-200/60 dark:border-rose-800/50',
    text: 'text-rose-600 dark:text-rose-400',
    solidText: 'text-white'
  }
};

// --- SINTETIZADOR NATIVO DE EFEITOS SONOROS ---
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
      playTone(987.77, 'square', 0, 0.1, 0.1);     // B5
      playTone(1318.51, 'square', 0.1, 0.4, 0.1);  // E6
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

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-sm mb-8">
       <div className="flex items-center gap-4">
         <div className={`p-3 rounded-xl transition-colors duration-500 ${isPomodoroActive && !isPomodoroBreak ? `${themeColors.bg.split(' ')[0]} text-white animate-pulse shadow-md` : isPomodoroBreak ? 'bg-emerald-500 text-white animate-pulse shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
           {isPomodoroBreak ? <Coffee className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
         </div>
         <div className="hidden sm:block">
           <h3 className="font-bold text-base text-slate-800 dark:text-white leading-none mb-1">{isPomodoroBreak ? 'Pausa' : 'Modo Foco'}</h3>
           <span className="text-xs text-slate-500 font-medium">50min Estudo / 10min Pausa</span>
         </div>
       </div>
       
       <div className="flex items-center gap-5 pr-2">
         <span className={`font-mono text-4xl font-black tracking-tighter w-28 text-center transition-colors duration-500 ${isPomodoroActive && !isPomodoroBreak ? themeColors.text.split(' ')[0] : isPomodoroBreak ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
           {formatTime(pomodoroTime)}
         </span>
         <div className="flex gap-2">
           <button onClick={togglePomodoro} className={`p-3 rounded-xl shadow-sm transition-transform hover:scale-105 cursor-pointer ${isPomodoroActive ? 'bg-slate-800 text-white dark:bg-slate-700' : `${themeColors.button.split(' ')[0]} text-white`}`}>
             {isPomodoroActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
           </button>
           <button onClick={resetPomodoro} className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-transform hover:scale-105 cursor-pointer shadow-sm" title="Reiniciar">
             <RefreshCcw className="w-5 h-5" />
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
  const colorClass = percent === 100 ? 'text-emerald-500' : themeColors.text.split(' ')[0];

  return (
    <div className="relative flex items-center justify-center w-6 h-6 shrink-0 opacity-80">
      <svg className="w-6 h-6 transform -rotate-90">
        <circle cx="12" cy="12" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-200 dark:text-slate-700" />
        <circle cx="12" cy="12" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`transition-all duration-1000 ${colorClass}`} />
      </svg>
      {percent === 100 && <CheckCircle className={`absolute w-3.5 h-3.5 text-emerald-500 bg-white dark:bg-slate-900 rounded-full`} />}
    </div>
  );
};

const ConfettiOverlay = ({ fire }) => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (fire > 0) {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
      const newParticles = Array.from({ length: 100 }).map((_, i) => ({
        id: i, left: Math.random() * 100, delay: Math.random() * 0.5, duration: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)], size: 6 + Math.random() * 10, tilt: Math.random() * 360
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [fire]);

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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 px-4">
      <div className="bg-gradient-to-b from-amber-100 to-white dark:from-amber-900/60 dark:to-slate-900 p-8 md:p-10 rounded-[2rem] shadow-2xl border-4 border-amber-300 dark:border-amber-700 max-w-sm w-full text-center transform transition-all animate-in zoom-in-90 duration-500 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-spin-slow pointer-events-none" style={{ animationDuration: '15s' }}>
           <div className="w-[150%] h-4 bg-amber-400 absolute rotate-0"></div><div className="w-[150%] h-4 bg-amber-400 absolute rotate-45"></div><div className="w-[150%] h-4 bg-amber-400 absolute rotate-90"></div><div className="w-[150%] h-4 bg-amber-400 absolute -rotate-45"></div>
        </div>
        <div className="relative z-10">
          <div className="w-28 h-28 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
            <Award className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-4xl font-black text-amber-600 dark:text-amber-500 mb-2 drop-shadow-sm">Nível {data.nivel}!</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium">A sua persistência foi recompensada.</p>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 mb-8 shadow-inner">
            <span className="block text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">Nova Patente Adquirida</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{data.titulo}</span>
          </div>
          <button onClick={onClose} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-black transition-all shadow-lg hover:shadow-orange-500/40 text-lg flex items-center justify-center gap-2 cursor-pointer">
            <PartyPopper className="w-5 h-5"/> Continuar a Missão
          </button>
        </div>
      </div>
    </div>
  );
};

const LevelMapModal = ({ onClose, currentXp }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors"><X className="w-5 h-5"/></button>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2"><Trophy className="text-amber-500"/> Jornada de Aprovação</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Acompanhe os níveis e a experiência (XP) necessária para evoluir.</p>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {LEVELS_MAP.map(lvl => {
            const isCurrent = currentXp >= lvl.min && currentXp < lvl.max;
            const isPast = currentXp >= lvl.max;
            return (
              <div key={lvl.nivel} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isCurrent ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50 scale-[1.02] shadow-sm' : isPast ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 opacity-70' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50'}`}>
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black ${isCurrent ? 'bg-amber-500 text-white' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                  {isPast ? <CheckCircle className="w-5 h-5"/> : lvl.nivel}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${isCurrent ? 'text-amber-700 dark:text-amber-400' : isPast ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>{lvl.titulo}</h4>
                  <p className="text-xs uppercase font-bold text-slate-400">{lvl.min} a {lvl.max} XP</p>
                </div>
                {isCurrent && <div className="text-xs font-black uppercase text-amber-500 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded-md">Atual</div>}
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
const AuthScreen = ({ auth }) => {
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-200 animate-in fade-in">
      <div className="bg-slate-900 p-8 rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
        
        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 flex items-center justify-center rounded-full mx-auto mb-6 shadow-inner">
          <Lock className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-black text-center text-white mb-2">Nomeação.Tech</h2>
        <p className="text-slate-400 text-center mb-8 text-sm px-4">
          {isLogin ? 'Faça login para sincronizar a sua Trilha e Sprints em qualquer dispositivo.' : 'Crie a sua conta gratuita para salvar os seus estudos na Nuvem.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">O seu E-mail</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 transition-colors shadow-inner" 
              placeholder="estudante@concursos.com" 
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">Palavra-passe</label>
            <input 
              type="password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-indigo-500 transition-colors shadow-inner font-black tracking-widest" 
              placeholder="••••••••" 
            />
          </div>
          
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1.5 block ml-1 flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Código de Convite (Acesso Restrito)</label>
              <input 
                type="text" required={!isLogin} value={accessCode} onChange={e => setAccessCode(e.target.value)} 
                className="w-full p-4 rounded-xl bg-slate-950 border border-amber-500/50 text-amber-500 outline-none focus:border-amber-400 transition-colors shadow-inner font-black tracking-widest uppercase" 
                placeholder="Insira o código secreto..." 
              />
            </div>
          )}
          
          {error && <p className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5"/>{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-colors mt-4 shadow-lg disabled:opacity-50 cursor-pointer">
            {loading ? 'A sincronizar com a Nuvem...' : (isLogin ? 'Entrar no Sistema' : 'Criar a Minha Conta')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer">
            {isLogin ? 'Não tem conta? Clique para criar' : 'Já tem conta? Clique para entrar'}
          </button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// APLICAÇÃO PRINCIPAL
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 

  // EFEITOS DE SUCESSO (DOPAMINA)
  const [confettiFire, setConfettiFire] = useState(0);
  const [levelUpData, setLevelUpData] = useState(null);
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [flashElementId, setFlashElementId] = useState(null); 

  // ESTADOS DE DADOS E MÉTRICAS
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

  // 1. INICIALIZAÇÃO DO FIREBASE AUTH
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

  // 2. SINCRONIZAÇÃO DE LEITURA (NUVEM -> LOCAL)
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

  // 3. SINCRONIZAÇÃO DE ESCRITA (LOCAL -> NUVEM)
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
  
  // UX 4: Reforço Visual Dopamina (Flash Green)
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

  const toggleProgress = (assId, type) => {
    setUserProgress(prev => {
      const current = prev[assId] || {};
      const newState = { ...current, [type]: !current[type] };
      if (type === 'estudado' && !newState.estudado) { newState.questoes = false; newState.revisado = false; }
      if (type === 'questoes' && !newState.questoes) { newState.revisado = false; }
      if (type === 'revisado') {
        if (newState.revisado) {
          const now = new Date().getTime();
          newState.lastReviewedTimestamp = now;
          newState.nextReviewTimestamp = now + (1000 * 60 * 60 * 24 * 1);
          addXP(10);
        } else {
          newState.lastReviewedTimestamp = null;
          newState.nextReviewTimestamp = null;
        }
      }
      triggerVisualFlash(assId);
      return { ...prev, [assId]: newState };
    });
  };

  const handleReviewFeedback = (assId, feedbackType) => {
    setReviewStats(prev => ({ ...prev, [feedbackType]: (prev[feedbackType] || 0) + 1 }));
    
    // UX 3: Salva no Histórico Diário de Evolução
    const today = new Date().toLocaleDateString();
    setDailyReviewStats(prev => {
      const current = prev[today] || { facil: 0, bom: 0, dificil: 0 };
      return { ...prev, [today]: { ...current, [feedbackType]: current[feedbackType] + 1 } };
    });

    setUserProgress(prev => {
      const current = prev[assId] || {};
      const now = new Date().getTime();
      let daysToAdd = 1; 
      if (feedbackType === 'bom') daysToAdd = projectConfig.revBom || 7;
      if (feedbackType === 'facil') daysToAdd = projectConfig.revFacil || 15;
      addXP(15); 
      triggerVisualFlash(assId);
      return { ...prev, [assId]: { ...current, revisado: true, lastReviewedTimestamp: now, nextReviewTimestamp: now + (1000 * 60 * 60 * 24 * daysToAdd) } };
    });
  };

  const resetProgress = (assId) => { setUserProgress(prev => ({ ...prev, [assId]: { estudado: false, questoes: false, revisado: false, lastReviewedTimestamp: null, nextReviewTimestamp: null } })); };

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
  const pendingReviewsCount = Object.entries(userProgress).filter(([id, data]) => {
    if (!activeSubjectIds.has(id)) return false;
    if (!data.estudado) return false;
    if (data.revisado && data.nextReviewTimestamp && data.nextReviewTimestamp <= now) return true;
    if (!data.revisado) return true;
    return false;
  }).length;

  const totalAssuntos = activeSubjectIds.size;
  const totalCheckboxes = totalAssuntos * 3; 
  const completedCheckboxes = Object.entries(userProgress).reduce((acc, [assId, data]) => {
    if (!activeSubjectIds.has(assId)) return acc;
    return acc + (data.estudado ? 1 : 0) + (data.questoes ? 1 : 0) + (data.revisado ? 1 : 0);
  }, 0);
  const progressPerc = totalCheckboxes === 0 ? 0 : Math.round((completedCheckboxes / totalCheckboxes) * 100);

  // UX 1: Renomeação SaaS das Abas
  const navPhases = [
    { phase: 'Cockpit', items: [
      { id: 'dashboard', icon: Activity, label: 'Centro de Comando' }
    ]},
    { phase: 'Planejamento', id: 'planejamento', items: [
      { id: 'disciplinas', icon: Folder, label: 'Edital Verticalizado' },
      { id: 'planner', icon: LayoutGrid, label: 'Backlog de Sprints' }
    ]},
    { phase: 'Execução', id: 'acao', items: [
      { id: 'cronograma', icon: Calendar, label: 'Mesa de Foco' }, 
      { id: 'revisoes', icon: BrainCircuit, label: 'Motor de Revisão', badge: pendingReviewsCount }
    ]},
    { phase: 'Sistema', id: 'sistema', items: [
      { id: 'admin', icon: Settings, label: 'Painel de Controle' }
    ]}
  ];

  if (!isCloudReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold animate-pulse">Sincronizando com a Nuvem...</h2>
      </div>
    );
  }

  if (auth && !user) {
    return <AuthScreen auth={auth} />;
  }

  const mobileNavItems = [
    { id: 'dashboard', icon: Activity, label: 'Painel' },
    { id: 'disciplinas', icon: Folder, label: 'Edital' },
    { id: 'planner', icon: LayoutGrid, label: 'Backlog' },
    { id: 'cronograma', icon: Calendar, label: 'Foco', badge: customSprint.length > 0 ? customSprint.length : 0 },
    { id: 'revisoes', icon: BrainCircuit, label: 'Revisões', badge: pendingReviewsCount }
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-200 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col md:flex-row font-sans transition-colors duration-300 relative">
        <ConfettiOverlay fire={confettiFire} />
        <LevelUpModal data={levelUpData} onClose={() => setLevelUpData(null)} />
        {showLevelMap && <LevelMapModal currentXp={gamification.xp} onClose={() => setShowLevelMap(false)} />}

        {/* MOBILE TOP HEADER */}
        <div className={`md:hidden flex items-center justify-between p-4 ${themeColors.headerBg} shadow-md border-b ${themeColors.border} z-20 sticky top-0 transition-colors duration-500`}>
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className={`w-11 h-11 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 shadow-sm`}>
              <img src={projectConfig.logoUrl} alt="Logo" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-[10px] ${themeColors.headerSubtext} font-bold uppercase tracking-widest truncate max-w-[150px]`}>Olá, {projectConfig.userName.split(' ')[0]}</span>
              <h2 className={`font-extrabold text-base leading-tight tracking-tight truncate max-w-[150px] ${themeColors.headerText}`}>{projectConfig.appName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 rounded-full transition-colors cursor-pointer shadow-sm`}>
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className={`w-4 h-4 ${themeColors.text.split(' ')[0]}`} />}
            </button>
          </div>
        </div>

        {/* SIDEBAR DESKTOP - Fixa e Sólida */}
        <aside className={`hidden md:flex w-72 bg-white dark:bg-slate-900 shadow-xl flex-col z-10 shrink-0 border-r border-slate-300 dark:border-slate-800 sticky top-0 h-screen overflow-hidden`}>
          <div className={`p-6 ${themeColors.headerBg} border-b ${themeColors.border} relative transition-colors duration-500 shrink-0`}>
            
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`absolute top-6 right-6 p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700 rounded-full transition-colors cursor-pointer shadow-sm text-slate-500 dark:text-slate-400 z-10`}>
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className={`w-4 h-4 ${themeColors.text.split(' ')[0]}`} />}
            </button>

            <div className="flex items-center gap-3 min-w-0 mb-6 pr-10 mt-1">
              <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 shadow-sm`}>
                <img src={projectConfig.logoUrl} alt="Logo" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-contain p-1.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-[10px] ${themeColors.headerSubtext} font-bold uppercase tracking-widest truncate max-w-[120px]`}>Olá, {projectConfig.userName.split(' ')[0]}</span>
                <h2 className={`font-extrabold text-xl tracking-tight truncate ${themeColors.headerText}`} title={projectConfig.appName}>{projectConfig.appName}</h2>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div>
                <p className={`text-[10px] ${themeColors.headerSubtext} font-bold uppercase tracking-widest leading-tight mb-1.5 truncate`}>{projectConfig.concurso}</p>
                <h3 className={`text-xl font-black leading-tight truncate mb-2 ${themeColors.headerText}`}>{projectConfig.cargo}</h3>
                
                <div className="flex flex-col xl:flex-row gap-2 w-full mb-1">
                  <span className={`flex flex-1 items-center justify-center gap-1.5 bg-white dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl text-[10px] font-bold ${themeColors.text.split(' ')[0]} border border-slate-300 dark:border-slate-700 shadow-sm truncate`} title={projectConfig.banca}>
                    {projectConfig.banca}
                  </span>
                  <span className={`flex shrink-0 items-center justify-center gap-1.5 bg-white dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl text-[10px] font-bold ${themeColors.text.split(' ')[0]} border border-slate-300 dark:border-slate-700 shadow-sm`}>
                    <Target size={12} /> {projectConfig.horasDia}h/dia
                  </span>
                </div>
              </div>

              <div onClick={() => setShowLevelMap(true)} className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 p-4 transition-all hover:shadow-md cursor-pointer shadow-sm`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <Award size={22} className="text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform duration-300" />
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 dark:text-white leading-none">Lvl {userLevel.nivel}</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 truncate max-w-[90px]">{userLevel.titulo}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-2 py-1 rounded-md flex-shrink-0 border border-orange-200 dark:border-orange-500/20">
                      <Flame size={12} className="fill-current animate-pulse" />
                      <span className="text-[11px] font-black">{gamification.streak}</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000 ease-out" style={{ width: `${(gamification.xp / userLevel.max) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar flex flex-col bg-slate-50/50 dark:bg-slate-900">
            {navPhases.map((phaseGroup, pIdx) => (
              <div key={pIdx} className={pIdx > 0 ? "pt-4" : ""}>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-4 text-left">{phaseGroup.phase}</h3>
                <div className="space-y-1">
                  {phaseGroup.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all font-medium cursor-pointer ${activeTab === item.id ? themeColors.activeTab + ' shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <IconComponent className={`w-5 h-5 ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.id === 'cronograma' && customSprint.length > 0 && <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{customSprint.length}</span>}
                        {item.badge > 0 && <span className="bg-red-500 animate-pulse text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {user && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-auto shrink-0">
              <button onClick={() => { if(window.confirm('Tem certeza que deseja sair do sistema?')) { auth && signOut(auth); } }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-sm cursor-pointer">
                <LogOut className="w-4 h-4" /> Sair do Sistema
              </button>
            </div>
          )}
        </aside>

        {/* CONTENT AREA EXPANDIDA (MAX WIDTH 1600px PARA COCKPIT REAL) */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-28 md:pb-8 text-left">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full transition-all duration-500 h-full flex flex-col">
            {activeTab === 'dashboard' && <TabDashboard config={projectConfig} progressPerc={progressPerc} gamification={gamification} setGamification={setGamification} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} userLevel={userLevel} themeColors={themeColors} reviewStats={reviewStats} dailyReviewStats={dailyReviewStats} edital={edital} activeSubjectIds={activeSubjectIds} userProgress={userProgress} />}
            {activeTab === 'disciplinas' && <TabDisciplinas edital={edital} setEdital={setEdital} progress={userProgress} setUserProgress={setUserProgress} toggleSprintItem={toggleSprintItem} customSprint={customSprint} resetProgress={resetProgress} themeColors={themeColors} setActiveTab={setActiveTab} addXP={addXP} triggerVisualFlash={triggerVisualFlash} flashElementId={flashElementId} />}
            {activeTab === 'planner' && <TabPlanner customSprint={customSprint} setCustomSprint={setCustomSprint} sprintsCompleted={sprintsCompleted} setActiveTab={setActiveTab} themeColors={themeColors} progress={userProgress} toggleProgress={toggleProgress} flashElementId={flashElementId} />}
            {activeTab === 'cronograma' && <TabCronograma customSprint={customSprint} setCustomSprint={setCustomSprint} sprintsCompleted={sprintsCompleted} setSprintsCompleted={setSprintsCompleted} setActiveTab={setActiveTab} progress={userProgress} toggleProgress={toggleProgress} addXP={addXP} triggerConfetti={triggerConfetti} themeColors={themeColors} handleAutoLog={handleAutoLog} flashElementId={flashElementId} />}
            {activeTab === 'revisoes' && <TabRevisaoInteligente progress={userProgress} handleReviewFeedback={handleReviewFeedback} edital={edital} activeSubjectIds={activeSubjectIds} themeColors={themeColors} flashElementId={flashElementId} />}
            {activeTab === 'admin' && <TabAdmin auth={auth} config={projectConfig} setConfig={setProjectConfig} userProgress={userProgress} setUserProgress={setUserProgress} gamification={gamification} setGamification={setGamification} edital={edital} setEdital={setEdital} customSprint={customSprint} setCustomSprint={setCustomSprint} initialEdital={initialEdital} sprintsCompleted={sprintsCompleted} setSprintsCompleted={setSprintsCompleted} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} reviewStats={reviewStats} dailyReviewStats={dailyReviewStats} setDailyReviewStats={setDailyReviewStats} themeColors={themeColors} playLevelUpSound={playLevelUpSound} />}
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
          {mobileNavItems.map(item => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full py-1 gap-1 relative transition-colors ${isActive ? themeColors.text.split(' ')[0] : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? `${themeColors.lightBg.split(' ')[0]} scale-110` : ''}`}>
                  <IconComponent className={`w-6 h-6 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                </div>
                <span className={`text-[9px] font-bold tracking-tight transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 h-0 overflow-hidden translate-y-2'}`}>
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span className="absolute top-0 right-1/4 translate-x-1/2 -translate-y-1/4 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
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

// ==========================================
// ABA DASHBOARD / CENTRO DE COMANDO
// ==========================================
function TabDashboard({ config, progressPerc, gamification, setGamification, dailyLogs, setDailyLogs, userLevel, themeColors, reviewStats, dailyReviewStats, edital, activeSubjectIds, userProgress }) {
  const today = new Date().toLocaleDateString();
  const todayHours = dailyLogs[today] || 0;
  
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [editHoursValue, setEditHoursValue] = useState(todayHours);

  useEffect(() => {