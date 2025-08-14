import React, { useState } from "react";
import { Employee } from "@/types/employee";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-[hsl(283_95%_96%)] text-[hsl(283_95%_38%)]";
  }
}

export function EmployeeCard({
  e,
  onClick,
  onStatusChange,
  onDragStart,
  onDelete, // opcional
}: {
  e: Employee;
  onClick?: (e: Employee) => void;
  onStatusChange?: (e: Employee, next: Employee["status"]) => void;
  onDragStart?: (ev: React.DragEvent, emp: Employee) => void;
  onDelete?: (e: Employee) => void;
}) {
  // fallback de avatar si la imagen falla
  const [showImg, setShowImg] = useState<boolean>(!!e.photo);

  return (
    <div
      className="
        min-w-[320px] shrink-0 snap-start select-none
        rounded-2xl p-4 shadow bg-white border
        hover:shadow-lg transition
      "
      draggable={!!onDragStart}
      onDragStart={(ev) => onDragStart?.(ev, e)}
      onClick={() => onClick?.(e)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {showImg && e.photo ? (
          <img
            src={e.photo}
            alt={e.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={() => setShowImg(false)}
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
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadgeClass(e.status)}`}>
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
          <DropdownMenuTrigger className="p-1 rounded hover:bg-accent" onClick={(ev) => ev.stopPropagation()}>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(ev) => {
                ev.stopPropagation();
                onStatusChange?.(e, "Active");
              }}
            >
              Set status: Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(ev) => {
                ev.stopPropagation();
                onStatusChange?.(e, "Pending");
              }}
            >
              Set status: Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(ev) => {
                ev.stopPropagation();
                onStatusChange?.(e, "Hiring");
              }}
            >
              Set status: Hiring
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(ev) => {
                ev.stopPropagation();
                onStatusChange?.(e, "Backfill");
              }}
            >
              Set status: Backfill
            </DropdownMenuItem>

            {/* Delete (opcional) */}
            {onDelete && (
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onDelete(e);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete employee
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Dejamos también el default export por compatibilidad
export default EmployeeCard;
