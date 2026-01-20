import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancesViewProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function FinancesView({ transactions, onAddTransaction }: FinancesViewProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= monthStart && date <= monthEnd;
  });

  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthProfit = monthIncome - monthExpenses;

  // Datos para gráficas
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    const income = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'income' && tDate >= start && tDate <= end;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' && tDate >= start && tDate <= end;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(date, 'MMM', { locale: es }),
      ingresos: income,
      gastos: expenses,
      ganancia: income - expenses
    };
  });

  // Gastos por categoría
  const expensesByCategory = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Finanzas</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Registrar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Transacción</DialogTitle>
            </DialogHeader>
            <AddTransactionForm
              initialType={transactionType}
              onSubmit={(transaction) => {
                onAddTransaction(transaction);
                setIsAddDialogOpen(false);
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
        >
          Anterior
        </Button>
        <div className="text-center">
          <p className="font-semibold capitalize">
            {format(selectedMonth, 'MMMM yyyy', { locale: es })}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedMonth(subMonths(selectedMonth, -1))}
          disabled={selectedMonth >= new Date()}
        >
          Siguiente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ingresos del Mes</p>
              <p className="text-3xl font-bold mt-1">${monthIncome.toLocaleString()}</p>
            </div>
            <ArrowUpCircle className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Gastos del Mes</p>
              <p className="text-3xl font-bold mt-1">${monthExpenses.toLocaleString()}</p>
            </div>
            <ArrowDownCircle className="w-12 h-12 opacity-80" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ganancia Neta</p>
              <p className="text-3xl font-bold mt-1">${monthProfit.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trend" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="trend">Tendencia</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Últimos 6 Meses</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
                <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Gastos por Categoría</h3>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-sm">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium">${cat.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">No hay gastos registrados</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-auto py-4"
          onClick={() => {
            setTransactionType('income');
            setIsAddDialogOpen(true);
          }}
        >
          <div className="text-center">
            <ArrowUpCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium">Registrar Ingreso</p>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4"
          onClick={() => {
            setTransactionType('expense');
            setIsAddDialogOpen(true);
          }}
        >
          <div className="text-center">
            <ArrowDownCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium">Registrar Gasto</p>
          </div>
        </Button>
      </div>

      {/* Transactions List */}
      <div>
        <h2 className="font-semibold mb-3">Movimientos del Mes</h2>
        <div className="space-y-2">
          {monthTransactions.length > 0 ? (
            monthTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(transaction => (
                <Card key={transaction.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(transaction.date), "d MMM", { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))
          ) : (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No hay movimientos este mes</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function AddTransactionForm({ initialType, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState({
    type: initialType,
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  const incomeCategories = ['Servicios', 'Productos', 'Otros ingresos'];
  const expenseCategories = ['Inventario', 'Servicios', 'Renta', 'Gastos', 'Nómina', 'Otros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tipo</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value, category: '' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Ingreso</SelectItem>
            <SelectItem value="expense">Gasto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Monto *</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
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
            {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Descripción *</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ej: Pago de servicios"
          required
        />
      </div>

      <div>
        <Label>Fecha</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
      </div>
    </form>
  );
}
