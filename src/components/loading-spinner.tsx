// src/components/loading-spinner.tsx
"use client";

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  text?: string;
}

export function LoadingSpinner({ className, size = 32, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col justify-center items-center space-y-2 py-8", className)}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
