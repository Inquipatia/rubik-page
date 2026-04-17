"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";
import FixedHeader from "@/app/components/layout/fixed-header";
import SceneStage from "@/app/components/experience/scene-stage";
import ScrollProgress from "@/app/components/experience/scroll-progress";
import IntroScene from "@/app/components/scenes/intro-scene";
import BrandShowcase from "@/app/components/scenes/brand-showcase";
import WorkScene from "@/app/components/scenes/work-scene";
import ContactScene from "@/app/components/scenes/contact-scene";
import CotizaScene from "@/app/components/scenes/cotiza-scene";

export type BrandWorkItem = {
  image: string;
  title?: string;
  description?: string;
};

export type SelectedBrand = {
  brandName: string;
  brandLogo?: string;
  description: string;
  works: BrandWorkItem[];
};

function CornerSocialPanel() {
  const socials = [
    {
      href: "https://instagram.com/rubikcreaciones.cl",
      label: "Instagram",
      icon: <FaInstagram size={14} />,
    },
    {
      href: "https://web.facebook.com/profile.php?id=100083381976669",
      label: "Facebook",
      icon: <FaFacebookF size={13} />,
    },
    {
      href: "https://tiktok.com/@rubikcreaciones",
      label: "TikTok",
      icon: <FaTiktok size={13} />,
    },
    {
      href: "https://www.linkedin.com/in/rubik-creaciones-9b13063b5/",
      label: "LinkedIn",
      icon: <FaLinkedinIn size={13} />,
    },
    {
      href: "https://wa.me/56991330559",
      label: "WhatsApp",
      icon: <FaWhatsapp size={14} />,
    },
  ];

  return (
    <div className="fixed bottom-[72px] right-4 z-50 hidden md:block">
      <div className="w-[74px] rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,10,16,0.96),rgba(6,6,10,0.98))] p-2 shadow-[0_14px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="flex flex-col items-center gap-2">
          {socials.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
              className="group flex h-[44px] w-[44px] items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-white/82 transition duration-300 hover:-translate-y-[1px] hover:border-white/14 hover:bg-white/[0.07] hover:text-white"
            >
              <span className="transition duration-300 group-hover:scale-110">
                {item.icon}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileSection({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-[92px] px-3 sm:px-4 ${className}`}
    >
      <div className="mx-auto w-full max-w-[1220px]">{children}</div>
    </section>
  );
}

export default function Home() {
  const [activeScene, setActiveScene] = useState(0);
  const [activeWorkCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCubeHovered, setIsCubeHovered] = useState(false);
  const [isCotizaOpen, setIsCotizaOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<SelectedBrand | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const wheelLockRef = useRef(false);
  const totalMainScenes = 4;

  const progress = useMemo(() => {
    if (activeScene === 0) return 0.08;
    if (activeScene === 1) return 0.36;
    if (activeScene === 2) return 0.68;
    if (activeScene === 3) return 1;
    return 0;
  }, [activeScene]);

  const scrollToSection = useCallback((id: string) => {
    if (typeof window === "undefined") return;
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const unlockAfterDelay = useCallback(() => {
    window.setTimeout(() => {
      wheelLockRef.current = false;
      setIsAnimating(false);
    }, 680);
  }, []);

  const goNext = useCallback(() => {
    if (isCotizaOpen || selectedBrand) return;

    if (activeScene < totalMainScenes - 1) {
      setActiveScene((prev) => prev + 1);
    }
  }, [activeScene, totalMainScenes, isCotizaOpen, selectedBrand]);

  const goPrev = useCallback(() => {
    if (isCotizaOpen || selectedBrand) return;

    if (activeScene > 0) {
      setActiveScene((prev) => prev - 1);
    }
  }, [activeScene, isCotizaOpen, selectedBrand]);

  const handleJump = useCallback(
    (index: number) => {
      if (isMobile) {
        const mobileIds = ["inicio", "marcas", "servicios", "contacto"];
        const targetId = mobileIds[index];
        if (targetId) scrollToSection(targetId);
        return;
      }

      if (wheelLockRef.current) return;

      wheelLockRef.current = true;
      setIsAnimating(true);

      setIsCotizaOpen(false);
      setSelectedBrand(null);
      setActiveScene(index);

      unlockAfterDelay();
    },
    [isMobile, scrollToSection, unlockAfterDelay]
  );

  const handleOpenCotiza = useCallback(() => {
    if (isMobile) {
      scrollToSection("cotiza");
      return;
    }

    setSelectedBrand(null);
    setIsCotizaOpen(true);
    wheelLockRef.current = true;
    setIsAnimating(true);
    unlockAfterDelay();
  }, [isMobile, scrollToSection, unlockAfterDelay]);

  const handleCloseCotiza = useCallback(() => {
    wheelLockRef.current = true;
    setIsAnimating(true);
    setIsCotizaOpen(false);
    unlockAfterDelay();
  }, [unlockAfterDelay]);

  const handleOpenBrandDetails = useCallback(
    (brand: SelectedBrand) => {
      wheelLockRef.current = true;
      setIsAnimating(true);
      setIsCotizaOpen(false);
      setSelectedBrand(brand);
      unlockAfterDelay();
    },
    [unlockAfterDelay]
  );

  const handleCloseBrandDetails = useCallback(() => {
    wheelLockRef.current = true;
    setIsAnimating(true);
    setSelectedBrand(null);
    unlockAfterDelay();
  }, [unlockAfterDelay]);

  const handleGoToServicios = useCallback(() => {
    if (isMobile) {
      scrollToSection("servicios");
      return;
    }

    wheelLockRef.current = true;
    setIsAnimating(true);

    setIsCotizaOpen(false);
    setSelectedBrand(null);
    setActiveScene(2);

    unlockAfterDelay();
  }, [isMobile, scrollToSection, unlockAfterDelay]);

  useEffect(() => {
    if (isMobile) return;

    const onWheel = (event: WheelEvent) => {
      if (isCotizaOpen) return;
      if (selectedBrand) return;
      if (isCubeHovered) return;
      if (wheelLockRef.current || isAnimating) return;

      const threshold = 52;
      if (Math.abs(event.deltaY) < threshold) return;

      wheelLockRef.current = true;
      setIsAnimating(true);

      if (event.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }

      unlockAfterDelay();
    };

    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [
    goNext,
    goPrev,
    isAnimating,
    unlockAfterDelay,
    isCubeHovered,
    isCotizaOpen,
    selectedBrand,
    isMobile,
  ]);

  const shouldShowOverlayUi =
    !isMobile && !isCotizaOpen && !selectedBrand;

  return (
    <main
      className={`relative w-full overflow-x-hidden text-white ${
        isMobile ? "min-h-screen" : "h-[100svh] overflow-hidden"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,#7a4dff_0%,#4e1cbb_18%,#23114a_54%,#090912_100%)]" />
        <div className="absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.12)_0_1px,transparent_1.5px)] bg-[length:180px_180px]" />
          <div className="absolute left-[8%] top-[10%] h-48 w-48 rounded-full bg-fuchsia-500/10 blur-2xl" />
          <div className="absolute right-[10%] top-[12%] h-52 w-52 rounded-full bg-violet-500/10 blur-2xl" />
          <div className="absolute bottom-[8%] left-[30%] h-40 w-40 rounded-full bg-blue-500/8 blur-2xl" />
        </div>
      </div>

      <div className={`relative z-10 w-full ${isMobile ? "min-h-screen" : "h-full"}`}>
        <FixedHeader
          activeScene={activeScene}
          onJump={handleJump}
          onOpenCotiza={handleOpenCotiza}
          isCotizaOpen={isCotizaOpen}
          isMobileSinglePage={isMobile}
        />

        {isMobile ? (
          <div className="relative z-10 flex flex-col gap-5 pb-8 pt-[84px]">
            <MobileSection id="inicio" className="pt-1">
              <IntroScene
                titleTop="EL EQUIPO QUE"
                titleBottom="CONCRETA TUS IDEAS"
                description="CON MÁS DE 100 TRABAJOS REALIZADOS, RUBIK CREACIONES CRECE CONTIGO, ¿QUÉ ESPERAS PARA TRABAJAR JUNTOS?"
                primary="Cotiza con nosotros"
                secondary="Ver nuestros trabajos"
                onCubeHoverChange={() => {}}
                onOpenCotiza={handleOpenCotiza}
                onGoToServicios={handleGoToServicios}
              />
            </MobileSection>

            <MobileSection id="marcas">
              <BrandShowcase onOpenBrandDetails={handleOpenBrandDetails} />
            </MobileSection>

            <MobileSection id="servicios">
              <WorkScene activeWorkCard={activeWorkCard} />
            </MobileSection>

            <MobileSection id="contacto">
              <ContactScene />
            </MobileSection>

            <MobileSection id="cotiza" className="pb-6">
              <CotizaScene onClose={() => scrollToSection("inicio")} />
            </MobileSection>
          </div>
        ) : (
          <SceneStage
            activeScene={activeScene}
            activeWorkCard={activeWorkCard}
            onCubeHoverChange={setIsCubeHovered}
            isCotizaOpen={isCotizaOpen}
            onOpenCotiza={handleOpenCotiza}
            onGoToServicios={handleGoToServicios}
            onCloseCotiza={handleCloseCotiza}
            selectedBrand={selectedBrand}
            onOpenBrandDetails={handleOpenBrandDetails}
            onCloseBrandDetails={handleCloseBrandDetails}
          />
        )}

        {shouldShowOverlayUi && <ScrollProgress progress={progress} />}

        {shouldShowOverlayUi && (
          <div className="pointer-events-none fixed bottom-10 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur">
            Gira arriba / abajo
          </div>
        )}

        {shouldShowOverlayUi && <CornerSocialPanel />}
      </div>
    </main>
  );
}