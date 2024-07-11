'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import * as Form from '@ui/form/Form.components';

import type { RadioGroupProps } from '@components/ui/radio/RadioGroup';
import RadioGroup from '@components/ui/radio/RadioGroup';

type FormRadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  RadioGroupProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormRadioGroupField = <
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
}: FormRadioGroupFieldProps<TFieldValues, TName>) => (
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
          <RadioGroup
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

export default FormRadioGroupField;
