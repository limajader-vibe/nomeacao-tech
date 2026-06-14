import React, { useState, useEffect, useRef } from 'react';
import { 
  PieChart, Calendar, CheckCircle, Clock, Target, BookOpen, 
  Layers, FileText, ChevronDown, Folder, FolderOpen, ChevronRight, PlayCircle, 
  RefreshCcw, Save, Trash2, Moon, Sun, ShoppingCart, ExternalLink, GripVertical, Plus, Link, Pencil, Settings,
  Edit, AlertTriangle, ChevronUp, Flame, Trophy, TrendingUp, Activity, Award, ListPlus, ArrowRight, ArrowLeft, BarChart2,
  Thermometer, CalendarDays, LayoutGrid, BrainCircuit, Eye, Zap, Image as ImageIcon, ShieldAlert, Download, Sliders, Lock,
  UnfoldVertical, FoldVertical, FilePlus, Upload, Filter
} from 'lucide-react';

// --- HELPERS LOCAL STORAGE ---
const getStorage = (key, defaultValue) => {
  try { 
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (e) { return defaultValue; }
};
const setStorage = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} };

// --- CONFIGURAÇÃO INICIAL ---
const initialConfig = { 
  appName: 'Nomeação.Tech',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png',
  concurso: 'Base de TI (Iniciantes)', 
  cargo: 'Núcleo Duro - Qualquer Cargo', 
  banca: 'Principais (CEBRASPE, FCC, FGV)', 
  horasDia: 4,
  revBom: 7,
  revFacil: 15
};

// --- ÁRVORE DA TRILHA BASE ---
const initialEdital = [
  {
    id: 'bloco-gerais', nome: 'Conhecimentos Gerais (Base)', icone: 'Layers',
    disciplinas: [
      { id: 'port', nome: 'Língua Portuguesa', cor: 'text-rose-700 bg-rose-100', 
        assuntos: [
          { id: 'port_1', titulo: 'Compreensão de Textos', temp: '🔥 QUENTE', linkTec: '', indent: 0, pergunta: "Qual a diferença entre Depreende-se e Infere-se no Cebraspe?", resposta: "Depreende-se = Interpretação (conclusão além do texto). Infere-se = Compreensão (está escrito no texto)." },
          { id: 'port_2', titulo: 'Reescritura de Frases', temp: '🔥 QUENTE', linkTec: '', indent: 0, pergunta: "Posso trocar 'Conquanto' por 'Porquanto' mantendo o sentido?", resposta: "NÃO! Conquanto é Concessão (embora). Porquanto é Causa (porque)." }
        ] 
      }
    ]
  },
  {
    id: 'bloco-especificos', nome: 'Núcleo Duro de TI', icone: 'BookOpen',
    disciplinas: [
      { id: 'bd', nome: 'Banco de Dados', cor: 'text-cyan-700 bg-cyan-100', 
        assuntos: [
          { id: 'conceitos', titulo: 'Conceitos Iniciais e Esquemas', temp: '🔥 QUENTE', linkTec: 'https://www.tecconcursos.com.br/caderno/abrir/Q6VKGo', indent: 0, pergunta: "Diferencie Esquema de Instância num SGBD.", resposta: "Esquema é a ESTRUTURA (o projeto, raramente muda). Instância é a fotografia dos DADOS num dado momento (muda a todo instante)." }
        ] 
      },
      { id: 'eng_soft', nome: 'Engenharia de Software', cor: 'text-emerald-700 bg-emerald-100', 
        assuntos: [
          { id: 'ciclos', titulo: 'Abordagens de Ciclo de Vida', temp: '☀️ MORNO', linkTec: '', indent: 0, pergunta: "", resposta: "" }, 
          { id: 'processos', titulo: 'Processos de Desenvolvimento', temp: '🔥 QUENTE', linkTec: '', indent: 0, pergunta: "Modelagem é uma Atividade Guarda-Chuva?", resposta: "FALSO. Modelagem é fase do Framework Genérico. Guarda-chuva são atividades transversais (ex: Qualidade, Gerência de Riscos)." }
        ] 
      }
    ]
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => getStorage('pareto_theme_v22', false));
  const [activeTab, setActiveTab] = useState('dashboard'); 

  const [projectConfig, setProjectConfig] = useState(() => {
    const saved = getStorage('pareto_config_v22', initialConfig);
    return { ...initialConfig, ...saved };
  });
  
  const [edital, setEdital] = useState(() => getStorage('pareto_edital_v22', initialEdital));
  const [userProgress, setUserProgress] = useState(() => getStorage('pareto_progress_v22', {}));
  const [customSprint, setCustomSprint] = useState(() => getStorage('pareto_custom_sprint_v22', []));
  const [sprintsCompleted, setSprintsCompleted] = useState(() => getStorage('pareto_sprints_completed_v22', 0));
  
  const [gamification, setGamification] = useState(() => getStorage('pareto_gamification_v22', { xp: 0, streak: 0, lastActiveDate: '' }));
  const [dailyLogs, setDailyLogs] = useState(() => getStorage('pareto_daily_logs_v22', {}));

  // PERSISTÊNCIA
  useEffect(() => { setStorage('pareto_theme_v22', isDarkMode); }, [isDarkMode]);
  useEffect(() => { setStorage('pareto_config_v22', projectConfig); }, [projectConfig]);
  useEffect(() => { setStorage('pareto_edital_v22', edital); }, [edital]);
  useEffect(() => { setStorage('pareto_progress_v22', userProgress); }, [userProgress]);
  useEffect(() => { setStorage('pareto_custom_sprint_v22', customSprint); }, [customSprint]);
  useEffect(() => { setStorage('pareto_sprints_completed_v22', sprintsCompleted); }, [sprintsCompleted]);
  useEffect(() => { setStorage('pareto_gamification_v22', gamification); }, [gamification]);
  useEffect(() => { setStorage('pareto_daily_logs_v22', dailyLogs); }, [dailyLogs]);

  // STREAK
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
  }, []);

  const addXP = (amount) => { setGamification(prev => ({ ...prev, xp: prev.xp + amount })); };

  const toggleProgress = (assId, type) => {
    setUserProgress(prev => {
      const current = prev[assId] || {};
      const newState = { ...current, [type]: !current[type] };
      
      if (type === 'estudado' && !newState.estudado) { newState.questoes = false; newState.revisado = false; }
      if (type === 'questoes' && !newState.questoes) { newState.revisado = false; }
      
      if (type === 'revisado') {
        if (newState.revisado) {
          const now = new Date().getTime();
          const tomorrow = now + (1000 * 60 * 60 * 24 * 1); 
          newState.lastReviewedTimestamp = now;
          newState.nextReviewTimestamp = tomorrow;
          addXP(10);
        } else {
          newState.lastReviewedTimestamp = null;
          newState.nextReviewTimestamp = null;
        }
      }
      return { ...prev, [assId]: newState };
    });
  };

  const handleReviewFeedback = (assId, feedbackType) => {
    setUserProgress(prev => {
      const current = prev[assId] || {};
      const now = new Date().getTime();
      let daysToAdd = 1; // Difícil -> 1 dia
      if (feedbackType === 'bom') daysToAdd = projectConfig.revBom || 7;
      if (feedbackType === 'facil') daysToAdd = projectConfig.revFacil || 15;
      const next = now + (1000 * 60 * 60 * 24 * daysToAdd);
      addXP(15); 
      return { ...prev, [assId]: { ...current, revisado: true, lastReviewedTimestamp: now, nextReviewTimestamp: next } };
    });
  };

  const resetProgress = (assId) => {
    setUserProgress(prev => ({ ...prev, [assId]: { estudado: false, questoes: false, revisado: false, lastReviewedTimestamp: null, nextReviewTimestamp: null } }));
  };

  const toggleSprintItem = (discId, assId, discNome, assTitulo, temp, linkTec) => {
    setCustomSprint(prev => {
      const exists = prev.find(item => item.assId === assId);
      if (exists) return prev.filter(item => item.assId !== assId);
      return [...prev, { discId, assId, discNome, assTitulo, temp, linkTec }];
    });
  };

  // CÁLCULOS
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

  const calculateLevel = (xp) => {
    if (xp < 100) return { nivel: 1, titulo: 'Sobrevivente', max: 100 };
    if (xp < 300) return { nivel: 2, titulo: 'Aspirante a TI', max: 300 };
    if (xp < 600) return { nivel: 3, titulo: 'Fundação Sólida', max: 600 };
    if (xp < 1000) return { nivel: 4, titulo: 'Caçador de Bancas', max: 1000 };
    if (xp < 2000) return { nivel: 5, titulo: 'Mestre da Base', max: 2000 };
    return { nivel: 6, titulo: 'Futuro Nomeado', max: 5000 };
  };
  const userLevel = calculateLevel(gamification.xp);

  const navPhases = [
    { phase: 'Cockpit', items: [{ id: 'dashboard', icon: Activity, label: 'Visão Geral' }] },
    { phase: 'Planejamento', id: 'planejamento', items: [
      { id: 'disciplinas', icon: Folder, label: 'Arsenal de Matérias' },
      { id: 'planner', icon: LayoutGrid, label: 'Metas da Semana' }
    ]},
    { phase: 'Execução', id: 'acao', items: [
      { id: 'cronograma', icon: Calendar, label: 'Sprints Diárias' }, 
      { id: 'revisoes', icon: BrainCircuit, label: 'Revisão Espaçada', badge: pendingReviewsCount }
    ]},
    { phase: 'Sistema', id: 'sistema', items: [
      { id: 'admin', icon: Settings, label: 'Painel de Controle' }
    ]}
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col md:flex-row font-sans transition-colors duration-300">
        
        <aside className="w-full md:w-72 bg-white dark:bg-slate-900 shadow-xl flex flex-col z-10 shrink-0 border-r border-slate-200 dark:border-slate-800">
          <div className="p-6 bg-gradient-to-br from-blue-700 to-indigo-900 dark:from-slate-800 dark:to-slate-950 text-white relative">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-200" />}
            </button>
            
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-white/30 backdrop-blur-sm shadow-inner">
                <img 
                  src={projectConfig.logoUrl} 
                  alt="Logo" 
                  onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity bg-white p-1" 
                />
              </div>
              <h2 className="font-bold text-2xl tracking-tight text-white shadow-sm truncate" title={projectConfig.appName}>{projectConfig.appName}</h2>
            </div>
            
            <div className="mt-5 p-4 bg-white/10 rounded-xl relative">
              <div className="animate-in fade-in text-left">
                <p className="text-[10px] text-blue-200 uppercase font-black mb-1">{projectConfig.concurso}</p>
                <p className="font-bold text-lg leading-tight mb-2">{projectConfig.cargo}</p>
                <div className="flex flex-wrap gap-2 text-xs text-blue-100 font-medium">
                  <span className="bg-blue-900/60 px-2 py-1 rounded border border-white/10">{projectConfig.banca}</span>
                  <span className="bg-blue-900/60 px-2 py-1 rounded border border-white/10">Meta: {projectConfig.horasDia}h/dia</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-3">
                  <div className="bg-blue-800 p-2 rounded-lg"><Award className="w-5 h-5 text-amber-300"/></div>
                  <div>
                    <p className="text-xs font-bold text-white">Lvl {userLevel.nivel}: {userLevel.titulo}</p>
                    <p className="text-[10px] text-blue-200">{gamification.xp} / {userLevel.max} XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col bg-slate-50/50 dark:bg-slate-900">
            {navPhases.map((phaseGroup, pIdx) => (
              <div key={pIdx} className={pIdx > 0 ? "pt-4" : ""}>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-4 text-left">{phaseGroup.phase}</h3>
                <div className="space-y-1">
                  {phaseGroup.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all font-medium cursor-pointer ${activeTab === item.id ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        <IconComponent className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'opacity-70'}`} />
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
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto pb-24 text-left">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'dashboard' && <TabDashboard config={projectConfig} progressPerc={progressPerc} gamification={gamification} setGamification={setGamification} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} userLevel={userLevel} pendingReviewsCount={pendingReviewsCount} setActiveTab={setActiveTab} customSprint={customSprint} userProgress={userProgress} edital={edital} activeSubjectIds={activeSubjectIds} />}
            {activeTab === 'disciplinas' && <TabDisciplinas edital={edital} setEdital={setEdital} progress={userProgress} toggleSprintItem={toggleSprintItem} customSprint={customSprint} resetProgress={resetProgress} />}
            {activeTab === 'planner' && <TabPlanner customSprint={customSprint} sprintsCompleted={sprintsCompleted} setActiveTab={setActiveTab} />}
            {activeTab === 'cronograma' && <TabCronograma customSprint={customSprint} setCustomSprint={setCustomSprint} sprintsCompleted={sprintsCompleted} setSprintsCompleted={setSprintsCompleted} setActiveTab={setActiveTab} progress={userProgress} toggleProgress={toggleProgress} addXP={addXP} />}
            {activeTab === 'revisoes' && <TabDeckAnki progress={userProgress} handleReviewFeedback={handleReviewFeedback} edital={edital} activeSubjectIds={activeSubjectIds} />}
            {activeTab === 'admin' && <TabAdmin config={projectConfig} setConfig={setProjectConfig} setUserProgress={setUserProgress} setGamification={setGamification} setEdital={setEdital} setCustomSprint={setCustomSprint} initialEdital={initialEdital} />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ==========================================
// ABA DASHBOARD / COCKPIT
// ==========================================
function TabDashboard({ config, progressPerc, gamification, setGamification, dailyLogs, setDailyLogs, userLevel, pendingReviewsCount, setActiveTab, customSprint, userProgress, edital, activeSubjectIds }) {
  const [loggedHoursToday, setLoggedHoursToday] = useState('');
  const today = new Date().toLocaleDateString();
  const todayHours = dailyLogs[today] || 0;
  const progressDaily = Math.min((todayHours / config.horasDia) * 100, 100);

  // Cálculos do Funil
  const totalAssuntos = activeSubjectIds.size;
  let countTeoria = 0;
  let countQuestoes = 0;
  let countRevisao = 0;

  activeSubjectIds.forEach(id => {
    const p = userProgress[id];
    if (p?.estudado) countTeoria++;
    if (p?.questoes) countQuestoes++;
    if (p?.revisado) countRevisao++;
  });

  const percTeoria = totalAssuntos === 0 ? 0 : Math.round((countTeoria / totalAssuntos) * 100);
  const percQuestoes = totalAssuntos === 0 ? 0 : Math.round((countQuestoes / totalAssuntos) * 100);
  const percRevisao = totalAssuntos === 0 ? 0 : Math.round((countRevisao / totalAssuntos) * 100);

  // Cálculos do Radar de Disciplinas
  const radarData = [];
  edital.forEach(b => b.disciplinas.forEach(d => {
    const totalDisc = d.assuntos.length;
    if (totalDisc === 0) return;
    let completedDisc = 0;
    d.assuntos.forEach(a => {
      const p = userProgress[a.id];
      if (p?.estudado) completedDisc++;
      if (p?.questoes) completedDisc++;
      if (p?.revisado) completedDisc++;
    });
    const percDisc = Math.round((completedDisc / (totalDisc * 3)) * 100);
    radarData.push({ id: d.id, nome: d.nome, perc: percDisc, cor: d.cor });
  }));

  const handleLogHours = (e) => {
    e.preventDefault();
    const hours = parseFloat(loggedHoursToday);
    if (!isNaN(hours) && hours > 0) {
      setDailyLogs(prev => ({ ...prev, [today]: (prev[today] || 0) + hours }));
      if ((todayHours + hours) >= config.horasDia && gamification.lastActiveDate !== today) {
        setGamification(prev => ({ ...prev, streak: prev.streak + 1, lastActiveDate: today }));
      } else if (gamification.lastActiveDate !== today) {
        setGamification(prev => ({ ...prev, lastActiveDate: today }));
      }
      setLoggedHoursToday('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{config.appName} Cockpit</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Mensure a sua execução diária e visualize as suas métricas de aprovação.</p>
      </header>

      {/* LINHA 1: COCKPIT DIÁRIO E OFENSIVA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
              <circle cx="64" cy="64" r="56" className="stroke-blue-500 drop-shadow-md transition-all duration-1000 ease-out" strokeWidth="12" fill="none" strokeDasharray="351.85" strokeDashoffset={351.85 - (351.85 * progressDaily) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{todayHours.toFixed(1)}<span className="text-lg text-slate-400">h</span></span>
              <span className="text-[10px] font-bold uppercase text-slate-400">De {config.horasDia}h Meta</span>
            </div>
          </div>
          <div className="flex-1 w-full z-10 text-left">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Foco de Hoje</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Registe as horas líquidas de estudo focadas no edital.</p>
            <form onSubmit={handleLogHours} className="flex gap-2">
              <input type="number" step="0.5" placeholder="Ex: 2.5" value={loggedHoursToday} onChange={(e) => setLoggedHoursToday(e.target.value)} className="w-24 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500 font-bold text-center" />
              <button type="submit" className="bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold transition-colors cursor-pointer">Adicionar Horas</button>
            </form>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-md p-6 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy className="w-24 h-24"/></div>
          <div className="z-10 text-left">
            <h3 className="font-bold text-amber-100 flex items-center gap-2 text-sm uppercase tracking-wider mb-4"><Flame className="w-4 h-4"/> Status Atual</h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black">{gamification.streak}</span>
              <span className="text-amber-200 font-medium mb-1">Dias Seguidos</span>
            </div>
            {gamification.streak > 0 ? <p className="text-xs text-amber-100 mt-1">Sua ofensiva está em chamas!</p> : <p className="text-xs text-amber-100 mt-1">Estude hoje para acender a chama.</p>}
          </div>
          <div className="mt-6 pt-4 border-t border-amber-400/30 z-10 text-left">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-lg">Nível {userLevel.nivel}</span>
              <span className="text-xs font-bold text-amber-200">{gamification.xp} / {userLevel.max} XP</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(gamification.xp / userLevel.max) * 100}%` }}></div>
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest text-amber-200 mt-2">{userLevel.titulo}</p>
          </div>
        </div>
      </div>

      {/* LINHA 2: DOMÍNIO E PASSOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-center text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl"><TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400"/></div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Domínio da Trilha</h3>
              <p className="text-xs text-slate-500">Progresso de Consolidação</p>
            </div>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-4xl font-black text-slate-800 dark:text-white">{progressPerc}%</span>
            <span className="text-sm font-bold text-slate-400 mb-1">Consolidado</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progressPerc}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Continue a fechar tópicos para consolidar a sua aprovação.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 text-left">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Próximos Passos</h3>
          <div className="space-y-3">
            <button onClick={() => setActiveTab('revisoes')} className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-200 dark:bg-red-800 rounded-lg group-hover:scale-110 transition-transform"><BrainCircuit className="w-5 h-5 text-red-700 dark:text-red-300"/></div>
                <div className="text-left">
                  <span className="block font-bold text-red-900 dark:text-red-300">Revisão Espaçada</span>
                  <span className="text-xs text-red-700 dark:text-red-400">Lute contra o esquecimento.</span>
                </div>
              </div>
              <span className="font-black text-xl text-red-600 dark:text-red-400">{pendingReviewsCount}</span>
            </button>

            <button onClick={() => setActiveTab('planner')} className="w-full flex items-center justify-between p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-200 dark:bg-emerald-800 rounded-lg group-hover:scale-110 transition-transform"><LayoutGrid className="w-5 h-5 text-emerald-700 dark:text-emerald-300"/></div>
                <div className="text-left">
                  <span className="block font-bold text-emerald-900 dark:text-emerald-300">Metas da Semana</span>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400">Gerenciar e criar novas Sprints.</span>
                </div>
              </div>
              <span className="font-black text-xl text-emerald-600 dark:text-emerald-400">{Math.ceil(customSprint.length / 2)} Sprints</span>
            </button>
          </div>
        </div>
      </div>

      {/* LINHA 3: FUNIL DA APROVAÇÃO E RADAR DE DISCIPLINAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Funil da Aprovação */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-500"/> O Funil da Aprovação
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-6 w-full max-w-md mx-auto">
            {/* Teoria */}
            <div className="w-full">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                <span className="text-blue-600 dark:text-blue-400">1. Teoria</span>
                <span className="text-slate-500">{countTeoria}/{totalAssuntos} ({percTeoria}%)</span>
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${percTeoria}%`}}></div>
              </div>
            </div>
            {/* Questões */}
            <div className="w-[90%] mx-auto">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                <span className="text-purple-600 dark:text-purple-400">2. Questões</span>
                <span className="text-slate-500">{countQuestoes}/{totalAssuntos} ({percQuestoes}%)</span>
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-1000" style={{width: `${percQuestoes}%`}}></div>
              </div>
            </div>
            {/* Revisões */}
            <div className="w-[80%] mx-auto">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
                <span className="text-emerald-600 dark:text-emerald-400">3. Revisões</span>
                <span className="text-slate-500">{countRevisao}/{totalAssuntos} ({percRevisao}%)</span>
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${percRevisao}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Radar de Disciplinas */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500"/> Raio-X por Disciplina
          </h3>
          <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {radarData.map(disc => (
              <div key={disc.id}>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300 truncate pr-2">{disc.nome}</span>
                  <span className="text-slate-500 shrink-0 font-black">{disc.perc}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${disc.perc === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{width: `${disc.perc}%`}}></div>
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
// ABA 1: ARSENAL DE MATÉRIAS
// ==========================================
function TabDisciplinas({ edital, setEdital, progress, customSprint, toggleSprintItem, resetProgress }) {
  const [expanded, setExpanded] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  
  const [newTopic, setNewTopic] = useState({ discId: '', titulo: '', linkTec: '' });
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editTopicData, setEditTopicData] = useState({ titulo: '', linkTec: '', pergunta: '', resposta: '', indent: 0 });
  
  const [bulkInput, setBulkInput] = useState({ discId: null, text: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const toggleNode = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpanded({});
      setIsAllExpanded(false);
    } else {
      const newExpanded = {};
      edital.forEach(bloco => {
        newExpanded[bloco.id] = true;
        bloco.disciplinas.forEach(disc => { newExpanded[disc.id] = true; });
      });
      setExpanded(newExpanded);
      setIsAllExpanded(true);
    }
  };

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, position, discId) => { dragItem.current = { position, discId }; e.dataTransfer.effectAllowed = "move"; };
  const handleDragEnter = (e, position, discId) => { e.preventDefault(); dragOverItem.current = { position, discId }; };
  const handleDrop = (e) => {
    e.preventDefault();
    if (!dragItem.current || !dragOverItem.current) return;
    if (dragItem.current.discId !== dragOverItem.current.discId) return;

    const discId = dragItem.current.discId;
    const dragIdx = dragItem.current.position;
    const dropIdx = dragOverItem.current.position;
    
    dragItem.current = null;
    dragOverItem.current = null;

    setEdital(prevEdital => prevEdital.map(bloco => ({
      ...bloco,
      disciplinas: bloco.disciplinas.map(disc => {
        if (disc.id === discId) {
          const newAssuntos = [...disc.assuntos];
          const [draggedTopic] = newAssuntos.splice(dragIdx, 1);
          newAssuntos.splice(dropIdx, 0, draggedTopic);
          return { ...disc, assuntos: newAssuntos };
        }
        return disc;
      })
    })));
  };

  const handleDeleteClick = (discId, assId) => {
    if (confirmDeleteId === assId) {
      setEdital(prev => prev.map(b => ({
        ...b,
        disciplinas: b.disciplinas.map(d => {
          if(d.id === discId) return { ...d, assuntos: d.assuntos.filter(a => a.id !== assId) };
          return d;
        })
      })));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(assId);
      setTimeout(() => setConfirmDeleteId(null), 3000); 
    }
  };

  const handleIndent = (discId, assId, delta) => {
    setEdital(prev => prev.map(b => ({
      ...b,
      disciplinas: b.disciplinas.map(d => {
        if (d.id === discId) {
          return {
            ...d,
            assuntos: d.assuntos.map(a => {
              if (a.id === assId) {
                const currentIndent = a.indent || 0;
                const newIndent = Math.max(0, Math.min(3, currentIndent + delta));
                return { ...a, indent: newIndent };
              }
              return a;
            })
          };
        }
        return d;
      })
    })));
  };

  const handleAddTopic = (discId) => {
    if(!newTopic.titulo) return;
    const newAssId = `t_${Date.now()}`;
    setEdital(prev => prev.map(b => ({
      ...b,
      disciplinas: b.disciplinas.map(d => {
        if(d.id === discId) return { ...d, assuntos: [...d.assuntos, { id: newAssId, titulo: newTopic.titulo, temp: '⭐ NOVO', linkTec: newTopic.linkTec, indent: 0, pergunta: '', resposta: '' }] };
        return d;
      })
    })));
    setNewTopic({ discId: '', titulo: '', linkTec: '' });
  };

  const handleBulkAdd = (discId) => {
    if (!bulkInput.text.trim()) return;
    const lines = bulkInput.text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return;

    const newAssuntos = lines.map((line, idx) => ({
      id: `t_${Date.now()}_${idx}`,
      titulo: line.trim(),
      temp: '⭐ NOVO',
      linkTec: '',
      indent: 0,
      pergunta: '',
      resposta: ''
    }));

    setEdital(prev => prev.map(b => ({
      ...b,
      disciplinas: b.disciplinas.map(d => {
        if(d.id === discId) {
          return { ...d, assuntos: [...d.assuntos, ...newAssuntos] };
        }
        return d;
      })
    })));
    
    setBulkInput({ discId: null, text: '' });
  };

  const startEditTopic = (assunto) => { 
    setEditingTopicId(assunto.id); 
    setEditTopicData({ 
      titulo: assunto.titulo || '', 
      linkTec: assunto.linkTec || '',
      pergunta: assunto.pergunta || '',
      resposta: assunto.resposta || '',
      indent: assunto.indent || 0
    }); 
  };
  
  const saveEditTopic = (discId, assId) => {
    if (!editTopicData.titulo) return;
    setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => {
        if (d.id === discId) return { ...d, assuntos: d.assuntos.map(a => a.id === assId ? { ...a, ...editTopicData } : a) };
        return d;
      })
    })));
    setEditingTopicId(null);
  };

  const isFullyMastered = (assId) => {
    const p = progress[assId];
    return p?.estudado && p?.questoes && p?.revisado;
  };

  const getMemoryHealth = (assId) => {
    const p = progress[assId];
    if (!p?.lastReviewedTimestamp) return null; 
    
    const now = new Date().getTime();
    const diffDays = (now - p.lastReviewedTimestamp) / (1000 * 3600 * 24);

    if (diffDays <= 3) return { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Memória Fresca' };
    if (diffDays <= 7) return { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'A Enfraquecer' };
    return { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Alerta Crítico' };
  };

  const checkStatus = (assId) => {
    const p = progress[assId];
    const count = (p?.estudado ? 1 : 0) + (p?.questoes ? 1 : 0) + (p?.revisado ? 1 : 0);
    if (count === 3) return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
    if (count > 0) return <PlayCircle className="w-5 h-5 text-blue-400 shrink-0" />;
    return <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600 shrink-0"></div>;
  };

  return (
    <div className="space-y-6 animate-in fade-in text-left">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Arsenal de Matérias</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">A sua Trilha Base. Assuntos 100% dominados ficam riscados.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <button onClick={() => { setIsEditing(!isEditing); setEditingTopicId(null); setBulkInput({discId: null, text: ''}); }} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors w-full sm:w-auto shadow-sm cursor-pointer ${isEditing ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'}`}>
            {isEditing ? <Save className="w-4 h-4"/> : <Edit className="w-4 h-4"/>}
            {isEditing ? 'Concluir Gestão' : 'Gerenciar Matérias'}
          </button>
        </div>
      </header>

      {isEditing && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200/80">
            <strong>Modo Edição Ativo:</strong><br/>
            Na edição de um tópico, você agora pode preencher o <strong className="text-amber-900 dark:text-amber-400">Gatilho (Pergunta) e Conceito (Resposta)</strong>. Essa será a sua munição de Revisão Espaçada na respectiva aba!
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        
        <div className="flex justify-start mb-4">
          <button 
            onClick={toggleExpandAll} 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
          >
            {isAllExpanded ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
            {isAllExpanded ? 'Recolher Tudo' : 'Expandir Tudo'}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {edital.map((bloco) => (
            <div key={bloco.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4">
                <Layers className="w-5 h-5 text-indigo-500"/>
                <span className="font-black text-xl text-slate-800 dark:text-slate-200 uppercase tracking-tight">{bloco.nome}</span>
              </div>
              <div className="space-y-3">
                {bloco.disciplinas.map((disc) => {
                  const totalAssuntosDisc = disc.assuntos.length;
                  const concluidosAssuntosDisc = disc.assuntos.filter(a => isFullyMastered(a.id)).length;
                  const percConcluidoDisc = totalAssuntosDisc === 0 ? 0 : Math.round((concluidosAssuntosDisc / totalAssuntosDisc) * 100);
                  const isDiscMastered = totalAssuntosDisc > 0 && concluidosAssuntosDisc === totalAssuntosDisc;

                  return (
                    <div key={disc.id}>
                      <div onClick={() => toggleNode(disc.id)} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-3 rounded-lg select-none border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-colors">
                        {expanded[disc.id] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                        <FolderOpen className={`w-5 h-5 ${disc.cor?.split(' ')[0] || 'text-slate-500'}`} />
                        <span className="font-bold text-base text-slate-700 dark:text-slate-300">{disc.nome}</span>
                        
                        {/* NOVO: CHECKLIST GAMIFICADO NA TRILHA */}
                        <div className="ml-3 flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${isDiscMastered ? 'text-emerald-500' : 'text-slate-500'}`}>
                            {concluidosAssuntosDisc}/{totalAssuntosDisc} Concluídos
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${percConcluidoDisc}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {expanded[disc.id] && (
                        <div className="mt-2 space-y-2">
                          {disc.assuntos.map((assunto, index) => {
                            const isInSprint = customSprint.some(item => item.assId === assunto.id);
                            const isCurrentlyEditing = editingTopicId === assunto.id;
                            const mastered = isFullyMastered(assunto.id);
                            const memoryHealth = getMemoryHealth(assunto.id);
                            const hasFlashcard = assunto.pergunta || assunto.resposta;

                            return (
                              <div 
                                key={assunto.id} 
                                draggable={isEditing && !isCurrentlyEditing}
                                onDragStart={(e) => handleDragStart(e, index, disc.id)}
                                onDragEnter={(e) => handleDragEnter(e, index, disc.id)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                style={{ marginLeft: assunto.indent ? `${assunto.indent * 1.5}rem` : '0' }}
                                className={`flex items-center gap-3 py-3 px-4 rounded-xl border transition-colors bg-white dark:bg-slate-900 shadow-sm ${isEditing && !isCurrentlyEditing ? 'border-dashed border-amber-300 cursor-move hover:bg-amber-50 dark:hover:bg-amber-900/10' : 'border-slate-200 dark:border-slate-800'} ${mastered && !isEditing ? 'opacity-70 bg-slate-50 dark:bg-slate-900/50' : ''}`}
                              >
                                {isCurrentlyEditing ? (
                                  <div className="flex-1 flex flex-col gap-4 p-2 animate-in fade-in">
                                    <div className="grid md:grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Título do Assunto</label>
                                        <input type="text" value={editTopicData.titulo} onChange={(e) => setEditTopicData({...editTopicData, titulo: e.target.value})} className="w-full p-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500" />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Link Caderno TEC</label>
                                        <input type="text" value={editTopicData.linkTec} onChange={(e) => setEditTopicData({...editTopicData, linkTec: e.target.value})} className="w-full p-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500" placeholder="https://..." />
                                      </div>
                                    </div>

                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 p-4 rounded-xl space-y-3">
                                      <h4 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 flex items-center gap-2"><BrainCircuit className="w-4 h-4"/> Configurar Revisão Espaçada</h4>
                                      <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Gatilho Mental (A Pergunta)</label>
                                        <input type="text" value={editTopicData.pergunta} onChange={(e) => setEditTopicData({...editTopicData, pergunta: e.target.value})} placeholder="Ex: Qual a diferença entre Framework Genérico e Guarda-Chuva?" className="w-full p-2 text-sm rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500" />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Conceito Chave (A Resposta / Pegadinha)</label>
                                        <textarea rows="2" value={editTopicData.resposta} onChange={(e) => setEditTopicData({...editTopicData, resposta: e.target.value})} placeholder="Ex: Framework é fase de construção. Guarda-chuva é suporte contínuo." className="w-full p-2 text-sm rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none resize-none focus:border-blue-500"></textarea>
                                      </div>
                                    </div>

                                    <div className="flex gap-2 mt-1">
                                      <button onClick={() => saveEditTopic(disc.id, assunto.id)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer">Salvar Alterações</button>
                                      <button onClick={() => setEditingTopicId(null)} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer">Cancelar</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {isEditing ? (
                                      <GripVertical className="w-5 h-5 text-slate-300 dark:text-slate-600 cursor-move" />
                                    ) : (
                                      mastered ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : checkStatus(assunto.id)
                                    )}
                                    
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <span className={`font-bold transition-colors ${mastered && !isEditing ? 'line-through text-slate-400 dark:text-slate-500 decoration-2' : 'text-slate-700 dark:text-slate-300'} ${assunto.indent > 0 ? 'text-sm' : 'text-base'}`}>{assunto.titulo}</span>
                                    
                                    <div className="flex gap-2 items-center">
                                      {!isEditing && memoryHealth && (
                                        <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider ${memoryHealth.bg} ${memoryHealth.color}`} title="Saúde da Memória">
                                          <Thermometer className="w-3 h-3"/> {memoryHealth.label}
                                        </div>
                                      )}
                                      {isEditing && assunto.linkTec && <span className="text-[10px] text-blue-500 dark:text-blue-400 flex items-center gap-1"><Link className="w-3 h-3"/> Link TEC</span>}
                                    </div>
                                  </div>
                                  
                                  {!isEditing && (
                                      <button 
                                        onClick={() => {
                                          if (mastered && !isInSprint) resetProgress(assunto.id);
                                          toggleSprintItem(disc.id, assunto.id, disc.nome, assunto.titulo, assunto.temp, assunto.linkTec);
                                        }} 
                                        className={`flex items-center gap-1.5 text-xs font-black uppercase transition-colors px-3 py-1.5 rounded-lg border shadow-sm cursor-pointer ${isInSprint ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : mastered ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' : 'bg-white text-indigo-600 border-indigo-200 dark:bg-slate-800 dark:text-indigo-400 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40'}`}
                                      >
                                        {isInSprint ? <CheckCircle className="w-4 h-4" /> : (mastered ? <RefreshCcw className="w-4 h-4" /> : <Target className="w-4 h-4" />)}
                                        <span className="hidden md:inline">{isInSprint ? 'Na Sprint' : (mastered ? 'Refazer Ciclo' : 'Add à Sprint')}</span>
                                      </button>
                                    )}
                                    {isEditing && (
                                      <div className="flex flex-wrap gap-2">
                                        <button onClick={() => handleIndent(disc.id, assunto.id, -1)} disabled={!assunto.indent} className="p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 cursor-pointer" title="Recuar Nível"><ArrowLeft className="w-4 h-4"/></button>
                                        <button onClick={() => handleIndent(disc.id, assunto.id, 1)} disabled={(assunto.indent || 0) >= 3} className="p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 cursor-pointer" title="Avançar Nível"><ArrowRight className="w-4 h-4"/></button>
                                        
                                        <button onClick={() => startEditTopic(assunto)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer" title="Editar"><Pencil className="w-4 h-4"/></button>
                                        <button 
                                          onClick={() => handleDeleteClick(disc.id, assunto.id)} 
                                          className={`p-2 rounded-lg transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer ${confirmDeleteId === assunto.id ? 'bg-red-500 text-white' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                                          title="Excluir"
                                        >
                                          <Trash2 className="w-4 h-4"/>
                                          {confirmDeleteId === assunto.id && "Confirmar"}
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}

                          {isEditing && (
                            <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl flex flex-col gap-4 shadow-inner">
                              {bulkInput.discId === disc.id ? (
                                <div className="flex flex-col gap-3 animate-in fade-in">
                                  <h4 className="text-xs font-black uppercase text-amber-700 dark:text-amber-500 flex items-center gap-2"><ListPlus className="w-4 h-4"/> Importação Rápida</h4>
                                  <p className="text-xs text-amber-800/80 dark:text-amber-200/60">Cole a lista de assuntos abaixo (um por linha).</p>
                                  <textarea 
                                    rows="6"
                                    placeholder="Exemplo:&#10;Modelagem de Dados&#10;Normalização&#10;Linguagem SQL..."
                                    value={bulkInput.text}
                                    onChange={(e) => setBulkInput({ discId: disc.id, text: e.target.value })}
                                    className="w-full p-3 text-sm rounded-lg border border-amber-300 dark:border-amber-700/50 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-amber-500 resize-none"
                                  />
                                  <div className="flex gap-2">
                                    <button onClick={() => handleBulkAdd(disc.id)} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">Gerar Tópicos</button>
                                    <button onClick={() => setBulkInput({ discId: null, text: '' })} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer">Cancelar</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <h4 className="text-xs font-black uppercase text-amber-700 dark:text-amber-500 flex items-center gap-2 mb-3"><Plus className="w-4 h-4"/> Adicionar Único</h4>
                                    <div className="flex flex-col md:flex-row gap-2">
                                      <input type="text" placeholder="Nome do assunto..." value={newTopic.discId === disc.id ? newTopic.titulo : ''} onChange={(e) => setNewTopic({...newTopic, discId: disc.id, titulo: e.target.value})} className="flex-1 p-2.5 text-sm rounded-lg border border-amber-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-amber-500" />
                                      <input type="text" placeholder="Link Caderno TEC (Opcional)" value={newTopic.discId === disc.id ? newTopic.linkTec : ''} onChange={(e) => setNewTopic({...newTopic, discId: disc.id, linkTec: e.target.value})} className="flex-1 p-2.5 text-sm rounded-lg border border-amber-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-amber-500 hidden md:block" />
                                      <button onClick={() => handleAddTopic(disc.id)} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">Adicionar</button>
                                    </div>
                                  </div>

                                  <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-amber-200 dark:border-amber-800/50"></div>
                                    <span className="flex-shrink-0 mx-4 text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-widest">OU</span>
                                    <div className="flex-grow border-t border-amber-200 dark:border-amber-800/50"></div>
                                  </div>

                                  <button 
                                    onClick={() => setBulkInput({ discId: disc.id, text: '' })} 
                                    className="w-full border-2 border-dashed border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                  >
                                    <ListPlus className="w-5 h-5"/> Importar Vários (Copiar e Colar Índice)
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ABA: METAS DA SEMANA
// ==========================================
function TabPlanner({ customSprint, sprintsCompleted, setActiveTab }) {
  const sprintGroups = [];
  for (let i = 0; i < customSprint.length; i += 2) sprintGroups.push(customSprint.slice(i, i + 2));

  const activeSprint = sprintGroups.length > 0 ? sprintGroups[0] : null;
  const backlogSprints = sprintGroups.length > 1 ? sprintGroups.slice(1) : [];

  return (
    <div className="space-y-6 animate-in fade-in text-left h-full">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2"><LayoutGrid className="w-8 h-8 text-blue-500"/> Metas da Semana</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">A sua visão estratégica. O que for agendado aqui será executado na Sprint Diária.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Coluna 1: Fila de Sprints (Cinza, Tracejada) */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col min-h-[450px]">
          <h3 className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ListPlus className="w-5 h-5"/> Fila de Sprints ({backlogSprints.length})
          </h3>
          
          {backlogSprints.length > 0 ? (
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {backlogSprints.map((group, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Sprint {sprintsCompleted + idx + 2}</div>
                  {group.map(item => (
                    <div key={item.assId} className="mb-2 last:mb-0 pl-2 border-l-2 border-slate-200 dark:border-slate-600">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase truncate">{item.discNome}</span>
                      <span className="block text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{item.assTitulo}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center bg-transparent">
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-2">O seu Backlog está vazio.</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs">Vá ao Arsenal de Matérias para organizar a sua semana.</p>
            </div>
          )}
        </div>

        {/* Coluna 2: Em Curso (Azul, Tracejada) */}
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 flex flex-col min-h-[450px]">
          <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5"/> Em Curso (Hoje)
          </h3>
          
          {activeSprint ? (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-blue-200 dark:border-blue-700 flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="text-[10px] font-bold text-blue-500 mb-4 uppercase tracking-wider">Sprint {sprintsCompleted + 1}</div>
                <div className="space-y-4">
                  {activeSprint.map(item => (
                    <div key={item.assId} className="last:mb-0">
                      <span className="block text-[9px] font-bold text-blue-400 uppercase truncate">{item.discNome}</span>
                      <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.assTitulo}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setActiveTab && setActiveTab('cronograma')} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-sm cursor-pointer">
                Ir para Execução
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-800/50 rounded-xl p-6 text-center bg-transparent">
              <p className="text-blue-400 dark:text-blue-500 text-sm">Nenhuma Sprint ativada hoje.</p>
            </div>
          )}
        </div>

        {/* Coluna 3: Vitórias (Verde, Sólida) */}
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 flex flex-col min-h-[450px]">
          <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5"/> Vitórias
          </h3>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-700/50 flex flex-col items-center justify-center flex-1">
            <Trophy className="w-16 h-16 text-emerald-500 mb-4" />
            <span className="text-6xl font-black text-emerald-600 dark:text-emerald-400 mb-2">{sprintsCompleted}</span>
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Sprints Fechadas</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// ABA 4: SPRINTS DE ESTUDO DIÁRIA
// ==========================================
function TabCronograma({ customSprint, setCustomSprint, sprintsCompleted, setSprintsCompleted, setActiveTab, progress, toggleProgress, addXP }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const sprintGroups = [];
  for (let i = 0; i < customSprint.length; i += 2) sprintGroups.push(customSprint.slice(i, i + 2));

  const handleCompleteSprint = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000); 
      return;
    }
    setSprintsCompleted(prev => prev + 1);
    setCustomSprint(prev => prev.slice(2)); 
    addXP(50); 
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Sprints de Estudo</h2>
          <p className="text-slate-500 mt-1">Marque os passos. Bater a Sprint rende <strong className="text-blue-500">+50 XP</strong>.</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <button disabled={sprintGroups.length === 0} onClick={handleCompleteSprint} className={`w-full md:w-auto px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${showConfirm ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white disabled:opacity-50'}`}>
            <CheckCircle className="w-5 h-5" /> {showConfirm ? 'Confirmar Fecho (+50 XP)' : 'Concluir Sprint'}
          </button>
        </div>
      </header>

      {sprintGroups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Fila Vazia!</h3>
          <p className="text-slate-500 mb-6 text-center">Planeje a sua semana adicionando matérias.</p>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('disciplinas')} className="bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-6 py-3 rounded-xl font-bold cursor-pointer">
              Ir para o Arsenal de Matérias
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 mt-6">
          {sprintGroups.map((group, idx) => {
            const sprintNum = sprintsCompleted + idx + 1;
            const isActive = idx === 0;

            return (
              <div key={sprintNum} className={`bg-white dark:bg-slate-900 rounded-2xl p-0 overflow-hidden flex flex-col md:flex-row border-2 transition-all ${isActive ? 'border-blue-400 shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/20 scale-[1.01]' : 'border-slate-200 dark:border-slate-800 opacity-80'}`}>
                <div className={`p-5 w-full md:w-32 flex flex-col items-center justify-center font-black border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400'}`}>
                  <span className="text-xs uppercase tracking-widest">Sprint</span><span className="text-4xl mt-1">{sprintNum}</span>
                  {isActive && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded mt-2">EM CURSO</span>}
                </div>
                
                <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {group.map(item => {
                    const isEstudado = progress[item.assId]?.estudado || false;
                    const isQuestoes = progress[item.assId]?.questoes || false;
                    const isRevisado = progress[item.assId]?.revisado || false;

                    return (
                      <div key={item.assId} className={`rounded-xl p-5 border flex flex-col relative ${isActive ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
                        <button onClick={() => setCustomSprint(p => p.filter(i => i.assId !== item.assId))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors cursor-pointer" title="Remover"><Trash2 className="w-4 h-4"/></button>
                        
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 pr-6">{item.discNome}</span>
                        <p className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">{item.assTitulo}</p>
                        
                        <div className="mt-auto space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                          <label className={`flex items-center gap-3 cursor-pointer transition-colors ${isEstudado ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                            <input type="checkbox" checked={isEstudado} onChange={() => toggleProgress(item.assId, 'estudado')} disabled={!isActive} className="w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0" />
                            <span className="font-bold text-sm uppercase tracking-wide">1. Teoria</span>
                          </label>

                          <label className={`flex items-center gap-3 cursor-pointer transition-colors ${isQuestoes ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                            <input type="checkbox" checked={isQuestoes} onChange={() => toggleProgress(item.assId, 'questoes')} disabled={!isActive || !isEstudado} className="w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0" />
                            <span className="font-bold text-sm uppercase tracking-wide">2. Questões</span>
                          </label>

                          <label className={`flex items-center gap-3 cursor-pointer transition-colors ${isRevisado ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                            <input type="checkbox" checked={isRevisado} onChange={() => toggleProgress(item.assId, 'revisado')} disabled={!isActive || !isQuestoes} className="w-5 h-5 rounded cursor-pointer disabled:opacity-50 shrink-0" />
                            <span className="font-bold text-sm uppercase tracking-wide">3. Revisão (Agenda Auto)</span>
                          </label>
                          
                          {isActive && (
                            item.linkTec ? (
                              <a href={item.linkTec} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm">
                                <ExternalLink className="w-4 h-4" /> Resolver no TEC
                              </a>
                            ) : (
                              <button disabled className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed transition-all border border-slate-200 dark:border-slate-800">
                                <ExternalLink className="w-4 h-4 opacity-50" /> Resolver no TEC (Em breve)
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {/* Placeholder */}
                  {group.length === 1 && (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 opacity-60 p-5">
                      <Target className="w-8 h-8 mb-2" />
                      <p className="text-sm font-bold uppercase tracking-wider">Espaço Vazio</p>
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
// ABA 5: REVISÃO ESPAÇADA
// ==========================================
function TabDeckAnki({ progress, handleReviewFeedback, edital, activeSubjectIds }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  let todosAssuntos = [];
  edital.forEach(b => b.disciplinas.forEach(d => {
    d.assuntos.forEach(a => todosAssuntos.push({...a, discNome: d.nome}))
  }));

  const now = new Date().getTime();

  const revisoesPendentes = todosAssuntos.filter(a => {
    if (!activeSubjectIds.has(a.id)) return false;
    const p = progress[a.id];
    if (!p?.estudado) return false;
    if (p.revisado && p.nextReviewTimestamp && p.nextReviewTimestamp <= now) return true;
    if (!p.revisado) return true;
    return false;
  });

  const revisoesConcluidas = todosAssuntos.filter(a => {
    if (!activeSubjectIds.has(a.id)) return false;
    const p = progress[a.id];
    return p?.estudado && p?.revisado && p?.nextReviewTimestamp && p.nextReviewTimestamp > now;
  });

  const getDaysUntil = (timestamp) => {
    const diff = Math.ceil((timestamp - now) / (1000 * 3600 * 24));
    if (diff === 1) return 'Amanhã';
    return `em ${diff} dias`;
  };

  const handleFeedbackClick = (assId, type) => {
    handleReviewFeedback(assId, type);
    setIsFlipped(false); 
    if (revisoesPendentes.length <= 1) {
      setIsReviewing(false); 
    }
  };

  if (isReviewing && revisoesPendentes.length > 0) {
    const activeCard = revisoesPendentes[0]; 
    const questionText = activeCard.pergunta ? activeCard.pergunta : `Explique em voz alta os pontos principais e as pegadinhas sobre:\n\n${activeCard.titulo}`;
    const answerText = activeCard.resposta ? activeCard.resposta : `(Você não registrou um conceito-chave para este tópico). \n\nAvalie abaixo a sua retenção mental com base na Teoria e Questões que resolveu.`;

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-left">
          
          <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center relative">
            <span className="text-xs font-black uppercase text-blue-500 tracking-widest">{activeCard.discNome}</span>
            <span className="text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-sm">{revisoesPendentes.length} restantes</span>
            {activeCard.linkTec && (
              <a href={activeCard.linkTec} target="_blank" rel="noreferrer" title="Abrir Caderno TEC" className="absolute top-3 right-3 p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="p-8 md:p-12 min-h-[200px] flex items-center justify-center bg-white dark:bg-slate-900">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-snug whitespace-pre-wrap">{questionText}</h3>
          </div>

          {isFlipped ? (
            <div className="border-t border-slate-100 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-900/10 animate-in slide-in-from-bottom-4">
              <div className="p-8 min-h-[150px] flex items-center justify-center">
                <p className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{answerText}</p>
              </div>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-4 uppercase tracking-widest text-center">Nível de Retenção Neural</p>
                <div className="flex gap-3">
                  <button onClick={() => handleFeedbackClick(activeCard.id, 'dificil')} className="flex-1 bg-white hover:bg-red-500 text-red-600 hover:text-white dark:bg-slate-800 dark:hover:bg-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 p-4 rounded-xl font-black transition-all shadow-sm hover:shadow-lg flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="text-base uppercase tracking-wider">Difícil</span>
                    <span className="text-[10px] opacity-70 group-hover:text-red-200 font-medium">Revisar Amanhã</span>
                  </button>
                  <button onClick={() => handleFeedbackClick(activeCard.id, 'bom')} className="flex-1 bg-white hover:bg-amber-500 text-amber-600 hover:text-white dark:bg-slate-800 dark:hover:bg-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl font-black transition-all shadow-sm hover:shadow-lg flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="text-base uppercase tracking-wider">Bom</span>
                    <span className="text-[10px] opacity-70 group-hover:text-amber-200 font-medium">Revisar em 7 Dias</span>
                  </button>
                  <button onClick={() => handleFeedbackClick(activeCard.id, 'facil')} className="flex-1 bg-white hover:bg-emerald-500 text-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl font-black transition-all shadow-sm hover:shadow-lg flex flex-col items-center gap-1 group cursor-pointer">
                    <span className="text-base uppercase tracking-wider">Fácil</span>
                    <span className="text-[10px] opacity-70 group-hover:text-emerald-200 font-medium">Revisar em 15 Dias</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-center">
              <button onClick={() => setIsFlipped(true)} className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer">
                <Eye className="w-5 h-5"/> Revelar Conceito-Chave
              </button>
            </div>
          )}
        </div>
        <button onClick={() => setIsReviewing(false)} className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">Voltar ao Painel</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in text-left">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-blue-500" /> Revisão Espaçada
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Retenção ativa. O seu algoritmo inteligente de memorização (Leitner).</p>
        
        {revisoesPendentes.length > 0 && (
          <div className="mt-4">
            <button onClick={() => setIsReviewing(true)} className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Zap className="w-5 h-5"/> Iniciar Ciclo de Revisão ({revisoesPendentes.length})
            </button>
          </div>
        )}
      </header>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-4 border-b border-red-100 dark:border-red-900/30 pb-2">
            <AlertTriangle className="w-5 h-5"/> Tópicos na Fila (Hoje)
          </h3>
          <div className="space-y-3">
            {revisoesPendentes.length === 0 ? (
              <div className="text-sm font-bold text-slate-400 dark:text-slate-500 p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-400 mb-3 opacity-50"/>
                <p>A sua memória está em dia!</p>
                <p>Nenhum tópico agendado para hoje.</p>
              </div>
            ) : (
              revisoesPendentes.map((data) => (
                <div key={data.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
                  <div className="truncate pr-4">
                    <span className="text-[9px] uppercase font-black text-slate-400 block mb-0.5">{data.discNome}</span>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{data.titulo}</h4>
                  </div>
                  {(data.pergunta || data.resposta) && <BrainCircuit className="w-4 h-4 text-blue-400 shrink-0" title="Possui Gatilho Customizado"/>}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-4 border-b border-emerald-100 dark:border-emerald-900/30 pb-2">
            <Calendar className="w-5 h-5"/> Próximas Revisões (Agendadas)
          </h3>
          <div className="space-y-3">
            {revisoesConcluidas.length === 0 ? (
              <div className="text-sm font-bold text-slate-400 dark:text-slate-500 p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-center">
                Quando concluir as suas avaliações, os tópicos aparecerão aqui.
              </div>
            ) : (
              revisoesConcluidas
                .sort((a, b) => progress[a.id].nextReviewTimestamp - progress[b.id].nextReviewTimestamp)
                .map((data) => {
                  const p = progress[data.id];
                  return (
                    <div key={data.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex justify-between items-center opacity-70">
                      <div className="truncate pr-4">
                        <span className="block text-[8px] uppercase font-black text-slate-400 mb-0.5">{data.discNome}</span>
                        <h4 className="font-bold text-slate-600 dark:text-slate-400 text-xs truncate">{data.titulo}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-black text-emerald-500 dark:text-emerald-400">{getDaysUntil(p.nextReviewTimestamp)}</span>
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
// ABA ADMIN
// ==========================================
function TabAdmin({ config, setConfig, setUserProgress, setGamification, setEdital, setCustomSprint, initialEdital }) {
  const [localConfig, setLocalConfig] = useState({
    ...config,
    revBom: config.revBom || 7,
    revFacil: config.revFacil || 15
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [saveStatus, setSaveStatus] = useState('');
  const [confirmResetProgress, setConfirmResetProgress] = useState(false);
  const [confirmFactoryReset, setConfirmFactoryReset] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'nomeacao2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Palavra-passe incorreta.');
      setPasswordInput('');
    }
  };

  const handleSave = () => {
    setConfig(localConfig);
    setSaveStatus('Configurações salvas com sucesso!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      config: localConfig,
      progress: JSON.parse(localStorage.getItem('pareto_progress_v22') || '{}'),
      gamification: JSON.parse(localStorage.getItem('pareto_gamification_v22') || '{}'),
      sprints: JSON.parse(localStorage.getItem('pareto_custom_sprint_v22') || '[]'),
      edital: JSON.parse(localStorage.getItem('pareto_edital_v22') || '[]'),
      logs: JSON.parse(localStorage.getItem('pareto_daily_logs_v22') || '{}'),
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

  const handleResetProgress = () => {
    if (confirmResetProgress) {
      setUserProgress({});
      setGamification(prev => ({ ...prev, xp: 0, streak: 0 }));
      setCustomSprint([]);
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
      setEdital(initialEdital);
      setConfirmFactoryReset(false);
      alert("Sistema restaurado para o Padrão de Fábrica.");
    } else {
      setConfirmFactoryReset(true);
      setTimeout(() => setConfirmFactoryReset(false), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Acesso Restrito</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Digite a palavra-passe para aceder às configurações do sistema.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Palavra-passe..." 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors text-center font-black tracking-widest"
              />
              {errorMsg && <p className="text-red-500 text-xs font-bold mt-2">{errorMsg}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg transition-all cursor-pointer">
              Desbloquear Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in text-left">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-500" /> Painel de Controle
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Personalize o seu sistema, ajuste o algoritmo e faça backups.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('admin_auth'); }} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer dark:bg-slate-800 dark:text-slate-300">
            <Lock className="w-5 h-5"/> Trancar
          </button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer">
            <Save className="w-5 h-5"/> Salvar Alterações
          </button>
        </div>
      </header>

      {saveStatus && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 p-4 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5"/> {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BLOCO 1: PERSONALIZAÇÃO VISUAL */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-indigo-500"/> Identidade Visual
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Nome do App / Sistema</label>
              <input 
                type="text" 
                value={localConfig.appName} 
                onChange={e => setLocalConfig({...localConfig, appName: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">URL da Logo (Imagem)</label>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={localConfig.logoUrl} alt="Preview" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-cover" />
                </div>
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={localConfig.logoUrl} 
                  onChange={e => setLocalConfig({...localConfig, logoUrl: e.target.value})}
                  className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-colors text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO 2: CONFIGURAÇÕES DE ESTUDO */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Target className="w-5 h-5 text-blue-500"/> Configurações do Foco
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Concurso Alvo</label>
              <input 
                type="text" 
                value={localConfig.concurso} 
                onChange={e => setLocalConfig({...localConfig, concurso: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Cargo</label>
              <input 
                type="text" 
                value={localConfig.cargo} 
                onChange={e => setLocalConfig({...localConfig, cargo: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Banca</label>
              <input 
                type="text" 
                value={localConfig.banca} 
                onChange={e => setLocalConfig({...localConfig, banca: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Meta Diária (Horas)</label>
              <input 
                type="number" 
                step="0.5"
                value={localConfig.horasDia} 
                onChange={e => setLocalConfig({...localConfig, horasDia: parseFloat(e.target.value)})}
                className="w-full md:w-1/2 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-colors font-black text-lg"
              />
            </div>
          </div>
        </div>

        {/* BLOCO 3: MOTOR DE RETENÇÃO (LEITNER) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-emerald-500"/> Motor de Retenção (Leitner)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Ajuste os intervalos em dias para a próxima revisão baseada na sua avaliação no Deck de Combate.</p>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-2">Se avaliar "BOM"</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1"
                  value={localConfig.revBom} 
                  onChange={e => setLocalConfig({...localConfig, revBom: parseInt(e.target.value)})}
                  className="w-20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-200 outline-none focus:border-amber-500 transition-colors font-black text-center"
                />
                <span className="text-sm font-bold text-slate-400">Dias</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-2">Se avaliar "FÁCIL"</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="2"
                  value={localConfig.revFacil} 
                  onChange={e => setLocalConfig({...localConfig, revFacil: parseInt(e.target.value)})}
                  className="w-20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-200 outline-none focus:border-emerald-500 transition-colors font-black text-center"
                />
                <span className="text-sm font-bold text-slate-400">Dias</span>
              </div>
            </div>
            <p className="col-span-2 text-[10px] text-slate-400 mt-1">Nota: Avaliar "Difícil" sempre agenda a revisão para o dia seguinte.</p>
          </div>
        </div>

        {/* BLOCO 4: BACKUP DE DADOS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Download className="w-5 h-5 text-purple-500"/> Backup & Segurança
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 mt-3">Exporte todo o seu progresso, arsenal de matérias e níveis de XP para um arquivo de segurança no seu dispositivo.</p>
          </div>
          <button 
            onClick={handleExportBackup}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center gap-2 border border-purple-200 dark:border-purple-800 cursor-pointer"
          >
            <Download className="w-4 h-4"/> Exportar Meus Dados (.JSON)
          </button>
        </div>

        {/* BLOCO 5: ZONA DE PERIGO (DANGER ZONE) */}
        <div className="lg:col-span-2 bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm mt-2">
          <h3 className="text-lg font-black text-red-700 dark:text-red-400 mb-6 flex items-center gap-2 border-b border-red-200 dark:border-red-900/30 pb-3">
            <ShieldAlert className="w-5 h-5"/> Zona de Risco (Gestão Crítica)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-red-100 dark:border-red-900/50 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Limpar Progresso</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Zera todas as marcações de estudo, níveis, XP e revisões. O seu Arsenal de Matérias editado será <strong className="text-slate-700 dark:text-slate-300">mantido</strong>.</p>
              </div>
              <button 
                onClick={handleResetProgress}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${confirmResetProgress ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'}`}
              >
                {confirmResetProgress ? 'Tem certeza? Clique para Limpar' : 'Zerar Progresso e Gamificação'}
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-red-100 dark:border-red-900/50 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Restaurar Padrão de Fábrica</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Aviso: Isto apaga <strong className="text-red-500">TUDO</strong>. O progresso e qualquer matéria ou flashcard que tenha adicionado serão destruídos.</p>
              </div>
              <button 
                onClick={handleFactoryReset}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${confirmFactoryReset ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'}`}
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