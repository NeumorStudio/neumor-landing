"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeContext";

// Cinco enlaces como máximo: con siete el menú de escritorio se apelmaza.
// "Precio" entra porque en una web de servicios es de lo más buscado, y
// "Laboratorio" sale porque ahora vive al final, después de la decisión de compra.
const navLinks = [
  { href: "#construimos", label: "Construimos" },
  { href: "#compromisos", label: "Cómo trabajamos" },
  { href: "#proyectos", label: "Proyectos" },
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
  const [activa, setActiva] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Scrollspy: marca en el menú la sección que se está viendo.
   *
   * Se usa IntersectionObserver y no el evento de scroll a propósito: el
   * observador solo avisa cuando una sección entra o sale, mientras que
   * escuchar el scroll obligaría a calcular posiciones en cada fotograma —y
   * eso, con las capas de cristal, es justo lo que no conviene pagar.
   *
   * El margen superior descuenta la altura de la barra, para que una sección
   * cuente como activa cuando su título asoma bajo el menú, no cuando toca el
   * borde de la ventana.
   */
  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    let raf = 0;

    const arrancar = () => {
      const secciones = navLinks
        .map((l) => document.querySelector(l.href))
        .filter(Boolean) as Element[];

      // La barra puede montarse antes de que el resto de la página esté en el
      // DOM. Si aún no hay secciones, se reintenta en el siguiente frame en vez
      // de rendirse: rendirse era el motivo de que el menú no se marcara nunca.
      if (!secciones.length) {
        raf = requestAnimationFrame(arrancar);
        return;
      }

    /*
     * No se usa `intersectionRatio` para decidir: ese ratio se calcula sobre el
     * tamaño del propio elemento, así que una sección más alta que la ventana
     * nunca alcanza un umbral alto y el menú no se marcaba nunca.
     *
     * En su lugar se recorta la zona de detección a una banda estrecha bajo la
     * barra. La sección que cruza esa banda es la activa, sin importar lo larga
     * que sea.
     */
      const dentro = new Set<string>();
      obs = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            const id = `#${e.target.id}`;
            if (e.isIntersecting) dentro.add(id);
            else dentro.delete(id);
          }
          // Si hay varias en la banda, gana la primera en el orden del menú.
          const marcada = navLinks.find((l) => dentro.has(l.href));
          setActiva(marcada ? marcada.href : "");
        },
        { rootMargin: "-88px 0px -78% 0px", threshold: 0 }
      );

      secciones.forEach((s) => obs!.observe(s));
    };

    arrancar();

    return () => {
      cancelAnimationFrame(raf);
      obs?.disconnect();
    };
  }, []);

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`ng-navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        {/* El logo también va en cápsula: sin la banda de la barra, es la única
            pieza que quedaría sin fondo propio y perdería legibilidad cuando
            pasa contenido con contraste por debajo. */}
        <Link
          href="/"
          aria-label="NeumorStudio"
          className="ng-wordmark nav-item !py-1.5 font-display text-lg md:text-xl font-bold tracking-tight relative z-10"
        >
          {/* Símbolo: trazo-n con punto azul */}
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={64}
            height={64}
            priority
            className="w-[1.5em] h-[1.5em] mr-2 rounded-[0.34em]"
          />
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
              className={`nav-item text-sm text-[var(--ink-soft)] relative z-10 ${
                activa === link.href ? "activa" : ""
              }`}
              aria-current={activa === link.href ? "true" : undefined}
            >
              {link.label}
              {activa === link.href && <span className="punto-activo" aria-hidden="true" />}
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
