'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import * as Form from '@ui/form/Form.components';

import type { TagComboboxProps } from '@components/composed/tags/TagCombobox';
import TagCombobox from '@components/composed/tags/TagCombobox';

type FormTagSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  TagComboboxProps & {
    name: string;
    label?: string;
  };
const FormTagSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label = 'Tags',
  disabled,
  control,
  placeholder = 'Select an existing tag or add a new one'
}: FormTagSelectFieldProps<TFieldValues, TName>) => (
  <Form.FormField
    control={control}
    name={name}
    render={({ field }) => (
      <Form.FormItem>
        {label && <Form.FormLabel>{label}</Form.FormLabel>}
        <Form.FormControl>
          <TagCombobox
            disabled={disabled}
            selectedTags={field.value}
            setSelectedTagsChange={field.onChange}
            placeholder={placeholder}
          />
        </Form.FormControl>
        <Form.FormErrorMessage />
      </Form.FormItem>
    )}
  />
);

export default FormTagSelectField;
