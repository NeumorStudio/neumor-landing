"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeContext";

const navLinks = [
  { href: "#construimos", label: "Construimos" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#laboratorio", label: "Laboratorio" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
];

function ThemeButton() {
  const { isDark, setIsDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Render solo en cliente para evitar desajuste de hidratación con el tema
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" aria-hidden />;

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="ng-raised w-10 h-10 !p-0 flex items-center justify-center text-[var(--ink-soft)]"
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`ng-navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="NeumorStudio"
          className="ng-wordmark font-display text-lg md:text-xl font-bold tracking-tight relative z-10"
        >
          {/* Símbolo: trazo-n con punto azul */}
          <svg
            className="w-[1.2em] h-[1.2em] mr-1.5"
            viewBox="20 20 68 68"
            aria-hidden="true"
          >
            <defs>
              <mask id="wm-hollow">
                <rect x="20" y="20" width="68" height="68" fill="white" />
                <path
                  d="M31 77 V45 Q31 31 47 31 H53 Q69 31 69 45 V60"
                  fill="none"
                  stroke="black"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </mask>
            </defs>
            <path
              d="M31 77 V45 Q31 31 47 31 H53 Q69 31 69 45 V60"
              fill="none"
              stroke="currentColor"
              strokeWidth="13"
              strokeLinecap="round"
              mask="url(#wm-hollow)"
            />
            <circle cx="69" cy="77" r="6" fill="var(--accent)" />
          </svg>
          {"NeumorStudio".split("").map((letter, i) => (
            <span key={i} aria-hidden="true">
              {letter}
            </span>
          ))}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm text-[var(--ink-soft)] hover:text-[var(--foreground)]
                         transition-colors relative z-10 px-2 py-2"
            >
              {link.label}
            </button>
          ))}

          <ThemeButton />

          <button
            onClick={() => scrollToSection("#contacto")}
            className="ng-btn-primary text-sm"
          >
            Solicitar propuesta
          </button>
        </div>

        {/* Mobile: toggle + menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeButton />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--ink-soft)] relative z-10"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-out
          ${isMobileMenuOpen ? "max-h-80 opacity-100 mt-2" : "max-h-0 opacity-0"}
        `}
      >
        <div className="mx-4 p-4 ng-card space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left px-4 py-2 text-sm text-[var(--ink-soft)]"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 px-2">
            <button
              onClick={() => scrollToSection("#contacto")}
              className="ng-btn-primary text-sm w-full justify-center"
            >
              Solicitar propuesta
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
