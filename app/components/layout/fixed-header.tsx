"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

type FixedHeaderProps = {
  activeScene: number;
  onJump: (index: number) => void;
  onOpenCotiza: () => void;
  isCotizaOpen: boolean;
  isMobileSinglePage?: boolean;
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
  isMobileSinglePage = false,
}: FixedHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleJump = (index: number) => {
    onJump(index);
    closeMobileMenu();
  };

  const handleCotiza = () => {
    onOpenCotiza();
    closeMobileMenu();
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [activeScene, isCotizaOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80]">
        <div className="mx-auto w-full max-w-[1460px] px-3 pt-3 sm:px-4 sm:pt-4 md:px-5 lg:px-6 xl:px-8">
          <div className="grid grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr] md:gap-4">
            <div className="flex min-w-0 items-center justify-start">
              <button
                type="button"
                onClick={() => handleJump(0)}
                aria-label="Ir al inicio"
                className="flex shrink-0 items-center"
              >
                <div className="relative h-[62px] w-[182px] overflow-visible sm:h-[70px] sm:w-[205px] md:h-[82px] md:w-[240px] lg:h-[108px] lg:w-[324px] xl:h-[126px] xl:w-[380px] 2xl:h-[136px] 2xl:w-[410px]">
                  <Image
                    src="/img/logo.png"
                    alt="Rubik"
                    fill
                    priority
                    className="origin-left scale-[1.1] object-contain object-left"
                    sizes="(max-width: 640px) 182px, (max-width: 768px) 205px, (max-width: 1024px) 240px, (max-width: 1280px) 324px, (max-width: 1536px) 380px, 410px"
                  />
                </div>
              </button>
            </div>

            <div className="hidden items-center justify-center md:flex">
              <nav className="menu-shell">
                {navItems.map((item) => {
                  const isActive = !isCotizaOpen && activeScene === item.index;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onJump(item.index)}
                      className={`menu-pill omnes-text text-[14px] font-medium tracking-[-0.01em] text-white/88 ${isActive ? "is-active" : ""}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="hidden min-w-[228px] items-center justify-end md:flex xl:min-w-[264px] 2xl:min-w-[288px]">
              <div className="menu-shell">
                <button
                  type="button"
                  onClick={onOpenCotiza}
                  className={`menu-pill cotiza-pill omnes-text text-[14px] font-semibold tracking-[0.02em] text-white/92 ${
                    isCotizaOpen ? "is-active" : ""
                  }`}
                >
                  COTIZA
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menú"
                aria-expanded={isMobileMenuOpen}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:bg-white/14"
              >
                <HiOutlineBars3 size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-[rgba(3,2,10,0.74)] backdrop-blur-md"
          />

          <div className="absolute inset-x-0 top-0 px-3 pt-4">
            <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(18,12,40,0.96),rgba(8,7,18,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <div className="relative h-[42px] w-[126px]">
                  <Image
                    src="/img/logo.png"
                    alt="Rubik"
                    fill
                    priority
                    className="object-contain object-left"
                    sizes="126px"
                  />
                </div>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Cerrar menú"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/12"
                >
                  <HiOutlineXMark size={21} />
                </button>
              </div>

              <div className="px-4 pb-6 pt-6">
                <div className="grid gap-3.5">
                  {navItems.map((item) => {
                    const isActive =
                      !isMobileSinglePage &&
                      !isCotizaOpen &&
                      activeScene === item.index;

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleJump(item.index)}
                        className={`flex min-h-[58px] items-center justify-between rounded-[18px] border px-5 text-left transition ${
                          isActive
                            ? "border-white/24 bg-white/14 text-white shadow-[0_10px_24px_rgba(124,58,237,0.18)]"
                            : "border-white/10 bg-white/[0.05] text-white/90 hover:border-white/18 hover:bg-white/[0.09]"
                        }`}
                      >
                        <span className="omnes-text text-[15px] font-medium tracking-[-0.01em]">
                          {item.label}
                        </span>
                        <span className="omnes-text text-[12px] text-white/56">
                          {String(item.index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleCotiza}
                    className={`mt-2 flex min-h-[60px] items-center justify-center rounded-[18px] border px-5 transition ${
                      isCotizaOpen && !isMobileSinglePage
                        ? "border-white/24 bg-white/16 text-white"
                        : "border-fuchsia-300/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] text-white hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.1))]"
                    }`}
                  >
                    <span className="omnes-text text-[15px] font-semibold tracking-[0.02em]">
                      COTIZA
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}