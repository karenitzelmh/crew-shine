import { EmployeeStats } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

interface StatsCardsProps {
  stats: EmployeeStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const statItems = [
    {
      title: "Total Empleados",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Activos",
      value: stats.active,
      icon: UserCheck,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Inactivos",
      value: stats.inactive,
      icon: UserX,
      color: "text-inactive",
      bgColor: "bg-inactive/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card key={item.title} className="bg-gradient-card shadow-card border-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};