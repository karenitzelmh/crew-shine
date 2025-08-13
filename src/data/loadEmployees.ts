// src/data/loadEmployees.ts
import Papa from 'papaparse';

// Importa la URL del CSV desde src/ con Vite:
import employeesUrl from './employees.csv?url';

export type EmployeeStatus = 'Activo' | 'Pending' | 'Hiring' | 'Backfill';

export interface Employee {
  id: string;
  name: string;
  team: string;
  position: string;
  levelling?: string;
  status: EmployeeStatus;
  photo?: string;
  startDate?: string; // mapeado desde "date"
}

const makeId = (name: string, team: string, date?: string) =>
  `${(name || 'emp').trim().toLowerCase().replace(/\s+/g, '-')}-${(team || 'team')
    .trim()
    .toLowerCase()}-${date ? date.replace(/[^0-9]/g, '') : Math.random().toString(36).slice(2, 8)}`;

const normalizeStatus = (s: string): EmployeeStatus => {
  const x = (s || '').trim().toLowerCase();
  if (x === 'activo' || x === 'active') return 'Activo';
  if (x === 'pending' || x === 'pendiente') return 'Pending';
  if (x === 'hiring') return 'Hiring';
  if (x === 'backfill') return 'Backfill';
  return 'Pending';
};

export async function loadEmployees(): Promise<Employee[]> {
  // employeesUrl es una URL estática generada por Vite para src/data/employees.csv
  const res = await fetch(employeesUrl);
  if (!res.ok) throw new Error(`Failed to load CSV: ${res.status}`);
  const csv = await res.text();

  const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });

  return (data as any[]).map((r) => {
    const name = String(r.name || '').trim();
    const team = String(r.team || '').trim();
    const date = r.date ? String(r.date).trim() : undefined;

    return {
      id: makeId(name, team, date),
      name,
      team,
      position: String(r.position || '').trim(),
      levelling: r.levelling ? String(r.levelling).trim() : undefined,
      status: normalizeStatus(String(r.status || '')),
      photo: r.photo ? String(r.photo).trim() : undefined,
      startDate: date, // <- columna "date" del CSV
    } as Employee;
  });
}
