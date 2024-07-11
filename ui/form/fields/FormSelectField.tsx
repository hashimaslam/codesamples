'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import * as Form from '@ui/form/Form.components';
import type { SelectMenuProps } from '@ui/select/Select';
import Select from '@ui/select/Select';

type FormSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  SelectMenuProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  items,
  disabled,
  control,
  required,
  tooltip,
  placeholder
}: FormSelectFieldProps<TFieldValues, TName>) => (
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
          <Select
            disabled={disabled}
            value={field.value || undefined}
            onValueChange={field.onChange}
            placeholder={placeholder}
            items={items}
          />
        </Form.FormControl>
        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormSelectField;
