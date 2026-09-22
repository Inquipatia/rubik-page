"use client";

import dynamic from "next/dynamic";

// Share the same split points between the desktop stage and mobile sections.
export const BrandShowcase = dynamic(() => import("../scenes/brand-showcase"));
export const WorkScene = dynamic(() => import("../scenes/work-scene"));
export const ContactScene = dynamic(() => import("../scenes/contact-scene"));
export const CotizaScene = dynamic(() => import("../scenes/cotiza-scene"));
