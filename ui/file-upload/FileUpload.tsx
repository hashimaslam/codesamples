'use client';

import type { DragEvent, FC } from 'react';
import { useCallback, useState } from 'react';

import { cn } from '@utils/cn';

import Spinner from '@ui/Spinner';
import {
  FileUploadEmpty,
  FileUploadPopulated
} from '@ui/file-upload/FileUpload.components';

export type FileUploadProps = {
  title?: string;
  description?: string;
  fileName?: string;
  accept?: string;
  isLoading?: boolean;
  className?: string;
  onChange?: (file: File | null) => void;
};
const FileUpload: FC<FileUploadProps> = ({
  title = 'Upload a file',
  fileName,
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
        'flex min-h-32 flex-col items-center justify-center space-y-2 rounded border border-dashed border-slate-300 p-6',
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
        <FileUploadPopulated
          fileName={fileName}
          onRemove={() => {
            onChange?.(null);
          }}
        />
      )}
      {isLoading && <Spinner />}
    </div>
  );
};

export default FileUpload;

export const useDragFile = (onDrop?: (file: File) => void) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    switch (event.type) {
      case 'dragover':
        setIsDragging(true);
        break;
      case 'dragleave':
      case 'drop':
        setIsDragging(false);
        break;
    }
  }, []);

  const handleOnDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      handleDragOver(event);
      const files = event.dataTransfer.files;
      if (files.length) {
        onDrop?.(files[0]);
      }
    },
    [handleDragOver, onDrop]
  );

  return {
    isDragging,
    containerProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragOver,
      onDrop: handleOnDrop
    }
  };
};
