import { useState, type ReactNode } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

type PredictionGateProps = {
  question: string;
  hint?: string;
  revealContent: ReactNode;
  children?: ReactNode;
};

export default function PredictionGate({ question, hint, revealContent, children }: PredictionGateProps) {
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userPrediction, setUserPrediction] = useState('');

  return (
    <div className="border-2 border-violet-300 rounded-xl bg-violet-50 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-violet-600" />
        <h3 className="text-lg font-bold text-violet-900">先思考再验证</h3>
      </div>
      <p className="text-gray-800 font-medium">{question}</p>

      {children}

      <textarea
        className="w-full border border-violet-200 rounded-lg p-3 text-sm bg-white resize-none"
        rows={2}
        placeholder="写下你的预测或直觉..."
        value={userPrediction}
        onChange={(e) => setUserPrediction(e.target.value)}
      />

      <div className="flex gap-2">
        {hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-1.5 text-sm bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
          >
            {showHint ? '隐藏提示' : '💡 需要提示'}
          </button>
        )}
        <button
          onClick={() => setRevealed(!revealed)}
          className="px-4 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          {revealed ? '收起解释' : '✨ 揭晓答案'}
        </button>
      </div>

      {showHint && hint && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          {hint}
        </div>
      )}

      {revealed && (
        <div className="bg-white border border-violet-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ChevronRight className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-800">解释</span>
          </div>
          {revealContent}
          {userPrediction && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">你的预测：{userPrediction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
