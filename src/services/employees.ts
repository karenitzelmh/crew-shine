import { supabase } from "@/integrations/supabase/client";
import type { Employee } from "@/types/employee";

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
    level: r.levelling ?? '',
    status: r.status as Employee["status"],
    photo: r.photo ?? undefined,
    startDate: r.date ?? undefined,
  }));
}

export async function addEmployee(newEmp: Omit<Employee, "id">) {
  const { error } = await supabase.from("employees").insert({
    name: newEmp.name,
    team: newEmp.team,
    position: newEmp.position,
    levelling: newEmp.level ?? '',
    status: newEmp.status,
    photo: newEmp.photo ?? null,
    date: newEmp.startDate ?? null,
  });
  if (error) throw error;
}

export async function updateEmployeeStatus(id: string, status: string) {
  const { error } = await supabase.from("employees").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateEmployeeTeam(id: string, team: string) {
  const { error } = await supabase.from("employees").update({ team }).eq("id", id);
  if (error) throw error;
}

export async function updateEmployee(id: string, updates: Partial<Pick<Employee, "name" | "position" | "level">>) {
  const dbUpdates: any = {};
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.position) dbUpdates.position = updates.position;
  if (updates.level) dbUpdates.levelling = updates.level;
  
  const { error } = await supabase.from("employees").update(dbUpdates).eq("id", id);
  if (error) throw error;
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) throw error;
}

