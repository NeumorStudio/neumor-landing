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
  title: "NeumorStudio | Desarrollo de software y automatización",
  description:
    "Estudio de desarrollo de software: aplicaciones web con panel de gestión, automatización de procesos e integraciones a medida. Desarrollo asistido por IA con supervisión de ingeniería.",
  keywords: ['desarrollo de software', 'aplicaciones web', 'panel de gestion', 'automatizacion', 'inteligencia artificial', 'desarrollo a medida'],
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
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://neumorstudio.com',
    siteName: 'NeumorStudio',
    title: 'NeumorStudio | Desarrollo de software y automatización',
    description: 'Aplicaciones web con panel de gestión, automatización de procesos e integraciones a medida.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeumorStudio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeumorStudio | Desarrollo de software y automatización',
    description: 'Aplicaciones web con panel de gestión, automatización de procesos e integraciones a medida.',
    images: ['/images/og-image.png'],
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
