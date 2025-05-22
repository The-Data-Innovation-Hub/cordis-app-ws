import React from 'react';

type ActivityChartProps = {
  data: Array<{
    date: string;
    value: number;
  }>;
};

/**
 * ActivityChart Component
 * Displays a bar chart of activity data
 */
const ActivityChart: React.FC<ActivityChartProps> = ({ data = [] }) => {
  const maxValue = Math.max(...data.map((d) => d.value || 0), 1);
  const chartHeight = 200;
  const barWidth = 40;
  const barSpacing = 16;
  const chartPadding = 20;

  return (
    <div className="w-full overflow-x-auto">
      <div 
        className="flex items-end h-[200px]"
        style={{ minWidth: `${data.length * (barWidth + barSpacing) + chartPadding * 2}px` }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (chartHeight - 40);
          return (
            <div 
              key={index}
              className="flex flex-col items-center mx-2 transition-all duration-300 hover:opacity-90"
              style={{
                width: `${barWidth}px`,
                marginRight: `${barSpacing}px`,
              }}
            >
              <div 
                className="w-full bg-[#0089AD] rounded-t-md hover:bg-opacity-80 transition-colors duration-300"
                style={{
                  height: `${barHeight}px`,
                }}
                aria-label={`${item.value} on ${item.date}`}
              />
              <div className="mt-2 text-xs text-gray-500 text-center">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityChart;
