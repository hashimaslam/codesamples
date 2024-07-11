'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { CalendarDateRangePickerProps } from '@ui/calendar/CalendarDateRangePicker';
import CalendarDateRangePicker from '@ui/calendar/CalendarDateRangePicker';
import * as Form from '@ui/form/Form.components';

type FormDateRangeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  Omit<CalendarDateRangePickerProps, 'onChange'> & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormDateRangeField = <
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
}: FormDateRangeFieldProps<TFieldValues, TName>) => (
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
          <CalendarDateRangePicker
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

export default FormDateRangeField;
