import { ReactNode, forwardRef } from "react";

interface NeumorfSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const NeumorfSection = forwardRef<HTMLElement, NeumorfSectionProps>(
  function NeumorfSection({ children, className = "", id }, ref) {
    return (
      <section
        ref={ref}
        id={id}
        className={`
          w-full max-w-5xl mx-auto
          px-4 md:px-6
          py-[72px] md:py-28
          ${className}
        `}
      >
        {children}
      </section>
    );
  }
);
