import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { FC, ReactNode } from 'react';

import { cn } from '@utils/cn';

export type ToastProps = {
  title?: ReactNode;
  description?: ReactNode;
  duration?: number;
  action?: ReactNode;
  dismiss?: () => void;
} & VariantProps<typeof toastVariants>;

const variantIcon = {
  success: CheckCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationCircleIcon,
  error: XCircleIcon
};

export const toastVariants = cva(
  'group pointer-events-auto relative rounded-md flex w-full gap-2 overflow-hidden rounded-md p-4 shadow-1 transition-all max-w-screen-sm',
  {
    variants: {
      variant: {
        info: 'bg-slate-100',
        success: 'bg-green-100',
        warning: 'bg-yellow-100',
        error: 'bg-red-100'
      }
    },
    defaultVariants: {
      variant: 'info'
    }
  }
);

const Toast: FC<ToastProps> = ({
  variant,
  title,
  description,
  action,
  dismiss
}) => {
  const Icon = variantIcon[variant || 'info'];

  return (
    <div className={cn(toastVariants({ variant }))}>
      <Icon className='h-5 w-5 flex-shrink-0' />
      <div className='grid gap-1'>
        {title && (
          <div className='text-sm font-medium text-slate-800'>{title}</div>
        )}
        {description && (
          <div className='text-sm text-slate-500'>{description}</div>
        )}
      </div>
      {!action && dismiss && (
        <button
          onClick={dismiss}
          className='absolute right-2 top-2 rounded-md p-1 text-slate-800 hover:opacity-80'
        >
          <XMarkIcon className='h-5 w-5' />
        </button>
      )}
      {action && (
        <div className='absolute right-2 top-2 p-1 text-slate-800 hover:opacity-80'>
          {action}
        </div>
      )}
    </div>
  );
};

export default Toast;
