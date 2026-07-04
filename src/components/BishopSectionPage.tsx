import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import FormulaCard from './FormulaCard';
import ConceptCard from './ConceptCard';
import InteractiveDemo from './InteractiveDemo';
import KaTeX from './KaTeX';
import { Slider } from '@/components/ui/slider';
import { getAllSections, getSectionByPath, type Section } from '@/course/manifest';

export type ConceptItem = {
  title: string;
  description: React.ReactNode;
  formula?: string;
};

export type BishopSectionPageProps = {
  sectionPath: string;
  heroIcon?: React.ReactNode;
  summary: React.ReactNode;
  concepts: ConceptItem[];
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
};

export default function BishopSectionPage({
  sectionPath,
  heroIcon,
  summary,
  concepts,
  demo,
}: BishopSectionPageProps) {
  const section = getSectionByPath(sectionPath);
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection: Section | null = allSections[currentIndex - 1] ?? null;
  const nextSection: Section | null = allSections[currentIndex + 1] ?? null;

  const [param, setParam] = useState(demo?.param ?? 0.5);

  const demoResult = useMemo(() => {
    if (!demo) return null;
    return demo.compute(param);
  }, [demo, param]);

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
        <p className="mt-6 text-sm text-amber-800">
          <ShieldAlert className="w-4 h-4 inline-block mr-1" />
          本页内容仅供教学与非商业学习使用（CC BY-NC 4.0）。
        </p>
      </section>

      {/* Concepts */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心概念</h2>
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

      {/* Interactive demo */}
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
