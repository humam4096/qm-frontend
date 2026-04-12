interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  size?: number;
}

export function DonutChart({ data, size = 200 }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;
  const innerRadius = radius * 0.6;
  
  let currentAngle = -90; // Start from top

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle = endAngle;

    // Calculate path for donut segment
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1)
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-0">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                strokeWidth="2"
                stroke="white"
              />
            </g>
          ))}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-foreground">{total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full shrink-0" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm font-medium text-foreground">{segment.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-foreground">{segment.value}</span>
              <span className="text-xs text-muted-foreground w-12 text-right">
                {segment.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
