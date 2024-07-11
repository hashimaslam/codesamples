'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { cn } from '@utils/cn';

const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitives.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-5 w-8 shrink-0 cursor-pointer items-center rounded-full',
      'disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-200',
      'ring-offset-white focus:outline-none focus:ring-2 focus:ring-offset-2 data-[state=checked]:ring-green-600 data-[state=unchecked]:ring-slate-200',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-3 w-3 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4.25 data-[state=unchecked]:translate-x-0.75'
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = 'Switch';

export default Switch;
