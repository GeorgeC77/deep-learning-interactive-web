import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Play, RotateCcw } from 'lucide-react';

type Preset<T extends string> = {
  key: T;
  label: string;
  description: string;
  params: Record<string, number>;
};

type ExperimentPresetsProps<T extends string> = {
  title: string;
  presets: Preset<T>[];
  onApply: (params: Record<string, number>) => void;
};

export default function ExperimentPresets<T extends string>({
  title,
  presets,
  onApply,
}: ExperimentPresetsProps<T>) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="border-2 border-emerald-300 rounded-xl bg-emerald-50 p-4 space-y-3">
      <h4 className="text-sm font-bold text-emerald-800">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() => {
              setActive(preset.key);
              onApply(preset.params);
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border-2',
              active === preset.key
                ? 'bg-emerald-200 border-emerald-500 text-emerald-800'
                : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300',
            )}
            title={preset.description}
          >
            <Play className="w-3 h-3 inline mr-1" />
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setActive(null)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border-2 bg-white border-gray-200 text-gray-500 hover:border-gray-400"
        >
          <RotateCcw className="w-3 h-3 inline mr-1" />
          重置
        </button>
      </div>
      {active && (
        <p className="text-xs text-emerald-700">
          {presets.find((p) => p.key === active)?.description}
        </p>
      )}
    </div>
  );
}
