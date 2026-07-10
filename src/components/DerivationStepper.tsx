import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

type DerivationStep = {
  label: string;
  formula: string;
  explanation: string;
};

type DerivationStepperProps = {
  title: string;
  steps: DerivationStep[];
};

export default function DerivationStepper({ title, steps }: DerivationStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="border-2 border-blue-300 rounded-xl bg-blue-50 p-6 space-y-4">
      <h3 className="text-lg font-bold text-blue-900">{title}</h3>

      {/* Step indicators */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2',
              i < currentStep
                ? 'bg-green-100 border-green-400 text-green-700'
                : i === currentStep
                ? 'bg-blue-200 border-blue-500 text-blue-800 ring-2 ring-blue-400'
                : 'bg-white border-gray-200 text-gray-500',
            )}
          >
            {i + 1}. {step.label}
          </button>
        ))}
      </div>

      {/* Current step detail */}
      <div className="bg-white rounded-lg border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex-shrink-0">
            {currentStep + 1}
          </span>
          <div className="space-y-3 flex-1">
            <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm overflow-x-auto">
              {'\\( ' + steps[currentStep].formula + ' \\)'}
            </div>
            <p className="text-sm text-gray-700">{steps[currentStep].explanation}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg transition-colors',
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
          )}
        >
          ← 上一步
        </button>
        <span className="text-sm text-gray-500 self-center">
          {currentStep + 1} / {steps.length}
        </span>
        <button
          disabled={currentStep === steps.length - 1}
          onClick={() => setCurrentStep(currentStep + 1)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1',
            currentStep === steps.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
        >
          下一步 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
