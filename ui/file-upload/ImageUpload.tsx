'use client';

import type { FC } from 'react';

import { cn } from '@utils/cn';

import Spinner from '@ui/Spinner';
import {
  FileUploadEmpty,
  ImageUploadPopulated
} from '@ui/file-upload/FileUpload.components';

import { useDragFile } from '@components/ui/file-upload/FileUpload';

export type ImageUploadProps = {
  title?: string;
  description?: string;
  fileName?: string;
  imageSrc?: string;
  accept?: string;
  isLoading?: boolean;
  className?: string;
  onChange?: (file: File | null) => void;
};
const ImageUpload: FC<ImageUploadProps> = ({
  title = 'Upload an image',
  fileName,
  imageSrc,
  description,
  accept,
  isLoading,
  onChange,
  className
}) => {
  const { containerProps, isDragging } = useDragFile(onChange);

  return (
    <div
      {...containerProps}
      className={cn(
        'flex min-h-32 flex-col items-center justify-center space-y-2 rounded border border-dashed border-slate-300 p-4',
        {
          'border-yellow-400': isDragging
        },
        className
      )}
    >
      {!isLoading && !fileName && (
        <FileUploadEmpty
          title={title}
          description={description}
          accept={accept}
          onChange={onChange}
        />
      )}
      {!isLoading && fileName && (
        <ImageUploadPopulated
          imageSrc={imageSrc}
          onRemove={() => {
            onChange?.(null);
          }}
        />
      )}
      {isLoading && <Spinner />}
    </div>
  );
};

export default ImageUpload;
