import katex from 'katex';
import { useMemo } from 'react';

interface KaTeXProps {
  math: string;
  display?: boolean;
  className?: string;
}

export default function KaTeX({ math, display = false, className = '' }: KaTeXProps) {
  const html = useMemo(() => {
    const source = typeof math === 'string' ? math : String(math ?? '');
    if (source.trim() === '') return '';
    try {
      return katex.renderToString(source, {
        displayMode: display,
        output: 'html',
        throwOnError: false,
        trust: true,
      });
    } catch {
      return source;
    }
  }, [math, display]);

  const label = typeof math === 'string' ? math : String(math ?? '');

  if (display) {
    return (
      <div
        className={`max-w-full overflow-x-auto overflow-y-hidden ${className}`.trim()}
        aria-label={label}
        title={label}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={className}
      aria-label={label}
      title={label}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
