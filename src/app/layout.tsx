import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Döner Gourmet - Pedidos Online',
  description: 'Haz tu pedido en Döner Gourmet y recógelo en el local. Dürums, hamburguesas y complementos.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
