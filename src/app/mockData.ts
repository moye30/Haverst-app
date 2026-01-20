import { Client, Appointment, Service, Transaction, InventoryItem, Notification } from './types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'María González',
    phone: '+52 555-0101',
    email: 'maria.g@email.com',
    notes: 'Prefiere productos sin amoniaco',
    birthday: '1985-03-15',
    lastVisit: '2026-01-15',
    totalVisits: 24,
    totalSpent: 12500,
    preferences: ['Tinte sin amoniaco', 'Corte en capas', 'Productos orgánicos'],
    history: [
      {
        id: 'h1',
        date: '2026-01-15',
        services: ['Corte', 'Tinte', 'Tratamiento'],
        total: 850,
        notes: 'Cliente muy satisfecha con el resultado',
        photos: []
      },
      {
        id: 'h2',
        date: '2025-12-20',
        services: ['Alaciado', 'Hidratación'],
        total: 950,
        notes: 'Aplicar keratina suave',
        photos: []
      }
    ]
  },
  {
    id: '2',
    name: 'Ana Martínez',
    phone: '+52 555-0102',
    email: 'ana.m@email.com',
    notes: 'Cuero cabelludo sensible',
    birthday: '1990-07-22',
    lastVisit: '2026-01-18',
    totalVisits: 18,
    totalSpent: 9800,
    preferences: ['Productos hipoalergénicos', 'Peinados recogidos'],
    history: [
      {
        id: 'h3',
        date: '2026-01-18',
        services: ['Manicure', 'Pedicure'],
        total: 450,
        notes: 'Le encantó el color nude',
        photos: []
      }
    ]
  },
  {
    id: '3',
    name: 'Laura Ramírez',
    phone: '+52 555-0103',
    email: 'laura.r@email.com',
    notes: 'Prefiere citas por la tarde',
    birthday: '1988-11-30',
    lastVisit: '2026-01-12',
    totalVisits: 32,
    totalSpent: 18900,
    preferences: ['Balayage', 'Tratamientos capilares', 'Maquillaje de noche'],
    history: [
      {
        id: 'h4',
        date: '2026-01-12',
        services: ['Balayage', 'Corte', 'Peinado'],
        total: 1200,
        notes: 'Resultado espectacular, cliente fiel',
        photos: []
      }
    ]
  },
  {
    id: '4',
    name: 'Carmen Silva',
    phone: '+52 555-0104',
    notes: 'Cliente VIP',
    birthday: '1982-05-10',
    lastVisit: '2026-01-19',
    totalVisits: 45,
    totalSpent: 28500,
    preferences: ['Mechas californianas', 'Tratamientos premium', 'Faciales'],
    history: [
      {
        id: 'h5',
        date: '2026-01-19',
        services: ['Facial', 'Depilación'],
        total: 750,
        notes: 'Siempre puntual',
        photos: []
      }
    ]
  },
  {
    id: '5',
    name: 'Patricia López',
    phone: '+52 555-0105',
    email: 'paty.l@email.com',
    notes: 'Le gusta probar nuevos estilos',
    birthday: '1995-09-18',
    lastVisit: '2026-01-10',
    totalVisits: 15,
    totalSpent: 7200,
    preferences: ['Cortes modernos', 'Colores vibrantes'],
    history: [
      {
        id: 'h6',
        date: '2026-01-10',
        services: ['Corte pixie', 'Color fantasía'],
        total: 980,
        notes: 'Color rosa pastel, le encantó',
        photos: []
      }
    ]
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    clientId: '1',
    clientName: 'María González',
    date: '2026-01-20',
    time: '10:00',
    services: ['Corte', 'Tinte'],
    duration: 120,
    status: 'confirmed',
    notes: 'Retoque de raíz',
    reminder: true
  },
  {
    id: 'a2',
    clientId: '2',
    clientName: 'Ana Martínez',
    date: '2026-01-20',
    time: '14:00',
    services: ['Manicure', 'Pedicure'],
    duration: 90,
    status: 'confirmed',
    notes: '',
    reminder: true
  },
  {
    id: 'a3',
    clientId: '3',
    clientName: 'Laura Ramírez',
    date: '2026-01-21',
    time: '11:00',
    services: ['Balayage', 'Tratamiento'],
    duration: 180,
    status: 'confirmed',
    notes: 'Tonos caramelo',
    reminder: true
  },
  {
    id: 'a4',
    clientId: '4',
    clientName: 'Carmen Silva',
    date: '2026-01-21',
    time: '16:00',
    services: ['Facial', 'Maquillaje'],
    duration: 120,
    status: 'pending',
    notes: 'Evento especial',
    reminder: false
  },
  {
    id: 'a5',
    clientId: '5',
    clientName: 'Patricia López',
    date: '2026-01-22',
    time: '09:00',
    services: ['Corte', 'Peinado'],
    duration: 90,
    status: 'confirmed',
    notes: '',
    reminder: true
  },
  {
    id: 'a6',
    clientId: '1',
    clientName: 'María González',
    date: '2026-01-23',
    time: '15:00',
    services: ['Hidratación profunda'],
    duration: 60,
    status: 'pending',
    notes: '',
    reminder: false
  }
];

export const mockServices: Service[] = [
  { id: 's1', name: 'Corte Dama', category: 'Corte', price: 250, duration: 45, description: 'Corte de cabello con técnica personalizada', isActive: true },
  { id: 's2', name: 'Corte Caballero', category: 'Corte', price: 180, duration: 30, description: 'Corte de cabello masculino', isActive: true },
  { id: 's3', name: 'Tinte Completo', category: 'Color', price: 450, duration: 120, description: 'Aplicación de color en todo el cabello', isActive: true },
  { id: 's4', name: 'Retoque de Raíz', category: 'Color', price: 320, duration: 90, description: 'Aplicación de color solo en raíz', isActive: true },
  { id: 's5', name: 'Balayage', category: 'Color', price: 850, duration: 180, description: 'Técnica de mechas naturales', isActive: true },
  { id: 's6', name: 'Mechas Californianas', category: 'Color', price: 750, duration: 150, description: 'Mechas con efecto degradado', isActive: true },
  { id: 's7', name: 'Alaciado', category: 'Tratamiento', price: 600, duration: 180, description: 'Tratamiento de alaciado permanente', isActive: true },
  { id: 's8', name: 'Hidratación Profunda', category: 'Tratamiento', price: 350, duration: 60, description: 'Tratamiento intensivo de hidratación', isActive: true },
  { id: 's9', name: 'Keratina', category: 'Tratamiento', price: 900, duration: 180, description: 'Tratamiento con keratina para alisar', isActive: true },
  { id: 's10', name: 'Manicure', category: 'Uñas', price: 200, duration: 45, description: 'Manicure completo con esmaltado', isActive: true },
  { id: 's11', name: 'Pedicure', category: 'Uñas', price: 250, duration: 60, description: 'Pedicure completo con esmaltado', isActive: true },
  { id: 's12', name: 'Uñas Acrílicas', category: 'Uñas', price: 450, duration: 120, description: 'Aplicación de uñas acrílicas', isActive: true },
  { id: 's13', name: 'Peinado Casual', category: 'Peinado', price: 280, duration: 45, description: 'Peinado para uso diario', isActive: true },
  { id: 's14', name: 'Peinado de Novia', category: 'Peinado', price: 800, duration: 120, description: 'Peinado elaborado para eventos', isActive: true },
  { id: 's15', name: 'Maquillaje Social', category: 'Maquillaje', price: 350, duration: 60, description: 'Maquillaje para eventos', isActive: true },
  { id: 's16', name: 'Maquillaje de Novia', category: 'Maquillaje', price: 650, duration: 90, description: 'Maquillaje profesional para bodas', isActive: true },
  { id: 's17', name: 'Facial Básico', category: 'Facial', price: 400, duration: 60, description: 'Limpieza facial profunda', isActive: true },
  { id: 's18', name: 'Depilación Ceja', category: 'Depilación', price: 80, duration: 15, description: 'Depilación y diseño de cejas', isActive: true },
  { id: 's19', name: 'Depilación Facial', category: 'Depilación', price: 180, duration: 30, description: 'Depilación completa de rostro', isActive: true },
  { id: 's20', name: 'Permanente', category: 'Tratamiento', price: 550, duration: 150, description: 'Permanente rizado o ondulado', isActive: true }
];

export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-01-19', type: 'income', amount: 750, category: 'Servicios', description: 'Facial + Depilación - Carmen Silva', clientId: '4' },
  { id: 't2', date: '2026-01-18', type: 'income', amount: 450, category: 'Servicios', description: 'Manicure + Pedicure - Ana Martínez', clientId: '2' },
  { id: 't3', date: '2026-01-18', type: 'expense', amount: 1200, category: 'Inventario', description: 'Compra de tintes y productos' },
  { id: 't4', date: '2026-01-17', type: 'income', amount: 980, category: 'Servicios', description: 'Corte + Color - Nueva cliente' },
  { id: 't5', date: '2026-01-16', type: 'expense', amount: 450, category: 'Servicios', description: 'Pago de luz' },
  { id: 't6', date: '2026-01-15', type: 'income', amount: 850, category: 'Servicios', description: 'Corte + Tinte + Tratamiento - María González', clientId: '1' },
  { id: 't7', date: '2026-01-15', type: 'income', amount: 600, category: 'Servicios', description: 'Alaciado - Nueva cliente' },
  { id: 't8', date: '2026-01-14', type: 'expense', amount: 800, category: 'Inventario', description: 'Productos de uñas y esmaltes' },
  { id: 't9', date: '2026-01-14', type: 'income', amount: 1200, category: 'Servicios', description: 'Balayage + Corte + Peinado - Laura Ramírez', clientId: '3' },
  { id: 't10', date: '2026-01-13', type: 'income', amount: 550, category: 'Servicios', description: 'Permanente - Cliente regular' },
  { id: 't11', date: '2026-01-13', type: 'income', amount: 350, category: 'Servicios', description: 'Maquillaje social - Evento' },
  { id: 't12', date: '2026-01-12', type: 'expense', amount: 250, category: 'Gastos', description: 'Internet y teléfono' },
];

export const mockInventory: InventoryItem[] = [
  { id: 'i1', name: 'Tinte Rubio Ceniza', category: 'Tintes', quantity: 8, unit: 'unidades', minStock: 5, price: 120, lastPurchase: '2026-01-18' },
  { id: 'i2', name: 'Tinte Castaño Oscuro', category: 'Tintes', quantity: 12, unit: 'unidades', minStock: 5, price: 120, lastPurchase: '2026-01-18' },
  { id: 'i3', name: 'Oxidante 20vol', category: 'Tintes', quantity: 15, unit: 'litros', minStock: 10, price: 85, lastPurchase: '2026-01-18' },
  { id: 'i4', name: 'Shampoo Hidratante', category: 'Productos', quantity: 6, unit: 'unidades', minStock: 8, price: 180, lastPurchase: '2026-01-10' },
  { id: 'i5', name: 'Acondicionador Reparador', category: 'Productos', quantity: 4, unit: 'unidades', minStock: 8, price: 180, lastPurchase: '2026-01-10' },
  { id: 'i6', name: 'Keratina Brasileña', category: 'Tratamientos', quantity: 3, unit: 'unidades', minStock: 2, price: 450, lastPurchase: '2025-12-28' },
  { id: 'i7', name: 'Mascarilla Hidratante', category: 'Tratamientos', quantity: 10, unit: 'unidades', minStock: 5, price: 200, lastPurchase: '2026-01-15' },
  { id: 'i8', name: 'Esmalte Permanente - Nude', category: 'Uñas', quantity: 15, unit: 'unidades', minStock: 10, price: 95, lastPurchase: '2026-01-14' },
  { id: 'i9', name: 'Esmalte Permanente - Rojo', category: 'Uñas', quantity: 12, unit: 'unidades', minStock: 10, price: 95, lastPurchase: '2026-01-14' },
  { id: 'i10', name: 'Base coat', category: 'Uñas', quantity: 7, unit: 'unidades', minStock: 5, price: 110, lastPurchase: '2026-01-14' },
  { id: 'i11', name: 'Top coat', category: 'Uñas', quantity: 8, unit: 'unidades', minStock: 5, price: 110, lastPurchase: '2026-01-14' },
  { id: 'i12', name: 'Guantes desechables', category: 'Consumibles', quantity: 3, unit: 'cajas', minStock: 2, price: 85, lastPurchase: '2026-01-05' },
  { id: 'i13', name: 'Toallas desechables', category: 'Consumibles', quantity: 25, unit: 'paquetes', minStock: 15, price: 45, lastPurchase: '2026-01-12' },
  { id: 'i14', name: 'Capa de corte', category: 'Herramientas', quantity: 8, unit: 'unidades', minStock: 6, price: 120, lastPurchase: '2025-11-20' },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'appointment',
    title: 'Cita próxima',
    message: 'María González tiene cita mañana a las 10:00',
    date: '2026-01-20T08:00:00',
    read: false
  },
  {
    id: 'n2',
    type: 'lowStock',
    title: 'Stock bajo',
    message: 'Shampoo Hidratante por debajo del stock mínimo',
    date: '2026-01-19T14:00:00',
    read: false
  },
  {
    id: 'n3',
    type: 'lowStock',
    title: 'Stock bajo',
    message: 'Acondicionador Reparador por debajo del stock mínimo',
    date: '2026-01-19T14:00:00',
    read: false
  },
  {
    id: 'n4',
    type: 'birthday',
    title: 'Cumpleaños próximo',
    message: 'Carmen Silva cumple años el 10 de Mayo',
    date: '2026-01-19T09:00:00',
    read: true
  },
  {
    id: 'n5',
    type: 'reminder',
    title: 'Cliente inactiva',
    message: 'Patricia López no ha visitado en 10 días',
    date: '2026-01-18T10:00:00',
    read: true
  }
];
