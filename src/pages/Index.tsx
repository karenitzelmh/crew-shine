// src/pages/Index.tsx
import { useEffect, useMemo, useState } from "react";
import { Employee, Team, EmployeeStats } from "@/types/employee";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { TeamSection } from "@/components/TeamSection";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users2 } from "lucide-react";
import { loadEmployees } from "@/data/loadEmployees";

// ID simple para nuevos empleados (local, sin backend)
const genId = (name: string, team: string) =>
  `${(name || "emp").trim().toLowerCase().replace(/\s+/g, "-")}-${(team || "team")
    .trim()
    .toLowerCase()}-${Date.now().toString(36).slice(4)}${Math.random().toString(36).slice(2, 6)}`;

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Carga desde CSV (src/data/employees.csv)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await loadEmployees();
        if (mounted) setEmployees(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Teams (purple palette)
  const teams: Team[] = useMemo(() => {
    const names = Array.from(new Set(employees.map((e) => e.team))).filter(Boolean);
    const palette = ["#8A05BE", "#B64ACB", "#6D28D9", "#9333EA", "#7C3AED", "#5B21B6", "#A855F7"];
    return names.map((name, i) => ({ id: name, name, color: palette[i % palette.length] }));
  }, [employees]);

  // KPIs
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

  // Filtros
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const okTeam = selectedTeam === "all" || employee.team === selectedTeam;
      const okStatus = selectedStatus === "all" || employee.status === selectedStatus;
      const okSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      return okTeam && okStatus && okSearch;
    });
  }, [employees, selectedTeam, selectedStatus, searchTerm]);

  // Agrupar por team
  const employeesByTeam = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    teams.forEach((team) => {
      groups[team.id] = filteredEmployees.filter((emp) => emp.team === team.id);
    });
    return groups;
  }, [filteredEmployees, teams]);

  // --- Handlers (todo local; sin backend) ---

  const handleAddEmployee = async (newEmployee: Omit<Employee, "id">) => {
    const withId: Employee = { ...newEmployee, id: genId(newEmployee.name, newEmployee.team) };
    setEmployees((prev) => [...prev, withId]);
    toast({ title: "Employee added", description: `${newEmployee.name} joined the org` });
  };

  const handleStatusChange = async (id: string, next: Employee["status"]) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status: next } : e)));
    const emp = employees.find((e) => e.id === id);
    if (emp) toast({ title: "Status updated", description: `${emp.name} is now ${next}` });
  };

  // Click to cycle: Active → Pending → Hiring → Backfill → Active
  const handleEmployeeClick = async (employee: Employee) => {
    const order: Employee["status"][] = ["Active", "Pending", "Hiring", "Backfill"];
    const next = order[(order.indexOf(employee.status) + 1) % order.length];
    await handleStatusChange(employee.id, next);
  };

  const handleDragStart = (e: React.DragEvent, employee: Employee) => {
    e.dataTransfer.setData("application/json", JSON.stringify(employee));
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent, newTeamId: string) => {
    e.preventDefault();
    const employeeData: Employee = JSON.parse(e.dataTransfer.getData("application/json"));
    if (employeeData.team !== newTeamId) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === employeeData.id ? { ...emp, team: newTeamId } : emp))
      );
      toast({ title: "Employee moved", description: `${employeeData.name} → ${newTeamId}` });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-primary rounded-lg">
              <Building2 className="h-8 w-8 text-primary-foreground" />
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

        {/* Teams */}
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
              onStatusChange={(emp, next) => handleStatusChange(emp.id, next)}
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

