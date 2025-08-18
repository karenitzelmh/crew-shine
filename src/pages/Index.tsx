// src/pages/Index.tsx
import { useEffect, useMemo, useState } from "react";
import { Employee, Team, EmployeeStats } from "@/types/employee";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { TeamSection } from "@/components/TeamSection";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import {
  fetchEmployees,
  addEmployee,
  updateEmployeeStatus,
  updateEmployeeTeam,
  updateEmployee,
  deleteEmployee,
} from "@/services/employees";
import { TeamSummaryCards } from "@/components/TeamSummaryCards";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
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
          if (!mounted) return;
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
    const names = Array.from(
      new Set(
        employees
          .map((e) => (e.team || "").trim())
          .filter((v) => v && v.length > 0)
      )
    );
    const palette = ["#8A05BE", "#B64ACB", "#6D28D9", "#9333EA", "#7C3AED", "#5B21B6", "#A855F7"];
    return names.map((name, i) => ({ id: name, name, color: palette[i % palette.length] }));
  }, [employees]);

  // Levels y conteos por nivel
  const levels = useMemo(() => {
    return Array.from(
      new Set(
        employees
          .map((e) => (e.level || "").trim())
          .filter((v) => v && v.length > 0)
      )
    ).sort();
  }, [employees]);

  const byLevel: Record<string, number> = useMemo(() => {
    const m: Record<string, number> = {};
    levels.forEach((lvl) => {
      m[lvl] = employees.filter((e) => (e.level || "").trim() === lvl).length;
    });
    return m;
  }, [employees, levels]);

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
      const okTeam = selectedTeams.length === 0 || selectedTeams.includes(employee.team);
      const okStatus = selectedStatuses.length === 0 || selectedStatuses.includes(employee.status);
      const okLevel = selectedLevels.length === 0 || selectedLevels.includes(employee.level);
      const okEmployee = selectedEmployees.length === 0 || selectedEmployees.includes(employee.id);
      return okTeam && okStatus && okLevel && okEmployee;
    });
  }, [employees, selectedTeams, selectedStatuses, selectedLevels, selectedEmployees]);

  // Agrupar por team
  const employeesByTeam = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    teams.forEach((team) => {
      groups[team.id] = filteredEmployees.filter((emp) => emp.team === team.id);
    });
    return groups;
  }, [filteredEmployees, teams]);

  // Handlers (DB first; realtime actualiza a todos)
  const handleAddEmployee = async (newEmployee: Omit<Employee, "id">) => {
    await addEmployee(newEmployee);
    toast({ title: "Employee added", description: `${newEmployee.name} joined the org` });
  };

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

  const handleEditEmployee = async (emp: Employee, updates: Partial<Pick<Employee, "name" | "position" | "level">>) => {
    await updateEmployee(emp.id, updates);
    toast({ 
      title: "Employee updated", 
      description: `${updates.name || emp.name} information updated` 
    });
  };

  const handleDeleteEmployee = async (emp: Employee) => {
    if (confirm(`Are you sure you want to delete ${emp.name}?`)) {
      await deleteEmployee(emp.id);
      toast({ 
        title: "Employee deleted", 
        description: `${emp.name} has been removed from the system` 
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

        {/* Team Summary */}
        <TeamSummaryCards teams={teams} employees={employees} />

        {/* Filters */}
        <div className="mt-8">
          <FilterBar
            teams={teams}
            employees={employees}
            selectedTeams={selectedTeams}
            selectedStatuses={selectedStatuses}
            selectedLevels={selectedLevels}
            selectedEmployees={selectedEmployees}
            onTeamsChange={setSelectedTeams}
            onStatusesChange={setSelectedStatuses}
            onLevelsChange={setSelectedLevels}
            onEmployeesChange={setSelectedEmployees}
          />
        </div>

        {/* Teams - Horizontal Layout */}
        <div className="flex gap-4 mt-6 overflow-x-auto pb-4"
             style={{
               maskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
               WebkitMaskImage: "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)"
             }}
        >
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
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployee}
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
                <li>• <strong>Levelling:</strong> Filter by M1/M2/M3… and see counts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

