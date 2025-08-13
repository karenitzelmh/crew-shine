import { useState } from "react";
import { Employee, Team } from "@/types/employee";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddEmployeeDialogProps {
  teams: Team[];
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
}

export const AddEmployeeDialog = ({ teams, onAddEmployee }: AddEmployeeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    team: '',
    status: 'Activo' as const,
    photo: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.team) {
      onAddEmployee({
        ...formData,
        photo: formData.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`
      });
      setFormData({
        name: '',
        email: '',
        position: '',
        team: '',
        status: 'Activo',
        photo: '',
        startDate: new Date().toISOString().split('T')[0]
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground hover:shadow-hover transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Empleado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Juan Pérez"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="juan.perez@empresa.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Posición</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Desarrollador Senior"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Equipo</Label>
            <Select value={formData.team} onValueChange={(value) => setFormData(prev => ({ ...prev, team: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar equipo" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Estatus</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Hiring">Hiring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photo">URL de Foto (opcional)</Label>
            <Input
              id="photo"
              value={formData.photo}
              onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          
          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground">
            Añadir Empleado
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};