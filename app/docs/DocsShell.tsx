"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Inicio",
    items: [
      { href: "/docs", label: "Introducción" },
    ],
  },
  {
    title: "Arquitectura",
    items: [
      { href: "/docs/arquitectura", label: "Visión General" },
      { href: "/docs/estructura", label: "Estructura del Proyecto" },
    ],
  },
  {
    title: "Referencia",
    items: [
      { href: "/docs/tech-stack", label: "Stack Tecnológico" },
      { href: "/docs/funcionalidades", label: "Funcionalidades" },
    ],
  },
  {
    title: "Guías",
    items: [
      { href: "/docs/desarrollo-local", label: "Desarrollo Local" },
      { href: "/docs/persistencia", label: "Persistencia de Datos" },
    ],
  },
  {
    title: "Operaciones",
    items: [
      { href: "/docs/seguridad", label: "Seguridad" },
      { href: "/docs/roadmap", label: "Roadmap" },
      { href: "/docs/mantenimiento", label: "Mantenimiento" },
    ],
  },
];

export function DocsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#e6e6e6]/90 dark:bg-[#0F141A]/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="text-lg font-semibold text-[#2c2c2c] dark:text-[#E5E7EB] hover:opacity-80 transition-opacity">
              NeumorStudio
            </Link>
            <span className="text-slate-400 dark:text-slate-500">/</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Documentación</span>
          </div>

          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#2c2c2c] dark:hover:text-white transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar Overlay (mobile) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-40
            w-72 h-[calc(100vh-4rem)]
            bg-[#e6e6e6] dark:bg-[#0F141A]
            border-r border-slate-200/50 dark:border-slate-700/50
            overflow-y-auto
            transition-transform duration-300 lg:transition-none
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <nav className="p-4 space-y-6">
            {sidebarItems.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`
                            block px-3 py-2 rounded-lg text-sm transition-all
                            ${isActive
                              ? "bg-[#2c2c2c] text-white dark:bg-[#E5E7EB] dark:text-[#0F141A] font-medium shadow-[4px_4px_12px_rgba(0,0,0,0.1)]"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                            }
                          `}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:pl-0">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
