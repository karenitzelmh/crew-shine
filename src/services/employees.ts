import { supabase } from "@/lib/supabase";
import type { Employee } from "@/types/employee";

export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("id,name,team,position,level,status,photo,start_date")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    team: r.team,
    position: r.position,
    level: r.level ?? '',
    status: r.status as Employee["status"],
    photo: r.photo ?? undefined,
    startDate: r.start_date ?? undefined,
  }));
}

export async function addEmployee(newEmp: Omit<Employee, "id">) {
  const { error } = await supabase.from("employees").insert({
    name: newEmp.name,
    team: newEmp.team,
    position: newEmp.position,
    level: newEmp.level ?? '',
    status: newEmp.status,
    photo: newEmp.photo ?? null,
    start_date: newEmp.startDate ?? null,
  });
  if (error) throw error;
}

export async function updateEmployeeStatus(id: string, status: Employee["status"]) {
  const { error } = await supabase.from("employees").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateEmployeeTeam(id: string, team: string) {
  const { error } = await supabase.from("employees").update({ team }).eq("id", id);
  if (error) throw error;
}

