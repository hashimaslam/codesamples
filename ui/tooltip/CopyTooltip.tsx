'use client';

import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import type { FC, MouseEvent, PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';

import * as Tooltip from '@components/ui/tooltip/Tooltip.components';

type CopyTooltipProps = PropsWithChildren<{
  text: string;
}>;

const CopyTooltip: FC<CopyTooltipProps> = ({ text, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (!navigator?.clipboard) return;

      navigator?.clipboard?.writeText(text)?.then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      });
    },
    [text]
  );

  const TooltipContent = () => {
    if (isCopied) {
      return (
        <div className='flex items-center gap-1'>
          <span>Copied!</span>
          <CheckIcon className='h-3 w-3 stroke-2' />
        </div>
      );
    }

    return (
      <div className='flex items-center gap-1'>
        <span>Copy</span>
        <Square2StackIcon className='h-3 w-3 stroke-2' />
      </div>
    );
  };

  return (
    <Tooltip.TooltipProvider delayDuration={0}>
      <Tooltip.TooltipRoot>
        <Tooltip.TooltipTrigger asChild>
          <span>{children}</span>
        </Tooltip.TooltipTrigger>
        <Tooltip.TooltipContent
          onClick={handleCopyToClipboard}
          className='cursor-pointer'
        >
          <TooltipContent />
          <Tooltip.TooltipArrow />
        </Tooltip.TooltipContent>
      </Tooltip.TooltipRoot>
    </Tooltip.TooltipProvider>
  );
};

export default CopyTooltip;
