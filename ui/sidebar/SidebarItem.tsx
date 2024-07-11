'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

import { cn } from '@utils/cn';

import type { TNavigationButtonWithSubItems } from '@components/composed/layout/sidebar/NavigationItems';

type SidebarWithSubItemsProps = TNavigationButtonWithSubItems & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export const SidebarWithSubItems: FC<SidebarWithSubItemsProps> = ({
  open,
  onOpenChange,
  icon: Icon,
  name,
  subItems,
  match
}) => {
  const pathname = usePathname();

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={onOpenChange}
      className='space-y-1'
    >
      <Collapsible.Trigger asChild>
        <SidebarItem
          icon={Icon}
          name={name}
          asTrigger
          open={open}
          active={!open && pathname?.startsWith(match)}
        />
      </Collapsible.Trigger>

      <Collapsible.Content className="space-y-1 overflow-y-hidden data-[state='closed']:animate-radix-collapse-slide-up data-[state='open']:animate-radix-collapse-slide-down">
        {subItems.map((subItem) => (
          <SidebarSubItem
            key={subItem.name}
            name={subItem.name}
            href={subItem.href}
            className={cn({
              'bg-yellow-400': pathname.startsWith(subItem.href)
            })}
          />
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

type SidebarSubItemProps = {
  name: string;
  href: string;
  className?: string;
};
const SidebarSubItem: FC<SidebarSubItemProps> = ({ name, href, className }) => (
  <Link
    href={href}
    className={cn(
      'flex w-full items-center gap-3 rounded-md py-2.5 pl-11 pr-3 text-sm transition-colors hover:bg-yellow-400',
      className
    )}
  >
    {name}
  </Link>
);

type SidebarItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: FC<{
    className?: string;
  }>;
  name: string;
  href?: string;
  active?: boolean;
  asDialog?: boolean;
  open?: boolean;
  asTrigger?: boolean;
};
const SidebarItem: FC<SidebarItemProps> = ({
  icon: Icon,
  name,
  active,
  className,
  href,
  asDialog,
  asTrigger,
  open,
  ...props
}) => {
  const classes = cn(
    'flex w-full items-center justify-between gap-3 rounded-md py-2 pl-2 pr-3 text-sm font-medium transition-colors',
    'text-slate-800 hover:bg-yellow-400',
    'outline-none focus:ring-2 focus:ring-yellow-300',
    {
      'bg-yellow-400': active
    },
    className
  );

  const WrapperComponent: FC<PropsWithChildren> = ({ children }) =>
    asDialog ? (
      <Dialog.Close asChild>{children}</Dialog.Close>
    ) : (
      <>{children}</>
    );

  if (href) {
    return (
      <WrapperComponent>
        <Link className={classes} href={href}>
          <div className='flex items-center gap-3'>
            {Icon && <Icon className='h-6 w-6 flex-shrink-0' />}
            <span className='truncate'>{name}</span>
          </div>

          {asTrigger && (
            <ChevronDownIcon className='h-4 w-4 flex-shrink-0 text-slate-500' />
          )}
        </Link>
      </WrapperComponent>
    );
  }

  return (
    <WrapperComponent>
      <button {...props} className={classes}>
        <div className='flex items-center gap-3'>
          {Icon && <Icon className='h-6 w-6 shrink-0' />}
          <span className='truncate'>{name}</span>
        </div>

        {asTrigger && (
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 flex-shrink-0 text-slate-500 transition-all',
              {
                'rotate-180': open
              }
            )}
          />
        )}
      </button>
    </WrapperComponent>
  );
};
export default SidebarItem;
