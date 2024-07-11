'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode
} from 'react';
import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import type { TitleProps } from '@ui/typography/Title';
import Title from '@ui/typography/Title';

const dialogVariants = cva(
  'fixed left-1/2 top-1/2 max-h-9/10 overflow-y-auto z-modal w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
  {
    variants: {
      size: {
        md: 'max-w-md'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

type DialogProps = PropsWithChildren<{
  trigger: ReactNode;
}> &
  VariantProps<typeof dialogVariants> & {
    close: () => void;
  };

const Dialog: FC<DialogProps> = ({ trigger, size, children, close }) => (
  <DialogPrimitive.Root>
    <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
    <DialogPrimitive.DialogPortal>
      <DialogPrimitive.Content className={cn(dialogVariants({ size }))}>
        <CloseIcon onClick={close} />
        {children}
      </DialogPrimitive.Content>
      <DialogOverlay onClick={close} />
    </DialogPrimitive.DialogPortal>
  </DialogPrimitive.Root>
);

Dialog.displayName = 'Dialog';

export default Dialog;

type UncontrolledDialogProps = PropsWithChildren<{
  close: () => void;
}> &
  VariantProps<typeof dialogVariants>;
export const UncontrolledDialog: FC<UncontrolledDialogProps> = ({
  size,
  children,
  close
}) => (
  <DialogPrimitive.Root open>
    <DialogPrimitive.DialogPortal>
      <DialogPrimitive.Content className={cn(dialogVariants({ size }))}>
        <CloseIcon onClick={close} />
        {children}
      </DialogPrimitive.Content>
      <DialogOverlay onClick={close} />
    </DialogPrimitive.DialogPortal>
  </DialogPrimitive.Root>
);

const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 bg-slate-800/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const CloseIcon = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>((props, ref) => (
  <DialogPrimitive.Close
    {...props}
    ref={ref}
    className='fixed right-5 top-5 rounded-md p-1 hover:bg-slate-100'
  >
    <XMarkIcon className='h-4 w-4 stroke-2 text-slate-800' />
  </DialogPrimitive.Close>
));

CloseIcon.displayName = DialogPrimitive.Close.displayName;

export const DialogTitle: FC<TitleProps> = ({ className, ...props }) => (
  <Title {...props} variant='h3' className={cn('font-bold', className)} />
);

export const DialogButtonContainer = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('grid grid-cols-2 gap-2', className)}
    {...props}
  />
));

DialogButtonContainer.displayName = 'DialogButtonContainer';
