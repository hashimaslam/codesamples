import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import { supportedChains } from '@utils/helpers/crypto';

import FormSelectField from '@ui/form/fields/FormSelectField';
import type { SelectMenuProps } from '@ui/select/Select';

type FormNetworkSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  Omit<SelectMenuProps, 'items'> & {
    name: string;
    label?: string;
    required?: boolean;
    tooltip?: string;
  };

const networkItems = supportedChains.map((chain) => ({
  label: chain.name,
  value: String(chain.chainId)
}));

const FormNetworkSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  ...props
}: FormNetworkSelectFieldProps<TFieldValues, TName>) => (
  <FormSelectField
    name={name}
    label='Network'
    placeholder='Select network'
    {...props}
    items={networkItems}
    control={control}
  />
);

export default FormNetworkSelectField;
