import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Search, Plus, Phone, Mail, Calendar, DollarSign, Cake, Heart, History } from 'lucide-react';
import { Client, ServiceHistory } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientsViewProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
}

export function ClientsView({ clients, onAddClient }: ClientsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientas</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Clienta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Clienta</DialogTitle>
            </DialogHeader>
            <AddClientForm
              onSubmit={(client) => {
                onAddClient(client);
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">{clients.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-green-600">
            {clients.filter(c => {
              const lastVisit = new Date(c.lastVisit);
              const daysSince = Math.floor((Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
              return daysSince <= 30;
            }).length}
          </p>
          <p className="text-xs text-gray-500">Activas</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(clients.reduce((sum, c) => sum + c.totalVisits, 0) / clients.length)}
          </p>
          <p className="text-xs text-gray-500">Promedio</p>
        </Card>
      </div>

      {/* Clients List */}
      <div className="space-y-2">
        {filteredClients.length > 0 ? (
          filteredClients
            .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
            .map(client => (
              <Card
                key={client.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{client.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Phone className="w-3 h-3" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">${client.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{client.totalVisits} visitas</p>
                  </div>
                </div>
              </Card>
            ))
        ) : (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No se encontraron clientas</p>
          </Card>
        )}
      </div>

      {/* Client Details Dialog */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <ClientDetails client={selectedClient} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ClientDetails({ client }: { client: Client }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
          {client.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
            {client.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{client.email}</span>
              </div>
            )}
            {client.birthday && (
              <div className="flex items-center gap-1">
                <Cake className="w-4 h-4" />
                <span>{format(new Date(client.birthday), 'd MMM', { locale: es })}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold">{client.totalVisits}</p>
          <p className="text-xs text-gray-500">Visitas</p>
        </Card>
        <Card className="p-3 text-center">
          <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold">${client.totalSpent.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total gastado</p>
        </Card>
        <Card className="p-3 text-center">
          <Heart className="w-6 h-6 text-pink-500 mx-auto mb-1" />
          <p className="text-lg font-bold">${Math.round(client.totalSpent / client.totalVisits)}</p>
          <p className="text-xs text-gray-500">Promedio</p>
        </Card>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-3 mt-4">
          <div>
            <Label className="text-xs text-gray-500">Última Visita</Label>
            <p className="font-medium">
              {format(new Date(client.lastVisit), "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
          </div>

          {client.notes && (
            <div>
              <Label className="text-xs text-gray-500">Notas</Label>
              <Card className="p-3 bg-yellow-50 border-yellow-200">
                <p className="text-sm">{client.notes}</p>
              </Card>
            </div>
          )}

          {client.preferences.length > 0 && (
            <div>
              <Label className="text-xs text-gray-500 mb-2 block">Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                {client.preferences.map((pref, idx) => (
                  <Badge key={idx} variant="secondary">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-4">
          {client.history.length > 0 ? (
            client.history
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(record => (
                <HistoryCard key={record.id} record={record} />
              ))
          ) : (
            <Card className="p-8 text-center">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Sin historial de servicios</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-3 mt-4">
          {client.preferences.length > 0 ? (
            <div className="space-y-2">
              {client.preferences.map((pref, idx) => (
                <Card key={idx} className="p-3">
                  <p className="font-medium">{pref}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Sin preferencias registradas</p>
            </Card>
          )}

          {client.notes && (
            <div>
              <Label className="text-xs text-gray-500 mb-2 block">Notas Especiales</Label>
              <Card className="p-3 bg-blue-50 border-blue-200">
                <p className="text-sm">{client.notes}</p>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HistoryCard({ record }: { record: ServiceHistory }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold">
            {format(new Date(record.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
          <p className="text-sm text-gray-500">{record.services.join(', ')}</p>
        </div>
        <p className="font-semibold text-green-600">${record.total}</p>
      </div>
      {record.notes && (
        <p className="text-sm text-gray-600 mt-2 italic">"{record.notes}"</p>
      )}
    </Card>
  );
}

function AddClientForm({ onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    notes: '',
    preferences: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    onSubmit({
      ...formData,
      preferences: formData.preferences ? formData.preferences.split(',').map(p => p.trim()) : [],
      lastVisit: format(new Date(), 'yyyy-MM-dd'),
      totalVisits: 0,
      totalSpent: 0,
      history: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre completo *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: María González"
          required
        />
      </div>

      <div>
        <Label>Teléfono *</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Ej: +52 555-0101"
          required
        />
      </div>

      <div>
        <Label>Email (opcional)</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="ejemplo@email.com"
        />
      </div>

      <div>
        <Label>Fecha de nacimiento (opcional)</Label>
        <Input
          type="date"
          value={formData.birthday}
          onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
        />
      </div>

      <div>
        <Label>Preferencias (separadas por comas)</Label>
        <Input
          value={formData.preferences}
          onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
          placeholder="Ej: Productos orgánicos, Sin amoniaco"
        />
      </div>

      <div>
        <Label>Notas</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Información relevante sobre la clienta..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={!formData.name || !formData.phone}>
          Guardar Clienta
        </Button>
      </div>
    </form>
  );
}
