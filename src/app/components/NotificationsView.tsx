import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Bell, Calendar, AlertTriangle, Gift, Info } from 'lucide-react';
import { Notification } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationsView({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationsViewProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'birthday': return <Gift className="w-5 h-5 text-pink-600" />;
      case 'lowStock': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'reminder': return <Info className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100';
      case 'birthday': return 'bg-pink-100';
      case 'lowStock': return 'bg-amber-100';
      case 'reminder': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">{unreadCount} sin leer</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={onMarkAllAsRead}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(notification => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer transition-all ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : 'opacity-70'
                }`}
                onClick={() => !notification.read && onMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <Badge className="bg-blue-500 text-white">Nuevo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.date), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))
        ) : (
          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No hay notificaciones</p>
          </Card>
        )}
      </div>
    </div>
  );
}
