'use client';

import { useState, useMemo } from 'react';
import {
  menuItems,
  categoryLabels,
  categoryIcons,
  CartItem,
  Extra,
  formatPrice,
  calculateItemTotal,
  generateWhatsAppMessage,
  generateOwnerWhatsAppMessage,
  OWNER_PHONE,
} from './menu-data';

// ─── COMPONENTE PRINCIPAL ───

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('doner');

  const total = useMemo(() => cart.reduce((sum, item) => sum + calculateItemTotal(item), 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    setShowCart(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      if (delta === -1 && newCart[index].quantity === 1) {
        return newCart.filter((_, i) => i !== index);
      }
      newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + delta };
      return newCart;
    });
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setShowCart(false);
  };

  const handleOrder = () => {
    if (!customerName.trim() || cart.length === 0) return;

    const estimatedTime = 15;

    // Enlace para el cliente (confirmación)
    const clientMessage = generateWhatsAppMessage(customerName, cart, total, estimatedTime);
    const clientUrl = `https://wa.me/${OWNER_PHONE}?text=${clientMessage}`;

    window.open(clientUrl, '_blank');
    setOrderSent(true);
  };

  const handleOwnerOrder = () => {
    if (!customerName.trim() || cart.length === 0) return;

    const ownerMessage = generateOwnerWhatsAppMessage(customerName, cart, total);
    const ownerUrl = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(ownerMessage)}`;

    window.open(ownerUrl, '_blank');
    setOrderSent(true);
  };

  return (
    <main className="min-h-screen bg-dark text-white">
      {/* ─── HERO ────────────────────────────── */}
      <HeroSection onOrderNow={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* ─── BARRA DE CATEGORÍAS ─────────────── */}
      <CategoryBar active={activeCategory} onSelect={setActiveCategory} />

      {/* ─── MENÚ ────────────────────────────── */}
      <section id="menu" className="max-w-4xl mx-auto px-4 pb-32">
        {Object.entries(categoryLabels).map(([catKey, label]) => (
          <div
            key={catKey}
            id={`cat-${catKey}`}
            className={`mb-12 transition-all duration-500 ${activeCategory === catKey ? 'opacity-100' : 'opacity-40 blur-[1px]'}`}
            onClick={() => setActiveCategory(catKey)}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span>{categoryIcons[catKey]}</span>
              <span>{label}</span>
            </h2>
            <div className="grid gap-4">
              {menuItems
                .filter((item) => item.category === catKey)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* ─── FLOATING CART BUTTON ────────────── */}
      {cart.length > 0 && (
        <>
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-red-700 text-white rounded-full p-4 shadow-2xl shadow-red-500/30 transition-all hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* ─── CART DRAWER ──────────────────── */}
          <CartDrawer
            visible={showCart}
            cart={cart}
            total={total}
            customerName={customerName}
            setCustomerName={setCustomerName}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onOrder={handleOrder}
            onOrderOwner={handleOwnerOrder}
            orderSent={orderSent}
            setOrderSent={setOrderSent}
            setShowOrderModal={setShowOrderModal}
            showOrderModal={showOrderModal}
          />
        </>
      )}
    </main>
  );
}

// ─── HERO ───────────────────────────────────────

function HeroSection({ onOrderNow }: { onOrderNow: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-[#111] to-[#1a0505]" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* Logo / Icon */}
        <div className="mb-6 animate-fade-in-up">
          <span className="text-7xl inline-block">🥙</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 animate-fade-in-up">
          <span className="text-white">DÖNER</span>{' '}
          <span className="text-primary">GOURMET</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 mb-3 animate-fade-in-up animate-delay-100">
          El auténtico sabor turco en el corazón de la ciudad
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up animate-delay-100">
          <div className="h-px w-12 bg-primary/50" />
          <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">
            Pedidos Online
          </span>
          <div className="h-px w-12 bg-primary/50" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in-up animate-delay-200">
          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
            🥙 Dürum artesanal
          </span>
          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
            🍔 Hamburguesa 100%
          </span>
          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
            ⚡ Recoge en 15 min
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={onOrderNow}
          className="inline-flex items-center gap-3 bg-primary hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 btn-glow animate-fade-in-up animate-delay-300"
        >
          Ver Menú
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── CATEGORY BAR ───────────────────────────────

function CategoryBar({ active, onSelect }: { active: string; onSelect: (cat: string) => void }) {
  const categories = [
    { key: 'doner', label: 'Döner', icon: '🥙' },
    { key: 'hamburguesa', label: 'Hamburguesa', icon: '🍔' },
    { key: 'complementos', label: 'Complementos', icon: '🧀' },
  ];

  return (
    <div className="sticky top-0 z-30 bg-dark/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-4xl mx-auto flex justify-center gap-2 p-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              onSelect(cat.key);
              document.getElementById(`cat-${cat.key}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === cat.key
                ? 'bg-primary text-white shadow-lg shadow-red-500/25'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MENU ITEM CARD ─────────────────────────────

function MenuItemCard({
  item,
  onAddToCart,
}: {
  item: (typeof menuItems)[0];
  onAddToCart: (item: CartItem) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: Extra }>({});
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const extrasPrice = selectedExtras.reduce((s, e) => s + e.price, 0);
  const optionsPrice = Object.values(selectedOptions).reduce((s, o) => s + o.price, 0);
  const unitPrice = item.basePrice + extrasPrice + optionsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart({
      ...item,
      quantity,
      selectedExtras,
      selectedOptions,
      notes,
    });
    // Reset
    setQuantity(1);
    setSelectedExtras([]);
    setSelectedOptions({});
    setNotes('');
    setShowDetails(false);
  };

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const selectOption = (groupName: string, option: Extra) => {
    setSelectedOptions((prev) => ({ ...prev, [groupName]: option }));
  };

  return (
    <div className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-primary/30">
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
          </div>
          <span className="text-primary font-bold text-lg ml-4 whitespace-nowrap">
            {formatPrice(item.basePrice)}€
          </span>
        </div>

        {/* Extras / Options toggle */}
        {(item.extras || item.options) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-secondary hover:text-yellow-400 mt-2 flex items-center gap-1 transition-colors"
          >
            {showDetails ? '▲ Ocultar personalización' : '▼ Personalizar pedido'}
          </button>
        )}

        {/* Extras / Options */}
        {showDetails && (
          <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
            {/* Option Groups */}
            {item.options?.map((group) => (
              <div key={group.name}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => {
                    const isSelected = selectedOptions[group.name]?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectOption(group.name, opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                      >
                        {opt.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Extras */}
            {item.extras && item.extras.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Extras</p>
                <div className="flex flex-wrap gap-2">
                  {item.extras.map((extra) => {
                    const isSelected = selectedExtras.find((e) => e.id === extra.id);
                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-secondary/20 border-secondary text-secondary'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                      >
                        +{extra.name} — {formatPrice(extra.price)}€
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Notas (ej: sin lechuga, sin cebolla)
              </p>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguna modificación..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>
        )}

        {/* Quantity + Add */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              -
            </button>
            <span className="font-bold text-lg w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all hover:scale-105 text-sm"
          >
            Añadir {formatPrice(totalPrice)}€
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CART DRAWER ─────────────────────────────────

function CartDrawer({
  visible,
  cart,
  total,
  customerName,
  setCustomerName,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrder,
  onOrderOwner,
  orderSent,
  setOrderSent,
  showOrderModal,
  setShowOrderModal,
}: {
  visible: boolean;
  cart: CartItem[];
  total: number;
  customerName: string;
  setCustomerName: (name: string) => void;
  onClose: () => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onOrder: () => void;
  onOrderOwner: () => void;
  orderSent: boolean;
  setOrderSent: (v: boolean) => void;
  showOrderModal: boolean;
  setShowOrderModal: (v: boolean) => void;
}) {
  return (
    <>
      {/* Overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-dark-card border-l border-white/10 z-50 transform transition-transform duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🛒 Tu Pedido
              {cart.length > 0 && (
                <span className="text-sm text-gray-500 font-normal">({cart.length} items)</span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <span className="text-4xl block mb-4">🛒</span>
                <p>Tu carrito está vacío</p>
                <p className="text-sm mt-2">Añade productos del menú</p>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemTotal = calculateItemTotal(item);
                const extrasPrice = item.selectedExtras.reduce((s, e) => s + e.price, 0);
                const optionsPrice = Object.values(item.selectedOptions).reduce((s, o) => s + o.price, 0);

                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        {item.selectedExtras.length > 0 && (
                          <p className="text-xs text-secondary mt-1">
                            +{item.selectedExtras.map((e) => e.name.toLowerCase()).join(', +')}
                          </p>
                        )}
                        {Object.values(item.selectedOptions).filter((o) => o.price > 0).length > 0 && (
                          <p className="text-xs text-secondary mt-1">
                            {Object.values(item.selectedOptions)
                              .filter((o) => o.price > 0)
                              .map((o) => o.name.toLowerCase())
                              .join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">📝 {item.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-gray-600 hover:text-red-400 transition-colors ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(index, -1)}
                          className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(index, 1)}
                          className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs hover:bg-white/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-primary">{formatPrice(itemTotal)}€</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-white/10 p-5 space-y-4">
              {/* Customer name */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: Nicolás"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-2xl font-black text-primary">{formatPrice(total)}€</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClearCart}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm"
                >
                  Vaciar
                </button>
                <button
                  onClick={() => {
                    if (!customerName.trim()) return;
                    setShowOrderModal(true);
                  }}
                  disabled={!customerName.trim()}
                  className="flex-1 bg-primary hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold px-4 py-3 rounded-xl transition-all"
                >
                  Pedir por WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── ORDER CONFIRMATION MODAL ────────── */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-white/10 rounded-2xl max-w-md w-full p-6">
            {orderSent ? (
              <div className="text-center py-6">
                <span className="text-5xl block mb-4">✅</span>
                <h3 className="text-xl font-bold mb-2">¡Pedido enviado!</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Se ha abierto WhatsApp con tu pedido. Solo confirma y listo.
                </p>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setOrderSent(false);
                    onClearCart();
                  }}
                  className="bg-primary hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl"
                >
                  Nuevo pedido
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">📋 Resumen del pedido</h3>

                <div className="bg-white/5 rounded-xl p-4 mb-4 space-y-2 max-h-60 overflow-y-auto">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-white font-medium">{formatPrice(calculateItemTotal(item))}€</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-black text-primary">{formatPrice(total)}€</span>
                </div>

                <p className="text-xs text-gray-500 mb-4 text-center">
                  Al enviar el pedido se abrirá WhatsApp. Confirma el envío para que el dueño lo reciba.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      setOrderSent(false);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => {
                      onOrder();
                      onOrderOwner();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-xl transition-all"
                  >
                    📱 Enviar pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
