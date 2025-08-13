import Papa from "papaparse";
import type { Employee } from "@/types/employee";

/**
 * CSV esperado en public/data/employees.csv con encabezados:
 * Equipo, Posición, Nombre, Levelling, Estatus, avatar_url (opcional), email (opcional), startDate (opcional)
 *
 * Mantengo los estatus tal cual ('Activo' | 'Pending' | 'Hiring')
 * para que tu lógica actual (KPIs y ciclo de estatus) funcione sin cambiar nada.
 */
export async function loadEmployees(): Promise<Employee[]> {
  const res = await fetch("/data/employees.csv", { cache: "no-store" });
  if (!res.ok) throw new Error("No pude leer /data/employees.csv");
  const text = await res.text();

  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  return (data || []).filter(Boolean).map((r) => ({
    id: crypto.randomUUID(),
    name: (r["Nombre"] || "").trim(),
    photo: (r["avatar_url"] || "").trim() || undefined,   // ruta tipo /avatars/juan-jimenez.png
    team: (r["Equipo"] || "").trim(),                     // p. ej. 'AML Ops'
    status: (r["Estatus"] || "").trim() as Employee["status"], // 'Activo'|'Pending'|'Hiring'
    position: (r["Posición"] || "").trim(),
    level: (r["Levelling"] || "").trim() || undefined,
    startDate: (r["startDate"] || "").trim() || undefined,
    email: (r["email"] || "").trim() || "",
  })) as Employee[];
}

