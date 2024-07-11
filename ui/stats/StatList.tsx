import type { FC } from 'react';

import Card from '@ui/Card';

type StatListProps = {
  title: string;
  list?: string[];
};
const StatList: FC<StatListProps> = ({ title, list }) => (
  <Card className='space-y-6'>
    <h3 className='font-bold'>{title}</h3>
    {Boolean(list?.length) && (
      <ol className='list-inside list-decimal space-y-2'>
        {list?.map((item) => (
          <li key={item} className='text-sm'>
            {item}
          </li>
        ))}
      </ol>
    )}
  </Card>
);

export default StatList;
