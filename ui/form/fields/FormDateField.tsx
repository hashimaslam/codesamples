'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { CalendarDayPickerProps } from '@ui/calendar/CalendarDayPicker';
import CalendarDayPicker from '@ui/calendar/CalendarDayPicker';
import * as Form from '@ui/form/Form.components';

type FormDateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  CalendarDayPickerProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormDateField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  disabled,
  control,
  placeholder,
  required,
  tooltip
}: FormDateFieldProps<TFieldValues, TName>) => (
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
          <CalendarDayPicker
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

export default FormDateField;
