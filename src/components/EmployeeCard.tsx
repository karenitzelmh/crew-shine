import { Employee } from "@/types/employee";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Calendar } from "lucide-react";

interface EmployeeCardProps {
  employee: Employee;
  onDragStart?: (e: React.DragEvent, employee: Employee) => void;
  onClick?: (employee: Employee) => void;
}

const statusColors = {
  Activo: "success",
  Pending: "warning", 
  Hiring: "hiring"
} as const;

export const EmployeeCard = ({ employee, onDragStart, onClick }: EmployeeCardProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart?.(e, employee);
  };

  return (
    <Card
      className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer animate-fade-in border-0"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick?.(employee)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12 ring-2 ring-primary/10">
            <AvatarImage src={employee.photo} alt={employee.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {employee.name}
              </h3>
              <Badge 
                variant="secondary" 
                className={`
                  text-xs font-medium
                  ${employee.status === 'Activo' ? 'bg-success text-success-foreground' : ''}
                  ${employee.status === 'Pending' ? 'bg-warning text-warning-foreground' : ''}
                  ${employee.status === 'Hiring' ? 'bg-hiring text-hiring-foreground' : ''}
                `}
              >
                {employee.status}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2 truncate">
              {employee.position}
            </p>
            
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Mail className="h-3 w-3 mr-1" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Desde {employee.startDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};