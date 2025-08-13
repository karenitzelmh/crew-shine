import Papa from "papaparse";
import type { Employee } from "@/types/employee";

// mapea "Activo/Pending/Hiring" -> active/pending/hiring
const mapStatus = (s: string): Employee["status"] => {
  const v = s?.trim().toLowerCase();
  if (v === "activo" || v === "active") return "active";
  if (v === "pending" || v === "pendiente") return "pending";
  return "hiring";
};

export async function loadEmployees(): Promise<Employee[]> {
  const res = await fetch("/data/employees.csv", { cache: "no-store" });
  if (!res.ok) throw new Error("No pude leer /data/employees.csv");
  const text = await res.text();

  // Tus columnas: Equipo, Posición, Nombre, Levelling, Estatus, avatar_url (opcional)
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data.filter(Boolean);

  // adapta al tipo Employee que ya usa tu app
  const employees: Employee[] = rows.map((r) => ({
    id: crypto.randomUUID(),
    name: (r["Nombre"] || "").trim(),
    photo: (r["avatar_url"] || "").trim() || undefined,   // la UI usa "photo" en mockData
    team: (r["Equipo"] || "").trim().toLowerCase(),       // ej: "AML Ops"
    status: mapStatus(r["Estatus"] || ""),                // active/pending/hiring
    position: (r["Posición"] || "").trim(),
    startDate: (r["startDate"] || "").trim() || undefined, // si luego agregas esta col
    email: (r["email"] || "").trim() || undefined,          // si luego agregas esta col
    level: (r["Levelling"] || "").trim() || undefined,      // si tu tipo la incluye
  }));

  return employees;
}
