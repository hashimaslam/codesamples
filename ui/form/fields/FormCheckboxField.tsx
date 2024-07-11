'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { CheckboxProps } from '@ui/Checkbox';
import Checkbox from '@ui/Checkbox';
import * as Form from '@ui/form/Form.components';

type FormCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  CheckboxProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormCheckboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  control,
  required,
  tooltip,
  ...checkboxProps
}: FormCheckboxFieldProps<TFieldValues, TName>) => (
  <Form.FormField
    control={control}
    name={name}
    render={({ field }) => (
      <Form.FormItem>
        <Form.FormControl>
          <div className='flex gap-2'>
            <Checkbox
              {...checkboxProps}
              id={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            {label && (
              <Form.FormLabel
                required={required}
                tooltip={tooltip}
                htmlFor={field.name}
              >
                {label}
              </Form.FormLabel>
            )}
          </div>
        </Form.FormControl>

        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormCheckboxField;
