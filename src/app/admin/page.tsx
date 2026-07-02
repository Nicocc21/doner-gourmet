'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  customerName: string;
  items: string;
  total: number;
  status: 'pendiente' | 'preparando' | 'listo' | 'entregado';
  createdAt: string;
  notes?: string;
}

type StatusType = Order['status'];

const STATUS_FLOW: StatusType[] = ['pendiente', 'preparando', 'listo', 'entregado'];

const STATUS_COLORS: Record<StatusType, string> = {
  pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  preparando: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  listo: 'bg-green-500/20 text-green-400 border-green-500/30',
  entregado: 'bg-gray-500/20 text-gray-500 border-gray-500/30',
};

const STATUS_LABELS: Record<StatusType, string> = {
  pendiente: '🕐 Pendiente',
  preparando: '👨‍🍳 Preparando',
  listo: '✅ Listo',
  entregado: '📦 Entregado',
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState<StatusType | 'todos'>('todos');
  const [search, setSearch] = useState('');

  // ─── Cargar pedidos desde localStorage ───
  useEffect(() => {
    const stored = localStorage.getItem('doner-orders');
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // ─── Guardar pedidos ───
  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('doner-orders', JSON.stringify(newOrders));
  };

  // ─── Cambiar estado ───
  const advanceStatus = (id: string) => {
    const newOrders = orders.map((o) => {
      if (o.id !== id) return o;
      const currentIdx = STATUS_FLOW.indexOf(o.status);
      const nextStatus = currentIdx < STATUS_FLOW.length - 1
        ? STATUS_FLOW[currentIdx + 1]
        : o.status;
      return { ...o, status: nextStatus };
    });
    saveOrders(newOrders);
  };

  // ─── Retroceder estado ───
  const regressStatus = (id: string) => {
    const newOrders = orders.map((o) => {
      if (o.id !== id) return o;
      const currentIdx = STATUS_FLOW.indexOf(o.status);
      const prevStatus = currentIdx > 0
        ? STATUS_FLOW[currentIdx - 1]
        : o.status;
      return { ...o, status: prevStatus };
    });
    saveOrders(newOrders);
  };

  // ─── Eliminar pedido ───
  const deleteOrder = (id: string) => {
    if (!confirm('¿Eliminar este pedido?')) return;
    saveOrders(orders.filter((o) => o.id !== id));
  };

  // ─── Login simple ───
  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const filteredOrders = orders
    .filter((o) => filter === 'todos' || o.status === filter)
    .filter((o) =>
      search
        ? o.customerName.toLowerCase().includes(search.toLowerCase()) ||
          o.id.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ─── LOGIN MODAL ───
  if (showPasswordModal) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="bg-dark-card border border-white/10 rounded-2xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <span className="text-4xl block mb-3">🔐</span>
            <h1 className="text-2xl font-bold">Panel del Dueño</h1>
            <p className="text-gray-500 text-sm mt-2">Döner Gourmet</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Contraseña"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Entrar
          </button>
          <p className="text-xs text-gray-600 text-center mt-4">
            Contraseña por defecto: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* ─── HEADER ─── */}
      <header className="bg-dark-card border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🥙 Döner Gourmet</h1>
            <p className="text-xs text-gray-500">Panel de gestión de pedidos</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {orders.filter((o) => o.status !== 'entregado').length} activos
            </span>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="bg-primary hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              + Registrar pedido
            </button>
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              ← Ver menú
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ─── FILTROS ─── */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === 'todos'
                ? 'bg-white/10 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
            }`}
          >
            Todos ({orders.length})
          </button>
          {STATUS_FLOW.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                filter === s
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
              }`}
            >
              {STATUS_LABELS[s]} ({orders.filter((o) => o.status === s).length})
            </button>
          ))}
        </div>

        {/* ─── BUSCADOR ─── */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o ID..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 mb-6"
        />

        {/* ─── LISTA DE PEDIDOS ─── */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <span className="text-5xl block mb-4">📋</span>
            <p className="text-lg">No hay pedidos {filter !== 'todos' ? 'con este estado' : 'aún'}</p>
            <p className="text-sm mt-2">Registra un pedido manualmente o espera a que lleguen</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-dark-card border rounded-2xl p-5 transition-all ${
                  order.status === 'entregado'
                    ? 'border-gray-800 opacity-60'
                    : 'border-white/10 hover:border-primary/30'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{order.customerName}</h3>
                    <p className="text-xs text-gray-500">
                      #{order.id.slice(0, 8)} ·{' '}
                      {new Date(order.createdAt).toLocaleString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold border ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* Items */}
                <div className="bg-white/5 rounded-xl p-3 mb-3">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {order.items}
                  </pre>
                </div>

                {/* Notes */}
                {order.notes && (
                  <p className="text-sm text-yellow-400 mb-3">📝 Nota: {order.notes}</p>
                )}

                {/* Total + Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xl font-black text-primary">
                    {order.total.toFixed(2).replace('.', ',')}€
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Botón regresar (no en pendiente) */}
                    {order.status !== 'pendiente' && (
                      <button
                        onClick={() => regressStatus(order.id)}
                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm"
                        title="Estado anterior"
                      >
                        ◀
                      </button>
                    )}

                    {/* Botón avanzar (no en entregado) */}
                    {order.status !== 'entregado' ? (
                      <button
                        onClick={() => advanceStatus(order.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          order.status === 'pendiente'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : order.status === 'preparando'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}
                      >
                        {order.status === 'pendiente'
                          ? '👨‍🍳 A preparar'
                          : order.status === 'preparando'
                          ? '✅ Marcar listo'
                          : '📦 Entregar'}
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="px-4 py-2 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── MODAL REGISTRAR PEDIDO ─── */}
      {showRegisterModal && (
        <RegisterOrderModal
          onClose={() => setShowRegisterModal(false)}
          onSave={(order) => {
            saveOrders([order, ...orders]);
            setShowRegisterModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─── MODAL REGISTRAR PEDIDO MANUAL ────────────

function RegisterOrderModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (order: Order) => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState('');
  const [total, setTotal] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!customerName.trim() || !items.trim() || !total.trim()) {
      alert('Completa al menos nombre, items y total');
      return;
    }

    const order: Order = {
      id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
      customerName: customerName.trim(),
      items: items.trim(),
      total: parseFloat(total.replace(',', '.')),
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      notes: notes.trim(),
    };

    onSave(order);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-card border border-white/10 rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">📝 Registrar Pedido Manual</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Nombre del cliente
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej: Nicolás"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Items del pedido (un por línea)
            </label>
            <textarea
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder={`▸ Dürum Grande x2
▸ Hamburguesa Doble Menú x1
▸ Patatas x1`}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                Total
              </label>
              <input
                type="text"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="27,00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Notas (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: sin lechuga, cebolla extra..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-red-700 text-white font-bold px-4 py-3 rounded-xl transition-all"
          >
            Guardar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
