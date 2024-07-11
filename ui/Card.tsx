import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@utils/cn';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn('rounded-lg bg-white p-4 shadow-1', className)}
    />
  )
);

Card.displayName = 'Card';
export default Card;
