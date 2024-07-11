import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'w-full rounded border-1.5 border-slate-200 bg-white px-4 py-2 text-sm text-slate-800',
        'ring-slate-200 ring-offset-white focus:outline-none focus:ring-2 focus:ring-offset-2',
        'placeholder:text-slate-500 hover:border-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:placeholder:text-slate-500',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export default Input;
