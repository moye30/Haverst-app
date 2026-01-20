import { useState, useEffect } from 'react';
import { Home, Calendar, Users, DollarSign, Package, Scissors, Settings } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AppointmentsView } from './components/AppointmentsView';
import { ClientsView } from './components/ClientsView';
import { FinancesView } from './components/FinancesView';
import { InventoryView } from './components/InventoryView';
import { ServicesView } from './components/ServicesView';
import { NotificationsView } from './components/NotificationsView';
import { 
  Client, 
  Appointment, 
  Service, 
  Transaction, 
  InventoryItem, 
  Notification 
} from './types';
import {
  mockClients,
  mockAppointments,
  mockServices,
  mockTransactions,
  mockInventory,
  mockNotifications
} from './mockData';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type View = 'dashboard' | 'appointments' | 'clients' | 'finances' | 'inventory' | 'services' | 'notifications';

function App() {
  // Estado de la aplicación
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Cargar datos del localStorage o usar datos mock
  useEffect(() => {
    const savedClients = localStorage.getItem('salonClients');
    const savedAppointments = localStorage.getItem('salonAppointments');
    const savedServices = localStorage.getItem('salonServices');
    const savedTransactions = localStorage.getItem('salonTransactions');
    const savedInventory = localStorage.getItem('salonInventory');
    const savedNotifications = localStorage.getItem('salonNotifications');

    setClients(savedClients ? JSON.parse(savedClients) : mockClients);
    setAppointments(savedAppointments ? JSON.parse(savedAppointments) : mockAppointments);
    setServices(savedServices ? JSON.parse(savedServices) : mockServices);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : mockTransactions);
    setInventory(savedInventory ? JSON.parse(savedInventory) : mockInventory);
    setNotifications(savedNotifications ? JSON.parse(savedNotifications) : mockNotifications);
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('salonClients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('salonAppointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('salonServices', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('salonTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('salonInventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('salonNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handlers para clientas
  const handleAddClient = (client: Omit<Client, 'id'>) => {
    const newClient = {
      ...client,
      id: Date.now().toString()
    };
    setClients([...clients, newClient]);
    toast.success('Clienta registrada exitosamente');
  };

  // Handlers para citas
  const handleAddAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments([...appointments, newAppointment]);
    toast.success('Cita agendada exitosamente');
  };

  const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    ));
    toast.success('Cita actualizada');
  };

  // Handlers para servicios
  const handleAddService = (service: Omit<Service, 'id'>) => {
    const newService = {
      ...service,
      id: Date.now().toString()
    };
    setServices([...services, newService]);
    toast.success('Servicio agregado exitosamente');
  };

  const handleUpdateService = (id: string, updates: Partial<Service>) => {
    setServices(services.map(svc => 
      svc.id === id ? { ...svc, ...updates } : svc
    ));
    toast.success('Servicio actualizado');
  };

  // Handlers para finanzas
  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([...transactions, newTransaction]);
    toast.success(
      transaction.type === 'income' 
        ? 'Ingreso registrado' 
        : 'Gasto registrado'
    );
  };

  // Handlers para inventario
  const handleAddInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    setInventory([...inventory, newItem]);
    toast.success('Producto agregado al inventario');
  };

  const handleUpdateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Handlers para notificaciones
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            appointments={appointments}
            transactions={transactions}
            clients={clients}
            inventory={inventory}
            notifications={notifications}
            onViewNotifications={() => setCurrentView('notifications')}
          />
        );
      case 'appointments':
        return (
          <AppointmentsView
            appointments={appointments}
            clients={clients}
            services={services}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
          />
        );
      case 'clients':
        return (
          <ClientsView
            clients={clients}
            onAddClient={handleAddClient}
          />
        );
      case 'finances':
        return (
          <FinancesView
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'inventory':
        return (
          <InventoryView
            inventory={inventory}
            onAddItem={handleAddInventoryItem}
            onUpdateItem={handleUpdateInventoryItem}
          />
        );
      case 'services':
        return (
          <ServicesView
            services={services}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-600 to-white-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">Haverst Studio</h1>
          <p className="text-sm opacity-90">By: Hannia Chavez</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto grid grid-cols-5 gap-1 p-2">
          <NavButton
            icon={<Home className="w-5 h-5" />}
            label="Inicio"
            active={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavButton
            icon={<Calendar className="w-5 h-5" />}
            label="Citas"
            active={currentView === 'appointments'}
            onClick={() => setCurrentView('appointments')}
            badge={appointments.filter(a => a.status === 'pending').length}
          />
          <NavButton
            icon={<Users className="w-5 h-5" />}
            label="Clientas"
            active={currentView === 'clients'}
            onClick={() => setCurrentView('clients')}
          />
          <NavButton
            icon={<DollarSign className="w-5 h-5" />}
            label="Finanzas"
            active={currentView === 'finances'}
            onClick={() => setCurrentView('finances')}
          />
          <NavButton
            icon={<Package className="w-5 h-5" />}
            label="Inventario"
            active={currentView === 'inventory'}
            onClick={() => setCurrentView('inventory')}
            badge={inventory.filter(i => i.quantity <= i.minStock).length}
          />
        </div>
      </nav>

      {/* Settings FAB (Floating Action Button) */}
      <button
        onClick={() => setCurrentView('services')}
        className={`fixed bottom-20 right-4 p-4 rounded-full shadow-lg transition-all ${
          currentView === 'services'
            ? 'bg-purple-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Scissors className="w-6 h-6" />
      </button>

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

function NavButton({ icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors relative ${
        active
          ? 'text-purple-600 bg-purple-50'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {badge > 0 && (
        <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
}

export default App;
