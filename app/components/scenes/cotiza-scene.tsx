"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CotizaSceneProps = {
  onClose: () => void;
};

const serviceOptions = ["Neón", "Stands", "Impresión", "Volumétricas", "Otros"];

const shellTransition = {
  duration: 0.62,
  ease: [0.16, 1, 0.3, 1] as const,
};

const cardTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as const,
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  company: "",
  message: "",
};

export default function CotizaScene({ onClose }: CotizaSceneProps) {
  const [selectedService, setSelectedService] = useState<string>("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const isValid = useMemo(() => {
    return (
      form.name.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      form.message.trim() &&
      selectedService.trim()
    );
  }, [form, selectedService]);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (status.type === "error") {
        setStatus({ type: null, message: "" });
      }
    };

  const handleSelectService = (service: string) => {
    setSelectedService(service);

    if (status.type === "error") {
      setStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      setStatus({
        type: "error",
        message: "Completa nombre, teléfono, correo, servicio y detalle.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: null, message: "" });

      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          company: form.company,
          service: selectedService,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "No se pudo enviar el correo.");
      }

      setForm(initialForm);
      setSelectedService("");
      setShowSuccessOverlay(true);

      window.setTimeout(() => {
        setShowSuccessOverlay(false);
      }, 2200);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo enviar el correo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-118px)] w-full items-start justify-center overflow-hidden px-4 pt-3 sm:pt-4 lg:px-6 lg:pt-5">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -14, scale: 0.985, filter: "blur(8px)" }}
        transition={shellTransition}
        className="relative mx-auto w-full max-w-[980px] transform-gpu will-change-transform lg:max-w-[1060px] xl:max-w-[1120px]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[8%] h-24 w-24 rounded-full bg-fuchsia-500/12 blur-3xl" />
          <div className="absolute bottom-[10%] right-[8%] h-28 w-28 rounded-full bg-violet-500/12 blur-3xl" />
          <div className="absolute left-1/2 top-[18%] h-20 w-20 -translate-x-1/2 rounded-full bg-white/6 blur-2xl" />
        </div>

        <div className="mb-5 flex items-start justify-between gap-4 lg:mb-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.04,
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="transform-gpu will-change-transform"
          >
            <h2 className="omnes-title text-[1.7rem] text-white sm:text-[1.9rem] lg:text-[2.05rem] xl:text-[2.2rem]">
              Cuéntanos tu proyecto
            </h2>

            <p className="omnes-text mt-2 max-w-[54ch] text-[14px] leading-6 text-white/78 lg:text-[15px] lg:leading-7">
              Déjanos tus datos y selecciona el servicio que necesitas.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.04fr_0.96fr] lg:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20, y: 8, scale: 0.992 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, y: -4, scale: 0.995 }}
            transition={{ delay: 0.08, ...cardTransition }}
            className="group relative overflow-hidden rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.085),rgba(255,255,255,0.03))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transform-gpu will-change-transform lg:p-5"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-8 top-8 h-20 w-20 rounded-full bg-violet-400/10 blur-3xl transition duration-500 group-hover:bg-violet-400/14" />
              <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-blue-400/8 blur-3xl transition duration-500 group-hover:bg-blue-400/12" />
            </div>

            <div className="relative [transform:translateZ(0)]">
              <p className="omnes-text mb-3 text-[11px] uppercase tracking-[0.16em] text-white/68 lg:text-[12px]">
                Datos de contacto
              </p>

              <form onSubmit={handleSubmit} className="grid gap-3">
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Nombre"
                  className="h-[44px] rounded-[15px] border border-white/10 bg-black/20 px-4 text-[15px] text-white outline-none transition duration-300 placeholder:text-white/42 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="Teléfono"
                  className="h-[44px] rounded-[15px] border border-white/10 bg-black/20 px-4 text-[15px] text-white outline-none transition duration-300 placeholder:text-white/42 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="Correo"
                  className="h-[44px] rounded-[15px] border border-white/10 bg-black/20 px-4 text-[15px] text-white outline-none transition duration-300 placeholder:text-white/42 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <input
                  type="text"
                  value={form.company}
                  onChange={handleChange("company")}
                  placeholder="Empresa (opcional)"
                  className="h-[44px] rounded-[15px] border border-white/10 bg-black/20 px-4 text-[15px] text-white outline-none transition duration-300 placeholder:text-white/42 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <textarea
                  value={form.message}
                  onChange={handleChange("message")}
                  placeholder="Detalle cotización"
                  className="min-h-[132px] rounded-[15px] border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white outline-none transition duration-300 placeholder:text-white/42 focus:border-white/24 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_16px_rgba(143,92,255,0.10)]"
                />

                <AnimatePresence>
                  {status.type === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      transition={{ duration: 0.22 }}
                      className="omnes-text rounded-[15px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-[14px] leading-6 text-rose-100"
                    >
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="menu-shell disabled:pointer-events-none disabled:opacity-70"
                  >
                    <span className="menu-pill is-active cotiza-pill omnes-text text-[14px] font-semibold">
                      {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="menu-shell"
                  >
                    <span className="menu-pill omnes-text text-[14px] font-medium">
                      Regresar
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <AnimatePresence>
              {showSuccessOverlay && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    y: 14,
                    filter: "blur(10px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    y: 10,
                    filter: "blur(8px)",
                  }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[22px] bg-[rgba(8,6,20,0.34)] backdrop-blur-[6px]"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: 0.05, duration: 0.25 }}
                    className="flex min-w-[280px] max-w-[360px] items-center gap-3 rounded-[20px] border border-emerald-300/20 bg-[linear-gradient(180deg,rgba(9,24,20,0.92),rgba(8,18,16,0.88))] px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.30),0_0_30px_rgba(16,185,129,0.08)]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/12">
                      <motion.span
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.12, duration: 0.2 }}
                        className="text-[18px] text-emerald-100"
                      >
                        ✓
                      </motion.span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="omnes-title text-[15px] text-white">
                        Solicitud enviada
                      </p>
                      <p className="omnes-text text-[13px] leading-5 text-white/78">
                        Te contactaremos pronto con una respuesta.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: 8, scale: 0.992 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, y: -4, scale: 0.995 }}
            transition={{ delay: 0.12, ...cardTransition }}
            className="group relative overflow-hidden rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.028))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transform-gpu will-change-transform lg:p-5"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-fuchsia-400/10 blur-3xl transition duration-500 group-hover:bg-fuchsia-400/16" />
              <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-violet-500/8 blur-3xl transition duration-500 group-hover:bg-violet-500/12" />
            </div>

            <div className="relative [transform:translateZ(0)]">
              <p className="omnes-text mb-3 text-[11px] uppercase tracking-[0.16em] text-white/68 lg:text-[12px]">
                Selecciona un servicio
              </p>

              <div className="grid gap-2.5">
                {serviceOptions.map((item, index) => {
                  const isSelected = selectedService === item;

                  return (
                    <motion.button
                      key={item}
                      type="button"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.18 + index * 0.045,
                        duration: 0.24,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onClick={() => handleSelectService(item)}
                      className={`flex min-h-[50px] items-center gap-3 rounded-[15px] px-4 text-left transition duration-300 ${
                        isSelected
                          ? "border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_22px_rgba(255,255,255,0.06)]"
                          : "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] text-white/84 hover:border-white/22 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.04))]"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition duration-300 ${
                          isSelected
                            ? "border-white bg-white shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                            : "border-white/30 bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.22)]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full bg-[#5d2bbf] transition duration-300 ${
                            isSelected
                              ? "scale-100 opacity-100"
                              : "scale-0 opacity-0"
                          }`}
                        />
                      </span>

                      <span
                        className={`omnes-text text-[15px] transition duration-300 ${
                          isSelected ? "text-white" : "text-white/88"
                        }`}
                      >
                        {item}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[15px] border border-white/10 bg-black/16 px-4 py-4">
                <p className="omnes-text text-[14px] leading-7 text-white/72 lg:text-[15px]">
                  {selectedService
                    ? `Servicio seleccionado: ${selectedService}. Completa tus datos para preparar una cotización más precisa.`
                    : "Elige el tipo de trabajo para orientar mejor la cotización y preparar una propuesta visual más precisa."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}