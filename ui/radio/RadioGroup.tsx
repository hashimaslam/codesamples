'use client';

import type { Root } from '@radix-ui/react-radio-group';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import Label from '@components/ui/Label';
import * as RadioPrimitive from '@components/ui/radio/Radio.components';

type RadioGroupItem = {
  value: string;
  label: string;
  description?: string;
};

export type RadioGroupProps = ComponentPropsWithoutRef<typeof Root> & {
  items: RadioGroupItem[];
};

const RadioGroup = forwardRef<ElementRef<typeof Root>, RadioGroupProps>(
  ({ items, ...props }, ref) => (
    <RadioPrimitive.RadioGroup ref={ref} {...props}>
      {items.map(({ value, label, description }) => (
        <div className='flex items-start space-x-2' key={value}>
          <RadioPrimitive.RadioGroupItem value={value} id={value} />

          <Label htmlFor={value} className='flex flex-col gap-1'>
            <span className='text-slate-800'>{label}</span>
            {description && <p className='text-slate-500'>{description}</p>}
          </Label>
        </div>
      ))}
    </RadioPrimitive.RadioGroup>
  )
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
