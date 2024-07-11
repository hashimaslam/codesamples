'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { ColorInputProps } from '@ui/ColorInput';
import ColorInput from '@ui/ColorInput';
import * as Form from '@ui/form/Form.components';

type FormColorInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  ColorInputProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormColorInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  type,
  name,
  label,
  control,
  disabled,
  placeholder,
  required,
  tooltip,
  ...inputProps
}: FormColorInputProps<TFieldValues, TName>) => (
  <Form.FormField
    control={control}
    name={name}
    render={({ field }) => (
      <Form.FormItem>
        {label && (
          <Form.FormLabel required={required} tooltip={tooltip}>
            {label}
          </Form.FormLabel>
        )}
        <Form.FormControl>
          <ColorInput
            {...inputProps}
            disabled={disabled}
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        </Form.FormControl>
        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormColorInput;
