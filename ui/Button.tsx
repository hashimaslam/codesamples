import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-slate-800 text-white enabled:hover:bg-slate-950 focus-visible:bg-slate-950 active:bg-slate-950 disabled:text-slate-500 disabled:bg-slate-200 focus-visible:ring-slate-950',
        secondary:
          'bg-white border-1.5 text-slate-800 border-slate-200 enabled:hover:border-slate-800 enabled:hover:text-slate-950 disabled:text-slate-500 active:bg-slate-50 active:border-800 disabled:bg-slate-200 focus-visible:ring-slate-200',
        yellow:
          'border-1.5 border-transparent bg-yellow-400 text-slate-800 enabled:hover:bg-yellow-500 active:border-1.5 active:border-yellow-200 active:bg-yellow-500 disabled:text-slate-500 disabled:bg-slate-200 focus-visible:ring-yellow-200',
        red: 'border-1.5 border-transparent bg-red-600 text-white enabled:hover:bg-red-700 active:border-1.5 active:border-red-200 active:bg-red-700 disabled:text-slate-500 disabled:bg-slate-200 focus-visible:ring-red-200'
      },
      size: {
        default: 'h-9 px-3 py-2 gap-2 rounded',
        'icon-default': 'h-9 w-9 p-2.5 rounded',
        sm: 'gap-1.5 px-2 py-1 rounded-sm',
        'icon-sm': 'p-1.5 h-6 w-6 rounded-sm'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, type = 'button', asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export default Button;
