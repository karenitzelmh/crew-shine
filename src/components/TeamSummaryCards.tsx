import { useMemo } from "react";
import { Employee, Team } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

      return { team, total, active, pending, hiring, backfill };
    });
  }, [teams, employees]);

  return (
    <div className="grid-tight mt-4">
      {teamStats.map((stat) => (
        <Card key={stat.team.id} className="card-compact-tight">
          <CardHeader className="!p-3 !pb-2">
            <CardTitle className="card-title flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: stat.team.color }}
              />
              {stat.team.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="!p-3 !pt-0">
            <div className="metrics">
              <div className="metric">
                <span>Total</span>
                <span className="pill">{stat.total}</span>
              </div>

              {stat.active > 0 && (
                <div className="metric">
                  <span>Active</span>
                  <span className="pill">{stat.active}</span>
                </div>
              )}

              {stat.pending > 0 && (
                <div className="metric">
                  <span>Pending</span>
                  <span className="pill">{stat.pending}</span>
                </div>
              )}

              {stat.hiring > 0 && (
                <div className="metric">
                  <span>Hiring</span>
                  <span className="pill">{stat.hiring}</span>
                </div>
              )}

              {stat.backfill > 0 && (
                <div className="metric">
                  <span>Backfill</span>
                  <span className="pill">{stat.backfill}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

    </div>
  );
};
