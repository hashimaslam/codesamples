import type { FC } from 'react';

import Button from '@ui/Button';
import {
  DialogButtonContainer,
  DialogTitle,
  UncontrolledDialog
} from '@ui/dialog/Dialog';
import Text from '@ui/typography/Text';

type DeleteDialogProps = {
  title: string;
  description: string;
  onClose: () => void;
  onDelete: () => void;
  isLoading?: boolean;
};

const DeleteDialog: FC<DeleteDialogProps> = ({
  title,
  description,
  isLoading,
  onClose,
  onDelete
}) => (
  <UncontrolledDialog close={onClose}>
    <div className='space-y-8'>
      <DialogTitle>{title}</DialogTitle>
      <Text className='text-sm'>{description}</Text>
      <DialogButtonContainer>
        <Button variant='secondary' onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant='red' onClick={onDelete} disabled={isLoading}>
          Delete
        </Button>
      </DialogButtonContainer>
    </div>
  </UncontrolledDialog>
);

export default DeleteDialog;
