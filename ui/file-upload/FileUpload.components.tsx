import {
  CheckCircleIcon,
  DocumentPlusIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useRef } from 'react';

type FileUploadEmptyProps = {
  title?: string;
  description?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
};
const FileUploadEmpty: FC<FileUploadEmptyProps> = ({
  title,
  description,
  accept,
  onChange
}) => {
  const uploadRef = useRef<HTMLInputElement>(null);

  const onFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.currentTarget?.files;
      const file = fileList?.item(0);
      if (file) {
        onChange?.(file);
      }
    },
    [onChange]
  );

  return (
    <>
      <DocumentPlusIcon className='mx-auto h-8 w-8 text-slate-500' />
      <div className='text-center'>
        <div>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              uploadRef.current?.click();
            }}
            className='text-sm font-medium text-slate-700 hover:opacity-80'
          >
            {title}
          </button>{' '}
          <span className='text-sm text-slate-500'>or drag and drop</span>
        </div>
        <p className='text-xs text-slate-300'>{description}</p>
      </div>

      <input
        ref={uploadRef}
        type='file'
        className='hidden'
        accept={accept}
        multiple={false}
        onChange={onFileUpload}
      />
    </>
  );
};

type FileUploadPopulatedProps = {
  fileName: string;
  onRemove?: () => void;
};

const FileUploadPopulated: FC<FileUploadPopulatedProps> = ({
  fileName,
  onRemove
}) => (
  <>
    <CheckCircleIcon className='mx-auto h-8 w-8 text-slate-500' />
    <div className='flex flex-col gap-1'>
      <div className='text-center text-sm text-slate-500'>
        <span className='font-medium text-slate-800'>{fileName}</span> uploaded.
      </div>
      <button
        type='button'
        className='flex items-center justify-center gap-1 text-center text-sm font-medium text-sky-500 hover:opacity-80'
        onClick={onRemove}
      >
        <XCircleIcon className='h-4 w-4 stroke-2' /> Remove file
      </button>
    </div>
  </>
);

type ImageUploadPopulatedProps = {
  imageSrc?: string;
  onRemove?: () => void;
};

const ImageUploadPopulated: FC<ImageUploadPopulatedProps> = ({
  imageSrc,
  onRemove
}) => (
  <div className='relative h-24 w-full'>
    <Image
      src={imageSrc as string}
      alt={`${imageSrc}`}
      className='relative h-full w-full rounded-sm object-cover'
      fill
    />
    <div
      className='absolute right-2 top-2 flex cursor-pointer items-center gap-1 bg-gray-800 bg-opacity-70 p-1 text-sm font-medium text-red-600'
      onClick={onRemove}
    >
      <XCircleIcon width={16} height={16} className='stroke-2' />{' '}
      <div> Remove file</div>
    </div>
  </div>
);

export { FileUploadEmpty, FileUploadPopulated, ImageUploadPopulated };
