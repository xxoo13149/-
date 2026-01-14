import React, { useMemo } from 'react';
import { Blank } from '../types';

interface CodeEditorProps {
  codeSnippet: string;
  blanks: Blank[];
  userAnswers: Record<number, string>;
  onAnswerChange: (id: number, value: string) => void;
  isSubmitted: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  codeSnippet,
  blanks,
  userAnswers,
  onAnswerChange,
  isSubmitted,
}) => {
  // Parse the code snippet to separate text from blanks (___N___)
  const codeParts = useMemo(() => {
    // Regex matches ___1___, ___12___, etc.
    const regex = /(___(\d+)___)/g;
    const parts = codeSnippet.split(regex);
    return parts;
  }, [codeSnippet]);

  // Helper to determine status color
  const getInputStatus = (id: number) => {
    if (!isSubmitted) return 'border-slate-600 bg-slate-800 text-slate-100';
    
    const answer = userAnswers[id]?.trim() || '';
    const blank = blanks.find((b) => b.id === id);
    
    if (!blank) return 'border-red-500 bg-red-900/20';

    const isCorrect = blank.answers.some(a => a === answer);
    return isCorrect 
      ? 'border-green-500 bg-green-900/20 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
      : 'border-red-500 bg-red-900/20 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
  };

  return (
    <div className="bg-slate-950 rounded-xl shadow-2xl border border-slate-800 overflow-hidden relative group flex flex-col max-h-[60vh] md:max-h-[55vh]">
      {/* Mac-like Window Controls */}
      <div className="bg-slate-900 px-4 py-3 flex items-center space-x-2 border-b border-slate-800 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <div className="ml-4 text-xs text-slate-500 font-mono">solution.py</div>
      </div>

      <div className="p-6 overflow-auto code-scroll relative flex-1">
        <pre className="code-font text-sm md:text-base leading-relaxed text-slate-300 whitespace-pre-wrap">
          {codeParts.map((part, index) => {
            // Check if this part is a placeholder placeholder like ___1___
            const match = part.match(/^___(\d+)___$/);
            
            if (match) {
              const id = parseInt(match[1], 10);
              // Calculate width based on answer length to make it look nice, min 60px
              const answerLength = userAnswers[id]?.length || 0;
              const widthStyle = Math.max(60, answerLength * 10 + 20) + 'px';

              return (
                <input
                  key={index}
                  type="text"
                  value={userAnswers[id] || ''}
                  onChange={(e) => onAnswerChange(id, e.target.value)}
                  className={`inline-block mx-1 px-2 py-0.5 rounded border-b-2 outline-none transition-all duration-300 text-center font-bold ${getInputStatus(id)}`}
                  style={{ width: widthStyle, minWidth: '40px', maxWidth: '300px' }}
                  autoComplete="off"
                  spellCheck={false}
                />
              );
            }

            // Skip the capture groups from split() that are just numbers
            if (/^\d+$/.test(part)) return null;

            return <span key={index}>{part}</span>;
          })}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;