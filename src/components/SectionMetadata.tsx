import { Target, Lightbulb, AlertTriangle, MapPin } from 'lucide-react';

export type SectionMetadataProps = {
  bishopChapter: string;
  bishopSection?: string;
  learningObjectives: string[];
  commonMistakes: string[];
};

export default function SectionMetadata({
  bishopChapter,
  bishopSection,
  learningObjectives,
  commonMistakes,
}: SectionMetadataProps) {

  return (
    <div className="space-y-10 mt-10">
      {/* Bishop mapping */}
      <section className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">教材映射</h2>
        </div>
        <p className="text-indigo-900">
          本小节对应 Bishop & Bishop《Deep Learning: Foundations and Concepts》
          <strong> {bishopChapter}</strong>
          {bishopSection && ` §${bishopSection}`}。
        </p>
      </section>

      {/* Learning objectives */}
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

      {/* Core intuition */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">核心直觉</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          掌握本小节的关键在于理解其数学动机与几何/概率直觉，而不是只记忆公式符号。
          试着用一句话向同学解释：为什么这个方法有效？它解决了什么痛点？
        </p>
      </section>

      {/* Common mistakes */}
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

    </div>
  );
}
