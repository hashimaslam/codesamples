'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { InputProps } from '@ui/Input';
import Input from '@ui/Input';
import * as Form from '@ui/form/Form.components';

type FormPercentageFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  InputProps & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormPercentageField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  control,
  required,
  tooltip,
  ...inputProps
}: FormPercentageFieldProps<TFieldValues, TName>) => (
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
          <div className='relative'>
            <Input {...field} {...inputProps} className='pr-8' />
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500'>
              %
            </div>
          </div>
        </Form.FormControl>
        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormPercentageField;
