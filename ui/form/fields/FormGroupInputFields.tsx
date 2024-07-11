import type { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@utils/cn';

import type { InputProps } from '@ui/Input';
import Input from '@ui/Input';
import * as Form from '@ui/form/Form.components';

type FormGroupInputFieldsProps<TFieldValues extends FieldValues = FieldValues> =
  {
    fields: (InputProps & {
      name: Path<TFieldValues>;
    })[];
    control: Control<TFieldValues>;
  };
const FormGroupInputFields = <TFieldValues extends FieldValues = FieldValues>({
  fields,
  control
}: FormGroupInputFieldsProps<TFieldValues>) => (
  <div>
    {fields.map((groupField, index) => {
      const isFirst = index === 0;
      const isInBetween = index > 0 && index < fields.length - 1;
      const isLast = index === fields.length - 1;

      return (
        <Form.FormField
          key={groupField.name}
          control={control}
          name={groupField.name}
          render={({ field }) => (
            <Form.FormItem>
              <Form.FormControl>
                <Input
                  {...field}
                  {...groupField}
                  className={cn('focus:relative focus:z-1', {
                    'rounded-b-none': isFirst,
                    '-mt-1.5px rounded-b-none': isInBetween,
                    '-mt-1.5px rounded-b-md rounded-t-none': isLast
                  })}
                />
              </Form.FormControl>
            </Form.FormItem>
          )}
        />
      );
    })}
  </div>
);

export default FormGroupInputFields;
