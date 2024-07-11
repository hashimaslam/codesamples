import { Slot } from "@radix-ui/react-slot";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@utils/cn";

/**
 * Scrollable content component.
 * @exavple
 * <ScrollableContent>
 *     <Scroll>
 *         {/** scrollable content *\/}
 *     </Scroll>
 *
 *     <Static>
 *         {/** static content *\/}
 *     </Static>
 * </ScrollableContent>
 */

type RootProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        {...props}
        className={cn("relative flex h-full w-full flex-col", className)}
      />
    );
  }
);

Root.displayName = "Root";

type ScrollProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};
const Scroll = forwardRef<HTMLDivElement, ScrollProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        {...props}
        className={cn("flex-grow overflow-y-auto", className)}
      />
    );
  }
);

Scroll.displayName = "Scroll";

type StaticProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};
const Static = forwardRef<HTMLDivElement, StaticProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} {...props} className={cn("flex", className)} />;
  }
);

Static.displayName = "Static";

export { Root, Scroll, Static };
