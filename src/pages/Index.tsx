import { useEffect, useMemo, useState } from "react";
import { Employee, Team, EmployeeStats } from "@/types/employee";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { TeamSection } from "@/components/TeamSection";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import {
  fetchEmployees,
  addEmployee,
  updateEmployeeStatus,
  updateEmployeeTeam,
  deleteEmployee, // 👈 nuevo
} from "@/services/employees";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Load data + Realtime
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchEmployees();
        if (mounted) setEmployees(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();

    const channel = supabase
      .channel("realtime-employees")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        async () => {
          const data = await fetchEmployees();
          if (mounted) setEmployees(data);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
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

  // Filters
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

  // Group by team
  const employeesByTeam = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    teams.forEach((team) => {
      groups[team.id] = filteredEmployees.filter((emp) => emp.team === team.id);
    });
    return groups;
  }, [filteredEmployees, teams]);

  // Add
  const handleAddEmployee = async (newEmployee: Omit<Employee, "id">) => {
    await addEmployee(newEmployee);
    toast({ title: "Employee added", description: `${newEmployee.name} joined the org` });
  };

  // Status change
  const handleStatusChange = async (emp: Employee, next: Employee["status"]) => {
    await updateEmployeeStatus(emp.id, next);
    toast({ title: "Status updated", description: `${emp.name} is now ${next}` });
  };

  // Click to cycle: Active → Pending → Hiring → Backfill → Active
  const handleEmployeeClick = async (employee: Employee) => {
    const order: Employee["status"][] = ["Active", "Pending", "Hiring", "Backfill"];
    const next = order[(order.indexOf(employee.status) + 1) % order.length];
    await handleStatusChange(employee, next);
  };

  // Drag + Drop (team move)
  const handleDragStart = (e: React.DragEvent, employee: Employee) => {
    e.dataTransfer.setData("application/json", JSON.stringify(employee));
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, newTeamId: string) => {
    e.preventDefault();
    const employeeData: Employee = JSON.parse(e.dataTransfer.getData("application/json"));
    if (employeeData.team !== newTeamId) {
      await updateEmployeeTeam(employeeData.id, newTeamId);
      toast({ title: "Employee moved", description: `${employeeData.name} → ${newTeamId}` });
    }
  };

  // Delete
  const handleDelete = async (emp: Employee) => {
    try {
      await deleteEmployee(emp.id); // Realtime actualizará a todos
      toast({ title: "Employee deleted", description: emp.name });
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        description: "Please try again",
        variant: "destructive",
      });
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
              onStatusChange={handleStatusChange}
              onDelete={handleDelete} // 👈 pasa delete
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
