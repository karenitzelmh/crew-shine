import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Employee, Team, EmployeeStats } from "@/types/employee";
import { loadEmployees } from "@/data/loadEmployees"; // tu loader que lee /data/employees.csv
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { TeamSection } from "@/components/TeamSection";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { useToast } from "@/hooks/use-toast";
import { BuildingIcon, Users2 } from "lucide-react";

const Index = () => {
  // 1) Fetch CSV
  const { data: fetched = [], isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: loadEmployees,
  });

  // 2) Local state (drag&drop & add)
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => setEmployees(fetched), [fetched]);

  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // 3) Build teams dynamically (purple palette)
  const teams: Team[] = useMemo(() => {
    const names = Array.from(new Set(employees.map((e) => e.team))).filter(Boolean);
    const palette = ["#8A05BE", "#B64ACB", "#6D28D9", "#9333EA", "#7C3AED", "#5B21B6", "#A855F7"];
    return names.map((name, i) => ({ id: name, name, color: palette[i % palette.length] }));
  }, [employees]);

  // 4) KPIs (English statuses, includes Backfill)
  const stats: EmployeeStats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "Active").length;
    const pending = employees.filter((e) => e.status === "Pending").length;
    const hiring = employees.filter((e) => e.status === "Hiring").length;
    const backfill = employees.filter((e) => e.status === "Backfill").length;

    const byTeam: Record<string, number> = {};
    teams.forEach((team) => {
      byTeam[team.id] = employees.filter((e) => e.team === team.id).length;
    });

    return { total, active, pending, hiring, backfill, byTeam };
  }, [employees, teams]);

  // 5) Filters (no email/startDate)
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesTeam = selectedTeam === "all" || employee.team === selectedTeam;
      const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus;
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTeam && matchesStatus && matchesSearch;
    });
  }, [employees, selectedTeam, selectedStatus, searchTerm]);

  // 6) Group by team
  const employeesByTeam = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    teams.forEach((team) => {
      groups[team.id] = filteredEmployees.filter((emp) => emp.team === team.id);
    });
    return groups;
  }, [filteredEmployees, teams]);

  // 7) Drag & Drop
  const handleDragStart = (e: React.DragEvent, employee: Employee) => {
    e.dataTransfer.setData("application/json", JSON.stringify(employee));
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent, newTeamId: string) => {
    e.preventDefault();
    const employeeData = JSON.parse(e.dataTransfer.getData("application/json"));
    if (employeeData.team !== newTeamId) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === employeeData.id ? { ...emp, team: newTeamId } : emp))
      );
      const teamName = teams.find((t) => t.id === newTeamId)?.name;
      toast({
        title: "Employee moved",
        description: `${employeeData.name} → ${teamName}`,
      });
    }
  };

  // 8) Add employee
  const handleAddEmployee = (newEmployee: Omit<Employee, "id">) => {
    const employee: Employee = { ...newEmployee, id: Date.now().toString() };
    setEmployees((prev) => [...prev, employee]);
    toast({
      title: "Employee added",
      description: `${employee.name} joined the org`,
    });
  };

  // 9) Change status (dropdown or click cycle)
  const handleStatusChange = (emp: Employee, next: Employee["status"]) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, status: next } : e)));
    toast({
      title: "Status updated",
      description: `${emp.name} is now ${next}`,
    });
  };

  // Click to cycle: Active → Pending → Hiring → Backfill → Active
  const handleEmployeeClick = (employee: Employee) => {
    const order: Employee["status"][] = ["Active", "Pending", "Hiring", "Backfill"];
    const idx = order.indexOf(employee.status);
    const next = order[(idx + 1) % order.length];
    handleStatusChange(employee, next);
  };

  if (isLoading) return <div className="p-6">Loading employees…</div>;
  if (error) return <div className="p-6">Failed to load CSV</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-primary rounded-lg">
              <BuildingIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Headcount Dashboard</h1>
              <p className="text-muted-foreground">Manage employees by team and status</p>
            </div>
          </div>
          <AddEmployeeDialog teams={teams} onAddEmployee={handleAddEmployee} />
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <FilterBar
          teams={teams}
          selectedTeam={selectedTeam}
          selectedStatus={selectedStatus}
          searchTerm={searchTerm}
          onTeamChange={setSelectedTeam}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchTerm}
        />

        {/* Teams (each section is horizontal inside) */}
        <div className="grid gap-6">
          {teams.map((team) => (
            <TeamSection
              key={team.id}
              team={team}
              employees={employeesByTeam[team.id] || []}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onEmployeeClick={handleEmployeeClick}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-card rounded-lg p-6 shadow-card border-0">
          <div className="flex items-start space-x-3">
            <Users2 className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">How to use:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Drag & drop:</strong> Move employees across teams</li>
                <li>• <strong>Click card:</strong> Cycle status (Active → Pending → Hiring → Backfill)</li>
                <li>• <strong>Dropdown menu:</strong> Set a specific status</li>
                <li>• <strong>Filters:</strong> Search by name or role</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
