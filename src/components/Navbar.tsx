import { useLocation, NavLink, Link } from 'react-router-dom';
import {
  GraduationCap,
  Home,
  ShieldAlert,
  ChevronDown,
  Menu,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Construction,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  courseManifest,
  getChapterStatus,
  getSectionByPath,
  statusLabel,
  type Part,
  type Chapter,
  type Section,
  type SectionStatus,
} from '@/course/manifest';

function StatusIcon({ status }: { status: SectionStatus }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    case 'beta':
      return <FlaskConical className="w-3.5 h-3.5 text-amber-600" />;
    case 'draft':
    default:
      return <Construction className="w-3.5 h-3.5 text-blue-600" />;
  }
}

function getCurrentContext(path: string) {
  if (path === '/') return null;
  const section = getSectionByPath(path);
  if (!section) return null;
  for (const part of courseManifest) {
    for (const chapter of part.chapters) {
      const idx = chapter.sections.findIndex((s) => s.path === path);
      if (idx !== -1) {
        return { part, chapter, section, sectionIndex: idx };
      }
    }
  }
  return null;
}

function ChapterLabel({ part, chapter }: { part: Part; chapter: Chapter }) {
  if (part.kind === 'prerequisite') return <>先修 Ch {chapter.number}</>;
  if (part.kind === 'appendix') {
    const label = chapter.bishopChapter?.replace('Appendix ', '') ?? String(chapter.number);
    return <>附录 {label}</>;
  }
  return <>Ch {chapter.number}</>;
}

function SectionItem({
  section,
  currentPath,
  onClick,
}: {
  section: Section;
  currentPath: string;
  onClick?: () => void;
}) {
  const isActive = currentPath === section.path;
  return (
    <Link
      to={section.path}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <StatusIcon status={section.status} />
      <span className="flex-grow truncate">{section.title}</span>
      <span className="text-xs text-gray-400 ml-2">{statusLabel(section.status)}</span>
    </Link>
  );
}

function CurrentChapterMenu({
  context,
  currentPath,
}: {
  context: NonNullable<ReturnType<typeof getCurrentContext>>;
  currentPath: string;
}) {
  const { part, chapter } = context;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none">
        <BookOpen className="w-4 h-4" />
        <span className="max-w-[160px] truncate">
          <ChapterLabel part={part} chapter={chapter} />
        </span>
        <ChevronDown className="w-3.5 h-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[80vh] overflow-y-auto">
        {chapter.sections.map((section) => (
          <DropdownMenuItem key={section.id} asChild>
            <Link
              to={section.path}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                currentPath === section.path && 'bg-blue-50 text-blue-700'
              )}
            >
              <StatusIcon status={section.status} />
              <span className="flex-grow truncate">{section.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav({ currentPath }: { currentPath: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors outline-none"
          aria-label="打开课程菜单"
        >
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline">目录</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            课程目录
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-6 py-6">
          <Link
            to="/"
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
              currentPath === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Home className="w-4 h-4" />
            首页
          </Link>

          {courseManifest.map((part) => (
            <div key={part.id}>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
                {part.kind === 'prerequisite' && '先修知识'}
                {part.kind === 'main' && `第 ${part.number} 部分 · ${part.title}`}
                {part.kind === 'appendix' && part.title}
              </div>
              <div className="flex flex-col gap-1">
                {part.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <Link
                      to={chapter.sections[0]?.path ?? '/'}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
                        currentPath.startsWith(chapter.sections[0]?.path ?? '')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <ChapterLabel part={part} chapter={chapter} />
                      <span className="flex-grow truncate">{chapter.title}</span>
                      <StatusIcon status={getChapterStatus(chapter)} />
                    </Link>
                    {currentPath.startsWith(chapter.sections[0]?.path ?? '') && (
                      <div className="ml-4 mt-1 border-l-2 border-gray-100 pl-2 flex flex-col gap-1">
                        {chapter.sections.map((section) => (
                          <SectionItem key={section.id} section={section} currentPath={currentPath} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const context = getCurrentContext(currentPath);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-blue-700 hover:text-blue-800 transition-colors"
          >
            <GraduationCap className="w-6 h-6" />
            <span className="hidden sm:inline">深度学习交互式课程</span>
            <span className="sm:hidden">深度学习课程</span>
          </NavLink>

          <div className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )
              }
            >
              <Home className="w-4 h-4" />
              首页
            </NavLink>

            {context && <CurrentChapterMenu context={context} currentPath={currentPath} />}

            <a
              href="https://github.com/GeorgeC77/machine-learning-interactive-web/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              title="CC BY-NC 4.0 非商业许可"
            >
              <ShieldAlert className="w-4 h-4" />
              CC BY-NC 4.0
            </a>

            <MobileNav currentPath={currentPath} />
          </div>
        </div>
      </div>
    </nav>
  );
}
