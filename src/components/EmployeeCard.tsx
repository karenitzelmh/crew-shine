import { Employee } from "@/types/employee";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import React from "react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]!.toUpperCase())
    .join("");
}

function statusBadgeClass(status: Employee["status"]) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Hiring":
      return "bg-blue-100 text-blue-700";
    case "Backfill":
    default:
      return "bg-[hsl(283_95%_96%)] text-[hsl(283_95%_38%)]"; // Nubank-ish purple
  }
}

export function EmployeeCard({
  e,
  onClick,
  onStatusChange,
  onDragStart,
}: {
  e: Employee;
  onClick?: (e: Employee) => void;
  onStatusChange?: (e: Employee, next: Employee["status"]) => void;
  onDragStart?: (ev: React.DragEvent, emp: Employee) => void;
}) {
  return (
    <div
      className="min-w-[300px] snap-start rounded-2xl p-4 shadow bg-white border hover:shadow-lg transition"
      draggable={!!onDragStart}
      onDragStart={(ev) => onDragStart?.(ev, e)}
      onClick={() => onClick?.(e)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {e.photo ? (
          <img
            src={e.photo}
            alt={e.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(img) => {
              // oculta imagen rota y muestra fallback
              (img.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
            {initials(e.name)}
          </div>
        )}

        {/* Body */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{e.name}</h4>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${statusBadgeClass(
                e.status
              )}`}
            >
              {e.status}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">{e.position}</div>
          {e.level && (
            <div className="text-xs mt-1 text-foreground/70">
              Level: <span className="font-medium">{e.level}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded hover:bg-accent">
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange?.(e, "Active")}>
              Set status: Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(e, "Pending")}>
              Set status: Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(e, "Hiring")}>
              Set status: Hiring
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange?.(e, "Backfill")}>
              Set status: Backfill
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default EmployeeCard;
