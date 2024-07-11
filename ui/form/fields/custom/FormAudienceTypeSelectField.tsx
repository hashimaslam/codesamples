import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import FormSelectField from '@ui/form/fields/FormSelectField';
import type { SelectMenuProps } from '@ui/select/Select';

type FormAudienceTypeSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  Omit<SelectMenuProps, 'items'> & {
    name: string;
    label?: string;
    required?: boolean;
    tooltip?: string;
  };

const FormAudienceTypeSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  ...props
}: FormAudienceTypeSelectFieldProps<TFieldValues, TName>) => (
  <FormSelectField
    {...props}
    name={name}
    items={[
      {
        label: 'Holder',
        value: 'holder'
      },
      {
        label: 'Tech Partner',
        value: 'tech-partner'
      },
      {
        label: 'Commercial Partner',
        value: 'commercial-partner'
      }
    ]}
    label='Type'
    placeholder='Select type'
    control={control}
  />
);

export default FormAudienceTypeSelectField;
