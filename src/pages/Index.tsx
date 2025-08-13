import { useState, useMemo } from "react";
import { Employee, Team, EmployeeStats } from "@/types/employee";
import { mockEmployees, mockTeams } from "@/data/mockData";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { TeamSection } from "@/components/TeamSection";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { useToast } from "@/hooks/use-toast";
import { BuildingIcon, Users2 } from "lucide-react";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Calculate statistics
  const stats: EmployeeStats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const pending = employees.filter(e => e.status === 'pending').length;
    const inactive = employees.filter(e => e.status === 'inactive').length;
    
    const byTeam: Record<string, number> = {};
    mockTeams.forEach(team => {
      byTeam[team.id] = employees.filter(e => e.team === team.id).length;
    });

    return { total, active, pending, inactive, byTeam };
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesTeam = selectedTeam === "all" || employee.team === selectedTeam;
      const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus;
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesTeam && matchesStatus && matchesSearch;
    });
  }, [employees, selectedTeam, selectedStatus, searchTerm]);

  // Group employees by team
  const employeesByTeam = useMemo(() => {
    const groups: Record<string, Employee[]> = {};
    mockTeams.forEach(team => {
      groups[team.id] = filteredEmployees.filter(emp => emp.team === team.id);
    });
    return groups;
  }, [filteredEmployees]);

  // Drag and drop handlers
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
        emp.id === employeeData.id 
          ? { ...emp, team: newTeamId }
          : emp
      ));
      
      const teamName = mockTeams.find(t => t.id === newTeamId)?.name;
      toast({
        title: "Empleado transferido",
        description: `${employeeData.name} ha sido movido a ${teamName}`,
      });
    }
  };

  // Add new employee
  const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
    };
    
    setEmployees(prev => [...prev, employee]);
    toast({
      title: "Empleado añadido",
      description: `${employee.name} ha sido añadido al equipo`,
    });
  };

  // Handle employee click for status change
  const handleEmployeeClick = (employee: Employee) => {
    const statusCycle = {
      'active': 'pending',
      'pending': 'inactive', 
      'inactive': 'active'
    } as const;
    
    const newStatus = statusCycle[employee.status];
    
    setEmployees(prev => prev.map(emp => 
      emp.id === employee.id 
        ? { ...emp, status: newStatus }
        : emp
    ));
    
    toast({
      title: "Estatus actualizado",
      description: `${employee.name} ahora está ${newStatus}`,
    });
  };

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
          <AddEmployeeDialog teams={mockTeams} onAddEmployee={handleAddEmployee} />
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <FilterBar
          teams={mockTeams}
          selectedTeam={selectedTeam}
          selectedStatus={selectedStatus}
          searchTerm={searchTerm}
          onTeamChange={setSelectedTeam}
          onStatusChange={setSelectedStatus}
          onSearchChange={setSearchTerm}
        />

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockTeams.map((team) => (
            <TeamSection
              key={team.id}
              team={team}
              employees={employeesByTeam[team.id]}
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
                <li>• <strong>Cambiar estatus:</strong> Haz clic en una tarjeta de empleado para cambiar su estatus</li>
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
