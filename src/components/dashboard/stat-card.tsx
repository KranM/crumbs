import { type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  formatter?: (value: number) => string;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  formatter,
}: StatCardProps) {
  const displayValue =
    typeof value === "number"
      ? formatter
        ? formatter(value)
        : value.toLocaleString()
      : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}
