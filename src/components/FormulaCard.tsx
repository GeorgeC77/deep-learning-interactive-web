import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormulaCardProps {
  title: string;
  formula: ReactNode;
  description?: ReactNode;
}

export default function FormulaCard({ title, formula, description }: FormulaCardProps) {
  return (
    <Card className="my-4 border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-lg my-2">{formula}</div>
        {description && <div className="text-sm text-gray-600 mt-2">{description}</div>}
      </CardContent>
    </Card>
  );
}

export { FormulaCard };
