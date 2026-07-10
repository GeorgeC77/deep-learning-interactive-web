import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type CounterexampleToggleProps = {
  title: string;
  correctScenario: { label: string; description: string };
  counterexampleScenario: { label: string; description: string };
  keyInsight: string;
};

export default function CounterexampleToggle({
  title,
  correctScenario,
  counterexampleScenario,
  keyInsight,
}: CounterexampleToggleProps) {
  const [mode, setMode] = useState<'correct' | 'counterexample'>('correct');

  return (
    <div className="border-2 border-red-300 rounded-xl bg-red-50 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-bold text-red-900">{title}</h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode('correct')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all border-2',
            mode === 'correct'
              ? 'bg-green-100 border-green-500 text-green-800 ring-2 ring-green-300'
              : 'bg-white border-gray-200 text-gray-500',
          )}
        >
          <CheckCircle2 className="w-4 h-4 inline mr-1" />
          {correctScenario.label}
        </button>
        <button
          onClick={() => setMode('counterexample')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all border-2',
            mode === 'counterexample'
              ? 'bg-red-100 border-red-500 text-red-800 ring-2 ring-red-300'
              : 'bg-white border-gray-200 text-gray-500',
          )}
        >
          <AlertTriangle className="w-4 h-4 inline mr-1" />
          {counterexampleScenario.label}
        </button>
      </div>

      <div className={cn(
        'rounded-lg p-4',
        mode === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200',
      )}>
        <p className="text-sm">
          {mode === 'correct' ? correctScenario.description : counterexampleScenario.description}
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <strong>关键洞察：</strong>{keyInsight}
      </div>
    </div>
  );
}
