import { useState, useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Target,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  MapPin,
  MessageCircleQuestion,
  FlaskConical,
} from 'lucide-react';
import FormulaCard from './FormulaCard';
import ConceptCard from './ConceptCard';
import InteractiveDemo from './InteractiveDemo';
import KaTeX from './KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath, type Section } from '@/course/manifest';

export type ConceptItem = {
  title: string;
  description: ReactNode;
  formula?: string;
};

export type QuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type WhyCardItem = {
  /** The motivating question, e.g. “为什么需要 Value？” */
  question: string;
  /** Plain-language, formula-free answer aimed at a first-time learner (≤100 chars). */
  answer: ReactNode;
};

export type BishopMapping = {
  chapter: string;
  section?: string;
  pages?: string;
  textbookSubsections?: string[];
  supplementalTopics?: string[];
  formulas?: string[];
  algorithms?: string[];
  exercises?: string[];
};

export type BishopSectionPageProps = {
  sectionPath: string;
  heroIcon?: ReactNode;
  summary: ReactNode;
  concepts: ConceptItem[];
  /** Legacy single-slider scalar demo. Kept for backward compatibility. */
  demo?: {
    title: string;
    label: string;
    param: number;
    min: number;
    max: number;
    step: number;
    compute: (value: number) => { label: string; value: number; display: string };
    formula: string;
  };
  /** Fully custom interactive surface (multi-control, charts, prediction gates, etc.). */
  interactiveDemo?: ReactNode;
  learningObjectives?: string[];
  coreIntuition?: ReactNode;
  commonMistakes?: string[];
  quiz?: QuizItem[];
  /** “为什么？”卡片：站在第一次学习的学生角度，不用公式解释动机。 */
  whyCards?: WhyCardItem[];
  /** 反例：帮助打破常见错误直觉的最小反例。 */
  counterexamples?: string[];
  bishopMapping?: BishopMapping;
  extraContent?: ReactNode;
};

export default function BishopSectionPage({
  sectionPath,
  heroIcon,
  summary,
  concepts,
  demo,
  interactiveDemo,
  learningObjectives,
  coreIntuition,
  commonMistakes,
  quiz,
  whyCards,
  counterexamples,
  bishopMapping,
  extraContent,
}: BishopSectionPageProps) {
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection: Section | null = allSections[currentIndex - 1] ?? null;
  const nextSection: Section | null = allSections[currentIndex + 1] ?? null;

  const [param, setParam] = useState(demo?.param ?? 0.5);

  const [quizStates, setQuizStates] = useState<
    { selected: number | null; submitted: boolean }[]
  >(() => (quiz ?? []).map(() => ({ selected: null, submitted: false })));

  const demoResult = useMemo(() => {
    if (!demo) return null;
    return demo.compute(param);
  }, [demo, param]);

  const selectOption = (qIdx: number, oIdx: number) => {
    setQuizStates((prev) =>
      prev.map((state, idx) => (idx === qIdx && !state.submitted ? { ...state, selected: oIdx } : state)),
    );
  };

  const submitQuiz = (qIdx: number) => {
    setQuizStates((prev) =>
      prev.map((state, idx) => (idx === qIdx ? { ...state, submitted: true } : state)),
    );
  };

  const resetQuiz = (qIdx: number) => {
    setQuizStates((prev) =>
      prev.map((state, idx) => (idx === qIdx ? { selected: null, submitted: false } : state)),
    );
  };

  if (!section) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            {heroIcon ?? <BookOpen className="w-9 h-9 text-blue-600" />}
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{summary}</p>

        {bishopMapping && (
          <div className="mt-6 inline-flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-full text-sm">
              <MapPin className="w-4 h-4" />
              教材映射：Bishop {bishopMapping.chapter}
              {bishopMapping.section && ` §${bishopMapping.section}`}
              {bishopMapping.pages && `（${bishopMapping.pages}）`}
            </div>
            {(bishopMapping.textbookSubsections || bishopMapping.formulas || bishopMapping.algorithms || bishopMapping.exercises) && (
              <div className="text-sm text-indigo-700 bg-indigo-50/60 rounded-lg px-4 py-2 max-w-3xl">
                {bishopMapping.textbookSubsections && (
                  <p><span className="font-medium">教材小节：</span>{bishopMapping.textbookSubsections.join('、')}</p>
                )}
                {bishopMapping.supplementalTopics && (
                  <p><span className="font-medium">补充/现代扩展：</span>{bishopMapping.supplementalTopics.join('、')}</p>
                )}
                {bishopMapping.formulas && (
                  <p><span className="font-medium">核心公式：</span>{bishopMapping.formulas.join('、')}</p>
                )}
                {bishopMapping.algorithms && (
                  <p><span className="font-medium">算法/方法：</span>{bishopMapping.algorithms.join('、')}</p>
                )}
                {bishopMapping.exercises && (
                  <p><span className="font-medium">练习建议：</span>{bishopMapping.exercises.join('；')}</p>
                )}
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed">
          本页为依据 Bishop &amp; Bishop 教材知识体系制作的原创教学解释与交互演示。
          教材原文、原图及习题解答版权归原作者和出版方所有；本项目不复制教材原文和原图。
        </p>
      </section>

      {/* Learning objectives */}
      {learningObjectives && learningObjectives.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">学习目标</h2>
          </div>
          <ul className="space-y-2">
            {learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Core intuition */}
      {coreIntuition && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">核心直觉</h2>
          </div>
          <div className="text-gray-700 leading-relaxed">{coreIntuition}</div>
        </section>
      )}

      {/* Concepts / Formulas */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念与公式</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {concepts.map((concept, idx) => (
            <ConceptCard
              key={idx}
              title={concept.title}
              description={concept.description}
            />
          ))}
        </div>
        {concepts.some((c) => c.formula) && (
          <div className="mt-6 space-y-4">
            {concepts
              .filter((c) => c.formula)
              .map((concept, idx) => (
                <FormulaCard
                  key={idx}
                  title={concept.title}
                  formula={concept.formula as string}
                  description={concept.description}
                />
              ))}
          </div>
        )}
      </section>

      {/* Legacy scalar interactive demo */}
      {demo && (
        <InteractiveDemo title={demo.title}>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  {demo.label}
                </label>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{param.toFixed(2)}</span>
              </div>
              <Slider
                value={[param]}
                min={demo.min}
                max={demo.max}
                step={demo.step}
                onValueChange={(v) => setParam(v[0])}
              />
            </div>
            <FormulaCard title="当前计算" formula={demo.formula} />
            {demoResult && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600">{demoResult.label}</div>
                  <div className="text-2xl font-bold text-blue-700">{demoResult.value.toFixed(3)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <KaTeX math={demoResult.display} />
                </div>
              </div>
            )}
          </div>
        </InteractiveDemo>
      )}

      {/* Custom interactive demo surface */}
      {interactiveDemo && (
        <InteractiveDemo title="交互探索">
          {interactiveDemo}
        </InteractiveDemo>
      )}

      {/* Why? cards — motivation without formulas */}
      {whyCards && whyCards.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircleQuestion className="w-6 h-6 text-sky-600" />
            <h2 className="text-2xl font-bold text-gray-900">为什么？</h2>
          </div>
          <div className="space-y-4">
            {whyCards.map((card, idx) => (
              <div key={idx} className="border-l-4 border-sky-300 bg-sky-50/60 rounded-r-lg p-4">
                <div className="font-medium text-sky-900 mb-1">Q：{card.question}</div>
                <div className="text-gray-700 text-[15px] leading-relaxed">{card.answer}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Common mistakes */}
      {commonMistakes && commonMistakes.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">常见误区</h2>
          </div>
          <ul className="space-y-3">
            {commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Counterexamples */}
      {counterexamples && counterexamples.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">反例</h2>
          </div>
          <ul className="space-y-3">
            {counterexamples.map((ce, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                <span>{ce}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Quiz */}
      {quiz && quiz.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-violet-600" />
            <h2 className="text-2xl font-bold text-gray-900">小测题</h2>
          </div>
          <div className="space-y-6">
            {quiz.map((q, qIdx) => {
              const { selected, submitted } = quizStates[qIdx];
              return (
                <div key={qIdx} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-3">
                    {qIdx + 1}. {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selected === oIdx;
                      const isCorrect = oIdx === q.correctIndex;
                      let btnClass = 'w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ';
                      if (submitted) {
                        if (isCorrect) btnClass += 'bg-emerald-50 border-emerald-300 text-emerald-800';
                        else if (isSelected) btnClass += 'bg-red-50 border-red-300 text-red-800';
                        else btnClass += 'bg-gray-50 border-gray-200 text-gray-500';
                      } else {
                        btnClass += isSelected
                          ? 'bg-violet-50 border-violet-300 text-violet-800'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700';
                      }
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={submitted}
                          className={btnClass}
                          onClick={() => selectOption(qIdx, oIdx)}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={selected === null || submitted}
                      onClick={() => submitQuiz(qIdx)}
                      className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      提交答案
                    </button>
                    {submitted && (
                      <button
                        type="button"
                        onClick={() => resetQuiz(qIdx)}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        重置
                      </button>
                    )}
                  </div>
                  {submitted && (
                    <div className="mt-3 text-sm text-gray-700 bg-slate-50 p-3 rounded-md">
                      <span className="font-medium">解析：</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Extra custom demos / content */}
      {extraContent}

      {/* Navigation */}
      <section className="flex flex-wrap justify-between gap-4">
        {prevSection ? (
          <Link
            to={prevSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevSection.title}
          </Link>
        ) : (
          <div />
        )}
        {nextSection && (
          <Link
            to={nextSection.path}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {nextSection.title}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </section>
    </div>
  );
}
