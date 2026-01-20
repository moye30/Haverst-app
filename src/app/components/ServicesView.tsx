import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Scissors, Plus, Search, Clock, DollarSign } from 'lucide-react';
import { Service } from '../types';

interface ServicesViewProps {
  services: Service[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
}

export function ServicesView({ services, onAddService, onUpdateService }: ServicesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];
  
  const activeServices = services.filter(s => s.isActive);
  const avgPrice = activeServices.reduce((sum, s) => sum + s.price, 0) / activeServices.length;
  const avgDuration = activeServices.reduce((sum, s) => sum + s.duration, 0) / activeServices.length;

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Servicios</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Servicio</DialogTitle>
            </DialogHeader>
            <ServiceForm
              onSubmit={(service) => {
                onAddService(service);
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <Scissors className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-lg font-bold">{activeServices.length}</p>
          <p className="text-xs text-gray-500">Activos</p>
        </Card>
        <Card className="p-3 text-center">
          <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold">${Math.round(avgPrice)}</p>
          <p className="text-xs text-gray-500">Promedio</p>
        </Card>
        <Card className="p-3 text-center">
          <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold">{Math.round(avgDuration)}</p>
          <p className="text-xs text-gray-500">min</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar servicios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat === 'all' ? 'Todos' : cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Services List */}
      <div className="space-y-2">
        {filteredServices.length > 0 ? (
          filteredServices
            .sort((a, b) => {
              if (a.isActive !== b.isActive) return b.isActive ? 1 : -1;
              return a.category.localeCompare(b.category);
            })
            .map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={() => setEditingService(service)}
                onToggleActive={() => onUpdateService(service.id, { isActive: !service.isActive })}
              />
            ))
        ) : (
          <Card className="p-8 text-center">
            <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No se encontraron servicios</p>
          </Card>
        )}
      </div>

      {/* Edit Service Dialog */}
      {editingService && (
        <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Servicio</DialogTitle>
            </DialogHeader>
            <ServiceForm
              initialData={editingService}
              onSubmit={(updates) => {
                onUpdateService(editingService.id, updates);
                setEditingService(null);
              }}
              onCancel={() => setEditingService(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ServiceCard({ service, onEdit, onToggleActive }: any) {
  return (
    <Card className={`p-4 ${!service.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{service.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {service.category}
            </Badge>
            {!service.isActive && (
              <Badge variant="outline" className="text-xs">
                Inactivo
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{service.description}</p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold">${service.price}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{service.duration} min</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Editar
          </Button>
          <Button
            size="sm"
            variant={service.isActive ? 'outline' : 'default'}
            onClick={onToggleActive}
          >
            {service.isActive ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ServiceForm({ initialData, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    isActive: true
  });

  const categories = ['Corte', 'Color', 'Tratamiento', 'Uñas', 'Peinado', 'Maquillaje', 'Facial', 'Depilación'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.duration) return;

    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre del Servicio *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Corte Dama"
          required
        />
      </div>

      <div>
        <Label>Categoría *</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Precio *</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <Label>Duración (min) *</Label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="60"
            required
          />
        </div>
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del servicio..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Servicio activo</Label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {initialData ? 'Guardar Cambios' : 'Agregar Servicio'}
        </Button>
      </div>
    </form>
  );
}
