"use client";

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
  { label: "FAQ", index: 4 },
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
          className="shrink-0 font-[300] text-[22px] tracking-[-0.04em] text-white sm:text-[24px] md:text-[26px]"
        >
          Rubik.
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