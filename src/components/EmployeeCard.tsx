import React, { useState } from "react";
import { Employee } from "@/types/employee";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

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
  onEdit,
  onDelete,
}: {
  e: Employee;
  onClick?: (e: Employee) => void;
  onStatusChange?: (e: Employee, next: Employee["status"]) => void;
  onDragStart?: (ev: React.DragEvent, emp: Employee) => void;
  onEdit?: (e: Employee, updates: Partial<Pick<Employee, "name" | "position" | "level">>) => void;
  onDelete?: (e: Employee) => void;
}) {
  // Para fallback de avatar si la imagen falla
  const [showImg, setShowImg] = useState<boolean>(!!e.photo);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(e.name);
  const [editPosition, setEditPosition] = useState(e.position);
  const [editLevel, setEditLevel] = useState(e.level || "");

  const handleSaveEdit = () => {
    if (editName.trim() && editPosition.trim()) {
      onEdit?.(e, {
        name: editName.trim(),
        position: editPosition.trim(),
        level: editLevel.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(e.name);
    setEditPosition(e.position);
    setEditLevel(e.level || "");
    setIsEditing(false);
  };

  return (
    <div
      className="
        w-full shrink-0 snap-start select-none
        rounded-xl p-3 shadow bg-white border
        hover:shadow-lg transition relative group
      "
      draggable={!!onDragStart && !isEditing}
      onDragStart={(ev) => onDragStart?.(ev, e)}
      onClick={() => !isEditing && onClick?.(e)}
    >
      {/* Edit button */}
      {onEdit && !isEditing && (
        <button
          onClick={(ev) => {
            ev.stopPropagation();
            setIsEditing(true);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white shadow-sm border opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-10"
        >
          <Edit2 className="w-3 h-3 text-muted-foreground" />
        </button>
      )}

      <div className="flex items-start gap-2">
        {/* Avatar */}
        {showImg && e.photo ? (
          <img
            src={e.photo}
            alt={e.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            onError={() => setShowImg(false)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-xs flex-shrink-0">
            {initials(isEditing ? editName : e.name)}
          </div>
        )}

        {/* Body */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
                className="h-7 text-xs"
                onClick={(e) => e.stopPropagation()}
              />
              <Input
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                placeholder="Position"
                className="h-7 text-xs"
                onClick={(e) => e.stopPropagation()}
              />
              <Input
                value={editLevel}
                onChange={(e) => setEditLevel(e.target.value)}
                placeholder="Level (optional)"
                className="h-7 text-xs"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-1">
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleSaveEdit();
                  }}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Save
                </button>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1 mb-1">
                <h4 className="font-medium text-sm truncate">{e.name}</h4>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusBadgeClass(e.status)} flex-shrink-0`}>
                  {e.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground truncate">{e.position}</div>
              {e.level && (
                <div className="text-xs mt-1 text-foreground/70">
                  Level: <span className="font-medium">{e.level}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded hover:bg-accent flex-shrink-0">
              <MoreVertical className="w-3 h-3" />
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
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onDelete?.(e);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Employee
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default EmployeeCard;

