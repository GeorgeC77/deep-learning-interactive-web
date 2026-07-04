import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import KaTeX from './KaTeX';

interface FormulaCardProps {
  title: string;
  formula: ReactNode;
  description?: ReactNode;
  className?: string;
}

export default function FormulaCard({ title, formula, description, className }: FormulaCardProps) {
  const formulaElement =
    typeof formula === 'string' ? (
      <KaTeX math={formula} display />
    ) : (
      formula
    );

  return (
    <Card className={cn('my-4 border-blue-200 bg-blue-50/50', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-lg my-2 overflow-x-auto">{formulaElement}</div>
        {description && <div className="text-sm text-gray-600 mt-2">{description}</div>}
      </CardContent>
    </Card>
  );
}

export { FormulaCard };
