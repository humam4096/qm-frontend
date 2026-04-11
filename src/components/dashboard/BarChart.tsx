interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  height?: number;
}

export function BarChart({ data, height = 300 }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = height - 60; // Reserve space for labels

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4" style={{ height: `${chartHeight}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const percentage = ((item.value / maxValue) * 100).toFixed(0);

          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
              {/* Value label */}
              <div className="text-sm font-bold text-foreground mb-1">
                {item.value}
              </div>
              
              {/* Bar */}
              <div 
                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                style={{ 
                  height: `${barHeight}px`,
                  backgroundColor: item.color,
                  minHeight: '4px'
                }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Labels */}
      <div className="flex items-start justify-between gap-4 mt-3">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center">
            <div className="text-xs text-muted-foreground font-medium leading-tight">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
