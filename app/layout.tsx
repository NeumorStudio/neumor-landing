import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const setInitialTheme = `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  } catch (err) {
    console.warn('No se pudo leer el tema inicial', err);
  }
})();
`;

// Registrar Service Worker
const registerSW = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registrado:', reg.scope))
      .catch((err) => console.warn('SW error:', err));
  });
}
`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e9edf4' },
    { media: '(prefers-color-scheme: dark)', color: '#12151c' },
  ],
};

export const metadata: Metadata = {
  // Sin metadataBase, Next resuelve las imágenes sociales contra localhost:3000
  // y la previsualización al compartir el enlace sale rota en producción.
  metadataBase: new URL('https://neumorstudio.com'),
  title: "NeumorStudio | Software a medida para negocios",
  description:
    "Montamos el software que tu negocio todavía hace a mano: reservas, gestión, captación de clientes y atención automática. Aplicaciones a medida con su panel, entregadas funcionando.",
  keywords: ['software a medida', 'aplicaciones web', 'panel de gestion', 'sistema de reservas', 'automatizacion para negocios', 'desarrollo web para empresas'],
  authors: [{ name: 'NeumorStudio' }],
  creator: 'NeumorStudio',
  publisher: 'NeumorStudio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NeumorStudio',
  },
  // Las imágenes sociales las genera app/opengraph-image.tsx. Antes se apuntaba
  // a /images/og-image.png, un fichero que no existe: cada vez que alguien
  // compartía el enlace, la previsualización salía vacía.
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://neumorstudio.com',
    siteName: 'NeumorStudio',
    title: 'NeumorStudio | Software a medida para negocios',
    description: 'Montamos el software que tu negocio todavía hace a mano: reservas, gestión, captación y atención automática.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeumorStudio | Software a medida para negocios',
    description: 'Montamos el software que tu negocio todavía hace a mano: reservas, gestión, captación y atención automática.',
    creator: '@neumorstudio',
  },
  icons: {
    icon: [
      // Sin tamaños pequeños el navegador encoge el de 192 y la pestaña sale borrosa
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <script dangerouslySetInnerHTML={{ __html: registerSW }} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
