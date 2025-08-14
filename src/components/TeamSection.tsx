import { useEffect, useRef, useState } from "react";
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
  const handleDrop = (e: React.DragEvent) => onDrop(e, team.id);

  // --- scroller independiente por team ---
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const refreshArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    refreshArrows();
  }, [employees]);

  const onScroll = () => refreshArrows();

  const scrollByStep = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Tamaño aproximado de una card + gap
    const STEP = 360;
    el.scrollBy({ left: dir * STEP, behavior: "smooth" });
  };

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
          <div className="relative">
            {/* Carrusel horizontal SOLO para este team */}
            <div
              ref={scrollerRef}
              onScroll={onScroll}
              className="
                horizontal-scroll
                -mx-2 px-2
                flex flex-nowrap gap-4
                overflow-x-auto pb-2
                snap-x snap-mandatory
                scrollbar-accent-muted
              "
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
              }}
            >
              {employees.map((employee) => (
                <div key={employee.id} className="snap-start">
                  <EmployeeCard
                    e={employee}
                    onDragStart={onDragStart}
                    onClick={onEmployeeClick}
                    onStatusChange={onStatusChange}
                  />
                </div>
              ))}
            </div>

            {/* Controles por sección */}
            {canLeft && (
              <button
                aria-label="Scroll left"
                className="
                  absolute left-1 top-1/2 -translate-y-1/2
                  rounded-full shadow bg-white/80 hover:bg-white
                  p-1 border
                "
                onClick={() => scrollByStep(-1)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canRight && (
              <button
                aria-label="Scroll right"
                className="
                  absolute right-1 top-1/2 -translate-y-1/2
                  rounded-full shadow bg-white/80 hover:bg-white
                  p-1 border
                "
                onClick={() => scrollByStep(1)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


