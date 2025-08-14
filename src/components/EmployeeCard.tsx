import React, { useState } from "react";
import { Employee } from "@/types/employee";
import { MoreVertical } from "lucide-react";
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
  compact = true, // 👈 por defecto compacta
  onClick,
  onStatusChange,
  onDragStart,
}: {
  e: Employee;
  compact?: boolean;
  onClick?: (e: Employee) => void;
  onStatusChange?: (e: Employee, next: Employee["status"]) => void;
  onDragStart?: (ev: React.DragEvent, emp: Employee) => void;
}) {
  const [showImg, setShowImg] = useState<boolean>(!!e.photo);

  const minWidth = compact ? "min-w-[260px]" : "min-w-[320px]";
  const padding = compact ? "p-3" : "p-4";
  const avatar = compact ? "w-10 h-10" : "w-12 h-12";
  const nameCls = compact ? "text-sm font-medium" : "font-medium";
  const roleCls = compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground";
  const levelCls = "text-[11px] mt-1 text-foreground/70";

  return (
    <div
      className={`${minWidth} shrink-0 snap-start select-none rounded-2xl ${padding} shadow bg-white border hover:shadow-lg transition`}
      draggable={!!onDragStart}
      onDragStart={(ev) => onDragStart?.(ev, e)}
      onClick={() => onClick?.(e)}
      role="listitem"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {showImg && e.photo ? (
          <img
            src={e.photo}
            alt={e.name}
            className={`${avatar} rounded-full object-cover`}
            onError={() => setShowImg(false)}
          />
        ) : (
          <div className={`${avatar} rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold`}>
            {initials(e.name)}
          </div>
        )}

        {/* Body */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={nameCls}>{e.name}</h4>
            <span className={`text-[11px] px-2 py-[2px] rounded-full ${statusBadgeClass(e.status)}`}>
              {e.status}
            </span>
          </div>
          <div className={roleCls}>{e.position}</div>
          {e.level && (
            <div className={levelCls}>
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
            <DropdownMenuItem onClick={(ev) => { ev.stopPropagation(); onStatusChange?.(e, "Active"); }}>
              Set status: Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(ev) => { ev.stopPropagation(); onStatusChange?.(e, "Pending"); }}>
              Set status: Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(ev) => { ev.stopPropagation(); onStatusChange?.(e, "Hiring"); }}>
              Set status: Hiring
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(ev) => { ev.stopPropagation(); onStatusChange?.(e, "Backfill"); }}>
              Set status: Backfill
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default EmployeeCard;

