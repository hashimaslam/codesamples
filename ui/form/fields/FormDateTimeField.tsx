'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { CalendarDateTimePickerProps } from '@ui/calendar/CalendarDateTimePicker';
import CalendarDateTimePicker from '@ui/calendar/CalendarDateTimePicker';
import * as Form from '@ui/form/Form.components';

type FormDateTimeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  CalendarDateTimePickerProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
    asTimestamp?: boolean;
  };
const FormDateTimeField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  disabled,
  control,
  placeholder,
  required,
  tooltip,
  asTimestamp
}: FormDateTimeFieldProps<TFieldValues, TName>) => (
  <Form.FormField
    control={control}
    name={name}
    render={({ field }) => {
      let value: Date = field.value;
      if (asTimestamp && field.value) {
        value = new Date(field.value);
      }

      return (
        <Form.FormItem>
          {label && (
            <Form.FormLabel required={required} tooltip={tooltip}>
              {label}
            </Form.FormLabel>
          )}
          <Form.FormControl>
            <CalendarDateTimePicker
              disabled={disabled}
              value={value}
              onChange={(newValue) => {
                if (!newValue) return field.onChange(undefined);
                if (asTimestamp)
                  return field.onChange(new Date(newValue).getTime());

                field.onChange(newValue);
              }}
              placeholder={placeholder}
            />
          </Form.FormControl>
          <Form.FormErrorMessage />
        </Form.FormItem>
      );
    }}
  />
);

export default FormDateTimeField;
