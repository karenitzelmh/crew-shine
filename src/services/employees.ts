import { supabase } from "@/integrations/supabase/client";
import type { Employee } from "@/types/employee";

/** Lee empleados ordenados por nombre */
export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;

  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    team: r.team,
    position: r.position,
    level: r.levelling ?? "",
    status: r.status as Employee["status"],
    photo: r.photo ?? undefined,
  }));
}

/** Crea un empleado (sin startDate) */
export async function addEmployee(newEmp: Omit<Employee, "id">) {
  const { error } = await supabase.from("employees").insert({
    name: newEmp.name,
    team: newEmp.team,
    position: newEmp.position,
    levelling: newEmp.level ?? "",
    status: newEmp.status,
    photo: newEmp.photo ?? null,
  });
  if (error) throw error;
}

/** Cambia estatus */
export async function updateEmployeeStatus(
  id: string,
  status: Employee["status"]
) {
  const { error } = await supabase.from("employees").update({ status }).eq("id", id);
  if (error) throw error;
}

/** Mueve de equipo */
export async function updateEmployeeTeam(id: string, team: string) {
  const { error } = await supabase.from("employees").update({ team }).eq("id", id);
  if (error) throw error;
}

/** Elimina empleado */
export async function deleteEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) throw error;
}

