import type {
  Active,
  DraggableAttributes,
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
} from "react";
import React, {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from "react";

type SortableListItemProps<T> = T & {
  id: UniqueIdentifier;
};

type SortableRenderItemProps<T> = SortableListItemProps<T> &
  T & {
    active?: boolean;
    index?: number;
  };

type SortableListProps1<T extends object> = {
  items: SortableListItemProps<T>[];
  onChange(oldIndex: number, newIndex: number): void;
  renderItem(item: SortableRenderItemProps<T>): ReactNode;
};

/**
 * Usage exavple
 * @exavple
 * <SortableList
 *   items={fields}
 *   onChange={swap}
 *   renderItem={(item) => (
 *     <SortableItem id={item.id}>
 *       <Input />
 *       <SortDragHandle>
 *         <Button size='icon-default' variant='secondary'>
 *           <DragIcon />
 *         </Button>
 *       </SortDragHandle>
 *     </ortableItem>
 *   )}
 * />
 */
const SortableList = <T extends object>({
  items,
  onChange,
  renderItem,
}: SortableListProps1<T>) => {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => items.find((item) => item?.id === active?.id),
    [active, items]
  );
  const activeIndex = useMemo(
    () => items.findIndex((item) => item?.id === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(activeIndex, overIndex);
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderItem({ ...item, index })}
          </React.Fragment>
        ))}
      </SortableContext>

      {activeItem && (
        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.4",
                },
              },
            }),
          }}
        >
          {renderItem({ ...activeItem, active: true, index: activeIndex })}
        </DragOverlay>
      )}
    </DndContext>
  );
};

type TSortableItemContext = {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
};

const SortableItemContext = createContext<TSortableItemContext>({
  attributes: {
    tabIndex: 0,
    role: "button",
    "aria-describedby": "",
    "aria-disabled": false,
    "aria-pressed": undefined,
    "aria-roledescription": "",
  },
  listeners: undefined,
  ref() {},
});

type SortableItemProps = {
  id: UniqueIdentifier;
};

const SortableItem = ({
  children,
  id,
}: PropsWithChildren<SortableItemProps>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider
      value={{
        attributes,
        listeners,
        ref: setActivatorNodeRef,
      }}
    >
      <div ref={setNodeRef} style={style}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
};

const SortDragHandle = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>((props) => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return <Slot {...attributes} {...listeners} ref={ref} {...props} />;
});

SortDragHandle.displayName = "SortDragHandle";

export { SortableList, SortableItem, SortDragHandle };
