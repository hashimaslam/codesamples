'use client';

import type * as SwitchPrimitives from '@radix-ui/react-switch';
import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import Switch from '@ui/Switch';
import * as Form from '@ui/form/Form.components';

type FormSwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  typeof SwitchPrimitives.Root & {
    name: string;
    label?: string;
    tooltip?: string;
    required?: boolean;
  };
const FormSwitchField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  name,
  control,
  required,
  tooltip,
  ...switchProps
}: FormSwitchFieldProps<TFieldValues, TName>) => (
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
          <Switch
            {...switchProps}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </Form.FormControl>
        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormSwitchField;
