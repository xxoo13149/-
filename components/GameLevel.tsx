import React, { useState, useEffect } from 'react';
import { LevelData } from '../types';
import CodeEditor from './CodeEditor';
import { ArrowRight, CheckCircle, AlertCircle, RefreshCw, Trophy, Lightbulb, X, BookOpen, Key, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameLevelProps {
  level: LevelData;
  onLevelComplete: () => void;
  totalLevels: number;
  currentLevelIndex: number;
  isLastLevel: boolean;
}

const GameLevel: React.FC<GameLevelProps> = ({ 
  level, 
  onLevelComplete, 
  totalLevels, 
  currentLevelIndex,
  isLastLevel
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Reset state when level changes
  useEffect(() => {
    setUserAnswers({});
    setIsSubmitted(false);
    setIsAllCorrect(false);
    setShowHelp(false);
  }, [level]);

  const handleAnswerChange = (id: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [id]: value }));
    if (isSubmitted) {
        setIsSubmitted(false);
    }
  };

  const checkAnswers = () => {
    setIsSubmitted(true);
    let allCorrect = true;

    level.blanks.forEach(blank => {
      const userVal = userAnswers[blank.id]?.trim() || '';
      if (!blank.answers.includes(userVal)) {
        allCorrect = false;
      }
    });

    setIsAllCorrect(allCorrect);

    if (allCorrect) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        gravity: 0.8,
        scalar: 1.2,
        colors: ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#ffffff']
      });
    }
  };

  const progressPercentage = Math.round(((currentLevelIndex) / totalLevels) * 100);

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col h-full relative z-10">
      
      {/* Help Modal - Glassmorphism */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel rounded-2xl shadow-[0_0_50px_rgba(79,70,229,0.3)] w-full max-w-2xl overflow-hidden animate-pop-in flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-900/80 to-slate-900/80 p-5 border-b border-white/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-400 border border-yellow-500/30">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">战术终端 // 帮助</h3>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Level {currentLevelIndex + 1} Data Log</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
               
               {/* Analysis Section */}
               <div className="space-y-3">
                 <h4 className="text-lg font-bold text-indigo-400 flex items-center gap-2 uppercase tracking-wide">
                    <Lightbulb size={20} /> 解析与思路
                 </h4>
                 <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 text-slate-300 leading-relaxed whitespace-pre-line shadow-inner">
                    {level.help.analysis}
                 </div>
               </div>

               {/* Keywords Section */}
               <div className="space-y-3">
                 <h4 className="text-lg font-bold text-indigo-400 flex items-center gap-2 uppercase tracking-wide">
                    <Key size={20} /> 核心关键词
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {level.help.keywords.map((kw, idx) => (
                        <span key={idx} className="bg-indigo-600/20 text-indigo-300 px-4 py-1.5 rounded-lg text-sm border border-indigo-500/30 font-mono shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            {kw}
                        </span>
                    ))}
                 </div>
               </div>

               {/* Answers Section */}
               <div className="space-y-3">
                 <h4 className="text-lg font-bold text-green-400 flex items-center gap-2 uppercase tracking-wide">
                    <CheckCircle size={20} /> 解密数据 (答案)
                 </h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {level.blanks.map((blank) => (
                        <div key={blank.id} className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex items-center justify-between shadow-inner">
                            <span className="text-slate-500 font-mono text-sm">位置 [{blank.id}]</span>
                            <span className="text-green-400 font-mono font-bold tracking-wider">{blank.answers[0]}</span>
                        </div>
                    ))}
                 </div>
               </div>
            </div>

            <div className="p-4 bg-slate-900/90 border-t border-white/5 flex justify-end shrink-0">
                <button 
                    onClick={() => setShowHelp(false)}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold tracking-wide transition-all shadow-lg shadow-indigo-900/50"
                >
                    关闭终端
                </button>
            </div>
          </div>
        </div>
      )}

      {/* HUD Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6 lg:mb-8 items-start">
        {/* Level Info Card */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <CodeEditor codeSnippet="def level_up(): return True" blanks={[]} userAnswers={{}} onAnswerChange={()=>{}} isSubmitted={false} /> 
            </div>
            <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-black px-3 py-1 rounded shadow-lg border border-indigo-400/30 tracking-widest uppercase">
                        Mission {currentLevelIndex + 1}
                    </span>
                    <div className="flex gap-1">
                         {[1,2,3].map(i => <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />)}
                    </div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md mb-2">{level.title}</h2>
                <p className="text-slate-300 font-medium leading-relaxed max-w-2xl">{level.description}</p>
            </div>
        </div>

        {/* Progress HUD */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-center h-full border-t-4 border-indigo-500">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">XP Progress</span>
                <span className="text-xl font-black text-white pixel-font">{progressPercentage}%</span>
            </div>
            <div className="h-4 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50 relative shadow-inner">
                {/* Grid lines on bar */}
                <div className="absolute inset-0 z-10" style={{backgroundImage: 'linear-gradient(90deg, transparent 90%, rgba(0,0,0,0.5) 90%)', backgroundSize: '10% 100%'}}></div>
                <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 relative transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[shine_2s_infinite]"></div>
                </div>
            </div>
            <div className="mt-2 text-right text-[10px] text-slate-500 font-mono">
                {currentLevelIndex} / {totalLevels} LEVELS CLEARED
            </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col gap-6 relative min-h-0">
        <CodeEditor 
          codeSnippet={level.codeSnippet}
          blanks={level.blanks}
          userAnswers={userAnswers}
          onAnswerChange={handleAnswerChange}
          isSubmitted={isSubmitted}
        />
        
        {/* Controls Bar */}
        <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 shrink-0 sticky bottom-0 bg-slate-900/80 backdrop-blur z-20">
          
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-400/10 font-bold tracking-wide uppercase text-sm"
          >
             <div className="bg-yellow-400/20 p-1.5 rounded-full"><Lightbulb size={18} /></div>
             <span>请求支援 (Hint)</span>
          </button>

          <div className="flex-1"></div>

          {/* Status Messages */}
          {isSubmitted && !isAllCorrect && (
             <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 flex items-center text-red-300 bg-red-950/50 px-5 py-2 rounded-lg border border-red-500/30 shadow-lg">
               <AlertCircle size={18} className="mr-2 text-red-500 animate-pulse" />
               <span className="text-sm font-bold">编译失败 // 检测到错误</span>
             </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
              {!isAllCorrect ? (
                <button
                    onClick={checkAnswers}
                    className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-900/50 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 border-b-4 border-indigo-800 active:border-b-0"
                >
                    <Zap size={20} className={isSubmitted ? "" : "animate-pulse"} />
                    <span>{isSubmitted ? '重新编译' : '执行代码'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-4 animate-in zoom-in slide-in-from-right-10 duration-500">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-green-400 font-black text-sm uppercase tracking-wider">System Operational</span>
                        <span className="text-slate-400 text-[10px]">NO BUGS FOUND</span>
                    </div>
                    <button
                    onClick={onLevelComplete}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2 border border-emerald-400/50 animate-pulse"
                    >
                        <span>{isLastLevel ? "领取证书" : "进入下一层"}</span>
                        {isLastLevel ? <Trophy size={20} /> : <ArrowRight size={20} />}
                    </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Full Screen Success Overlay */}
      {isSubmitted && isAllCorrect && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center justify-center w-full">
            <div className="animate-pop-in flex flex-col items-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-[60px] opacity-20 animate-pulse"></div>
                    <Trophy size={120} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] relative z-10" />
                </div>
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-300 drop-shadow-lg mt-4 pixel-font text-center">
                    {isLastLevel ? "MISSION ACCOMPLISHED" : "LEVEL COMPLETE"}
                </h2>
            </div>
        </div>
      )}

    </div>
  );
};

export default GameLevel;