import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, DollarSign, Users, Package, TrendingUp, AlertCircle, Bell } from 'lucide-react';
import { Appointment, Transaction, Client, InventoryItem, Notification } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardProps {
  appointments: Appointment[];
  transactions: Transaction[];
  clients: Client[];
  inventory: InventoryItem[];
  notifications: Notification[];
  onViewNotifications: () => void;
}

export function Dashboard({ appointments, transactions, clients, inventory, notifications, onViewNotifications }: DashboardProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(apt => apt.date === today);
  
  // Calcular ingresos del mes
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyProfit = monthlyIncome - monthlyExpenses;

  // Items con stock bajo
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  // Notificaciones no leídas
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <button 
          onClick={onViewNotifications}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Citas Hoy</p>
              <p className="text-2xl font-bold">{todayAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mes Actual</p>
              <p className="text-xl font-bold">${monthlyIncome.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Clientas</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Ganancia</p>
              <p className="text-xl font-bold text-green-600">${monthlyProfit.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alertas */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">Productos con stock bajo</h3>
              <p className="text-sm text-amber-700 mt-1">
                {lowStockItems.length} producto{lowStockItems.length > 1 ? 's' : ''} necesita{lowStockItems.length > 1 ? 'n' : ''} reabastecimiento
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Citas de Hoy */}
      <div>
        <h2 className="font-semibold mb-3">Citas de Hoy</h2>
        {todayAppointments.length > 0 ? (
          <div className="space-y-2">
            {todayAppointments.map(apt => (
              <Card key={apt.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{apt.clientName}</p>
                      <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                        {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{apt.time}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {apt.services.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{apt.duration} min</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No hay citas para hoy</p>
          </Card>
        )}
      </div>

      {/* Resumen Financiero */}
      <div>
        <h2 className="font-semibold mb-3">Resumen del Mes</h2>
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos</span>
              <span className="font-semibold text-green-600">+${monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gastos</span>
              <span className="font-semibold text-red-600">-${monthlyExpenses.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Ganancia Neta</span>
              <span className="font-bold text-lg text-green-600">${monthlyProfit.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Clientas Top */}
      <div>
        <h2 className="font-semibold mb-3">Clientas Top</h2>
        <div className="space-y-2">
          {clients
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5)
            .map(client => (
              <Card key={client.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.totalVisits} visitas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${client.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
