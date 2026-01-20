import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Calendar, Clock, Plus, Search, Filter } from 'lucide-react';
import { Appointment, Client, Service } from '../types';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentsViewProps {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (id: string, appointment: Partial<Appointment>) => void;
}

export function AppointmentsView({ 
  appointments, 
  clients, 
  services,
  onAddAppointment,
  onUpdateAppointment 
}: AppointmentsViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => {
      const matchesDate = apt.date === dateStr;
      const matchesSearch = apt.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
      return matchesDate && matchesSearch && matchesFilter;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Citas</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendar Nueva Cita</DialogTitle>
            </DialogHeader>
            <AddAppointmentForm
              clients={clients}
              services={services}
              onSubmit={(apt) => {
                onAddAppointment(apt);
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre de clienta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('day')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            viewMode === 'day' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'
          }`}
        >
          Día
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            viewMode === 'week' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'
          }`}
        >
          Semana
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'day' ? -1 : -7))}
        >
          Anterior
        </Button>
        <div className="text-center">
          <p className="font-semibold">
            {viewMode === 'day' 
              ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
              : `Semana del ${format(getWeekDays()[0], 'd MMM', { locale: es })}`
            }
          </p>
          <p className="text-xs text-gray-500">{format(selectedDate, 'yyyy')}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'day' ? 1 : 7))}
        >
          Siguiente
        </Button>
      </div>

      {/* Appointments List */}
      {viewMode === 'day' ? (
        <DayView
          date={selectedDate}
          appointments={getAppointmentsForDate(selectedDate)}
          onUpdateAppointment={onUpdateAppointment}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      ) : (
        <WeekView
          weekDays={getWeekDays()}
          appointments={appointments}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          onUpdateAppointment={onUpdateAppointment}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      )}
    </div>
  );
}

function DayView({ 
  date, 
  appointments, 
  onUpdateAppointment,
  getStatusColor,
  getStatusText 
}: any) {
  return (
    <div className="space-y-3">
      {appointments.length > 0 ? (
        appointments
          .sort((a: Appointment, b: Appointment) => a.time.localeCompare(b.time))
          .map((apt: Appointment) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onUpdateAppointment={onUpdateAppointment}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))
      ) : (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No hay citas para este día</p>
        </Card>
      )}
    </div>
  );
}

function WeekView({ 
  weekDays, 
  appointments, 
  searchQuery, 
  filterStatus,
  onUpdateAppointment,
  getStatusColor,
  getStatusText 
}: any) {
  return (
    <div className="space-y-3">
      {weekDays.map((day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayAppointments = appointments.filter((apt: Appointment) => {
          const matchesDate = apt.date === dateStr;
          const matchesSearch = apt.clientName.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
          return matchesDate && matchesSearch && matchesFilter;
        });

        return (
          <div key={dateStr}>
            <div className="flex items-center gap-2 mb-2">
              <div className="font-semibold">{format(day, 'EEEE', { locale: es })}</div>
              <div className="text-sm text-gray-500">{format(day, 'd MMM', { locale: es })}</div>
              <Badge variant="secondary" className="ml-auto">
                {dayAppointments.length}
              </Badge>
            </div>
            {dayAppointments.length > 0 ? (
              <div className="space-y-2 ml-4">
                {dayAppointments
                  .sort((a: Appointment, b: Appointment) => a.time.localeCompare(b.time))
                  .map((apt: Appointment) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      compact
                      onUpdateAppointment={onUpdateAppointment}
                      getStatusColor={getStatusColor}
                      getStatusText={getStatusText}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 ml-4">Sin citas</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AppointmentCard({ 
  appointment, 
  compact = false,
  onUpdateAppointment,
  getStatusColor,
  getStatusText 
}: any) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">{appointment.time}</span>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
          </div>
          <p className="font-medium">{appointment.clientName}</p>
          <p className="text-sm text-gray-600 mt-1">
            {appointment.services.join(', ')}
          </p>
          {!compact && appointment.notes && (
            <p className="text-sm text-gray-500 mt-2 italic">"{appointment.notes}"</p>
          )}
        </div>
        <div className="text-right text-sm">
          <p className="text-gray-500">{appointment.duration} min</p>
          {appointment.status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => onUpdateAppointment(appointment.id, { status: 'confirmed' })}
            >
              Confirmar
            </Button>
          )}
          {appointment.status === 'confirmed' && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => onUpdateAppointment(appointment.id, { status: 'completed' })}
            >
              Completar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function AddAppointmentForm({ clients, services, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    clientId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    services: [] as string[],
    notes: '',
    status: 'pending' as const,
    reminder: true
  });

  const selectedClient = clients.find((c: Client) => c.id === formData.clientId);
  const selectedServices = services.filter((s: Service) => formData.services.includes(s.id));
  const totalDuration = selectedServices.reduce((sum: number, s: Service) => sum + s.duration, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || formData.services.length === 0) return;

    onSubmit({
      ...formData,
      clientName: selectedClient?.name || '',
      duration: totalDuration
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Clienta</Label>
        <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar clienta" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client: Client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Fecha</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div>
          <Label>Hora</Label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Servicios</Label>
        <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-2">
          {services.filter((s: Service) => s.isActive).map((service: Service) => (
            <label key={service.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={formData.services.includes(service.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, services: [...formData.services, service.id] });
                  } else {
                    setFormData({ ...formData, services: formData.services.filter(id => id !== service.id) });
                  }
                }}
                className="rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{service.name}</p>
                <p className="text-xs text-gray-500">${service.price} • {service.duration} min</p>
              </div>
            </label>
          ))}
        </div>
        {totalDuration > 0 && (
          <p className="text-sm text-gray-500 mt-2">Duración total: {totalDuration} minutos</p>
        )}
      </div>

      <div>
        <Label>Notas</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Notas adicionales..."
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={!formData.clientId || formData.services.length === 0}>
          Agendar Cita
        </Button>
      </div>
    </form>
  );
}
