import { BookingType } from '@/contexts/SchedulingContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BookingTypeBadgeProps {
  type: BookingType;
  className?: string;
}

export function BookingTypeBadge({ type, className }: BookingTypeBadgeProps) {
  const styles = {
    recurring: 'bg-lavender-100 text-lavender-700 border-lavender-200',
    makeup: 'bg-mint-100 text-mint-700 border-mint-200',
    intro: 'bg-peach-100 text-peach-700 border-peach-200',
  };

  const labels = {
    recurring: 'Recurring',
    makeup: 'Makeup',
    intro: 'Intro',
  };

  return (
    <Badge
      variant="outline"
      className={cn('font-semibold border-2', styles[type], className)}
    >
      {labels[type]}
    </Badge>
  );
}
