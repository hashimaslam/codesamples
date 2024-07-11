'use client';

import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { cn } from '@utils/cn';
import { hexColorValidation } from '@utils/helpers/validation';

import type { InputProps } from '@ui/Input';
import Input from '@ui/Input';

export type ColorInputProps = InputProps & {
  value?: string;
  onChange?: (color: string) => void;
};

const ColorInput: FC<ColorInputProps> = ({
  value,
  onChange,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(value);

  const handleColorChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newColor = event.target.value;

      if (newColor !== '' && !hexColorValidation.test(newColor)) {
        return;
      }

      setSelectedColor(newColor);
      onChange?.(newColor);
    },
    [onChange]
  );

  const onColorPickerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newColor = event.target.value;

      setSelectedColor(newColor);
      setInputValue(newColor);
    },
    []
  );

  const [debouncedColor] = useDebounce<string | undefined>(selectedColor, 500);

  useEffect(() => {
    onChange?.(debouncedColor || '');
  }, [debouncedColor, onChange]);

  useEffect(() => {
    setInputValue(value);
    setSelectedColor(value);
  }, [value]);

  return (
    <div
      className={cn(
        'inline-flex w-full items-center overflow-hidden rounded border-1.5 border-slate-200',
        'ring-slate-200 ring-offset-white focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
        className
      )}
    >
      <div
        className='relative aspect-square h-9 w-9'
        style={{
          backgroundColor: selectedColor || '#fff'
        }}
      >
        <input
          className='h-full w-full opacity-0'
          type='color'
          value={selectedColor}
          onChange={onColorPickerChange}
        />
      </div>
      <Input
        {...props}
        type='text'
        value={inputValue}
        className='rounded-l-none border-0 border-l-1.5 focus:ring-0'
        onChange={(event) => {
          setInputValue(event.target.value);
          handleColorChange(event);
        }}
      />
    </div>
  );
};

export default ColorInput;
