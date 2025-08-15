import { useMemo } from "react";
import { Employee, Team } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamSummaryCardsProps {
  teams: Team[];
  employees: Employee[];
}

export const TeamSummaryCards = ({ teams, employees }: TeamSummaryCardsProps) => {
  const teamStats = useMemo(() => {
    return teams.map((team) => {
      const teamEmployees = employees.filter((emp) => emp.team === team.id);
      const active = teamEmployees.filter((emp) => emp.status === "Active").length;
      const pending = teamEmployees.filter((emp) => emp.status === "Pending").length;
      const hiring = teamEmployees.filter((emp) => emp.status === "Hiring").length;
      const backfill = teamEmployees.filter((emp) => emp.status === "Backfill").length;
      const total = teamEmployees.length;

      return {
        team,
        total,
        active,
        pending,
        hiring,
        backfill,
      };
    });
  }, [teams, employees]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {teamStats.map((stat) => (
        <Card
          key={stat.team.id}
          className="bg-gradient-card shadow-card border-0"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-foreground flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: stat.team.color }}
              />
              {stat.team.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total</span>
                <Badge variant="secondary">{stat.total}</Badge>
              </div>
              {stat.active > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                    {stat.active}
                  </Badge>
                </div>
              )}
              {stat.pending > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                    {stat.pending}
                  </Badge>
                </div>
              )}
              {stat.hiring > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hiring</span>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {stat.hiring}
                  </Badge>
                </div>
              )}
              {stat.backfill > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Backfill</span>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                    {stat.backfill}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};