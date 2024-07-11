import type { FC } from 'react';
import { Fragment } from 'react';

import Badge from '@ui/badge/Badge';

type NetworkBadgeProps = {
  value: number;
};

const NetworkBadge: FC<NetworkBadgeProps> = ({ value }) => {
  switch (value) {
    case 1:
      return <Badge variant='blue'>Ethereum</Badge>;
    case 137:
      return <Badge variant='purple'>Polygon</Badge>;
    default:
      return <Fragment />;
  }
};

export default NetworkBadge;
