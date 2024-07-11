'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { InputProps } from '@ui/Input';
import Input from '@ui/Input';
import * as Form from '@ui/form/Form.components';

type FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  InputProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormInputField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  control,
  required,
  tooltip,
  ...inputProps
}: FormInputFieldProps<TFieldValues, TName>) => (
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
          <Input
            {...field}
            {...inputProps}
            disabled={field?.disabled || inputProps?.disabled}
            onChange={(e) => {
              inputProps?.onChange?.(e);
              field?.onChange?.(e);
            }}
          />
        </Form.FormControl>
        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormInputField;
