import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Döner Gourmet - Pedidos Online',
  description: 'Haz tu pedido en Döner Gourmet y recógelo en el local. Dürums, hamburguesas y complementos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/doner-gourmet/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
