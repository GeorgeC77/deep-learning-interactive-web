import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronRight,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { courseManifest, getCompletedCount, getTotalSectionCount, type Chapter } from '@/course/manifest';

function getChapterEntryPath(chapter: Chapter): string {
  // The first chapter's legacy content lives at /overview
  if (chapter.id === 'ch01') return '/overview';
  if (chapter.id === 'ch02') return '/ch02/overview';
  return chapter.sections[0]?.path || '/';
}

export default function HomePage() {
  const completed = getCompletedCount();
  const total = getTotalSectionCount();
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

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
          机器学习交互式课程
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          一套面向机器学习初学者的交互式学习网站。
          从监督学习到强化学习，逐章深入理解机器学习的核心思想与算法。
        </p>

        {/* Progress */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>课程完成进度</span>
            <span>
              {completed}/{total} 小节 ({progress}%)
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Copyright banner */}
        <div className="mt-6 inline-flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-6 py-4 max-w-3xl mx-auto text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">版权声明</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              本课程内容仅供个人学习交流使用，采用{' '}
              <a
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-900"
              >
                CC BY-NC 4.0
              </a>{' '}
              许可。未经授权，严禁以任何形式用于商业用途，包括但不限于商业培训、付费课程、企业内训等。违者将依法追究法律责任。
            </p>
          </div>
        </div>
      </section>

      {/* Course Directory */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">课程目录</h2>
        </div>

        <Accordion type="multiple" defaultValue={['part-i']} className="w-full">
          {courseManifest.map((part) => {
            const partCompleted = part.chapters.reduce(
              (acc, ch) => acc + ch.sections.filter((s) => s.completed).length,
              0
            );
            const partTotal = part.chapters.reduce((acc, ch) => acc + ch.sections.length, 0);

            return (
              <AccordionItem key={part.id} value={part.id} className="border border-gray-200 rounded-xl mb-4 px-5 data-[state=open]:shadow-sm">
                <AccordionTrigger className="text-lg font-bold text-gray-900 hover:no-underline py-5">
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold border border-blue-200">
                      第{part.number}部分
                    </span>
                    <div>
                      <div className="text-base md:text-lg">{part.title}</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">
                        {part.chapters.length} 章 · {partCompleted}/{partTotal} 小节已完成
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                    {part.chapters.map((chapter) => {
                      const chapterCompleted = chapter.sections.filter((s) => s.completed).length;
                      const chapterTotal = chapter.sections.length;
                      const isFullyCompleted = chapterCompleted === chapterTotal && chapterTotal > 0;
                      const entryPath = getChapterEntryPath(chapter);

                      return (
                        <Link
                          key={chapter.id}
                          to={entryPath}
                          className="group flex items-start gap-3 p-5 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isFullyCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className={`w-5 h-5 ${chapterCompleted > 0 ? 'text-blue-400' : 'text-gray-300'} group-hover:text-blue-400`} />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {chapter.number}. {chapter.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1.5">
                              {chapterCompleted === chapterTotal ? (
                                <span className="text-emerald-600 font-medium">已完成</span>
                              ) : (
                                `${chapterCompleted}/${chapterTotal} 小节已完成`
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 mt-1" />
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Stats & License footer block */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-blue-900">学习进度</h3>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed mb-4">
            已完成 {completed} 个小节，还有 {total - completed} 个小节正在制作中。点击上方目录开始学习。
          </p>
          <div className="text-2xl font-bold text-blue-700">{progress}%</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-900">非商业用途</h3>
          </div>
          <p className="text-amber-800 text-sm leading-relaxed">
            本站所有原创内容版权归作者所有。你可以自由阅读、分享和用于个人学习，但禁止未经授权的商业使用。
            转载或引用请注明出处并遵守 CC BY-NC 4.0 许可协议。
          </p>
        </div>
      </section>
    </div>
  );
}
