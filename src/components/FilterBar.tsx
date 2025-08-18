import { Team, Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Filter, X, Users, Activity, Target, UserCheck } from "lucide-react";

interface FilterBarProps {
  teams: Team[];
  employees: Employee[];
  selectedTeams: string[];
  selectedStatuses: string[];
  selectedLevels: string[];
  selectedEmployees: string[];
  onTeamsChange: (teams: string[]) => void;
  onStatusesChange: (statuses: string[]) => void;
  onLevelsChange: (levels: string[]) => void;
  onEmployeesChange: (employees: string[]) => void;
}

export const FilterBar = ({
  teams,
  employees,
  selectedTeams,
  selectedStatuses,
  selectedLevels,
  selectedEmployees,
  onTeamsChange,
  onStatusesChange,
  onLevelsChange,
  onEmployeesChange,
}: FilterBarProps) => {
  const levels = [...new Set(employees.map(emp => emp.level).filter(level => level && level.trim() !== ''))];
  const statuses = ["Active", "Pending", "Hiring", "Backfill"];
  return (
    <div className="bg-gradient-card rounded-lg p-4 shadow-card border-0 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-semibold text-foreground">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Employees Dropdown */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Analistas
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-background hover:bg-muted/50">
                <span className="truncate">
                  {selectedEmployees.length === 0 
                    ? "Todos los analistas" 
                    : selectedEmployees.length === 1 
                      ? employees.find(emp => emp.id === selectedEmployees[0])?.name || "Seleccionado"
                      : `${selectedEmployees.length} seleccionados`
                  }
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto bg-popover">
              <DropdownMenuCheckboxItem
                checked={selectedEmployees.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) onEmployeesChange([]);
                }}
              >
                Todos los analistas
              </DropdownMenuCheckboxItem>
              {employees.map((employee) => (
                <DropdownMenuCheckboxItem
                  key={employee.id}
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onEmployeesChange([...selectedEmployees, employee.id]);
                    } else {
                      onEmployeesChange(selectedEmployees.filter(id => id !== employee.id));
                    }
                  }}
                >
                  {employee.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Teams Dropdown */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipos
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-background hover:bg-muted/50">
                <span className="truncate">
                  {selectedTeams.length === 0 
                    ? "Todos los equipos" 
                    : selectedTeams.length === 1 
                      ? teams.find(team => team.id === selectedTeams[0])?.name || "Seleccionado"
                      : `${selectedTeams.length} seleccionados`
                  }
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto bg-popover">
              <DropdownMenuCheckboxItem
                checked={selectedTeams.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) onTeamsChange([]);
                }}
              >
                Todos los equipos
              </DropdownMenuCheckboxItem>
              {teams.map((team) => (
                <DropdownMenuCheckboxItem
                  key={team.id}
                  checked={selectedTeams.includes(team.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onTeamsChange([...selectedTeams, team.id]);
                    } else {
                      onTeamsChange(selectedTeams.filter(id => id !== team.id));
                    }
                  }}
                >
                  {team.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Estado
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-background hover:bg-muted/50">
                <span className="truncate">
                  {selectedStatuses.length === 0 
                    ? "Todos los estados" 
                    : selectedStatuses.length === 1 
                      ? selectedStatuses[0]
                      : `${selectedStatuses.length} seleccionados`
                  }
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-popover">
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) onStatusesChange([]);
                }}
              >
                Todos los estados
              </DropdownMenuCheckboxItem>
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onStatusesChange([...selectedStatuses, status]);
                    } else {
                      onStatusesChange(selectedStatuses.filter(s => s !== status));
                    }
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Levels Dropdown */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Nivel
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-background hover:bg-muted/50">
                <span className="truncate">
                  {selectedLevels.length === 0 
                    ? "Todos los niveles" 
                    : selectedLevels.length === 1 
                      ? selectedLevels[0]
                      : `${selectedLevels.length} seleccionados`
                  }
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto bg-popover">
              <DropdownMenuCheckboxItem
                checked={selectedLevels.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) onLevelsChange([]);
                }}
              >
                Todos los niveles
              </DropdownMenuCheckboxItem>
              {levels.sort().map((level) => (
                <DropdownMenuCheckboxItem
                  key={level}
                  checked={selectedLevels.includes(level)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onLevelsChange([...selectedLevels, level]);
                    } else {
                      onLevelsChange(selectedLevels.filter(l => l !== level));
                    }
                  }}
                >
                  {level}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedEmployees.length > 0 || selectedTeams.length > 0 || selectedStatuses.length > 0 || selectedLevels.length > 0) && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {selectedEmployees.map((empId) => {
              const employee = employees.find(emp => emp.id === empId);
              return employee ? (
                <Badge key={empId} variant="secondary" className="flex items-center gap-1">
                  {employee.name}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => onEmployeesChange(selectedEmployees.filter(id => id !== empId))}
                  />
                </Badge>
              ) : null;
            })}
            {selectedTeams.map((teamId) => {
              const team = teams.find(t => t.id === teamId);
              return team ? (
                <Badge key={teamId} variant="secondary" className="flex items-center gap-1">
                  {team.name}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => onTeamsChange(selectedTeams.filter(id => id !== teamId))}
                  />
                </Badge>
              ) : null;
            })}
            {selectedStatuses.map((status) => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                {status}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onStatusesChange(selectedStatuses.filter(s => s !== status))}
                />
              </Badge>
            ))}
            {selectedLevels.map((level) => (
              <Badge key={level} variant="secondary" className="flex items-center gap-1">
                {level}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onLevelsChange(selectedLevels.filter(l => l !== level))}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

