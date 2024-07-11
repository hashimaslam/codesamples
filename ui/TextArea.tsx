import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@utils/cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'w-full resize-y rounded border-1.5 border-slate-200 bg-white px-4 py-2 text-sm text-slate-800',
        'ring-slate-200 ring-offset-white focus:outline-none focus:ring-2 focus:ring-offset-2',
        'placeholder:text-slate-500 hover:border-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:placeholder:text-slate-400',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export default Textarea;
