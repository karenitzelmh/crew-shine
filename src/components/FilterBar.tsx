import { Team } from "@/types/employee";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  teams: Team[];
  selectedTeam: string;
  selectedStatus: string;
  searchTerm: string;
  onTeamChange: (team: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
}

export const FilterBar = ({
  teams,
  selectedTeam,
  selectedStatus,
  searchTerm,
  onTeamChange,
  onStatusChange,
  onSearchChange
}: FilterBarProps) => {
  return (
    <div className="bg-gradient-card rounded-lg p-4 shadow-card border-0 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-semibold text-foreground">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar empleado</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team-filter">Equipo</Label>
          <Select value={selectedTeam} onValueChange={onTeamChange}>
            <SelectTrigger id="team-filter">
              <SelectValue placeholder="Todos los equipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los equipos</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status-filter">Estatus</Label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Todos los estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estatus</SelectItem>
              <SelectItem value="Activo">Activos</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Hiring">Hiring</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
