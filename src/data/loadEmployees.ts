import Papa from 'papaparse';
import type { Employee } from '@/types/employee';

export async function loadEmployees(): Promise<Employee[]> {
  const response = await fetch('/data/employees.csv');
  const csvText = await response.text();

  const { data } = Papa.parse<Employee>(csvText, {
    header: true,
    skipEmptyLines: true
  });

  return data;
}
