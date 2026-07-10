import { useState } from 'react';
import { Target, Lightbulb, AlertTriangle, HelpCircle, MapPin } from 'lucide-react';

export type QuizItem = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type SectionMetadataProps = {
  bishopChapter: string;
  bishopSection?: string;
  learningObjectives: string[];
  commonMistakes: string[];
  quiz: QuizItem[];
};

export default function SectionMetadata({
  bishopChapter,
  bishopSection,
  learningObjectives,
  commonMistakes,
  quiz,
}: SectionMetadataProps) {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});

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

      {/* Quiz */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">小测题</h2>
        </div>
        <div className="space-y-6">
          {quiz.map((q, qIdx) => (
            <div key={qIdx} className="border border-gray-200 rounded-lg p-4">
              <div className="font-medium text-gray-900 mb-3">
                {qIdx + 1}. {q.question}
              </div>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const answered = quizAnswers[qIdx] !== undefined;
                  const isSelected = quizAnswers[qIdx] === oIdx;
                  const isCorrect = oIdx === q.correctIndex;
                  let btnClass = 'w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ';
                  if (answered) {
                    if (isCorrect) btnClass += 'bg-emerald-50 border-emerald-300 text-emerald-800';
                    else if (isSelected) btnClass += 'bg-red-50 border-red-300 text-red-800';
                    else btnClass += 'bg-gray-50 border-gray-200 text-gray-500';
                  } else {
                    btnClass += 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700';
                  }
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={answered}
                      className={btnClass}
                      onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </button>
                  );
                })}
              </div>
              {quizAnswers[qIdx] !== undefined && (
                <div className="mt-3 text-sm text-gray-700 bg-slate-50 p-3 rounded-md">
                  <span className="font-medium">解析：</span>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
