import { useRef } from "react";
import { Employee, Team } from "@/types/employee";
import { EmployeeCard } from "./EmployeeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

interface TeamSectionProps {
  team: Team;
  employees: Employee[];
  onDragStart: (e: React.DragEvent, employee: Employee) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, teamId: string) => void;
  onEmployeeClick: (employee: Employee) => void;
  onStatusChange?: (employee: Employee, next: Employee["status"]) => void;
}

export const TeamSection = ({
  team,
  employees,
  onDragStart,
  onDragOver,
  onDrop,
  onEmployeeClick,
  onStatusChange,
}: TeamSectionProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => onDrop(e, team.id);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(420, Math.round(el.clientWidth * 0.8));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <Card
      className="bg-gradient-card shadow-card border-0 animate-slide-in"
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div
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
          <div className="relative">
            {/* Botones (ocultos en pantallas chicas; swipe en mobile) */}
            <button
              type="button"
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white/90 border shadow hover:bg-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={trackRef}
              className="
                horizontal-scroll
                -mx-2 px-2
                flex flex-nowrap gap-4
                overflow-x-auto pb-2
                snap-x snap-mandatory
              "
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
              }}
            >
              {employees.map((employee) => (
                <div key={employee.id} className="snap-start" onDragStart={(ev) => onDragStart(ev, employee)}>
                  <EmployeeCard
                    e={employee}
                    onDragStart={onDragStart}
                    onClick={onEmployeeClick}
                    onStatusChange={onStatusChange}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-white/90 border shadow hover:bg-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
