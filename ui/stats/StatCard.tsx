'use client';

import type { FC } from 'react';

import Card from '@ui/Card';
import Text from '@ui/typography/Text';

type StatCardProps = {
  className?: string;
  title: string;
  value: string | number;
  icon: FC<{
    className?: string;
  }>;
};
const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon }) => (
  <Card className='flex space-x-4'>
    <div>
      <div className='rounded-md bg-sky-400 p-2'>
        <Icon className='h-8 w-8 text-white' />
      </div>
    </div>
    <div className='space-y-1'>
      <Text className='font-bold'>{title}</Text>
      <Text className='text-xl leading-5'>{value}</Text>
    </div>
  </Card>
);

export default StatCard;
