import { EmployeeStats } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Clock, UserPlus, RefreshCcw } from "lucide-react";

interface StatsCardsProps {
  stats: EmployeeStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const statItems = [
    {
      title: "Total Employees",
      value: stats.total,
      icon: Users,
      colorClass: "text-[hsl(var(--primary))]",
      bgClass: "bg-[hsl(var(--primary)/0.10)]",
    },
    {
      title: "Active",
      value: stats.active,
      icon: UserCheck,
      colorClass: "text-[hsl(var(--success))]",
      bgClass: "bg-[hsl(var(--success)/0.12)]",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      colorClass: "text-[hsl(var(--warning))]",
      bgClass: "bg-[hsl(var(--warning)/0.12)]",
    },
    {
      title: "Hiring",
      value: stats.hiring,
      icon: UserPlus,
      colorClass: "text-[hsl(var(--primary))]",
      bgClass: "bg-[hsl(var(--primary)/0.10)]",
    },
    {
      title: "Backfill",
      value: stats.backfill,
      icon: RefreshCcw,
      colorClass: "text-[hsl(var(--primary))]",
      bgClass: "bg-[hsl(var(--primary)/0.10)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card
          key={item.title}
          className="bg-gradient-card shadow-card border-0 animate-fade-in"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${item.bgClass}`}>
              <item.icon className={`h-4 w-4 ${item.colorClass}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${item.colorClass}`}>
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
