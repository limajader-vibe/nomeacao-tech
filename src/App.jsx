import React, { useState, useEffect, useRef } from 'react';
import { 
  PieChart, Calendar, CheckCircle, Clock, Target, BookOpen, 
  Layers, FileText, ChevronDown, Folder, FolderOpen, ChevronRight, PlayCircle, 
  RefreshCcw, Save, Trash2, Moon, Sun, ShoppingCart, ExternalLink, GripVertical, Plus, Link, Pencil, Settings,
  Edit, AlertTriangle, ChevronUp, Flame, Trophy, TrendingUp, Activity, Award, ListPlus, ArrowRight, ArrowLeft, BarChart2,
  Thermometer, CalendarDays, LayoutGrid, BrainCircuit, Eye, Zap, Image as ImageIcon, ShieldAlert, Download, Sliders, Lock
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
  concurso: 'Base de TI', 
  cargo: 'Núcleo Duro', 
  banca: 'CEBRASPE', 
  horasDia: 4,
  revBom: 7,
  revFacil: 15
};

const initialEdital = [
  {
    id: 'bloco-gerais', nome: 'Conhecimentos Gerais', icone: 'Layers',
    disciplinas: [
      { id: 'port', nome: 'Língua Portuguesa', cor: 'text-rose-700 bg-rose-100', 
        assuntos: [
          { id: 'port_1', titulo: 'Compreensão de Textos', temp: '🔥 QUENTE', linkTec: '', indent: 0, pergunta: "Diferença Depreende-se vs Infere-se?", resposta: "Depreende-se = Interpretação. Infere-se = Compreensão." },
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
          { id: 'conceitos', titulo: 'Conceitos Iniciais e Esquemas', temp: '🔥 QUENTE', linkTec: '', indent: 0, pergunta: "Diferencie Esquema de Instância.", resposta: "Esquema é ESTRUTURA. Instância é DADO no momento." }
        ] 
      }
    ]
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => getStorage('pareto_theme_v16', false));
  const [activeTab, setActiveTab] = useState('dashboard'); 

  const [projectConfig, setProjectConfig] = useState(() => {
    const saved = getStorage('pareto_config_v16', initialConfig);
    return { ...initialConfig, ...saved };
  });
  
  const [edital, setEdital] = useState(() => getStorage('pareto_edital_v16', initialEdital));
  const [userProgress, setUserProgress] = useState(() => getStorage('pareto_progress_v16', {}));
  const [customSprint, setCustomSprint] = useState(() => getStorage('pareto_custom_sprint_v16', []));
  const [sprintsCompleted, setSprintsCompleted] = useState(() => getStorage('pareto_sprints_completed_v16', 0));
  
  const [gamification, setGamification] = useState(() => getStorage('pareto_gamification_v16', { xp: 0, streak: 0, lastActiveDate: '' }));
  const [dailyLogs, setDailyLogs] = useState(() => getStorage('pareto_daily_logs_v16', {}));

  // PERSISTÊNCIA
  useEffect(() => { setStorage('pareto_theme_v16', isDarkMode); }, [isDarkMode]);
  useEffect(() => { setStorage('pareto_config_v16', projectConfig); }, [projectConfig]);
  useEffect(() => { setStorage('pareto_edital_v16', edital); }, [edital]);
  useEffect(() => { setStorage('pareto_progress_v16', userProgress); }, [userProgress]);
  useEffect(() => { setStorage('pareto_custom_sprint_v16', customSprint); }, [customSprint]);
  useEffect(() => { setStorage('pareto_sprints_completed_v16', sprintsCompleted); }, [sprintsCompleted]);
  useEffect(() => { setStorage('pareto_gamification_v16', gamification); }, [gamification]);
  useEffect(() => { setStorage('pareto_daily_logs_v16', dailyLogs); }, [dailyLogs]);

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
      let daysToAdd = 1;
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
      { id: 'revisoes', icon: BrainCircuit, label: 'Deck de Combate', badge: pendingReviewsCount }
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
                <img src={projectConfig.logoUrl} alt="Logo" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2942/2942784.png'; }} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity bg-white p-1" />
              </div>
              <h2 className="font-bold text-2xl tracking-tight text-white shadow-sm truncate">{projectConfig.appName}</h2>
            </div>
            
            <div className="mt-5 p-4 bg-white/10 rounded-xl relative">
              <div className="animate-in fade-in text-left">
                <p className="text-[10px] text-blue-200 uppercase font-black mb-1">{projectConfig.concurso}</p>
                <p className="font-bold text-lg leading-tight mb-2">{projectConfig.cargo}</p>
                <div className="flex flex-wrap gap-2 text-xs text-blue-100 font-medium">
                  <span className="bg-blue-900/60 px-2 py-1 rounded border border-white/10">{projectConfig.banca}</span>
                  <span className="bg-blue-900/60 px-2 py-1 rounded border border-white/10">Meta: {projectConfig.horasDia}h</span>
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
            {activeTab === 'dashboard' && <TabDashboard config={projectConfig} progressPerc={progressPerc} gamification={gamification} setGamification={setGamification} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} userLevel={userLevel} pendingReviewsCount={pendingReviewsCount} setActiveTab={setActiveTab} customSprint={customSprint} />}
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

// --- SUB-COMPONENTES DAS ABAS ---

function TabDashboard({ config, progressPerc, gamification, setGamification, dailyLogs, setDailyLogs, userLevel, pendingReviewsCount, setActiveTab, customSprint }) {
  const [loggedHoursToday, setLoggedHoursToday] = useState('');
  const today = new Date().toLocaleDateString();
  const todayHours = dailyLogs[today] || 0;
  const progressDaily = Math.min((todayHours / config.horasDia) * 100, 100);

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
        <p className="text-slate-500 mt-2 text-lg">Mensure a sua execução diária e visualize as suas métricas.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 border border-slate-200 dark:border-slate-800">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
              <circle cx="64" cy="64" r="56" className="stroke-blue-500" strokeWidth="12" fill="none" strokeDasharray="351.85" strokeDashoffset={351.85 - (351.85 * progressDaily) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{todayHours.toFixed(1)}<span className="text-lg">h</span></span>
            </div>
          </div>
          <div className="flex-1 w-full text-left">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Foco de Hoje</h3>
            <p className="text-sm text-slate-500 mb-5">Registe as horas líquidas de estudo.</p>
            <form onSubmit={handleLogHours} className="flex gap-2">
              <input type="number" step="0.5" placeholder="Ex: 2.5" value={loggedHoursToday} onChange={(e) => setLoggedHoursToday(e.target.value)} className="w-24 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-500 font-bold text-center" />
              <button type="submit" className="bg-slate-800 dark:bg-blue-600 text-white px-5 py-3 rounded-xl font-bold cursor-pointer">Adicionar</button>
            </form>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-amber-100 flex items-center gap-2 text-sm uppercase tracking-wider mb-4"><Flame className="w-4 h-4"/> Ofensiva</h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black">{gamification.streak}</span>
              <span className="text-amber-200 font-medium mb-1">Dias Seguidos</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-amber-400/30">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold">Nível {userLevel.nivel}</span>
              <span className="text-xs text-amber-200">{gamification.xp} / {userLevel.max} XP</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all" style={{ width: `${(gamification.xp / userLevel.max) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabDisciplinas({ edital, setEdital, progress, customSprint, toggleSprintItem, resetProgress }) {
  const [expanded, setExpanded] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  const [newTopic, setNewTopic] = useState({ discId: '', titulo: '', linkTec: '' });
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editTopicData, setEditTopicData] = useState({ titulo: '', linkTec: '', pergunta: '', resposta: '' });

  const toggleNode = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddTopic = (discId) => {
    if(!newTopic.titulo) return;
    const newAssId = `t_${Date.now()}`;
    setEdital(prev => prev.map(b => ({
      ...b, disciplinas: b.disciplinas.map(d => d.id === discId ? { ...d, assuntos: [...d.assuntos, { id: newAssId, titulo: newTopic.titulo, temp: '⭐ NOVO', linkTec: newTopic.linkTec, indent: 0, pergunta: '', resposta: '' }] } : d)
    })));
    setNewTopic({ discId: '', titulo: '', linkTec: '' });
  };

  const startEditTopic = (assunto) => { 
    setEditingTopicId(assunto.id); 
    setEditTopicData({ titulo: assunto.titulo || '', linkTec: assunto.linkTec || '', pergunta: assunto.pergunta || '', resposta: assunto.resposta || '' }); 
  };
  
  const saveEditTopic = (discId, assId) => {
    if (!editTopicData.titulo) return;
    setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => d.id === discId ? { ...d, assuntos: d.assuntos.map(a => a.id === assId ? { ...a, ...editTopicData } : a) } : d) })));
    setEditingTopicId(null);
  };

  const handleDeleteClick = (discId, assId) => {
    if(window.confirm("Deseja apagar este assunto?")) {
      setEdital(prev => prev.map(b => ({ ...b, disciplinas: b.disciplinas.map(d => d.id === discId ? { ...d, assuntos: d.assuntos.filter(a => a.id !== assId) } : d) })));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in text-left">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Arsenal de Matérias</h2>
        </div>
        <button onClick={() => { setIsEditing(!isEditing); setEditingTopicId(null); }} className={`px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer ${isEditing ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
          {isEditing ? 'Concluir Gestão' : 'Gerenciar Matérias'}
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex flex-col gap-6">
          {edital.map((bloco) => (
            <div key={bloco.id}>
              <h3 className="font-black text-xl text-slate-800 dark:text-slate-200 mb-4">{bloco.nome}</h3>
              <div className="space-y-3">
                {bloco.disciplinas.map((disc) => (
                  <div key={disc.id}>
                    <div onClick={() => toggleNode(disc.id)} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <FolderOpen className="w-5 h-5 text-indigo-500" />
                      <span className="font-bold">{disc.nome}</span>
                    </div>

                    {expanded[disc.id] && (
                      <div className="mt-2 space-y-2">
                        {disc.assuntos.map((assunto) => {
                          const isInSprint = customSprint.some(item => item.assId === assunto.id);
                          const isCurrentlyEditing = editingTopicId === assunto.id;
                          const mastered = progress[assunto.id]?.estudado && progress[assunto.id]?.questoes && progress[assunto.id]?.revisado;

                          return (
                            <div key={assunto.id} className={`flex items-center justify-between p-3 rounded-xl border ${isCurrentlyEditing ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-300' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                              {isCurrentlyEditing ? (
                                <div className="flex-1 flex flex-col gap-3">
                                  <input type="text" value={editTopicData.titulo} onChange={(e) => setEditTopicData({...editTopicData, titulo: e.target.value})} className="p-2 border rounded dark:bg-slate-800" />
                                  <input type="text" placeholder="Frente Flashcard (Pergunta)" value={editTopicData.pergunta} onChange={(e) => setEditTopicData({...editTopicData, pergunta: e.target.value})} className="p-2 border rounded dark:bg-slate-800" />
                                  <input type="text" placeholder="Verso Flashcard (Resposta)" value={editTopicData.resposta} onChange={(e) => setEditTopicData({...editTopicData, resposta: e.target.value})} className="p-2 border rounded dark:bg-slate-800" />
                                  <div className="flex gap-2">
                                    <button onClick={() => saveEditTopic(disc.id, assunto.id)} className="bg-emerald-500 text-white px-4 py-2 rounded font-bold cursor-pointer">Salvar</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <span className={`font-bold ${mastered && !isEditing ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{assunto.titulo}</span>
                                  {!isEditing ? (
                                    <button onClick={() => toggleSprintItem(disc.id, assunto.id, disc.nome, assunto.titulo, assunto.temp, assunto.linkTec)} className={`cursor-pointer px-3 py-1 text-xs font-bold rounded ${isInSprint ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {isInSprint ? 'Na Sprint' : 'Add à Sprint'}
                                    </button>
                                  ) : (
                                    <div className="flex gap-2">
                                      <button onClick={() => startEditTopic(assunto)} className="text-blue-500 cursor-pointer"><Pencil className="w-4 h-4"/></button>
                                      <button onClick={() => handleDeleteClick(disc.id, assunto.id)} className="text-red-500 cursor-pointer"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                        {isEditing && (
                          <div className="flex gap-2 mt-2">
                            <input type="text" placeholder="Novo Tópico..." value={newTopic.discId === disc.id ? newTopic.titulo : ''} onChange={(e) => setNewTopic({...newTopic, discId: disc.id, titulo: e.target.value})} className="flex-1 p-2 border rounded dark:bg-slate-800" />
                            <button onClick={() => handleAddTopic(disc.id)} className="bg-amber-500 text-white px-4 py-2 rounded font-bold cursor-pointer">Adicionar</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabPlanner({ customSprint, sprintsCompleted }) {
  const sprintGroups = [];
  for (let i = 0; i < customSprint.length; i += 2) sprintGroups.push(customSprint.slice(i, i + 2));
  const backlogSprints = sprintGroups.slice(1);

  return (
    <div className="space-y-6">
      <header className="border-b pb-4"><h2 className="text-3xl font-extrabold">Metas da Semana</h2></header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
          <h3 className="font-bold mb-4">Fila de Sprints ({backlogSprints.length})</h3>
          {backlogSprints.map((group, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded mb-2 shadow-sm">
              <span className="text-xs font-bold text-slate-400">Sprint {sprintsCompleted + idx + 2}</span>
              {group.map(i => <div key={i.assId} className="font-bold">{i.assTitulo}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabCronograma({ customSprint, setCustomSprint, sprintsCompleted, setSprintsCompleted, progress, toggleProgress, addXP }) {
  const sprintGroups = [];
  for (let i = 0; i < customSprint.length; i += 2) sprintGroups.push(customSprint.slice(i, i + 2));

  return (
    <div className="space-y-6">
      <header className="border-b pb-4"><h2 className="text-3xl font-extrabold">Sprints Diárias</h2></header>
      {sprintGroups.length === 0 ? (
        <div className="text-center p-12 text-slate-400">Fila Vazia. Adicione no Arsenal.</div>
      ) : (
        sprintGroups.map((group, idx) => {
          const isActive = idx === 0;
          return (
            <div key={idx} className={`p-6 rounded-xl border ${isActive ? 'border-blue-500 shadow-lg' : 'border-slate-200 opacity-50'}`}>
              <h3 className="font-bold mb-4">Sprint {sprintsCompleted + idx + 1}</h3>
              {group.map(item => (
                <div key={item.assId} className="mb-4">
                  <span className="font-bold text-lg">{item.assTitulo}</span>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={progress[item.assId]?.estudado||false} onChange={()=>toggleProgress(item.assId,'estudado')} disabled={!isActive} className="cursor-pointer"/> Teoria</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={progress[item.assId]?.questoes||false} onChange={()=>toggleProgress(item.assId,'questoes')} disabled={!isActive} className="cursor-pointer"/> Questões</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={progress[item.assId]?.revisado||false} onChange={()=>toggleProgress(item.assId,'revisado')} disabled={!isActive} className="cursor-pointer"/> Revisão</label>
                  </div>
                </div>
              ))}
              {isActive && <button onClick={() => { setSprintsCompleted(p=>p+1); setCustomSprint(p=>p.slice(2)); addXP(50); }} className="bg-emerald-500 text-white px-4 py-2 rounded mt-4 cursor-pointer">Concluir Sprint</button>}
            </div>
          )
        })
      )}
    </div>
  );
}

function TabDeckAnki({ progress, handleReviewFeedback, edital, activeSubjectIds }) {
  const [isFlipped, setIsFlipped] = useState(false);
  let todosAssuntos = [];
  edital.forEach(b => b.disciplinas.forEach(d => d.assuntos.forEach(a => todosAssuntos.push(a))));
  
  const now = new Date().getTime();
  const pendentes = todosAssuntos.filter(a => activeSubjectIds.has(a.id) && progress[a.id]?.estudado && (!progress[a.id]?.revisado || (progress[a.id]?.nextReviewTimestamp <= now)));

  if (pendentes.length > 0) {
    const card = pendentes[0];
    return (
      <div className="p-8 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-xl border">
        <h3 className="text-2xl font-bold mb-8">{card.pergunta || `Explique: ${card.titulo}`}</h3>
        {isFlipped ? (
          <div>
            <p className="mb-8">{card.resposta || "Sem resposta cadastrada."}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => {handleReviewFeedback(card.id, 'dificil'); setIsFlipped(false);}} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Difícil</button>
              <button onClick={() => {handleReviewFeedback(card.id, 'bom'); setIsFlipped(false);}} className="bg-amber-500 text-white px-4 py-2 rounded cursor-pointer">Bom</button>
              <button onClick={() => {handleReviewFeedback(card.id, 'facil'); setIsFlipped(false);}} className="bg-emerald-500 text-white px-4 py-2 rounded cursor-pointer">Fácil</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsFlipped(true)} className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer">Revelar Resposta</button>
        )}
      </div>
    );
  }
  return <div className="text-center p-12 text-slate-400">Nenhuma revisão pendente hoje!</div>;
}

// ==================================================
// ABA ADMIN: PROTEGIDA POR PALAVRA-PASSE
// ==================================================
function TabAdmin({ config, setConfig, setUserProgress, setGamification, setEdital, setCustomSprint, initialEdital }) {
  const [localConfig, setLocalConfig] = useState({
    ...config,
    revBom: config.revBom || 7,
    revFacil: config.revFacil || 15
  });
  
  // LÓGICA DE AUTENTICAÇÃO SIMPLES
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
      progress: JSON.parse(localStorage.getItem('pareto_progress_v16') || '{}'),
      gamification: JSON.parse(localStorage.getItem('pareto_gamification_v16') || '{}'),
      sprints: JSON.parse(localStorage.getItem('pareto_custom_sprint_v16') || '[]'),
      edital: JSON.parse(localStorage.getItem('pareto_edital_v16') || '[]'),
      logs: JSON.parse(localStorage.getItem('pareto_daily_logs_v16') || '{}'),
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

  // Ecrã de bloqueio
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

  // Painel de Controle Normal
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