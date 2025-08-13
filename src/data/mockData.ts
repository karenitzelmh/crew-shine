import { Employee, Team } from "@/types/employee";

export const mockTeams: Team[] = [
  { id: "desarrollo", name: "Desarrollo", color: "#3B82F6" },
  { id: "diseno", name: "Diseño", color: "#8B5CF6" },
  { id: "marketing", name: "Marketing", color: "#10B981" },
  { id: "ventas", name: "Ventas", color: "#F59E0B" },
  { id: "rrhh", name: "Recursos Humanos", color: "#EF4444" },
];

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Ana García",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    team: "desarrollo",
    status: "active",
    position: "Desarrolladora Frontend",
    startDate: "2023-01-15",
    email: "ana.garcia@empresa.com"
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    team: "desarrollo",
    status: "active",
    position: "Desarrollador Backend",
    startDate: "2022-11-03",
    email: "carlos.rodriguez@empresa.com"
  },
  {
    id: "3",
    name: "María López",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    team: "diseno",
    status: "active",
    position: "Diseñadora UX/UI",
    startDate: "2023-03-10",
    email: "maria.lopez@empresa.com"
  },
  {
    id: "4",
    name: "Juan Martínez",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    team: "marketing",
    status: "pending",
    position: "Especialista en Marketing Digital",
    startDate: "2024-01-08",
    email: "juan.martinez@empresa.com"
  },
  {
    id: "5",
    name: "Laura Sánchez",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
    team: "ventas",
    status: "active",
    position: "Gerente de Ventas",
    startDate: "2021-09-20",
    email: "laura.sanchez@empresa.com"
  },
  {
    id: "6",
    name: "David Torres",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    team: "desarrollo",
    status: "inactive",
    position: "DevOps Engineer",
    startDate: "2022-06-12",
    email: "david.torres@empresa.com"
  },
  {
    id: "7",
    name: "Elena Ruiz",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    team: "rrhh",
    status: "active",
    position: "Especialista en RRHH",
    startDate: "2023-02-28",
    email: "elena.ruiz@empresa.com"
  },
  {
    id: "8",
    name: "Roberto Jiménez",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
    team: "diseno",
    status: "pending",
    position: "Diseñador Gráfico",
    startDate: "2024-01-15",
    email: "roberto.jimenez@empresa.com"
  }
];