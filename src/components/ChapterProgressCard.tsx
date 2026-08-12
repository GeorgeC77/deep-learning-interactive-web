import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Circle, Trophy } from 'lucide-react';

type ChapterProgressSection = {
  exerciseSetId: string;
  label: string;
  path: string;
  exerciseCount: number;
};

type StoredExerciseProgress = {
  masteredExerciseIds?: string[];
};

type ChapterProgressCardProps = {
  title: string;
  sections: ChapterProgressSection[];
};

const STORAGE_PREFIX = 'deep-learning-course:exercise:';

function readMasteredCount(exerciseSetId: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${exerciseSetId}`);
    if (!raw) return 0;
    const stored = JSON.parse(raw) as StoredExerciseProgress;
    return new Set(stored.masteredExerciseIds ?? []).size;
  } catch {
    return 0;
  }
}

export default function ChapterProgressCard({ title, sections }: ChapterProgressCardProps) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener('storage', refresh);
    window.addEventListener('course-progress-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('course-progress-updated', refresh);
    };
  }, []);

  void version;
  const progress = sections.map((section) => ({
    ...section,
    masteredCount: readMasteredCount(section.exerciseSetId),
  }));
  const total = progress.reduce((sum, section) => sum + section.exerciseCount, 0);
  const mastered = progress.reduce((sum, section) => sum + section.masteredCount, 0);
  const percentage = total === 0 ? 0 : Math.round((mastered / total) * 100);

  return (
    <section className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">答对各节原创练习，完成记录会保存在当前浏览器。</p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-bold text-emerald-800">
          {mastered}/{total} · {percentage}%
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white border border-emerald-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-label="第一章掌握进度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {progress.map((section) => {
          const complete = section.masteredCount >= section.exerciseCount;
          return (
            <Link
              key={section.exerciseSetId}
              to={section.path}
              className="group rounded-xl border border-emerald-200 bg-white p-4 hover:border-emerald-400 hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                {complete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <span className="font-bold text-gray-900">{section.label}</span>
                <ArrowRight className="ml-auto w-4 h-4 text-gray-300 group-hover:text-emerald-500" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                已掌握 {section.masteredCount}/{section.exerciseCount} 题
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
