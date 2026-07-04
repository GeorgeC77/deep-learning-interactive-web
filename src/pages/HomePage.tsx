import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  FlaskConical,
  Construction,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  courseManifest,
  getChapterStatus,
  getCompletedCount,
  getBetaCount,
  getDraftCount,
  statusLabel,
  type Part,
  type Chapter,
  type SectionStatus,
} from '@/course/manifest';

function StatusIcon({ status }: { status: SectionStatus }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case 'beta':
      return <FlaskConical className="w-4 h-4 text-amber-600" />;
    case 'draft':
    default:
      return <Construction className="w-4 h-4 text-blue-600" />;
  }
}

function ChapterLabel({ part, chapter }: { part: Part; chapter: Chapter }) {
  if (part.kind === 'prerequisite') return `先修 Ch ${chapter.number}`;
  if (part.kind === 'appendix') {
    const label = chapter.bishopChapter?.replace('Appendix ', '') ?? String(chapter.number);
    return `附录 ${label}`;
  }
  return `Ch ${chapter.number}`;
}

function ChapterCard({ part, chapter }: { part: Part; chapter: Chapter }) {
  const entryPath = chapter.sections[0]?.path || '/';
  const chapterStatus = getChapterStatus(chapter);
  const label = ChapterLabel({ part, chapter });

  return (
    <Link
      to={entryPath}
      className="group flex items-start gap-3 p-5 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex-grow min-w-0">
        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
          {label}. {chapter.title}
        </div>

        <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
          <StatusIcon status={chapterStatus} />
          <span>{statusLabel(chapterStatus)}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 mt-1" />
    </Link>
  );
}

function PartAccordion({ part }: { part: Part }) {
  const status = getChapterStatus({ id: part.id, number: part.number, title: part.title, sections: [] } as Chapter);
  const badgeColor =
    status === 'completed'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'beta'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <AccordionItem value={part.id} className="border border-gray-200 rounded-xl mb-4 px-5 data-[state=open]:shadow-sm">
      <AccordionTrigger className="text-lg font-bold text-gray-900 hover:no-underline py-5">
        <div className="flex items-center gap-3 text-left">
          <span
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border',
              badgeColor
            )}
          >
            {part.kind === 'prerequisite' ? '先修' : part.kind === 'appendix' ? '附录' : `P${part.number}`}
          </span>
          <div>
            <div className="text-base md:text-lg">{part.title}</div>

          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
          {part.chapters.map((chapter) => (
            <ChapterCard key={chapter.id} part={part} chapter={chapter} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Helper to concatenate class names
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function HomePage() {
  const prerequisitePart = courseManifest.find((p) => p.kind === 'prerequisite');
  const mainParts = courseManifest.filter((p) => p.kind === 'main');
  const appendixPart = courseManifest.find((p) => p.kind === 'appendix');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-14 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-9 h-9 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          深度学习交互式课程
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          从概率论先修到扩散模型，逐章深入理解深度学习的核心思想与算法。
        </p>

        {/* Copyright banner */}
        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          本内容仅供教学与非商业学习使用，完整授权说明见页脚。
        </p>

        {/* Progress stats */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            已完成 {getCompletedCount()}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <FlaskConical className="w-4 h-4" />
            预览版 {getBetaCount()}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Construction className="w-4 h-4" />
            制作中 {getDraftCount()}
          </div>
        </div>
      </section>


      {/* Course Directory */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">课程目录</h2>
        </div>

        <Accordion type="multiple" defaultValue={['part-0', 'part-1']} className="w-full">
          {prerequisitePart && <PartAccordion part={prerequisitePart} />}
          {mainParts.map((part) => (
            <PartAccordion key={part.id} part={part} />
          ))}
          {appendixPart && <PartAccordion part={appendixPart} />}
        </Accordion>
      </section>

      {/* License footer block */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <h3 className="text-lg font-bold text-amber-900">非商业用途</h3>
        </div>
        <p className="text-amber-800 text-sm leading-relaxed">
          本站所有原创内容版权归作者所有。你可以自由阅读、分享和用于个人学习，但禁止未经授权的商业使用。
          转载或引用请注明出处并遵守 CC BY-NC 4.0 许可协议。
        </p>
      </section>
    </div>
  );
}
