import { Team } from "@/types/employee";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  teams: Team[];
  selectedTeams: string[];
  selectedStatuses: string[];
  searchTerm: string;
  onTeamsChange: (teams: string[]) => void;
  onStatusesChange: (statuses: string[]) => void;
  onSearchChange: (search: string) => void;
}

export const FilterBar = ({
  teams,
  selectedTeams,
  selectedStatuses,
  searchTerm,
  onTeamsChange,
  onStatusesChange,
  onSearchChange,
}: FilterBarProps) => {
  return (
    <div className="bg-gradient-card rounded-lg p-4 shadow-card border-0 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-semibold text-foreground">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or role…"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Team */}
        <div className="space-y-2">
          <Label>Teams</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto bg-background rounded-md border p-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-teams"
                checked={selectedTeams.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onTeamsChange([]);
                  }
                }}
              />
              <Label htmlFor="all-teams" className="text-sm font-normal">
                All teams
              </Label>
            </div>
            {teams.map((team) => (
              <div key={team.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`team-${team.id}`}
                  checked={selectedTeams.includes(team.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onTeamsChange([...selectedTeams, team.id]);
                    } else {
                      onTeamsChange(selectedTeams.filter(t => t !== team.id));
                    }
                  }}
                />
                <Label htmlFor={`team-${team.id}`} className="text-sm font-normal">
                  {team.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto bg-background rounded-md border p-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-statuses"
                checked={selectedStatuses.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onStatusesChange([]);
                  }
                }}
              />
              <Label htmlFor="all-statuses" className="text-sm font-normal">
                All statuses
              </Label>
            </div>
            {["Active", "Pending", "Hiring", "Backfill"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onStatusesChange([...selectedStatuses, status]);
                    } else {
                      onStatusesChange(selectedStatuses.filter(s => s !== status));
                    }
                  }}
                />
                <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

