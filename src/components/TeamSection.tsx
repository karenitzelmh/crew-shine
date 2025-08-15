import { Employee, Team } from "@/types/employee";
import { EmployeeCard } from "./EmployeeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface TeamSectionProps {
  team: Team;
  employees: Employee[];
  onDragStart: (e: React.DragEvent, employee: Employee) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, teamId: string) => void;
  onEmployeeClick: (employee: Employee) => void;
  onStatusChange?: (employee: Employee, next: Employee["status"]) => void;
  onEditEmployee?: (employee: Employee, updates: Partial<Pick<Employee, "name" | "position" | "level">>) => void;
  onDeleteEmployee?: (employee: Employee) => void;
}

export const TeamSection = ({
  team,
  employees,
  onDragStart,
  onDragOver,
  onDrop,
  onEmployeeClick,
  onStatusChange,
  onEditEmployee,
  onDeleteEmployee,
}: TeamSectionProps) => {
  const handleDrop = (e: React.DragEvent) => onDrop(e, team.id);

  return (
    <Card
      className="bg-gradient-card shadow-card border-0 animate-slide-in relative"
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: team.color }}
            />
            {team.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            <Users className="h-3 w-3 mr-1" />
            {employees.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {employees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No employees in this team</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                e={employee}
                onDragStart={onDragStart}
                onClick={onEmployeeClick}
                onStatusChange={onStatusChange}
                onEdit={onEditEmployee}
                onDelete={onDeleteEmployee}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


