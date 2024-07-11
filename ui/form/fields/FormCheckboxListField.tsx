'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { CheckboxListProps } from '@ui/CheckboxList';
import CheckboxList from '@ui/CheckboxList';
import * as Form from '@ui/form/Form.components';

type FormCheckboxListFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  CheckboxListProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
    onChange?: (value: string[]) => void;
  };
const FormCheckboxListField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  control,
  required,
  tooltip,
  items,
  onChange,
  ...checkboxProps
}: FormCheckboxListFieldProps<TFieldValues, TName>) => (
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
          <CheckboxList
            {...checkboxProps}
            items={items}
            checked={field.value}
            onCheckedChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
          />
        </Form.FormControl>
        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormCheckboxListField;
