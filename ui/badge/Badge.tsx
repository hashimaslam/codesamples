import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-2.5 border px-2.5 py-0.5 text-xs font-normal focus:outline-none',
  {
    variants: {
      variant: {
        blue: 'text-white bg-badge-blue border-badge-blue',
        purple: 'text-white bg-badge-purple border-badge-purple',
        pink: 'text-white bg-badge-pink border-badge-pink',
        orange: 'text-white bg-badge-orange border-badge-orange',
        yellow: 'text-white bg-badge-yellow border-badge-yellow',
        lime: 'text-white bg-badge-lime border-badge-lime',
        green: 'text-white bg-green-600 border-green-600',
        red: 'text-white bg-red-600 border-red-600',
        gray: 'text-white bg-gray-300 border-gray-300',
        custom: 'text-white'
      }
    }
  }
);

export type BadgeVariants = Exclude<
  VariantProps<typeof badgeVariants>['variant'],
  'custom'
>;

type BadgeConditionalProps =
  | {
      variant: BadgeVariants;
      color?: never;
    }
  | {
      variant: 'custom';
      color: string;
    };

type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  } & BadgeConditionalProps;

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, asChild, color, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        {...props}
        ref={ref}
        style={
          color ? { backgroundColor: color, borderColor: color } : undefined
        }
        className={cn(badgeVariants({ variant }), className)}
      />
    );
  }
);

Badge.displayName = 'Badge';
export default Badge;
