"use client";

import Image from "next/image";

type FixedHeaderProps = {
  activeScene: number;
  onJump: (index: number) => void;
  onOpenCotiza: () => void;
  isCotizaOpen: boolean;
};

const navItems = [
  { label: "Inicio", index: 0 },
  { label: "Marcas", index: 1 },
  { label: "Servicios", index: 2 },
  { label: "Contacto", index: 3 },
];

export default function FixedHeader({
  activeScene,
  onJump,
  onOpenCotiza,
  isCotizaOpen,
}: FixedHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-[80]">
      <div className="mx-auto flex w-full max-w-[1220px] items-center justify-between px-3 pt-3 sm:px-4 sm:pt-4 md:px-5 lg:px-6 xl:px-8">
        <button
          type="button"
          onClick={() => onJump(0)}
          aria-label="Ir al inicio"
          className="flex shrink-0 items-center"
        >
          <div className="relative h-[48px] w-[142px] sm:h-[54px] sm:w-[160px] md:h-[62px] md:w-[186px] lg:h-[76px] lg:w-[228px] xl:h-[88px] xl:w-[264px] 2xl:h-[96px] 2xl:w-[288px] overflow-visible">
            <Image
              src="/img/logo.png"
              alt="Rubik"
              fill
              priority
              className="scale-[1.25] object-contain object-left origin-left"
              sizes="(max-width: 640px) 142px, (max-width: 768px) 160px, (max-width: 1024px) 186px, (max-width: 1280px) 228px, (max-width: 1536px) 264px, 288px"
            />
          </div>
        </button>

        <nav className="menu-shell hidden md:flex md:scale-[0.92] lg:scale-100">
          {navItems.map((item) => {
            const isActive = !isCotizaOpen && activeScene === item.index;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onJump(item.index)}
                className={`menu-pill ${isActive ? "is-active" : ""}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="menu-shell hidden md:flex md:scale-[0.92] lg:scale-100">
          <button
            type="button"
            onClick={onOpenCotiza}
            className={`menu-pill cotiza-pill ${isCotizaOpen ? "is-active" : ""}`}
          >
            COTIZA
          </button>
        </div>
      </div>
    </header>
  );
}