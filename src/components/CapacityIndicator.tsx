import { cn } from '@/lib/utils';

interface CapacityIndicatorProps {
  filled: number;
  capacity: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CapacityIndicator({ filled, capacity, size = 'md', showLabel = true }: CapacityIndicatorProps) {
  const percentage = (filled / capacity) * 100;
  
  const getColor = () => {
    if (percentage === 100) return 'bg-peach-300';
    if (percentage >= 80) return 'bg-peach-200';
    return 'bg-mint-300';
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-muted-foreground">Capacity</span>
          <span className={cn(
            'font-bold',
            percentage === 100 ? 'text-peach-700' : percentage >= 80 ? 'text-peach-600' : 'text-mint-700'
          )}>
            {filled}/{capacity}
          </span>
        </div>
      )}
      <div className={cn('w-full bg-secondary rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', getColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
