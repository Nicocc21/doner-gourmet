export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: 'doner' | 'hamburguesa' | 'complementos';
  extras?: Extra[];
  options?: OptionGroup[];
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface OptionGroup {
  name: string;
  options: Extra[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedExtras: Extra[];
  selectedOptions: { [key: string]: Extra };
  notes: string;
}

export const menuItems: MenuItem[] = [
  // ===== DÖNER GOURMET =====
  {
    id: 'durum-normal',
    name: 'Dürum Normal',
    description: 'Ensalada y patatas dentro',
    basePrice: 4.00,
    category: 'doner',
    extras: [
      { id: 'extra-carne', name: 'Extra carne', price: 2.00 },
      { id: 'extra-salsa', name: 'Extra salsa', price: 0.50 },
      { id: 'cheddar', name: 'Queso cheddar', price: 0.50 },
    ],
  },
  {
    id: 'durum-grande',
    name: 'Dürum Grande',
    description: 'Ensalada y patatas dentro',
    basePrice: 6.00,
    category: 'doner',
    extras: [
      { id: 'extra-carne-g', name: 'Extra carne', price: 2.00 },
      { id: 'extra-salsa-g', name: 'Extra salsa', price: 0.50 },
      { id: 'cheddar-g', name: 'Queso cheddar', price: 0.50 },
    ],
  },
  // ===== HAMBURGUESA =====
  {
    id: 'hamburguesa',
    name: 'Hamburguesa 100% Vacuno',
    description: 'Huevo, cebolla caramelizada, queso, tomate, lechuga',
    basePrice: 7.00,
    category: 'hamburguesa',
    options: [
      {
        name: 'Tamaño',
        options: [
          { id: 'hamb-normal', name: 'Normal', price: 0 },
          { id: 'hamb-doble', name: 'Doble (+3.00€)', price: 3.00 },
        ],
      },
      {
        name: 'Menú',
        options: [
          { id: 'hamb-solo', name: 'Solo hamburguesa', price: 0 },
          { id: 'hamb-menu', name: 'Menú (+3.00€)', price: 3.00 },
        ],
      },
    ],
    extras: [
      { id: 'extra-cheddar-h', name: 'Queso cheddar extra', price: 0.50 },
    ],
  },
  // ===== COMPLEMENTOS =====
  {
    id: 'patatas',
    name: 'Ración de Patatas',
    description: 'Patatas fritas crujientes',
    basePrice: 2.50,
    category: 'complementos',
  },
  {
    id: 'refresco',
    name: 'Refresco',
    description: 'Coca-Cola, Sprite, Fanta, Aquarius',
    basePrice: 1.50,
    category: 'complementos',
  },
];

export const categoryLabels: Record<string, string> = {
  doner: '🥙 DÖNER GOURMET',
  hamburguesa: '🍔 HAMBURGUESA',
  complementos: '🧀 COMPLEMENTOS',
};

export const categoryIcons: Record<string, string> = {
  doner: '🥙',
  hamburguesa: '🍔',
  complementos: '🧀',
};

// Número de WhatsApp del dueño (desde env)
export const OWNER_PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || '34600000000';

export function calculateItemTotal(item: CartItem): number {
  const extrasPrice = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const optionsPrice = Object.values(item.selectedOptions).reduce((sum, o) => sum + o.price, 0);
  return (item.basePrice + extrasPrice + optionsPrice) * item.quantity;
}

export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}

export function generateWhatsAppMessage(
  customerName: string,
  items: CartItem[],
  total: number,
  estimatedTime: number
): string {
  let message = `🛵 *NUEVO PEDIDO - Döner Gourmet* 🛵\n`;
  message += `─────────────────────────────\n`;
  message += `👤 *Cliente:* ${customerName}\n\n`;

  items.forEach((item) => {
    const extrasPrice = item.selectedExtras.reduce((s, e) => s + e.price, 0);
    const optionsPrice = Object.values(item.selectedOptions).reduce((s, o) => s + o.price, 0);
    const itemTotal = (item.basePrice + extrasPrice + optionsPrice) * item.quantity;
    
    message += `▸ *${item.name}* ×${item.quantity} — ${itemTotal.toFixed(2).replace('.', ',')}€\n`;
    
    if (item.selectedExtras.length > 0) {
      message += `   Extras: ${item.selectedExtras.map(e => e.name).join(', ')}\n`;
    }

    const selectedOpts = Object.values(item.selectedOptions).filter(o => o.price > 0);
    if (selectedOpts.length > 0) {
      message += `   Opciones: ${selectedOpts.map(o => o.name).join(', ')}\n`;
    }
    
    if (item.notes) {
      message += `   📝 Notas: ${item.notes}\n`;
    }
  });

  message += `\n─────────────────────────────\n`;
  message += `💰 *TOTAL: ${total.toFixed(2).replace('.', ',')}€*\n`;
  message += `⏱️ *Tiempo estimado:* ${estimatedTime} min\n`;
  message += `─────────────────────────────\n\n`;
  message += `✅ _Gracias por tu pedido! Lo preparamos en breve._`;

  return encodeURIComponent(message);
}

export function generateOwnerWhatsAppMessage(
  customerName: string,
  items: CartItem[],
  total: number
): string {
  let message = `🛵 *NUEVO PEDIDO - Döner Gourmet* 🛵\n`;
  message += `─────────────────────────────\n`;
  message += `👤 *Cliente:* ${customerName}\n\n`;

  items.forEach((item) => {
    const extrasPrice = item.selectedExtras.reduce((s, e) => s + e.price, 0);
    const optionsPrice = Object.values(item.selectedOptions).reduce((s, o) => s + o.price, 0);
    const itemTotal = (item.basePrice + extrasPrice + optionsPrice) * item.quantity;
    
    const extrasStr = item.selectedExtras.length > 0 
      ? ` [+${item.selectedExtras.map(e => e.name.toLowerCase()).join(', +')}]` 
      : '';
    const optsStr = Object.values(item.selectedOptions).filter(o => o.price > 0).length > 0
      ? ` [${Object.values(item.selectedOptions).filter(o => o.price > 0).map(o => o.name.toLowerCase()).join(', ')}]`
      : '';
    const notesStr = item.notes ? ` | 📝 ${item.notes}` : '';

    message += `▸ *${item.name}* ×${item.quantity}${extrasStr}${optsStr}${notesStr} — ${itemTotal.toFixed(2).replace('.', ',')}€\n`;
  });

  message += `\n─────────────────────────────\n`;
  message += `💰 *TOTAL: ${total.toFixed(2).replace('.', ',')}€*\n`;
  message += `─────────────────────────────`;

  return message;
}