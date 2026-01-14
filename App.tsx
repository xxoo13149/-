import React, { useState, useRef, useEffect } from 'react';
import { LEVELS } from './data';
import { GameState } from './types';
import GameLevel from './components/GameLevel';
import { Terminal, Code2, Play, Trophy, RotateCcw, Volume2, VolumeX, Map as MapIcon, Lock, Unlock, X, Sparkles, Cpu } from 'lucide-react';

// Using a reliable royalty-free game loop audio URL (Galaxy Invaders Theme from CodeSkulptor demos)
const BGM_URL = "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showLevelMap, setShowLevelMap] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    // Create audio instance
    const audio = new Audio(BGM_URL);
    audio.loop = true;
    audio.volume = 0.3;
    
    // Add rudimentary error handling
    const handleError = (e: Event) => {
      console.warn("Audio source failed to load:", e);
      setIsMusicPlaying(false);
    };

    audio.addEventListener('error', handleError);
    audioRef.current = audio;
    
    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(error => {
            console.error("Audio play failed:", error);
            setIsMusicPlaying(false);
          });
      }
    }
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setCurrentLevelIndex(0);
    
    // Attempt to play music on user interaction
    if (audioRef.current && !isMusicPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsMusicPlaying(true);
            })
            .catch(error => {
              // Auto-play was prevented or source failed
              console.log("Autoplay prevented or source invalid:", error);
              setIsMusicPlaying(false);
            });
        }
    }
  };

  const jumpToLevel = (index: number) => {
      setCurrentLevelIndex(index);
      setGameState(GameState.PLAYING);
      setShowLevelMap(false);
  };

  const nextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setGameState(GameState.COMPLETED);
    }
  };

  const restartGame = () => {
    setGameState(GameState.WELCOME);
    setCurrentLevelIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-float-delayed"></div>
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] animate-pulse"></div>
      </div>

      {/* Level Map Modal */}
      {showLevelMap && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                          <MapIcon className="text-indigo-400" />
                          <span>关卡地图 (Level Select)</span>
                      </h2>
                      <button onClick={() => setShowLevelMap(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                          <X />
                      </button>
                  </div>
                  <div className="p-8 overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {LEVELS.map((level, idx) => {
                          const isCurrent = idx === currentLevelIndex;
                          const isCompleted = idx < currentLevelIndex; // Simple logic for visual, technically we don't track completion persistently per session yet
                          
                          return (
                              <button 
                                key={level.id}
                                onClick={() => jumpToLevel(idx)}
                                className={`group relative p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] ${isCurrent ? 'bg-indigo-900/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-700/60 hover:border-slate-500'}`}
                              >
                                  <div className="flex justify-between items-start mb-2">
                                      <span className={`text-xs font-bold px-2 py-1 rounded ${isCurrent ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                          LVL {idx + 1}
                                      </span>
                                      {/* Just visual icons, all levels are unlocked as per request */}
                                      <Unlock size={14} className="text-emerald-500/50" />
                                  </div>
                                  <h3 className={`font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{level.title}</h3>
                                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{level.description}</p>
                              </button>
                          )
                      })}
                  </div>
              </div>
          </div>
      )}

      {/* Top Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={restartGame}>
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg relative z-10">
                    <Code2 size={24} className="text-white" />
                </div>
            </div>
            <h1 className="text-xl font-black tracking-wide italic text-white flex gap-1 items-center font-sans">
              <span>代码</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">嘻嘻</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
             {gameState === GameState.PLAYING && (
                 <button 
                    onClick={() => setShowLevelMap(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 group"
                 >
                     <MapIcon size={16} className="text-indigo-400 group-hover:animate-pulse" />
                     <span className="hidden sm:inline">关卡地图</span>
                 </button>
             )}
             
             <button 
                onClick={toggleMusic}
                className={`p-2.5 rounded-lg border transition-all duration-300 ${isMusicPlaying ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                title={isMusicPlaying ? "静音" : "播放音乐"}
             >
                {isMusicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 relative z-10 w-full max-w-7xl mx-auto">
        
        {gameState === GameState.WELCOME && (
          <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-700 relative z-10 py-10 flex flex-col items-center">
            
            <div className="relative group cursor-default">
                 {/* Decorative Elements */}
                 <Sparkles className="absolute -top-8 -right-8 text-yellow-400 animate-pulse" size={40} />
                 <Cpu className="absolute -bottom-6 -left-12 text-blue-500 animate-bounce" size={40} />
                 
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
                 
                 <h1 className="relative text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl select-none fun-font glitch-hover">
                    代码嘻嘻
                 </h1>
                 
                 <div className="mt-4 flex justify-center gap-2">
                    <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-mono border border-indigo-500/30">Python Edition</span>
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-mono border border-purple-500/30">Gamified Learning</span>
                 </div>
            </div>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
               <span className="text-white font-bold">编程</span>不再枯燥，<span className="text-white font-bold">闯关</span>就是学习！<br/>
               准备好修复世界的 BUG 了吗？
            </p>

            <div className="flex flex-col items-center gap-6 w-full">
              <button 
                onClick={startGame}
                className="group relative px-12 py-6 bg-white hover:bg-indigo-50 text-indigo-950 font-black text-2xl rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 overflow-hidden w-full max-w-xs border-b-8 border-indigo-200"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <Play className="fill-current" size={28} />
                  <span>开始挑战</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <div className="grid grid-cols-3 gap-8 text-center text-slate-400 mt-8">
                  <div className="flex flex-col items-center gap-2">
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700"><Trophy size={20} className="text-yellow-500" /></div>
                      <span className="text-xs font-bold">赢取勋章</span>
                  </div>
                   <div className="flex flex-col items-center gap-2">
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700"><MapIcon size={20} className="text-emerald-500" /></div>
                      <span className="text-xs font-bold">趣味关卡</span>
                  </div>
                   <div className="flex flex-col items-center gap-2">
                      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700"><Terminal size={20} className="text-pink-500" /></div>
                      <span className="text-xs font-bold">实战演练</span>
                  </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-12 text-xs text-slate-500 font-mono mt-12 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> System Ready</span>
              <span>v3.0.0 HAPPY_CODE</span>
            </div>
          </div>
        )}

        {gameState === GameState.PLAYING && (
          <GameLevel 
            level={LEVELS[currentLevelIndex]}
            onLevelComplete={nextLevel}
            totalLevels={LEVELS.length}
            currentLevelIndex={currentLevelIndex}
            isLastLevel={currentLevelIndex === LEVELS.length - 1}
          />
        )}

        {gameState === GameState.COMPLETED && (
          <div className="max-w-2xl w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-700 z-10 py-12">
             <div className="relative inline-block">
                 <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-30 animate-pulse"></div>
                 <Trophy size={120} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] relative z-10 animate-float" />
             </div>
             
            <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-sm uppercase fun-font">
                挑战成功
                </h1>
                <p className="text-xl text-slate-300 font-medium">
                所有系统已恢复正常。你已获得<span className="text-yellow-400 font-bold">代码大师</span>认证！
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
                <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-colors group">
                    <div className="text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">{LEVELS.length}</div>
                    <div className="text-xs text-indigo-400 uppercase tracking-widest font-bold">关卡全破</div>
                </div>
                 <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-colors group">
                    <div className="text-5xl font-black text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">S+</div>
                    <div className="text-xs text-emerald-600 uppercase tracking-widest font-bold">最终评级</div>
                </div>
            </div>

            <button 
              onClick={restartGame}
              className="mt-8 px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center space-x-3 mx-auto border border-slate-600 group"
            >
              <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
              <span>再次挑战 (Replay)</span>
            </button>
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center text-slate-600 text-[10px] font-mono border-t border-white/5 bg-slate-950/80 backdrop-blur-md z-50">
        <p className="tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity cursor-default">CODE_XIXI // SYSTEM_READY</p>
      </footer>
    </div>
  );
};

export default App;