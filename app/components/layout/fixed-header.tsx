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
          <div className="relative h-[38px] w-[112px] sm:h-[42px] sm:w-[126px] md:h-[48px] md:w-[145px] lg:h-[60px] lg:w-[182px] xl:h-[70px] xl:w-[212px] 2xl:h-[76px] 2xl:w-[230px]">
            <Image
              src="/img/logo.png"
              alt="Rubik"
              fill
              priority
              className="object-contain object-left"
              sizes="(max-width: 640px) 110px, (max-width: 768px) 128px, (max-width: 1024px) 150px, (max-width: 1280px) 210px, 245px"
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