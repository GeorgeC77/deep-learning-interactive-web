import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleHelp, RotateCcw, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ExerciseDifficulty = 1 | 2 | 3;

export type ExerciseOption = {
  id: string;
  label: string;
};

export type LearningExercise = {
  id: string;
  difficulty: ExerciseDifficulty;
  prompt: string;
  options: ExerciseOption[];
  correctOptionId: string;
  hint: string;
  explanation: string;
};

type ExerciseState = {
  selectedOptionId: string;
  submitted: boolean;
  mastered: boolean;
  attempts: number;
  hintVisible: boolean;
};

type StoredExerciseProgress = {
  masteredExerciseIds: string[];
  attempts: Record<string, number>;
};

type ExercisePanelProps = {
  exerciseSetId: string;
  title?: string;
  description?: string;
  exercises: LearningExercise[];
};

const STORAGE_PREFIX = 'deep-learning-course:exercise:';

function createInitialState(exercises: LearningExercise[]): Record<string, ExerciseState> {
  return Object.fromEntries(
    exercises.map((exercise) => [
      exercise.id,
      {
        selectedOptionId: '',
        submitted: false,
        mastered: false,
        attempts: 0,
        hintVisible: false,
      },
    ]),
  );
}

function loadProgress(
  exerciseSetId: string,
  exercises: LearningExercise[],
): Record<string, ExerciseState> {
  const initial = createInitialState(exercises);
  if (typeof window === 'undefined') return initial;

  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${exerciseSetId}`);
    if (!raw) return initial;
    const stored = JSON.parse(raw) as StoredExerciseProgress;
    const mastered = new Set(stored.masteredExerciseIds ?? []);
    return Object.fromEntries(
      exercises.map((exercise) => [
        exercise.id,
        {
          ...initial[exercise.id],
          mastered: mastered.has(exercise.id),
          attempts: stored.attempts?.[exercise.id] ?? 0,
        },
      ]),
    );
  } catch {
    return initial;
  }
}

export default function ExercisePanel({
  exerciseSetId,
  title = '主动练习',
  description = '先独立作答，再阅读反馈。全部答对才算掌握本节。',
  exercises,
}: ExercisePanelProps) {
  const [state, setState] = useState<Record<string, ExerciseState>>(() =>
    loadProgress(exerciseSetId, exercises),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const progress: StoredExerciseProgress = {
      masteredExerciseIds: exercises
        .filter((exercise) => state[exercise.id]?.mastered)
        .map((exercise) => exercise.id),
      attempts: Object.fromEntries(
        exercises.map((exercise) => [exercise.id, state[exercise.id]?.attempts ?? 0]),
      ),
    };
    window.localStorage.setItem(
      `${STORAGE_PREFIX}${exerciseSetId}`,
      JSON.stringify(progress),
    );
    window.dispatchEvent(new CustomEvent('course-progress-updated'));
  }, [exerciseSetId, exercises, state]);

  const masteredCount = useMemo(
    () => exercises.filter((exercise) => state[exercise.id]?.mastered).length,
    [exercises, state],
  );
  const allMastered = masteredCount === exercises.length;

  const selectOption = (exerciseId: string, optionId: string) => {
    setState((previous) => ({
      ...previous,
      [exerciseId]: {
        ...previous[exerciseId],
        selectedOptionId: optionId,
      },
    }));
  };

  const submit = (exercise: LearningExercise) => {
    setState((previous) => {
      const current = previous[exercise.id];
      const correct = current.selectedOptionId === exercise.correctOptionId;
      return {
        ...previous,
        [exercise.id]: {
          ...current,
          submitted: true,
          mastered: current.mastered || correct,
          attempts: current.attempts + 1,
        },
      };
    });
  };

  const retry = (exerciseId: string) => {
    setState((previous) => ({
      ...previous,
      [exerciseId]: {
        ...previous[exerciseId],
        selectedOptionId: '',
        submitted: false,
      },
    }));
  };

  const toggleHint = (exerciseId: string) => {
    setState((previous) => ({
      ...previous,
      [exerciseId]: {
        ...previous[exerciseId],
        hintVisible: !previous[exerciseId].hintVisible,
      },
    }));
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <CircleHelp className="w-6 h-6 text-violet-600" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>
        <div
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold border',
            allMastered
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-violet-50 text-violet-800 border-violet-200',
          )}
          aria-live="polite"
        >
          {allMastered ? '本节已掌握' : `掌握进度 ${masteredCount}/${exercises.length}`}
        </div>
      </div>

      <div className="space-y-5">
        {exercises.map((exercise, index) => {
          const exerciseState = state[exercise.id];
          const isCorrect =
            exerciseState.submitted &&
            exerciseState.selectedOptionId === exercise.correctOptionId;

          return (
            <article
              key={exercise.id}
              className={cn(
                'rounded-xl border-2 p-5 space-y-4',
                exerciseState.mastered
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-gray-200 bg-gray-50/70',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-gray-900">
                  {index + 1}. {exercise.prompt}
                </h3>
                <span
                  className="flex flex-shrink-0 text-amber-500"
                  aria-label={`难度 ${exercise.difficulty} 星`}
                >
                  {Array.from({ length: exercise.difficulty }, (_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-current" />
                  ))}
                </span>
              </div>

              <fieldset className="space-y-2" disabled={exerciseState.submitted}>
                <legend className="sr-only">请选择一个答案</legend>
                {exercise.options.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border bg-white p-3 text-sm transition-colors',
                      exerciseState.submitted
                        ? 'cursor-default'
                        : 'cursor-pointer hover:border-violet-300',
                      exerciseState.selectedOptionId === option.id && 'border-violet-400 bg-violet-50',
                    )}
                  >
                    <input
                      type="radio"
                      name={`${exerciseSetId}-${exercise.id}`}
                      value={option.id}
                      checked={exerciseState.selectedOptionId === option.id}
                      onChange={() => selectOption(exercise.id, option.id)}
                      className="mt-0.5 text-violet-600 focus:ring-violet-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleHint(exercise.id)}
                  className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200"
                >
                  {exerciseState.hintVisible ? '隐藏提示' : '查看提示'}
                </button>
                {!exerciseState.submitted ? (
                  <button
                    type="button"
                    disabled={!exerciseState.selectedOptionId}
                    onClick={() => submit(exercise)}
                    className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    提交答案
                  </button>
                ) : !isCorrect ? (
                  <button
                    type="button"
                    onClick={() => retry(exercise.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-violet-700 border border-violet-300 hover:bg-violet-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    再试一次
                  </button>
                ) : null}
              </div>

              {exerciseState.hintVisible && !exerciseState.submitted && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <strong>提示：</strong>{exercise.hint}
                </p>
              )}

              {exerciseState.submitted && (
                <div
                  className={cn(
                    'rounded-lg border p-4 text-sm',
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-red-200 bg-red-50 text-red-900',
                  )}
                  role="status"
                >
                  <p className="font-bold">
                    {isCorrect ? '回答正确' : '还差一步'}
                  </p>
                  <p className="mt-1">{exercise.explanation}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {allMastered && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
          <Trophy className="w-6 h-6 text-emerald-600" />
          <div>
            <p className="font-bold">本节练习全部完成</p>
            <p className="text-sm">掌握记录已保存在当前浏览器中，可以继续学习下一节。</p>
          </div>
          <CheckCircle2 className="ml-auto w-6 h-6 text-emerald-600" />
        </div>
      )}
    </section>
  );
}
