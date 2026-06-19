import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  PieChart, Calendar, CheckCircle, Clock, Target, BookOpen, 
  Layers, ChevronDown, Folder, ChevronRight, PlayCircle, 
  RefreshCcw, Save, Trash2, Moon, Sun, ShoppingCart, ExternalLink, GripVertical, Plus, Pencil, Settings,
  Edit, AlertTriangle, ChevronUp, Activity, ListPlus, ArrowRight, ArrowLeft, BarChart2,
  CalendarDays, LayoutGrid, BrainCircuit, ShieldAlert, Download, Sliders, Lock, LogOut,
  Filter, Play, Pause, Coffee, X, Menu, Minus, Upload, Palette, FolderOpen, ChevronsDown, ChevronsUp, Crosshair, Zap, Map, Flame
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
    badgeBg: 'bg-indigo-500 dark:bg-indigo-500/10',
    badgeText: 'text-white dark:text-indigo-400',
    badgeBorder: 'border-indigo-600 dark:border-indigo-500/30'
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
    badgeBg: 'bg-emerald-500 dark:bg-emerald-500/10',
    badgeText: 'text-white dark:text-emerald-400',
    badgeBorder: 'border-emerald-600 dark:border-emerald-500/30'
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
    badgeBg: 'bg-orange-500 dark:bg-orange-500/10',
    badgeText: 'text-white dark:text-orange-400',
    badgeBorder: 'border-orange-600 dark:border-orange-500/30'
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
    badgeBg: 'bg-rose-500 dark:bg-rose-500/10',
    badgeText: 'text-white dark:text-rose-400',
    badgeBorder: 'border-rose-600 dark:border-rose-500/30'
  }
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

function StopwatchWidget({ themeColors, isTimerActive, toggleTimer, displayTimerSeconds }) {
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
  };
  
  return (
    <div className={`flex items-center justify-between bg-white dark:bg-[#111e36] border ${isTimerActive ? `${themeColors.borderSolid} shadow-lg ${themeColors.shadowHover}` : 'border-slate-200/60 dark:border-white/5'} p-4 rounded-2xl mb-6 transition-all duration-300`}>
       <div className="flex items-center gap-4">
         <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
           <div className={`absolute inset-0 rounded-full border-[3px] border-slate-100 dark:border-white/5 ${isTimerActive ? 'animate-[spin_3s_linear_infinite] border-t-transparent border-r-transparent ' + themeColors.borderSolid : ''}`}></div>
           <div className={`absolute inset-0 flex items-center justify-center ${isTimerActive ? 'animate-pulse' : ''}`}>
               <Clock className={`w-5 h-5 ${isTimerActive ? themeColors.brightText : 'text-slate-400 dark:text-slate-500'}`} />
           </div>
         </div>
         <div className="flex flex-col">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">Acumulado do Dia</span>
           <span className={`font-mono text-2xl font-black tabular-nums tracking-tighter leading-none ${isTimerActive ? themeColors.brightText : 'text-slate-800 dark:text-white'}`}>
             {formatTime(displayTimerSeconds)}
           </span>
         </div>
       </div>
       <div className="flex gap-2">
         <button onClick={toggleTimer} className={`p-3 rounded-xl transition-all hover:scale-105 cursor-pointer ${isTimerActive ? 'bg-slate-800 text-white dark:bg-white/10 dark:hover:bg-white/20' : `${themeColors.bgSolid} text-white shadow-md`}`}>
           {isTimerActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
         </button>
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
          {isLogin ? 'Faça login para sincronizar o seu Painel de Voo.' : 'Crie a sua conta gratuita para salvar os seus estudos na Nuvem.'}
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
// ABA: PAINEL GERAL (DASHBOARD INICIANTE - MINIMALISMO)
// ==========================================
function TabQG({ config, progressPerc, dailyLogs, setDailyLogs, themeColors, edital, activeSubjectIds, userProgress, pendingReviewsCount, setActiveTab, customSprint, totalAssuntos, currentStreak }) {
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
    }
    setIsEditingHours(false);
  };

  const totalMastered = Object.entries(userProgress).filter(([id, data]) => activeSubjectIds.has(id) && data.estudado && data.questoes && data.revisado).length;

  // Raio-X de Avanço por Disciplina
  const discProgress = [];
  edital.forEach(b => b.disciplinas.forEach(d => {
      const totalDisc = d.assuntos.length;
      if (totalDisc === 0) return;
      let completedDisc = 0;
      d.assuntos.forEach(ass => {
         const p = userProgress[ass.id];
         if(p && p.estudado && p.questoes && p.revisado) completedDisc++;
      });
      discProgress.push({ id: d.id, nome: d.nome, perc: Math.round((completedDisc/totalDisc)*100) });
  }));
  discProgress.sort((a,b) => b.perc - a.perc);

  const todayObj = new Date(); todayObj.setHours(23, 59, 59, 999);
  
  const last14Days = Array.from({length: 14}).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return { dateObj: d, dateStr: d.toLocaleDateString(), dayLabel: d.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase() };
  }).reverse(); 
  
  const maxHoursLogged = Math.max(...last14Days.map(d => dailyLogs[d.dateStr] || 0));
  const maxHours = Math.max(maxHoursLogged, config.horasDia * 1.2, 2); 

  const formattedDate = new Intl.DateTimeFormat('pt-PT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).replace(/\./g, '');
  
  const hour = new Date().getHours();
  let greeting = 'Boa noite';
  if (hour >= 5 && hour < 12) greeting = 'Bom dia';
  else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
  
  const firstName = config.userName ? config.userName.split(' ')[0] : 'Concurseiro';

  const activeSprintItems = customSprint ? customSprint.slice(0, 2) : [];
  
  let statusText = '';
  if (pendingReviewsCount > 0) {
     statusText = `1º Passo: Você tem ${pendingReviewsCount} revisão(ões) na fila. Limpe-as primeiro.`;
  } else if (activeSprintItems.length > 0) {
     statusText = `2º Passo: Revisões limpas! O seu foco agora é Estudar Hoje.`;
  } else {
     statusText = `3º Passo: Missão cumprida por hoje. Vá descansar ou adicione novos alvos em Disciplinas/Metas.`;
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      
      {/* CABEÇALHO E NEXT ACTION CARD */}
      <div className="mb-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>Painel Geral</span> <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20"></span> <span>{formattedDate.toUpperCase()}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">
              {greeting}, {firstName}.
            </h2>
            <p className="text-base text-slate-500 dark:text-white/60 font-medium">
              {statusText}
            </p>
          </div>
        </div>

        {/* CARTÃO DE PRÓXIMA AÇÃO (Loop de Hábitos Simplificado) */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-6 md:p-8 border border-slate-200/60 dark:border-white/5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 opacity-5 dark:opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             {pendingReviewsCount > 0 ? <RefreshCcw className="w-64 h-64 text-red-500" /> : activeSprintItems.length > 0 ? <Target className={`w-64 h-64 ${themeColors.brightText}`} /> : <CheckCircle className="w-64 h-64 text-emerald-500" />}
          </div>

          {pendingReviewsCount > 0 ? (
            <div className="relative z-10">
              <span className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest mb-3"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> 1º PASSO: LIMPAR MEMÓRIA</span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Atenção Crítica nas Revisões</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 mb-6 max-w-lg">O sistema detectou tópicos a evaporar. Estancar essa perda é a sua prioridade máxima agora.</p>
              <button onClick={() => setActiveTab('memoria')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center">
                Iniciar Revisões <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : activeSprintItems.length > 0 ? (
            <div className="relative z-10">
              <span className={`flex items-center gap-2 text-[10px] font-black ${themeColors.brightText} uppercase tracking-widest mb-3`}><div className={`w-2 h-2 rounded-full ${themeColors.bgSolid} animate-pulse`}></div> 2º PASSO: ESTUDAR HOJE</span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 truncate max-w-2xl">{activeSprintItems.map(i => i.assTitulo).join(' • ')}</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 mb-6 max-w-lg">Memória blindada. O caminho está livre para absorver conhecimento novo.</p>
              <button onClick={() => setActiveTab('metas')} className={`${themeColors.bgSolid} ${themeColors.bgHover} text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${themeColors.shadowHover} flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center`}>
                Ir para Estudar Hoje <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative z-10">
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 3º PASSO: DESCANSO OU PLANEJAMENTO</span>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Operação Concluída</h3>
              <p className="text-sm text-slate-600 dark:text-white/60 mb-6 max-w-lg">Não há metas pendentes. O músculo cresce no repouso, mas se quiser, abasteça o seu plano para amanhã.</p>
              <button onClick={() => setActiveTab('arsenal')} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center border border-slate-200 dark:border-white/10">
                Disciplinas/Metas <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OS 3 PILARES ESSENCIAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PILAR 1: Disciplinas Concluídas */}
        <div className={`bg-white dark:bg-[#111e36] rounded-[2rem] p-6 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col relative overflow-hidden border-l-4 ${themeColors.borderLeft}`}>
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-black text-slate-500 dark:text-white/40 uppercase tracking-widest mt-1">Disciplinas Concluídas</p>
            <div className={`p-2.5 rounded-xl border ${themeColors.borderLight} ${themeColors.bgSuperLight}`}>
              <PieChart className={`w-5 h-5 ${themeColors.brightText}`}/>
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
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-wide">{totalMastered} de {totalAssuntos} tópicos fechados</p>
          </div>
        </div>

        {/* PILAR 2: Dias Seguidos */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-6 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col relative overflow-hidden border-l-4 border-l-orange-500 dark:border-l-orange-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs font-black text-slate-500 dark:text-white/40 uppercase tracking-widest mt-1">Dias Seguidos</p>
            <div className="p-2.5 rounded-xl border border-orange-200 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-500/5">
              <CalendarDays className="w-5 h-5 text-orange-500"/>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-2 mt-2 relative min-h-[48px]">
            <div className="flex items-baseline gap-1.5">
                <span className={`text-5xl font-black leading-none ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-800 dark:text-white'}`}>{currentStreak}</span>
            </div>
          </div>
          <div className="mt-8">
            <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0d1526] rounded-full overflow-hidden mb-3">
              <div className={`h-full transition-all duration-1000 ${currentStreak > 0 ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`} style={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}></div>
            </div>
            <p className={`text-[10px] font-bold tracking-wide text-slate-400 dark:text-white/30`}>Dias seguidos batendo a meta</p>
          </div>
        </div>

        {/* PILAR 3: Horas Estudadas Hoje */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-6 shadow-sm border border-slate-200/60 dark:border-white/5 flex flex-col relative overflow-hidden border-l-4 border-l-purple-500 dark:border-l-purple-500">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-xs font-black text-slate-500 dark:text-white/40 uppercase tracking-widest mt-1">Horas Estudadas Hoje</p>
            <div className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50/50 dark:bg-purple-500/5">
              <Clock className="w-5 h-5 text-purple-500"/>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-2 mt-2 relative min-h-[48px]">
            {isEditingHours ? (
              <div className="flex items-center gap-1">
                <input type="number" step="0.5" min="0" autoFocus value={editHoursValue} onChange={e => setEditHoursValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveHours()} onBlur={handleSaveHours} className="w-24 text-5xl font-black text-slate-800 dark:text-white bg-transparent border-b-2 border-purple-500 outline-none pb-1" />
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5 group cursor-pointer" onClick={() => setIsEditingHours(true)} title="Editar horas manuais">
                <span className="text-5xl font-black text-slate-800 dark:text-white leading-none transition-colors group-hover:text-purple-500">{todayHours.toFixed(1)}</span>
                <span className="text-lg font-bold text-slate-400 dark:text-white/30">/ {config.horasDia}h</span>
                <Pencil className="w-4 h-4 text-slate-300 dark:text-white/20 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-colors ml-1 mb-1" />
              </div>
            )}
          </div>
          <div className="mt-8">
            <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0d1526] rounded-full overflow-hidden mb-3">
              <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${Math.min((todayHours / config.horasDia) * 100, 100)}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 tracking-wide">Meta diária de estudos</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
        
        {/* INSIGHT A: Histórico de Horas */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] p-8 border border-slate-200/60 dark:border-white/5 shadow-sm flex flex-col h-full min-h-[300px]">
          <div className="flex flex-col justify-between items-start mb-8 gap-1">
             <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><BarChart2 className={`w-5 h-5 text-purple-500`}/> Histórico de Horas (Últimos 14 Dias)</h3>
             <p className="text-xs text-slate-500 dark:text-white/40">O seu tempo de dedicação ao longo das semanas.</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 mt-auto pt-4 relative">
            {/* Meta Line */}
            <div className="absolute w-full border-t border-dashed border-purple-500/30 flex items-center justify-end pr-1" style={{ bottom: `${(config.horasDia / maxHours) * 100}%` }}>
              <span className="text-[10px] font-bold text-purple-500 bg-white dark:bg-[#111e36] px-1.5 -translate-y-1/2">Meta: {config.horasDia}h</span>
            </div>

            {/* Bars for Hours (Clean) */}
            {last14Days.map((day, i) => {
              const hours = dailyLogs[day.dateStr] || 0;
              const heightPerc = (hours / maxHours) * 100;
              const isToday = i === 13;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group z-20">
                  <div className="w-full h-40 flex items-end justify-center relative">
                    <div className={`w-full max-w-[24px] rounded-t-lg transition-all duration-700 ease-out hover:opacity-80 ${isToday ? 'bg-purple-500' : 'bg-slate-200 dark:bg-[#0d1526] border dark:border-white/5'} relative`} style={{ height: `${heightPerc}%`, minHeight: hours > 0 ? '4px' : '0' }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black px-2 py-1.5 rounded pointer-events-none transition-opacity shadow-sm flex flex-col items-center gap-0.5 min-w-max">
                          <span>{hours > 0 ? `${hours}h` : '0h'}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black mt-3 uppercase ${isToday ? 'text-purple-500' : 'text-slate-400 dark:text-white/30'}`}>{day.dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* INSIGHT B: Progresso por Matéria */}
        <div className="bg-white dark:bg-[#111e36] rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-white/5 p-8 flex flex-col h-full max-h-[320px]">
          <div className="flex justify-between items-center mb-6 shrink-0">
             <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2"><Layers className={`w-5 h-5 ${themeColors.brightText}`}/> Progresso por Matéria</h3>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
               {discProgress.length === 0 ? <p className="text-sm text-slate-400 dark:text-white/30">Sem disciplinas registadas.</p> : discProgress.map(d => (
                 <div key={d.id}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-3">{d.nome}</span>
                      <span className={`text-xs font-black shrink-0 ${d.perc === 100 ? 'text-emerald-500' : themeColors.primaryText}`}>{d.perc}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-[#0d1526] rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 rounded-full ${d.perc === 100 ? 'bg-emerald-500' : themeColors.bgSolid}`} style={{width: `${d.perc}%`}}></div>
                    </div>
                 </div>
               ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabArsenal({ edital, setEdital, progress, setUserProgress, toggleSprintItem, customSprint, resetProgress, themeColors, setActiveTab }) {
  const [expanded, setExpanded] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newTopic, setNewTopic] = useState({ discId: '', titulo: '', linkTec: '' });
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [bulkInput, setBulkInput] = useState({ discId: null, text: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedDiscId, setSelectedDiscId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [inlineEditingId, setInlineEditingId] = useState(null);
  const [inlineEditValue, setInlineEditValue] = useState('');
  
  const [expandedTopics, setExpandedTopics] = useState({});
  const [selectedAssuntosBulk, setSelectedAssuntosBulk] = useState(new Set());
  
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
        title="Disciplinas/Metas" 
        subtitle="A sua Biblioteca de Matérias. Envie tópicos para Estudar Hoje." 
        icon={BookOpen}
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
                        <div key={disc.id} onClick={() => !isEditing && setSelectedDiscId(disc.id)} className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-colors ${isSelected && !isEditing ? `${themeColors.bgSuperLight} ${themeColors.primaryText} border ${themeColors.borderLight} shadow-sm` : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent text-slate-600 dark:text-white/60'}`}>
                          
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
                title="Disciplinas/Metas"
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
                              group flex items-center py-2.5 px-3 transition-colors duration-200 border-b border-slate-100 dark:border-white/5 
                              ${isEditing ? 'cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg'} 
                              ${isParent && !isBeingDragged ? 'mt-4 border-t border-t-slate-200 dark:border-t-white/10 pt-4' : ''} 
                              ${isSelectedBulk ? `${themeColors.bgSuperLight}` : ''}
                              ${isBeingDragged ? `opacity-40 border-dashed border-2 ${themeColors.borderSolid} z-10 bg-white dark:bg-[#0d1526]` : ''}
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
                                    {isInSprint ? 'Na Fila' : (mastered ? 'Refazer' : '+ Meta')}
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

function TabMetas({ customSprint, setCustomSprint, sprintsCompleted, setSprintsCompleted, setActiveTab, progress, toggleProgress, themeColors, isTimerActive, toggleTimer, displayTimerSeconds, pendingReviewsCount }) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newSprint = [...customSprint];
    const draggedItem = newSprint[draggedIndex];
    newSprint.splice(draggedIndex, 1);
    newSprint.splice(index, 0, draggedItem);
    setDraggedIndex(index); 
    setCustomSprint(newSprint);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleCompleteSprint = () => {
    setSprintsCompleted(prev => prev + 1); 
    setCustomSprint(prev => prev.slice(1)); 
  };

  // Trava de Titânio: Verifica se o alvo no topo tem as 3 etapas cumpridas
  const topItem = customSprint.length > 0 ? customSprint[0] : null;
  const isTopItemMastered = topItem ? (
    progress[topItem.assId]?.estudado &&
    progress[topItem.assId]?.questoes &&
    progress[topItem.assId]?.revisado
  ) : false;

  return (
    <div className="space-y-6 animate-in fade-in text-left pb-10">
      
      <SectionHeader 
        overline="Execução" 
        title="Estudar Hoje" 
        subtitle="A sua linha da frente. Concentre-se apenas no topo da lista." 
        icon={Target}
        themeColors={themeColors}
        extra={
          <button 
            disabled={customSprint.length === 0 || !isTopItemMastered} 
            onClick={handleCompleteSprint} 
            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-md ${
              customSprint.length === 0
                ? 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-white/20 cursor-not-allowed opacity-50'
                : !isTopItemMastered
                ? 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/40 cursor-not-allowed border border-slate-300 dark:border-white/10'
                : 'bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20'
            }`}
          >
            {!isTopItemMastered && customSprint.length > 0 ? (
              <><Lock className="w-5 h-5" /> Bloqueado (Cumpra as 3 Etapas)</>
            ) : (
              <><CheckCircle className="w-5 h-5" /> Concluir Tópico do Topo</>
            )}
          </button>
        }
      />

      {/* NOVO CRONÔMETRO LÍQUIDO CONTÍNUO */}
      <StopwatchWidget themeColors={themeColors} isTimerActive={isTimerActive} toggleTimer={toggleTimer} displayTimerSeconds={displayTimerSeconds} />

      {/* METAS */}
      {customSprint.length === 0 && pendingReviewsCount === 0 ? (
        <EmptyState 
           icon={ShoppingCart}
           title="Área Limpa!"
           message="Você completou o que tinha para hoje. Vá em Disciplinas/Metas para adicionar novos alvos."
           actionLabel="Disciplinas/Metas"
           onAction={() => setActiveTab('arsenal')}
           themeColors={themeColors}
        />
      ) : (
        <div className="flex flex-col gap-4 mt-6 relative">
          
          {/* AQUECIMENTO (Aparece se houver revisões) */}
          {pendingReviewsCount > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/5 border-2 border-red-400 dark:border-red-500 rounded-2xl p-6 shadow-lg mb-6 animate-in slide-in-from-top-4 relative overflow-hidden z-20">
               <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none"><BrainCircuit className="w-40 h-40 text-red-500" /></div>
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="p-4 bg-red-500 text-white rounded-xl shadow-md shrink-0">
                       <span className="text-[10px] uppercase font-black tracking-widest block leading-none">Foco</span>
                       <span className="text-3xl font-black leading-none block mt-1 text-center">1</span>
                     </div>
                     <div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/> ALERTA: Memória Crítica</span>
                       <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Limpar Motor de Revisões</h4>
                       <p className="text-sm text-slate-600 dark:text-white/60">Tem {pendingReviewsCount} tópicos a expirar. É **obrigatório** limpar a memória antes de avançar para novos estudos.</p>
                     </div>
                  </div>
                  <button onClick={() => setActiveTab('memoria')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-black transition-all shadow-xl hover:shadow-red-500/40 w-full md:w-auto shrink-0 cursor-pointer flex items-center gap-2">
                     <Activity className="w-5 h-5" /> Iniciar Revisões
                  </button>
               </div>
               
               {/* Overlay que tapa visualmente as metas se houver revisões pendentes */}
               <div className="absolute -bottom-10 left-0 w-full h-10 bg-gradient-to-b from-red-500/20 to-transparent pointer-events-none blur-sm"></div>
            </div>
          )}

          {/* O OVERLAY DE BLOQUEIO */}
          {pendingReviewsCount > 0 && customSprint.length > 0 && (
             <div className="absolute inset-0 top-32 z-10 bg-slate-100/50 dark:bg-[#0d1526]/60 backdrop-blur-[2px] rounded-[2rem] flex flex-col items-center justify-center border border-slate-200/50 dark:border-white/5 pointer-events-none">
                <Lock className="w-12 h-12 text-slate-400 dark:text-white/30 mb-2 opacity-50" />
                <span className="font-black text-slate-500 dark:text-white/40 uppercase tracking-widest text-sm opacity-80">Bloqueado pelas Revisões Pendentes</span>
             </div>
          )}

          {/* LISTA UNIFICADA DE METAS */}
          {customSprint.map((item, globalIdx) => {
            const isFocus = globalIdx < 2; // As duas primeiras são o "Foco", as restantes são "Fila"
            const isDragging = draggedIndex === globalIdx;
            const isEstudado = progress[item.assId]?.estudado || false;
            const isQuestoes = progress[item.assId]?.questoes || false;
            const isRevisado = progress[item.assId]?.revisado || false;

            return (
              <React.Fragment key={item.assId}>
                
                {/* Cabeçalho da Fila (Aparece antes do item índice 2) */}
                {globalIdx === 2 && (
                   <div className="flex items-center gap-4 mt-6 mb-2">
                      <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest flex items-center gap-2"><ChevronsDown className="w-4 h-4"/> Na Fila (Aguardando)</span>
                      <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
                   </div>
                )}

                <div 
                  draggable
                  onDragStart={(e) => handleDragStart(e, globalIdx)}
                  onDragEnter={(e) => handleDragEnter(e, globalIdx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative transition-colors duration-300 cursor-move rounded-2xl ${isFocus ? `bg-white dark:bg-[#111e36] border border-slate-200/80 dark:border-white/10 shadow-sm p-6 ${globalIdx === 0 ? `ring-1 ${themeColors.ring} shadow-md` : ''}` : 'bg-slate-50 dark:bg-[#111e36]/50 border border-slate-200 dark:border-white/5 p-4 opacity-80 hover:opacity-100'} ${isDragging ? `opacity-40 border-dashed ${themeColors.borderSolid} z-30` : ''}`}
                >
                  <div className={`absolute right-4 text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-white transition-colors flex items-center gap-2 ${isFocus ? 'top-6' : 'top-1/2 -translate-y-1/2'}`}>
                    <button onClick={() => setCustomSprint(p => p.filter(i => i.assId !== item.assId))} className="p-1 hover:text-red-500 transition-colors cursor-pointer" title="Remover da Fila"><Trash2 className="w-4 h-4"/></button>
                    <GripVertical className="w-5 h-5 cursor-grab" title="Arrastar para reordenar" />
                  </div>
                  
                  {isFocus && globalIdx === 0 && <span className={`absolute top-0 right-16 -translate-y-1/2 ${themeColors.bgSolid} text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-white/20 z-10 flex items-center gap-1`}><Target className="w-3 h-3"/> Alvo Principal</span>}

                  <div className={isFocus ? 'pr-14' : 'pr-20'}>
                    <span className={`text-[10px] font-black uppercase tracking-widest text-slate-500 dark:${themeColors.brightText} mb-1 block truncate`}>{item.discNome}</span>
                    <p className={`font-bold text-slate-800 dark:text-white leading-tight ${isFocus ? 'text-lg mb-6' : 'text-sm truncate'}`}>{item.assTitulo}</p>
                  </div>
                  
                  {/* CHECKBOXES TOTALMENTE ESTÁTICAS */}
                  {isFocus && (
                    <div className="mt-auto space-y-3 pt-5 border-t border-slate-100 dark:border-white/5">
                      
                      {/* 1. TEORIA */}
                      <label className={`flex items-center gap-3.5 cursor-pointer ${isEstudado ? themeColors.primaryText : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'}`}>
                        <input type="checkbox" checked={isEstudado} onChange={() => toggleProgress(item.assId, 'estudado')} className={`w-5 h-5 rounded cursor-pointer shrink-0 border-slate-300 dark:border-white/20 bg-transparent ${themeColors.primaryText} ${themeColors.ring} focus:ring-0 outline-none`} />
                        <span className="font-bold text-xs uppercase tracking-wide">1. Teoria</span>
                      </label>

                      {/* 2. QUESTÕES (SIMPLIFICADO) */}
                      <label className={`flex items-center gap-3.5 ${!isEstudado ? 'opacity-50' : 'cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors'} ${isQuestoes ? themeColors.primaryText : 'text-slate-500 dark:text-white/50'}`}>
                        <input type="checkbox" checked={isQuestoes} disabled={!isEstudado} onChange={() => toggleProgress(item.assId, 'questoes')} className={`w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0 border-slate-300 dark:border-white/20 bg-transparent ${themeColors.primaryText} ${themeColors.ring} focus:ring-0 outline-none`} />
                        <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-2">2. Questões (Bateria TEC)</span>
                      </label>

                      {/* 3. REVISÃO */}
                      <label className={`flex items-center gap-3.5 cursor-pointer ${isRevisado ? themeColors.primaryText : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white'}`}>
                        <input type="checkbox" checked={isRevisado} onChange={() => toggleProgress(item.assId, 'revisado')} disabled={!isQuestoes} className={`w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0 border-slate-300 dark:border-white/20 bg-transparent ${themeColors.primaryText} ${themeColors.ring} focus:ring-0 outline-none`} />
                        <span className="font-bold text-xs uppercase tracking-wide">3. Agendar Revisão Auto</span>
                      </label>
                      
                      {item.linkTec && (
                        <a href={item.linkTec} target="_blank" rel="noopener noreferrer" className={`mt-5 flex items-center justify-center gap-2 w-full py-3 text-xs font-bold rounded-xl ${themeColors.bgSuperLight} ${themeColors.primaryText} transition-colors shadow-sm cursor-pointer hover:${themeColors.bgSolid} hover:text-white dark:hover:${themeColors.bgSolid} dark:hover:text-white`}>
                          <ExternalLink className="w-4 h-4" /> Resolver no TEC
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ABA 4: REVISÕES (MOTOR DE REVISÃO)
// ==========================================
function TabMemoria({ progress, handleReviewFeedback, edital, activeSubjectIds, themeColors, projectConfig }) {
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
      let next = currentInterval <= 1 ? (projectConfig.revBom || 7) : (currentInterval * 2);
      return Math.max(1, Math.round(Math.min(365, next)));
    }
    if (feedbackType === 'facil') {
      let next = currentInterval <= 1 ? (projectConfig.revFacil || 15) : (currentInterval * 2.5);
      return Math.max(1, Math.round(Math.min(365, next)));
    }
    return 1;
  };

  return (
    <div className="space-y-6 animate-in fade-in text-left pb-10">
      
      <SectionHeader 
        overline="Retenção" 
        title="Revisões" 
        subtitle="Onde o algoritmo não deixa a matéria morrer. Avalie com honestidade." 
        icon={RefreshCcw}
        themeColors={themeColors}
      />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-6 border-b border-red-100 dark:border-red-900/30 pb-3">
            <AlertTriangle className="w-5 h-5"/> Revisões Pendentes
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
                const daysBom = getNextIntervalDays(data.id, 'bom');
                const daysFacil = getNextIntervalDays(data.id, 'facil');

                return (
                  <div key={data.id} className={`bg-white dark:bg-[#111e36] border p-6 rounded-2xl shadow-sm flex flex-col gap-4 border-l-4 transition-colors duration-300 border-slate-200/60 dark:border-white/5 border-l-red-500 hover:shadow-md`}>
                    <div className="flex justify-between items-start">
                      <div className="pr-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/40 tracking-widest flex items-center gap-2 mb-1.5">
                            {data.discNome}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{data.titulo}</h4>
                      </div>
                      {data.linkTec && (
                        <a href={data.linkTec} target="_blank" rel="noreferrer" title="Abrir Caderno TEC" className={`p-3 rounded-xl bg-slate-50 dark:bg-[#0d1526] ${themeColors.brightText} hover:bg-slate-100 transition-colors cursor-pointer shrink-0 shadow-sm border border-slate-100 dark:border-white/5`}>
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    
                    {/* BOTÕES ESTÁTICOS DE REVISÃO */}
                    <div className="grid grid-cols-3 gap-3 mt-3 pt-5 border-t border-slate-100 dark:border-white/5">
                      <button onClick={() => handleReviewFeedback(data.id, 'dificil')} className="py-3 px-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer border border-red-100 dark:border-red-500/20 transition-colors shadow-sm">
                        <span>Difícil</span><span className="text-[9px] font-bold opacity-70 tracking-widest">Amanhã</span>
                      </button>
                      <button onClick={() => handleReviewFeedback(data.id, 'bom')} className="py-3 px-2 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white dark:bg-amber-500/10 dark:hover:bg-amber-600 dark:text-amber-400 rounded-xl text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer border border-amber-100 dark:border-amber-500/20 transition-colors shadow-sm">
                        <span>Bom</span><span className="text-[9px] font-bold opacity-70 tracking-widest">{daysBom} Dias</span>
                      </button>
                      <button onClick={() => handleReviewFeedback(data.id, 'facil')} className="py-3 px-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:bg-emerald-500/10 dark:hover:bg-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer border border-emerald-100 dark:border-emerald-500/20 transition-colors shadow-sm">
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
                  return (
                    <div key={data.id} className={`bg-slate-50 dark:bg-[#111e36] border p-5 rounded-2xl flex justify-between items-center transition-colors duration-300 border-slate-200/60 dark:border-white/5 opacity-80 hover:opacity-100`}>
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
// ABA 5: CONFIGURAÇÕES DO SISTEMA
// ==========================================
function TabEngrenagens({ auth, config, setConfig, userProgress, setUserProgress, edital, setEdital, customSprint, setCustomSprint, initialEdital, setDailyLogs, themeColors }) {
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
      sprints: customSprint,
      edital: edital,
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
        if (data.sprints) setCustomSprint(data.sprints);
        if (data.edital) setEdital(data.edital);
        
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
      setCustomSprint([]);
      setConfirmResetProgress(false);
      alert("Progresso de estudo limpo com sucesso!");
    } else {
      setConfirmResetProgress(true);
      setTimeout(() => setConfirmResetProgress(false), 3000);
    }
  };

  const handleFactoryReset = () => {
    if (confirmFactoryReset) {
      setUserProgress({});
      setCustomSprint([]);
      setDailyLogs({});
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
        title="Configurações do Sistema" 
        subtitle="Personalize a sua plataforma e proteja a sua operação de estudo." 
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Nome do App / Sistema</label>
                <input 
                  type="text" 
                  value={localConfig.appName} 
                  onChange={e => setLocalConfig({...localConfig, appName: e.target.value})}
                  className={`w-full p-4 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#0d1526] text-slate-800 dark:text-white outline-none ${themeColors.ring} transition-colors`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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
            <Target className={`w-5 h-5 ${themeColors.brightText}`}/> Configurações da Meta
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-2">Concurso Alvo (Sua Meta Principal)</label>
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
            <p className="text-sm text-slate-500 dark:text-white/50 mb-8 leading-relaxed">Exporte todo o seu progresso e arsenal de matérias para um arquivo de segurança no seu dispositivo.</p>
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
                <p className="text-sm text-slate-500 dark:text-white/40 mb-6 leading-relaxed">Zera todas as marcações de estudo e revisões. O seu Edital Verticalizado será <strong className="text-slate-700 dark:text-white">mantido</strong>.</p>
              </div>
              <button 
                onClick={handleResetProgress}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${confirmResetProgress ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent dark:border-red-500/20'}`}
              >
                {confirmResetProgress ? 'Tem certeza? Clique para Limpar' : 'Zerar Progresso'}
              </button>
            </div>

            <div className="bg-white dark:bg-[#111e36] p-6 rounded-2xl border border-red-100 dark:border-white/5 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Restaurar Padrão de Fábrica</h4>
                <p className="text-sm text-slate-500 dark:text-white/40 mb-6 leading-relaxed">Aviso: Isto apaga <strong className="text-red-500">TUDO</strong>. O progresso e qualquer matéria que tenha adicionado serão destruídos.</p>
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
  const [activeTab, setActiveTab] = useState('qg'); 
  const [isDeepWork, setIsDeepWork] = useState(false);

  const [projectConfig, setProjectConfig] = useState(initialConfig);
  const [edital, setEdital] = useState(initialEdital);
  const [userProgress, setUserProgress] = useState({});
  const [customSprint, setCustomSprint] = useState([]);
  const [sprintsCompleted, setSprintsCompleted] = useState(0);
  const [dailyLogs, setDailyLogs] = useState({});

  // === ESTADO GLOBAL DO CRONÓMETRO ===
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [unloggedSeconds, setUnloggedSeconds] = useState(0);

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
          if (data.config) setProjectConfig(prev => ({ ...prev, ...data.config }));
          if (data.edital) setEdital(data.edital);
          if (data.userProgress) setUserProgress(data.userProgress);
          if (data.customSprint) setCustomSprint(data.customSprint);
          if (data.sprintsCompleted !== undefined) setSprintsCompleted(data.sprintsCompleted);
          if (data.dailyLogs) setDailyLogs(data.dailyLogs);
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
  useEffect(() => { saveToCloud('dailyLogs', dailyLogs); }, [dailyLogs, isCloudReady]);

  // === LÓGICA CORE DO CRONÓMETRO DE ELITE ===
  const handleAutoLog = useCallback((hoursToAdd) => {
    const today = new Date().toLocaleDateString();
    setDailyLogs(prev => {
      const currentHours = prev[today] || 0;
      return { ...prev, [today]: currentHours + hoursToAdd };
    });
  }, []);

  useEffect(() => {
    setIsDeepWork(isTimerActive);
  }, [isTimerActive]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setUnloggedSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Grava automaticamente quando pausa a sessão
  useEffect(() => {
    if (!isTimerActive && unloggedSeconds > 0) {
      handleAutoLog(unloggedSeconds / 3600);
      setUnloggedSeconds(0);
    }
  }, [isTimerActive, unloggedSeconds, handleAutoLog]);

  // Auto-Save a cada 60 segundos (Evita perda de dados se o user fechar a aba abruptamente)
  useEffect(() => {
    if (isTimerActive && unloggedSeconds >= 60) {
      handleAutoLog(unloggedSeconds / 3600);
      setUnloggedSeconds(0);
    }
  }, [isTimerActive, unloggedSeconds, handleAutoLog]);

  // CORREÇÃO TÁTICA: Auto-Pause ao sair da aba de Metas (Liberta o utilizador do Deep Work)
  useEffect(() => {
    if (activeTab !== 'metas' && isTimerActive) {
      setIsTimerActive(false);
    }
  }, [activeTab, isTimerActive]);

  const toggleTimer = () => setIsTimerActive(!isTimerActive);

  // Calcula o tempo que aparece no visor (Horas Totais do Dia + Segundos Correntes)
  const todayStrLocal = new Date().toLocaleDateString();
  const displayTimerSeconds = Math.floor((dailyLogs[todayStrLocal] || 0) * 3600) + unloggedSeconds;

  // Lógica do Current Streak (Dias Seguidos a Bater a Meta)
  const calculateCurrentStreak = () => {
     let streak = 0;
     const today = new Date();
     // Verifica se bateu a meta hoje
     const todayHours = dailyLogs[today.toLocaleDateString()] || 0;
     
     // Se já bateu hoje, conta 1. Se não bateu hoje, o streak ainda pode estar vivo de ontem.
     let d = new Date(today);
     if (todayHours >= projectConfig.horasDia) {
         streak++;
         d.setDate(d.getDate() - 1);
     } else {
         // O streak de hoje ainda é 0, vamos ver se ontem bateu para manter a corrente
         d.setDate(d.getDate() - 1);
         const yesterdayHours = dailyLogs[d.toLocaleDateString()] || 0;
         if (yesterdayHours < projectConfig.horasDia) {
             return 0; // Não bateu nem hoje nem ontem, streak quebrado.
         }
     }

     // Conta os dias para trás
     while(true) {
         const dateStr = d.toLocaleDateString();
         const hours = dailyLogs[dateStr] || 0;
         if (hours >= projectConfig.horasDia) {
             streak++;
             d.setDate(d.getDate() - 1);
         } else {
             break;
         }
     }
     return streak;
  };
  const currentStreak = useMemo(() => calculateCurrentStreak(), [dailyLogs, projectConfig.horasDia]);


  const handleReviewFeedback = (assId, feedbackType) => {
    setUserProgress(prev => {
      const current = prev[assId] || {};
      const now = new Date();
      let currentInterval = current.reviewInterval || 0;
      
      let newInterval = 1;

      if (feedbackType === 'dificil') {
        newInterval = 1; 
      } else if (feedbackType === 'bom') {
        newInterval = currentInterval <= 1 ? (projectConfig.revBom || 7) : (currentInterval * 2);
      } else if (feedbackType === 'facil') {
        newInterval = currentInterval <= 1 ? (projectConfig.revFacil || 15) : (currentInterval * 2.5);
      }
      
      newInterval = Math.min(Math.round(newInterval), 365);
      
      const nextReviewDate = new Date(now);
      nextReviewDate.setDate(now.getDate() + newInterval);
      nextReviewDate.setHours(0, 0, 0, 0); 
      
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
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          
          newState.lastReviewedTimestamp = now.getTime();
          newState.nextReviewTimestamp = tomorrow.getTime();
          newState.reviewInterval = 1; 
          newState.masteredAt = now.getTime();
        } else {
          newState.lastReviewedTimestamp = null;
          newState.nextReviewTimestamp = null;
          newState.reviewInterval = 0;
          newState.masteredAt = null;
        }
      }
      return { ...prev, [assId]: newState };
    });
  };

  const resetProgress = (assId) => { setUserProgress(prev => ({ ...prev, [assId]: { estudado: false, questoes: false, revisado: false, lastReviewedTimestamp: null, nextReviewTimestamp: null, reviewInterval: 0, masteredAt: null } })); };

  const toggleSprintItem = (discId, assId, discNome, assTitulo, temp, linkTec) => {
    setCustomSprint(prev => {
      const exists = prev.find(item => item.assId === assId);
      if (exists) return prev.filter(item => item.assId !== assId);
      return [...prev, { discId, assId, discNome, assTitulo, temp, linkTec }];
    });
  };

  const activeSubjectIds = new Set();
  edital.forEach(b => b.disciplinas.forEach(d => d.assuntos.forEach(a => activeSubjectIds.add(a.id))));

  const now = new Date().getTime();
  
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
    { phase: 'Comando', items: [
      { id: 'qg', icon: LayoutGrid, label: 'Painel Geral' }
    ]},
    { phase: 'Planejamento', items: [
      { id: 'arsenal', icon: BookOpen, label: 'Disciplinas/Metas' }
    ]},
    { phase: 'Execução', items: [
      { id: 'metas', icon: Target, label: 'Estudar Hoje', badge: customSprint.length }, 
      { id: 'memoria', icon: RefreshCcw, label: 'Revisões', badge: pendingReviewsCount }
    ]},
    { phase: 'Sistema', items: [
      { id: 'engrenagens', icon: Settings, label: 'Configurações do Sistema' }
    ]}
  ];

  if (!isCloudReady) {
    return (
      <div className="min-h-screen bg-[#0d1526] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold animate-pulse text-white/50 tracking-widest uppercase text-[10px]">A sincronizar com a Base de Dados...</h2>
      </div>
    );
  }

  if (auth && !user) {
    return <AuthScreen auth={auth} themeColors={themeColors} />;
  }

  const mobileNavItems = [
    { id: 'qg', icon: LayoutGrid, label: 'Painel' },
    { id: 'arsenal', icon: BookOpen, label: 'Disciplinas' },
    { id: 'metas', icon: Target, label: 'Estudar', badge: customSprint.length },
    { id: 'memoria', icon: RefreshCcw, label: 'Revisões', badge: pendingReviewsCount }
  ];

  const firstName = (projectConfig.userName || 'Concurseiro').split(' ')[0];

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

        {/* TOP HEADER MOBILE */}
        <div className={`${isDeepWork ? 'hidden' : 'flex md:hidden'} items-center justify-between p-4 bg-white dark:bg-[#0d1526] shadow-md border-b border-slate-200 dark:border-white/5 z-20 sticky top-0 transition-colors duration-500`}>
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm p-1`}>
              <img src={projectConfig.logoUrl || 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'} alt="Logo" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-contain" />
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
        <aside className={`${isDeepWork ? 'hidden' : 'hidden md:flex'} w-[280px] bg-white dark:bg-[#0d1526] shadow-xl flex-col z-10 shrink-0 border-r border-slate-200/80 dark:border-white/5 sticky top-0 h-screen overflow-hidden transition-colors duration-300`}>
          <div className={`p-6 bg-slate-50/50 dark:bg-transparent border-b border-slate-200/80 dark:border-white/5 relative transition-colors duration-500 shrink-0`}>
            
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`absolute top-6 right-6 p-2 bg-white dark:bg-[#111e36] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-full transition-colors cursor-pointer shadow-sm text-slate-500 dark:text-white/40 z-10`}>
              {isDarkMode ? <Sun className={`w-4 h-4 ${themeColors.brightText}`} /> : <Moon className={`w-4 h-4 text-slate-600`} />}
            </button>

            {/* MARCA DA PLATAFORMA */}
            <div className="flex items-center gap-3 min-w-0 mb-6 pr-10">
              <div className={`w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm p-1`}>
                <img src={projectConfig.logoUrl || 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'} alt="Logo" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-contain" />
              </div>
              <h2 className={`font-black text-xl tracking-tight truncate text-slate-800 dark:text-white`} title={projectConfig.appName}>{projectConfig.appName || 'Nomeação.Tech'}</h2>
            </div>
            
            {/* NOVO CARTÃO KPI ELITE */}
            <div className={`group relative overflow-hidden rounded-2xl border p-5 transition-all shadow-sm flex flex-col gap-4 ${themeColors.bgSuperLight} ${themeColors.borderLight}`}>
              
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${themeColors.borderSolid} bg-white dark:bg-[#0d1526] ${themeColors.primaryText} shadow-inner`}>
                  <span className="font-black text-xl">{(projectConfig.userName || 'C').charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest mb-0.5">Operador,</span>
                  <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight truncate" title={projectConfig.userName || 'Concurseiro'}>{firstName}</h3>
                  <p className={`text-[10px] font-bold ${themeColors.brightText} truncate mt-0.5 uppercase tracking-widest`}>{projectConfig.cargo}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-1 pt-4 border-t border-slate-200/50 dark:border-white/10">
                 <div className="flex justify-between items-end mb-1.5">
                     <span className="text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Edital Concluído</span>
                     <span className="text-[10px] font-black text-slate-800 dark:text-white">{progressPerc}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-200/50 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                   <div className={`h-full ${themeColors.bgSolid} transition-all duration-1000 ease-out`} style={{ width: `${progressPerc}%` }}></div>
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
                      <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors font-bold text-sm cursor-pointer ${isActive ? `${themeColors.bgSuperLight} ${themeColors.primaryText} border ${themeColors.borderLight} shadow-sm` : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'}`}>
                        <IconComponent className={`w-5 h-5 ${isActive ? themeColors.brightText : 'opacity-50'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.id === 'metas' && customSprint.length > 0 && <span className={`bg-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border dark:border-emerald-500/30 text-white text-[10px] font-black px-2 py-0.5 rounded-full`}>{customSprint.length}</span>}
                        {item.badge > 0 && item.id !== 'metas' && <span className={`bg-red-500 dark:bg-red-500/20 dark:text-red-400 dark:border dark:border-red-500/30 animate-pulse text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm`}>{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {user && (
            <div className="p-5 border-t border-slate-200/80 dark:border-white/5 bg-transparent mt-auto shrink-0">
              <button onClick={() => { if(window.confirm('Tem certeza que deseja sair do sistema?')) { auth && signOut(auth); } }} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:border-red-500/20 border border-transparent transition-colors font-bold text-sm cursor-pointer">
                <LogOut className="w-4 h-4" /> Sair do Sistema
              </button>
            </div>
          )}
        </aside>

        {/* CONTENT AREA EXPANDIDA */}
        <main className={`flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto ${isDeepWork ? 'pb-4' : 'pb-28 md:pb-10'} text-left transition-all duration-300 relative`}>
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full transition-all duration-500 h-full flex flex-col">
            {activeTab === 'qg' && <TabQG config={projectConfig} progressPerc={progressPerc} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} themeColors={themeColors} edital={edital} activeSubjectIds={activeSubjectIds} userProgress={userProgress} pendingReviewsCount={pendingReviewsCount} setActiveTab={setActiveTab} customSprint={customSprint} totalAssuntos={totalAssuntos} currentStreak={currentStreak} />}
            {activeTab === 'arsenal' && <TabArsenal edital={edital} setEdital={setEdital} progress={userProgress} setUserProgress={setUserProgress} toggleSprintItem={toggleSprintItem} customSprint={customSprint} resetProgress={resetProgress} themeColors={themeColors} setActiveTab={setActiveTab} />}
            {activeTab === 'metas' && <TabMetas customSprint={customSprint} setCustomSprint={setCustomSprint} sprintsCompleted={sprintsCompleted} setSprintsCompleted={setSprintsCompleted} setActiveTab={setActiveTab} progress={userProgress} toggleProgress={toggleProgress} themeColors={themeColors} isTimerActive={isTimerActive} toggleTimer={toggleTimer} displayTimerSeconds={displayTimerSeconds} pendingReviewsCount={pendingReviewsCount} />}
            {activeTab === 'memoria' && <TabMemoria progress={userProgress} handleReviewFeedback={handleReviewFeedback} edital={edital} activeSubjectIds={activeSubjectIds} themeColors={themeColors} projectConfig={projectConfig} />}
            {activeTab === 'engrenagens' && <TabEngrenagens auth={auth} config={projectConfig} setConfig={setProjectConfig} userProgress={userProgress} setUserProgress={setUserProgress} edital={edital} setEdital={setEdital} customSprint={customSprint} setCustomSprint={setCustomSprint} initialEdital={initialEdital} setDailyLogs={setDailyLogs} themeColors={themeColors} />}
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className={`${isDeepWork ? 'hidden' : 'flex md:hidden'} fixed bottom-0 left-0 w-full bg-white dark:bg-[#0d1526] border-t border-slate-200 dark:border-white/5 justify-between items-end px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50`}>
          {mobileNavItems.map(item => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full py-1.5 gap-1 relative transition-colors ${isActive ? themeColors.brightText : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70'}`}
              >
                <div className={`p-1.5 rounded-xl transition-colors duration-300 ${isActive ? `${themeColors.bgSuperLight}` : ''}`}>
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