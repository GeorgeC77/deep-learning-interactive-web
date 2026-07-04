import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllSections, getSectionByPath } from '@/course/manifest';

interface SectionNavigationProps {
  sectionPath: string;
}

export default function SectionNavigation({ sectionPath }: SectionNavigationProps) {
  const allSections = getAllSections();
  const currentIndex = allSections.findIndex((s) => s.path === sectionPath);
  const prevSection = allSections[currentIndex - 1];
  const nextSection = allSections[currentIndex + 1];
  const currentSection = getSectionByPath(sectionPath);

  return (
    <nav aria-label={`${currentSection?.title ?? ''} 章节目录导航`} className="flex flex-wrap justify-between gap-4">
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
    </nav>
  );
}
