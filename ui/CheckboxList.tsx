import type { FC } from 'react';

import type { CheckboxProps } from '@ui/Checkbox';
import Checkbox from '@ui/Checkbox';
import Label from '@ui/Label';

type CheckboxListItem = CheckboxProps & {
  value: string;
  label: string;
};

export type CheckboxListProps = {
  items: CheckboxListItem[];
  checked?: string[];
  onCheckedChange?: (checked: string[]) => void;
};
const CheckboxList: FC<CheckboxListProps> = ({
  items,
  checked = [],
  onCheckedChange
}) => (
  <div className='flex flex-col gap-2'>
    {items.map(({ value, label }) => (
      <div key={value} className='flex gap-2'>
        <Checkbox
          id={value}
          checked={checked.includes(value)}
          onCheckedChange={() => {
            if (checked.includes(value)) {
              onCheckedChange?.(checked.filter((id) => id !== value));
            } else {
              onCheckedChange?.([...checked, value]);
            }
          }}
        />
        <Label htmlFor={value}>{label}</Label>
      </div>
    ))}
  </div>
);

export default CheckboxList;
