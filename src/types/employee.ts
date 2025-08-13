export interface Employee {
  id: string;
  name: string;
  photo: string;
  team: string;
  status: 'Activo' | 'Pending' | 'Hiring';
  position: string;
  startDate: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  pending: number;
  hiring: number;
  byTeam: Record<string, number>;
}