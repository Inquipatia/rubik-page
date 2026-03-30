"use client";

type FixedHeaderProps = {
  activeScene: number;
  onJump: (index: number) => void;
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
}: FixedHeaderProps) {
  return (
    <header className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-5 lg:px-10">
      <button
        type="button"
        onClick={() => onJump(0)}
        className="text-[28px] font-semibold tracking-[-0.04em] text-white"
      >
        Rubik.
      </button>

      <nav className="hidden rounded-full border border-white/12 bg-white/[0.04] p-1 backdrop-blur-xl md:flex md:items-center md:gap-1">
        {navItems.map((item) => {
          const isActive = activeScene === item.index;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onJump(item.index)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-white text-[#23124a] shadow-[0_8px_20px_rgba(255,255,255,0.14)]"
                  : "text-white/78 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#23124a] shadow-[0_14px_30px_rgba(255,255,255,0.14)] transition hover:scale-[1.02]"
      >
        COTIZA
      </button>
    </header>
  );
}