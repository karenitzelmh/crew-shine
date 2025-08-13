import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Employee, Team, EmployeeStats } from "@/types/employee";
// ❌ ya no usamos mockData
// import { mockEmployees, mockTeams } from "@/data/mockData";
import { loadEmployees } from "@/data/loadEmployees";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { TeamSection } from "@/components/TeamSection";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { useToast } from "@/hooks/use-toast";
import { BuildingIcon, Users2 } from "lucide-react";

const Index = () => {
  // 1) Traer CSV
  const { data: fetched = [], isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: loadEmployees,
  });

  // 2) Estado local (para drag&drop y "Añadir empleado")
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => setEmployees(fetched), [fetched]);

  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // 3) Construir equipos desde la data (id=name)
  const teams: Team[] = useMemo(() => {
    const names = Array.from(new Set(employees.map(e => e.team))).filter(Boolean);
    const palette = ["#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444","#06B6D4","#F472B6"];
    return names.map((name, i) => ({ id: name, name, color: palette[i % palette.length] }));
  }, [employees]);

  // 4) KPIs (misma lógica; estatus: 'Activo'|'Pending'|'Hiring')
  const stats: EmployeeStats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Activo').length;
    const pending = employees.filter(e => e.status === 'Pending').length;
    const hiring = employees.filter(e => e.status === 'Hiring').length;

    const byTeam: Record<string, number> = {};
    teams.forEach(team => {
      byTeam[team.id] = employees.filter(e => e.team === team.id).length;
    });

    return { total, active, pending, hiring, byTeam };
  }, [employees, teams]);

  // 5) Filtros
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesTeam = selectedTeam === "all" || employee.team === selectedTeam;
      const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus;
      const email = (employee.email || "").toLowerCase();
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTeam && matchesStatus && matchesSearch;
    });
  }, [employees, selectedTeam, selectedStatus, searchTerm]);

  // 6) Agrupar por equipo
  const employeesByTeam = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    teams.forEach(team => {
      groups[team.id] = filteredEmployees.filter(emp => emp.team === team.id);
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
      setEmployees(prev => prev.map(emp =>
        emp.id === employeeData.id ? { ...emp, team: newTeamId } : emp
      ));
      const teamName = teams.find(t => t.id === newTeamId)?.name;
      toast({
        title: "Empleado transferido",
        description: `${employeeData.name} ha sido movido a ${teamName}`,
      });
    }
  };

  // 8) Añadir empleado (UI)
  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employee: Employee = { ...newEmployee, id: Date.now().toString() };
    setEmployees(prev => [...prev, employee]);
    toast({ title: "Empleado añadido", description: `${employee.name} ha sido añadido al equipo` });
  };

  // 9) Click para ciclo de estatus
  const handleEmployeeClick = (employee: Employee) => {
    const statusCycle = { 'Activo': 'Pending', 'Pending': 'Hiring', 'Hiring': 'Activo' } as const;
    const newStatus = statusCycle[employee.status];
    setEmployees(prev => prev.map(emp => emp.id === employee.id ? { ...emp, status: newStatus } : emp));
    toast({ title: "Estatus actualizado", description: `${employee.name} ahora está ${newStatus}` });
  };

  if (isLoading) return <div className="p-6">Cargando empleados…</div>;
  if (error) return <div className="p-6">Error cargando CSV</div>;

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
              <p className="text-muted-foreground">Gestión de empleados por equipos y estatus</p>
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

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamSection
              key={team.id}
              team={team}
              employees={employeesByTeam[team.id] || []}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onEmployeeClick={handleEmployeeClick}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-card rounded-lg p-6 shadow-card border-0">
          <div className="flex items-start space-x-3">
            <Users2 className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Cómo usar el dashboard:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Arrastrar y soltar:</strong> Mueve empleados entre equipos arrastrando sus tarjetas</li>
                <li>• <strong>Cambiar estatus:</strong> Haz clic en una tarjeta para cambiar su estatus</li>
                <li>• <strong>Filtrar:</strong> Usa los filtros para encontrar empleados específicos</li>
                <li>• <strong>Añadir:</strong> Usa el botón "Añadir Empleado" para agregar nuevos miembros</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
