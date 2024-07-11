import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { FC } from 'react';

import * as Tooltip from '@ui/tooltip/Tooltip.components';

type InfoTooltipProps = {
  text: string;
};
const InfoTooltip: FC<InfoTooltipProps> = ({ text }) => (
  <Tooltip.TooltipProvider delayDuration={0}>
    <Tooltip.TooltipRoot>
      <Tooltip.TooltipTrigger asChild>
        <InformationCircleIcon className='h-4 w-4 stroke-2 text-slate-500' />
      </Tooltip.TooltipTrigger>
      <Tooltip.TooltipPortal>
        <Tooltip.TooltipContent className='max-w-70 py-1 text-center'>
          {text}
          <Tooltip.TooltipArrow />
        </Tooltip.TooltipContent>
      </Tooltip.TooltipPortal>
    </Tooltip.TooltipRoot>
  </Tooltip.TooltipProvider>
);

export default InfoTooltip;
