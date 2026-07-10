import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
export type LessonPhase =
  | 'motivation'
  | 'prediction'
  | 'experiment'
  | 'explanation'
  | 'counterexample'
  | 'checkpoint'
  | 'transfer';

export type InteractionLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export type LessonStep = {
  phase: LessonPhase;
  title: string;
  content: ReactNode;
};

export type InteractiveLessonPageProps = {
  title: string;
  bishopChapter: string;
  bishopSection?: string;
  steps: LessonStep[];
  interactionLevel: InteractionLevel;
  children?: ReactNode;
};

/* -------------------------------------------------------------------------- */
/* Phase icon mapping                                                         */
/* -------------------------------------------------------------------------- */
const phaseConfig: Record<LessonPhase, { label: string; emoji: string; color: string }> = {
  motivation:     { label: '问题引入', emoji: '🤔', color: 'bg-amber-50 border-amber-300' },
  prediction:     { label: '你的预测', emoji: '🎯', color: 'bg-violet-50 border-violet-300' },
  experiment:     { label: '动手实验', emoji: '🧪', color: 'bg-emerald-50 border-emerald-300' },
  explanation:    { label: '逐步理解', emoji: '💡', color: 'bg-blue-50 border-blue-300' },
  counterexample: { label: '失败案例', emoji: '⚠️', color: 'bg-red-50 border-red-300' },
  checkpoint:     { label: '检查点', emoji: '✅', color: 'bg-indigo-50 border-indigo-300' },
  transfer:       { label: '迁移挑战', emoji: '🚀', color: 'bg-purple-50 border-purple-300' },
};

const levelBadge: Record<InteractionLevel, string> = {
  L0: 'bg-gray-200 text-gray-600',
  L1: 'bg-blue-100 text-blue-700',
  L2: 'bg-green-100 text-green-700',
  L3: 'bg-amber-100 text-amber-700',
  L4: 'bg-purple-100 text-purple-700',
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */
export default function InteractiveLessonPage({
  title,
  bishopChapter,
  bishopSection,
  steps,
  interactionLevel,
  children,
}: InteractiveLessonPageProps) {
  const [completedPhases, setCompletedPhases] = useState<Set<LessonPhase>>(new Set());
  const [activePhase, setActivePhase] = useState<LessonPhase>('motivation');

  const togglePhase = (phase: LessonPhase) => {
    setCompletedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
    setActivePhase(phase);
  };

  const phaseOrder: LessonPhase[] = [
    'motivation', 'prediction', 'experiment', 'explanation',
    'counterexample', 'checkpoint', 'transfer',
  ];

  const stepMap = new Map(steps.map((s) => [s.phase, s]));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-indigo-700 mt-2">
              教材映射：Bishop {bishopChapter}
              {bishopSection && ` §${bishopSection}`}
            </p>
          </div>
          <span className={cn('px-3 py-1 rounded-full text-sm font-medium', levelBadge[interactionLevel])}>
            交互等级 {interactionLevel}
          </span>
        </div>
      </section>

      {/* Phase progress */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {phaseOrder.map((phase) => {
            const cfg = phaseConfig[phase];
            const isDone = completedPhases.has(phase);
            const isActive = activePhase === phase;
            return (
              <button
                key={phase}
                onClick={() => togglePhase(phase)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2',
                  cfg.color,
                  isDone && 'ring-2 ring-green-400',
                  isActive && 'ring-2 ring-blue-500 scale-105 shadow-md',
                )}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.label}</span>
                {isDone && <span className="text-green-600 text-xs">✓</span>}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          点击每个阶段来展开/折叠。完成所有阶段即可获得完整理解。
          已完成的阶段：{completedPhases.size}/{phaseOrder.length}
        </p>
      </section>

      {/* Active step */}
      {stepMap.has(activePhase) && (
        <section className={cn(
          'rounded-xl border-2 p-6',
          phaseConfig[activePhase].color,
        )}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{phaseConfig[activePhase].emoji}</span>
            <h2 className="text-xl font-bold text-gray-900">
              {phaseConfig[activePhase].label}：{stepMap.get(activePhase)!.title}
            </h2>
          </div>
          <div className="prose prose-gray max-w-none">
            {stepMap.get(activePhase)!.content}
          </div>
        </section>
      )}

      {/* All steps when all completed */}
      {completedPhases.size >= phaseOrder.length && (
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl p-6 text-center">
          <p className="text-lg font-bold text-green-800">
            🎉 恭喜！你已完成本课所有学习阶段。
          </p>
          <p className="text-sm text-green-700 mt-1">
            建议返回任意阶段复习，或进入下一个主题继续学习。
          </p>
        </section>
      )}

      {/* Extra content (full demos shown below all phases) */}
      {children && (
        <div className="space-y-8">
          {children}
        </div>
      )}

      {/* Copyright */}
      <p className="text-center text-xs text-gray-400">
        本页为依据 Bishop & Bishop 教材知识体系制作的原创教学解释与交互演示。
        教材原文、原图及习题解答版权归原作者和出版方所有；本项目不复制教材原文和原图。
      </p>
    </div>
  );
}
