'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as LineChartComponent,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultLegendContent';

type TLegendPayload = Payload & {
  dataKey?: string;
};

type TAxisConfig = {
  dataKey?: string;
  formatter?: (value: string | number) => string | number;
};

type TLineConfig = {
  dataKey: string;
  label?: string;
  color: string;
  formatter?: (value: string | number) => string | number;
};

type LineChartProps<T extends object> = {
  xAxis?: TAxisConfig;
  yAxis?: TAxisConfig;
  lines: TLineConfig[];
  data: T[];
};

const LineChart = <T extends object>({
  xAxis,
  yAxis,
  lines,
  data
}: LineChartProps<T>) => (
  <ResponsiveContainer>
    <LineChartComponent
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray='3 3' stroke='#F1F5F9' />
      <XAxis
        dataKey={xAxis?.dataKey}
        axisLine={false}
        tick={{
          fill: '#64748B',
          fontSize: '10px',
          strokeWidth: 0
        }}
        tickLine={false}
        tickMargin={16}
        tickFormatter={(value) => xAxis?.formatter?.(value) || value}
      />
      <YAxis
        dataKey={yAxis?.dataKey}
        interval='preserveStartEnd'
        axisLine={false}
        tickSize={30}
        tickLine={{
          strokeDasharray: '3 3',
          stroke: '#F1F5F9'
        }}
        tickMargin={16}
        tick={{
          fill: '#64748B',
          fontSize: '10px'
        }}
        tickFormatter={(value) => yAxis?.formatter?.(value) || value}
      />
      <Tooltip />
      <Legend
        align='left'
        iconType='circle'
        iconSize={8}
        colorInterpolation='#64748B'
        content={(item) => (
          <div className='mt-4 flex gap-4'>
            {item.payload?.map((payload: TLegendPayload) => {
              const dataKey = payload?.dataKey;
              const label =
                lines?.find((line) => line?.dataKey === dataKey)?.label ||
                payload?.value;

              return (
                <div key={dataKey} className='inline-flex items-center gap-2'>
                  <span
                    className='inline-block h-2 w-2 rounded-full'
                    style={{ backgroundColor: payload?.color }}
                  />
                  <label className='text-xs text-slate-500'>{label}</label>
                </div>
              );
            })}
          </div>
        )}
      />
      {lines?.map((line) => (
        <Line
          key={line?.dataKey}
          type='monotone'
          dataKey={line?.dataKey}
          stroke={line?.color}
          strokeWidth={4}
          dot={false}
        />
      ))}
    </LineChartComponent>
  </ResponsiveContainer>
);

export default LineChart;
