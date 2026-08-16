import type { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';

interface CoreIntuitionCardProps {
  children: ReactNode;
}

export default function CoreIntuitionCard({ children }: CoreIntuitionCardProps) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-600" aria-hidden="true" />
        <h2 className="text-xl font-bold text-amber-950">核心直觉</h2>
      </div>
      <p className="leading-7 text-amber-950">{children}</p>
    </section>
  );
}
