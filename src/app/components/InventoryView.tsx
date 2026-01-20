import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Package, AlertTriangle, Plus, Search, TrendingDown } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
}

export function InventoryView({ inventory, onAddItem, onUpdateItem }: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];
  
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Producto</DialogTitle>
            </DialogHeader>
            <AddInventoryForm
              onSubmit={(item) => {
                onAddItem(item);
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Productos</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Stock Bajo</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alert for Low Stock */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">Productos con stock bajo</h3>
              <p className="text-sm text-amber-700 mt-1">
                {lowStockItems.length} producto{lowStockItems.length > 1 ? 's' : ''} necesita{lowStockItems.length > 1 ? 'n' : ''} reabastecimiento
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar productos..."
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

      {/* Inventory List */}
      <div className="space-y-2">
        {filteredInventory.length > 0 ? (
          filteredInventory
            .sort((a, b) => {
              // Primero los de stock bajo
              const aLow = a.quantity <= a.minStock ? 1 : 0;
              const bLow = b.quantity <= b.minStock ? 1 : 0;
              if (bLow !== aLow) return bLow - aLow;
              return a.name.localeCompare(b.name);
            })
            .map(item => (
              <InventoryCard
                key={item.id}
                item={item}
                onUpdateItem={onUpdateItem}
              />
            ))
        ) : (
          <Card className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No se encontraron productos</p>
          </Card>
        )}
      </div>

      {/* Total Value */}
      <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Valor Total del Inventario</p>
            <p className="text-3xl font-bold mt-1">${totalValue.toLocaleString()}</p>
          </div>
          <Package className="w-12 h-12 opacity-80" />
        </div>
      </Card>
    </div>
  );
}

function InventoryCard({ item, onUpdateItem }: { item: InventoryItem; onUpdateItem: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity.toString());

  const isLowStock = item.quantity <= item.minStock;
  const stockPercentage = (item.quantity / (item.minStock * 2)) * 100;

  const handleUpdateQuantity = () => {
    const newQuantity = parseInt(quantity);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onUpdateItem(item.id, { quantity: newQuantity });
      setIsEditing(false);
    }
  };

  return (
    <Card className={`p-4 ${isLowStock ? 'border-amber-300 bg-amber-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{item.name}</h3>
            {isLowStock && (
              <Badge variant="destructive" className="bg-amber-500">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Bajo
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
          
          {/* Stock Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Stock</span>
              <span>{item.quantity} {item.unit}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  isLowStock ? 'bg-amber-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mínimo: {item.minStock} {item.unit}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-gray-600">
              Precio: <span className="font-medium">${item.price}</span>
            </span>
            <span className="text-gray-600">
              Total: <span className="font-medium text-green-600">${(item.quantity * item.price).toLocaleString()}</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-20"
                autoFocus
              />
              <div className="flex gap-1">
                <Button size="sm" onClick={handleUpdateQuantity}>
                  ✓
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setQuantity(item.quantity.toString());
                    setIsEditing(false);
                  }}
                >
                  ✕
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Ajustar
              </Button>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateItem(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                  className="w-8 h-8 p-0"
                  disabled={item.quantity === 0}
                >
                  −
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function AddInventoryForm({ onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'unidades',
    minStock: '',
    price: '',
    lastPurchase: new Date().toISOString().split('T')[0]
  });

  const categories = ['Tintes', 'Productos', 'Tratamientos', 'Uñas', 'Consumibles', 'Herramientas'];
  const units = ['unidades', 'litros', 'cajas', 'paquetes', 'gramos', 'kilogramos'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.quantity || !formData.minStock || !formData.price) return;

    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      price: parseFloat(formData.price)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nombre del Producto *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Tinte Rubio Ceniza"
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
          <Label>Cantidad *</Label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="0"
            required
          />
        </div>
        <div>
          <Label>Unidad</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map(unit => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Stock Mínimo *</Label>
          <Input
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            placeholder="0"
            required
          />
        </div>
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
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Agregar Producto
        </Button>
      </div>
    </form>
  );
}
