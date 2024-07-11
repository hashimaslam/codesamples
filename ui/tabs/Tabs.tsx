import type { FC, ReactNode } from 'react';

import * as TabsPrimitive from '@ui/tabs/Tabs.components';

export type Tab = {
  id: string;
  label: ReactNode;
  content: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};
const Tabs: FC<TabsProps> = ({ tabs }) => (
  <TabsPrimitive.TabsRoot defaultValue={tabs.find(() => true)?.id}>
    <TabsPrimitive.TabsList>
      {tabs.map((tab) => (
        <TabsPrimitive.TabsTrigger key={tab.id} value={tab.id}>
          {tab.label}
        </TabsPrimitive.TabsTrigger>
      ))}
    </TabsPrimitive.TabsList>
    {tabs.map((tab) => (
      <TabsPrimitive.TabsContent key={tab.id} value={tab.id}>
        {tab.content}
      </TabsPrimitive.TabsContent>
    ))}
  </TabsPrimitive.TabsRoot>
);

export default Tabs;
