export interface Employee {
  id: string;
  name: string;
  photo: string;
  team: string;
  status: 'Active' | 'Pending' | 'Hiring' | 'Backfill';
  position: string;
  level: string; // e.g., "M2.IC4"
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
  backfill: number;
  byTeam: Record<string, number>;
}
