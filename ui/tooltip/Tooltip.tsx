'use client';

import type * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import * as Tooltip from '@components/ui/tooltip/Tooltip.components';

type TooltipProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> &
  PropsWithChildren<{
    content: ReactNode;
  }>;

const TooltipComponent: FC<TooltipProps> = ({
  children,
  content,
  ...triggerProps
}) => (
  <Tooltip.TooltipProvider delayDuration={100}>
    <Tooltip.TooltipRoot>
      <Tooltip.TooltipTrigger {...triggerProps}>
        {children}
      </Tooltip.TooltipTrigger>
      <Tooltip.TooltipContent>
        {content}
        <Tooltip.TooltipArrow />
      </Tooltip.TooltipContent>
    </Tooltip.TooltipRoot>
  </Tooltip.TooltipProvider>
);

export default TooltipComponent;
