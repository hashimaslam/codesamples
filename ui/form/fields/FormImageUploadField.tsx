'use client';

import type { FieldPath, FieldValues } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form';

import type { FileData } from '@utils/api/file/file.hook';
import { useFileUpload } from '@utils/api/file/file.hook';

import type { FileUploadProps } from '@ui/file-upload/FileUpload';
import ImageUpload from '@ui/file-upload/ImageUpload';
import * as Form from '@ui/form/Form.components';

type FormImageUploadFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  FileUploadProps & {
    label?: string;
    tooltip?: string;
    required?: boolean;
    imageSrc?: string;
    onUpload?: (file: FileData | null) => Promise<void>;
  };
const FormImageUploadField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  control,
  title,
  description,
  accept,
  isLoading,
  onUpload,
  required,
  tooltip,
  imageSrc
}: FormImageUploadFieldProps<TFieldValues, TName>) => {
  const { isUploading, upload } = useFileUpload({ onUpload });

  return (
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
            <ImageUpload
              title={title}
              description={description}
              fileName={field.value}
              accept={accept}
              imageSrc={imageSrc}
              isLoading={isUploading || isLoading}
              onChange={async (file: File | null) => {
                await upload(file);
                field.onChange(file?.name || '');
              }}
            />
          </Form.FormControl>
          <Form.FormErrorMessage />
        </Form.FormItem>
      )}
    />
  );
};

export default FormImageUploadField;
