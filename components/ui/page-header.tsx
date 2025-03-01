import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  className?: string;
}

export function PageHeader({ title, className }: PageHeaderProps) {
  return (
    <div className={cn("p-3 md:p-4 mb-4 bg-muted-foreground text-white rounded-md", className)}>
      <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
    </div>
  );
}
