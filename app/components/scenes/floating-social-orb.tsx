"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOrbInteraction } from "../experience/use-orb-interaction";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

type FloatingSocialOrbProps = {
  visible?: boolean;
  className?: string;
  resetKey?: string | number | boolean | null;
};

type SplineObject = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale?: {
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
};

type SplineApp = {
  setGlobalEvents?: (global: boolean) => void;
  emitEvent?: (event: "mouseHover", name: string) => void;
  emitEventReverse?: (event: "mouseHover", name: string) => void;
  findObjectByName?: (name: string) => SplineObject | undefined;
  setVariable?: (name: string, value: number | boolean | string) => void;
  setVariables?: (variables: Record<string, number | boolean | string>) => void;
  getVariable?: (name: string) => unknown;
};

type TransformSnapshot = {
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
};

type DanceStateName = "base" | "abajo" | "estirar" | "arriba";

type DanceStep = {
  state: DanceStateName;
  duration: number;
};

const SPLINE_SCENE_URL =
  "https://prod.spline.design/rWCCsSXcaU52lNsR/scene.splinecode";

const HOVER_SOUND_URL = "/sounds/openningbbpop.mp3";
const BOUNCE_SOUND_URL = "/sounds/jump2_join.mp3";

const HOVER_SOUND_COOLDOWN_MS = 900;
const BOUNCE_SOUND_DELAY_MS = 120;

const VIEW_ACT_OBJECT_NAME = "ViewAct";
const EYES_CONTROL_OBJECT_NAME = "eyesControl";
const ORB_ROOT_OBJECT_NAME = "orbRoot";

const IDLE_DANCE_EVERY_MS = 60_000;

const EYES_DEAD_ZONE = 0.08;
const EYES_MAX_X = 34;
const EYES_MAX_Y = 28;
const EYES_FOLLOW_SMOOTHNESS = 0.16;
const EYES_RESET_DURATION_MS = 420;

const EYE_LEFT_BLINK_OBJECT_NAME = "eyeLeftBlink";
const EYE_RIGHT_BLINK_OBJECT_NAME = "eyeRightBlink";

const BLINK_MIN_DELAY_MS = 4_200;
const BLINK_RANDOM_EXTRA_DELAY_MS = 3_800;
const BLINK_CLOSE_MS = 55;
const BLINK_HOLD_MS = 45;
const BLINK_OPEN_MS = 75;
const BLINK_CLOSED_SCALE_Y = 0.06;

/**
 * Estados capturados desde Spline para orbRoot.
 * El signo/interrogación queda fuera del código.
 */
const ORB_ROOT_DANCE_STATES: Record<DanceStateName, TransformSnapshot> = {
  base: {
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  abajo: {
    position: { x: 8.85, y: -124, z: 0 },
    scale: { x: 1.03, y: 0.39, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  estirar: {
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 0.34, y: 1.01, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  arriba: {
    position: { x: 35.91, y: 118.9, z: -2 },
    scale: { x: 0.8, y: 0.39, z: 1 },
    rotation: { x: 0, y: 0, z: 0 },
  },
};

const DANCE_SEQUENCE: DanceStep[] = [
  { state: "base", duration: 110 },
  { state: "abajo", duration: 150 },
  { state: "estirar", duration: 300 },
  { state: "arriba", duration: 200 },
  { state: "estirar", duration: 100 },
  { state: "abajo", duration: 150 },
  { state: "estirar", duration: 300 },
  { state: "arriba", duration: 100 },
  { state: "estirar", duration: 80 },
  { state: "abajo", duration: 120 },
  { state: "estirar", duration: 300 },
  { state: "arriba", duration: 130 },
  { state: "estirar", duration: 90 },
  { state: "abajo", duration: 110 },
  { state: "base", duration: 140 },
];

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function applyTransformSnapshot(
  object: SplineObject | null,
  snapshot: TransformSnapshot
) {
  if (!object) return;

  object.position.x = snapshot.position.x;
  object.position.y = snapshot.position.y;
  object.position.z = snapshot.position.z;

  if (object.scale) {
    object.scale.x = snapshot.scale.x;
    object.scale.y = snapshot.scale.y;
    object.scale.z = snapshot.scale.z;
  }

  if (object.rotation && snapshot.rotation) {
    object.rotation.x = snapshot.rotation.x;
    object.rotation.y = snapshot.rotation.y;
    object.rotation.z = snapshot.rotation.z;
  }
}

function getInterpolatedSnapshot(
  states: Record<DanceStateName, TransformSnapshot>,
  fromState: DanceStateName,
  toState: DanceStateName,
  progress: number
): TransformSnapshot {
  const from = states[fromState];
  const to = states[toState];
  const eased = easeInOutCubic(progress);

  return {
    position: {
      x: lerp(from.position.x, to.position.x, eased),
      y: lerp(from.position.y, to.position.y, eased),
      z: lerp(from.position.z, to.position.z, eased),
    },
    scale: {
      x: lerp(from.scale.x, to.scale.x, eased),
      y: lerp(from.scale.y, to.scale.y, eased),
      z: lerp(from.scale.z, to.scale.z, eased),
    },
    rotation: {
      x: lerp(from.rotation?.x ?? 0, to.rotation?.x ?? 0, eased),
      y: lerp(from.rotation?.y ?? 0, to.rotation?.y ?? 0, eased),
      z: lerp(from.rotation?.z ?? 0, to.rotation?.z ?? 0, eased),
    },
  };
}

function getDanceFrame(elapsed: number) {
  let cursor = 0;

  for (let index = 0; index < DANCE_SEQUENCE.length - 1; index += 1) {
    const fromStep = DANCE_SEQUENCE[index];
    const toStep = DANCE_SEQUENCE[index + 1];
    const segmentDuration = toStep.duration;

    if (elapsed <= cursor + segmentDuration) {
      const progress = Math.min((elapsed - cursor) / segmentDuration, 1);

      return getInterpolatedSnapshot(
        ORB_ROOT_DANCE_STATES,
        fromStep.state,
        toStep.state,
        progress
      );
    }

    cursor += segmentDuration;
  }

  return ORB_ROOT_DANCE_STATES.base;
}

export default function FloatingSocialOrb({
  visible = true,
  className = "",
  resetKey = null,
}: FloatingSocialOrbProps) {
  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);
  const [isSplineReady, setIsSplineReady] = useState(false);
  const loadIdleTimeoutRef = useRef<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const orbWrapRef = useRef<HTMLDivElement | null>(null);
  const splineAppRef = useRef<SplineApp | null>(null);
  const orbRootRef = useRef<SplineObject | null>(null);

  const idleDanceStartTimeoutRef = useRef<number | null>(null);
  const idleDanceIntervalRef = useRef<number | null>(null);
  const idleDanceAnimationFrameRef = useRef<number | null>(null);
  const idleDanceLoopStartedRef = useRef(false);
  const isIdleDanceAnimatingRef = useRef(false);

  const eyesControlRef = useRef<SplineObject | null>(null);
  const centerPositionRef = useRef<{ x: number; y: number; z: number } | null>(
    null
  );

  const blinkObjectsRef = useRef<SplineObject[]>([]);
  const blinkBaseScalesRef = useRef<{ x: number; y: number; z: number }[]>([]);
  const blinkTimeoutRef = useRef<number | null>(null);
  const blinkAnimationFrameRef = useRef<number | null>(null);
  const blinkLoopStartedRef = useRef(false);

  const resetAnimationFrameRef = useRef<number | null>(null);
  const bounceSoundTimeoutRef = useRef<number | null>(null);
  const softResetTimeoutRef = useRef<number | null>(null);
  const tabRestoreTimeoutRef = useRef<number | null>(null);

  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const bounceAudioRef = useRef<HTMLAudioElement | null>(null);

  const lastHoverSoundAtRef = useRef(0);
  const audioUnlockedRef = useRef(false);
  const isUnlockingAudioRef = useRef(false);

  const isViewActHoveringRef = useRef(false);
  const hasViewActSoundPlayedForCurrentHoverRef = useRef(false);

  const visibleRef = useRef(visible);
  const soundEnabledRef = useRef(soundEnabled);
  const isPageHiddenRef = useRef(false);

  const hasInitializedResetKeyWatcherRef = useRef(false);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const hoverAudio = new Audio(HOVER_SOUND_URL);
    hoverAudio.volume = 0.35;
    hoverAudio.preload = "auto";
    hoverAudio.load();
    hoverAudioRef.current = hoverAudio;

    const bounceAudio = new Audio(BOUNCE_SOUND_URL);
    bounceAudio.volume = 0.55;
    bounceAudio.preload = "auto";
    bounceAudio.load();
    bounceAudioRef.current = bounceAudio;

    return () => {
      if (hoverAudioRef.current) {
        hoverAudioRef.current.pause();
        hoverAudioRef.current.src = "";
        hoverAudioRef.current.load();
        hoverAudioRef.current = null;
      }

      if (bounceAudioRef.current) {
        bounceAudioRef.current.pause();
        bounceAudioRef.current.src = "";
        bounceAudioRef.current.load();
        bounceAudioRef.current = null;
      }

      if (bounceSoundTimeoutRef.current) {
        window.clearTimeout(bounceSoundTimeoutRef.current);
        bounceSoundTimeoutRef.current = null;
      }

      if (softResetTimeoutRef.current) {
        window.clearTimeout(softResetTimeoutRef.current);
        softResetTimeoutRef.current = null;
      }

      if (tabRestoreTimeoutRef.current) {
        window.clearTimeout(tabRestoreTimeoutRef.current);
        tabRestoreTimeoutRef.current = null;
      }
    };
  }, []);

  const unlockAudio = async () => {
    if (audioUnlockedRef.current || isUnlockingAudioRef.current) {
      return true;
    }

    isUnlockingAudioRef.current = true;

    const unlockOneAudio = async (audio: HTMLAudioElement | null) => {
      if (!audio) return false;

      try {
        audio.muted = true;
        audio.currentTime = 0;

        await audio.play();

        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;

        return true;
      } catch {
        audio.muted = false;
        return false;
      }
    };

    try {
      const hoverUnlocked = await unlockOneAudio(hoverAudioRef.current);
      const bounceUnlocked = await unlockOneAudio(bounceAudioRef.current);

      audioUnlockedRef.current = hoverUnlocked || bounceUnlocked || true;

      return true;
    } finally {
      isUnlockingAudioRef.current = false;
    }
  };

  const prepareBounceAudio = async () => {
    const audio = bounceAudioRef.current;
    if (!audio) return;

    try {
      const previousVolume = audio.volume;

      audio.muted = false;
      audio.volume = 0.01;
      audio.currentTime = 0;

      await audio.play();

      audio.pause();
      audio.currentTime = 0;
      audio.volume = previousVolume || 0.55;
    } catch {
      // El navegador puede bloquear la preparación del audio.
    }
  };

  const enableSound = async () => {
    await unlockAudio();

    audioUnlockedRef.current = true;
    soundEnabledRef.current = true;
    setSoundEnabled(true);

    await prepareBounceAudio();
  };

  const disableSound = () => {
    soundEnabledRef.current = false;
    setSoundEnabled(false);

    if (hoverAudioRef.current) {
      hoverAudioRef.current.pause();
      hoverAudioRef.current.currentTime = 0;
    }

    if (bounceAudioRef.current) {
      bounceAudioRef.current.pause();
      bounceAudioRef.current.currentTime = 0;
    }

    if (bounceSoundTimeoutRef.current) {
      window.clearTimeout(bounceSoundTimeoutRef.current);
      bounceSoundTimeoutRef.current = null;
    }
  };

  const toggleSound = async () => {
    if (soundEnabledRef.current) {
      disableSound();
      return;
    }

    await enableSound();
  };

  const handleSoundPointerDown = async (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    await toggleSound();
  };

  const playHoverSound = () => {
    if (!visibleRef.current) return;
    if (isPageHiddenRef.current) return;
    if (!soundEnabledRef.current) return;
    if (!audioUnlockedRef.current) return;

    const now = Date.now();

    if (now - lastHoverSoundAtRef.current < HOVER_SOUND_COOLDOWN_MS) {
      return;
    }

    lastHoverSoundAtRef.current = now;

    const audio = hoverAudioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = 0.35;
    audio.currentTime = 0;

    audio.play().catch(() => { });
  };

  const playBounceSound = (delayMs = BOUNCE_SOUND_DELAY_MS) => {
    if (bounceSoundTimeoutRef.current) {
      window.clearTimeout(bounceSoundTimeoutRef.current);
      bounceSoundTimeoutRef.current = null;
    }

    bounceSoundTimeoutRef.current = window.setTimeout(() => {
      if (!visibleRef.current) return;
      if (isPageHiddenRef.current) return;
      if (!soundEnabledRef.current) return;
      if (!audioUnlockedRef.current) return;

      const audio = bounceAudioRef.current;
      if (!audio) return;

      audio.muted = false;
      audio.volume = 0.55;
      audio.currentTime = 0;

      audio.play().catch(() => { });
    }, delayMs);
  };

  const resetOrbDanceTransforms = () => {
    applyTransformSnapshot(orbRootRef.current, ORB_ROOT_DANCE_STATES.base);
  };

  const cancelIdleDanceAnimation = () => {
    if (idleDanceAnimationFrameRef.current) {
      window.cancelAnimationFrame(idleDanceAnimationFrameRef.current);
      idleDanceAnimationFrameRef.current = null;
    }

    isIdleDanceAnimatingRef.current = false;
  };

  const animateOrbDanceByCode = () => {
    if (!orbRootRef.current) return;
    if (!visibleRef.current) return;
    if (isPageHiddenRef.current) return;
    if (isViewActHoveringRef.current) return;
    if (isIdleDanceAnimatingRef.current) return;

    cancelIdleDanceAnimation();

    isIdleDanceAnimatingRef.current = true;

    const totalDuration = DANCE_SEQUENCE.reduce(
      (total, step) => total + step.duration,
      0
    );

    const startTime = performance.now();

    const animate = (time: number) => {
      if (!visibleRef.current || isPageHiddenRef.current) {
        idleDanceAnimationFrameRef.current = null;
        isIdleDanceAnimatingRef.current = false;
        resetOrbDanceTransforms();
        return;
      }

      const elapsed = Math.min(time - startTime, totalDuration);
      const frame = getDanceFrame(elapsed);

      applyTransformSnapshot(orbRootRef.current, frame);

      if (elapsed < totalDuration) {
        idleDanceAnimationFrameRef.current = window.requestAnimationFrame(
          animate
        );
        return;
      }

      idleDanceAnimationFrameRef.current = null;
      isIdleDanceAnimatingRef.current = false;
      resetOrbDanceTransforms();
    };

    idleDanceAnimationFrameRef.current = window.requestAnimationFrame(animate);
  };

  const cancelEyesResetAnimation = () => {
    if (resetAnimationFrameRef.current) {
      window.cancelAnimationFrame(resetAnimationFrameRef.current);
      resetAnimationFrameRef.current = null;
    }
  };

  const resetEyesPosition = () => {
    const eyesControl = eyesControlRef.current;
    const center = centerPositionRef.current;

    if (!eyesControl || !center) return;

    eyesControl.position.x = center.x;
    eyesControl.position.y = center.y;
    eyesControl.position.z = center.z;
  };

  const animateEyesToCenter = () => {
    const eyesControl = eyesControlRef.current;
    const center = centerPositionRef.current;

    if (!eyesControl || !center) return;

    if (isPageHiddenRef.current) {
      resetEyesPosition();
      return;
    }

    cancelEyesResetAnimation();

    const startX = eyesControl.position.x;
    const startY = eyesControl.position.y;
    const startZ = eyesControl.position.z;
    const startTime = performance.now();

    const animate = (time: number) => {
      if (isPageHiddenRef.current) {
        resetAnimationFrameRef.current = null;
        resetEyesPosition();
        return;
      }

      const rawProgress = Math.min(
        (time - startTime) / EYES_RESET_DURATION_MS,
        1
      );

      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

      eyesControl.position.x =
        startX + (center.x - startX) * easedProgress;
      eyesControl.position.y =
        startY + (center.y - startY) * easedProgress;
      eyesControl.position.z =
        startZ + (center.z - startZ) * easedProgress;

      if (rawProgress < 1) {
        resetAnimationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        resetAnimationFrameRef.current = null;
        resetEyesPosition();
      }
    };

    resetAnimationFrameRef.current = window.requestAnimationFrame(animate);
  };

  const scheduleEyesPositionReset = () => {
    animateEyesToCenter();
  };

  const cancelBlinkAnimation = () => {
    if (blinkAnimationFrameRef.current) {
      window.cancelAnimationFrame(blinkAnimationFrameRef.current);
      blinkAnimationFrameRef.current = null;
    }
  };

  const resetBlinkScale = () => {
    blinkObjectsRef.current.forEach((blinkObject, index) => {
      const baseScale = blinkBaseScalesRef.current[index];

      if (!blinkObject?.scale || !baseScale) return;

      blinkObject.scale.x = baseScale.x;
      blinkObject.scale.y = baseScale.y;
      blinkObject.scale.z = baseScale.z;
    });
  };

  const clearEyeBlinkTimers = () => {
    if (blinkTimeoutRef.current) {
      window.clearTimeout(blinkTimeoutRef.current);
      blinkTimeoutRef.current = null;
    }

    cancelBlinkAnimation();
    resetBlinkScale();

    blinkLoopStartedRef.current = false;
  };

  const easeOutCubic = (value: number) => {
    return 1 - Math.pow(1 - value, 3);
  };

  const getNextBlinkDelay = () => {
    return BLINK_MIN_DELAY_MS + Math.random() * BLINK_RANDOM_EXTRA_DELAY_MS;
  };

  const scheduleNextBlink = () => {
    if (!visibleRef.current) return;
    if (isPageHiddenRef.current) return;
    if (!shouldRenderSpline) return;
    if (blinkObjectsRef.current.length === 0) return;

    if (blinkTimeoutRef.current) {
      window.clearTimeout(blinkTimeoutRef.current);
      blinkTimeoutRef.current = null;
    }

    blinkTimeoutRef.current = window.setTimeout(() => {
      blinkTimeoutRef.current = null;
      animateBlink();
    }, getNextBlinkDelay());
  };

  const animateBlink = () => {
    const blinkObjects = blinkObjectsRef.current;
    const baseScales = blinkBaseScalesRef.current;

    if (!visibleRef.current) return;
    if (isPageHiddenRef.current) return;
    if (blinkObjects.length === 0) return;

    cancelBlinkAnimation();

    const startTime = performance.now();
    const totalDuration = BLINK_CLOSE_MS + BLINK_HOLD_MS + BLINK_OPEN_MS;

    const animate = (time: number) => {
      if (isPageHiddenRef.current) {
        blinkAnimationFrameRef.current = null;
        resetBlinkScale();
        return;
      }

      const elapsed = time - startTime;

      blinkObjects.forEach((blinkObject, index) => {
        const baseScale = baseScales[index];

        if (!blinkObject?.scale || !baseScale) return;

        const baseY = baseScale.y;
        const closedY = baseY * BLINK_CLOSED_SCALE_Y;

        if (elapsed <= BLINK_CLOSE_MS) {
          const progress = Math.min(elapsed / BLINK_CLOSE_MS, 1);
          const eased = easeOutCubic(progress);

          blinkObject.scale.y = baseY + (closedY - baseY) * eased;
        } else if (elapsed <= BLINK_CLOSE_MS + BLINK_HOLD_MS) {
          blinkObject.scale.y = closedY;
        } else if (elapsed <= totalDuration) {
          const openElapsed = elapsed - BLINK_CLOSE_MS - BLINK_HOLD_MS;
          const progress = Math.min(openElapsed / BLINK_OPEN_MS, 1);
          const eased = easeOutCubic(progress);

          blinkObject.scale.y = closedY + (baseY - closedY) * eased;
        } else {
          blinkObject.scale.x = baseScale.x;
          blinkObject.scale.y = baseScale.y;
          blinkObject.scale.z = baseScale.z;
        }

        blinkObject.scale.x = baseScale.x;
        blinkObject.scale.z = baseScale.z;
      });

      if (elapsed <= totalDuration) {
        blinkAnimationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        blinkAnimationFrameRef.current = null;
        resetBlinkScale();
        scheduleNextBlink();
      }
    };

    blinkAnimationFrameRef.current = window.requestAnimationFrame(animate);
  };

  const startEyeBlinkLoop = () => {
    if (!visibleRef.current) return;
    if (isPageHiddenRef.current) return;
    if (!shouldRenderSpline) return;
    if (blinkObjectsRef.current.length === 0) return;

    if (blinkLoopStartedRef.current) return;

    blinkLoopStartedRef.current = true;
    resetBlinkScale();
    scheduleNextBlink();
  };

  const clearIdleDanceTimers = () => {
    if (idleDanceStartTimeoutRef.current) {
      window.clearTimeout(idleDanceStartTimeoutRef.current);
      idleDanceStartTimeoutRef.current = null;
    }

    if (idleDanceIntervalRef.current) {
      window.clearInterval(idleDanceIntervalRef.current);
      idleDanceIntervalRef.current = null;
    }

    cancelIdleDanceAnimation();
    resetOrbDanceTransforms();

    idleDanceLoopStartedRef.current = false;
  };

  const resetOrbAnimationState = () => {
    clearIdleDanceTimers();
    clearEyeBlinkTimers();
    cancelEyesResetAnimation();
    cancelIdleDanceAnimation();

    if (softResetTimeoutRef.current) {
      window.clearTimeout(softResetTimeoutRef.current);
      softResetTimeoutRef.current = null;
    }

    if (bounceSoundTimeoutRef.current) {
      window.clearTimeout(bounceSoundTimeoutRef.current);
      bounceSoundTimeoutRef.current = null;
    }

    if (bounceAudioRef.current) {
      bounceAudioRef.current.pause();
      bounceAudioRef.current.currentTime = 0;
    }

    resetOrbDanceTransforms();
    resetEyesPosition();
    resetBlinkScale();

    isViewActHoveringRef.current = false;
    hasViewActSoundPlayedForCurrentHoverRef.current = false;

    softResetTimeoutRef.current = window.setTimeout(() => {
      if (!visibleRef.current) return;
      if (isPageHiddenRef.current) return;

      startIdleDanceLoop();
      startEyeBlinkLoop();

      softResetTimeoutRef.current = null;
    }, 160);
  };

  const softSceneChangeReset = () => {
    clearIdleDanceTimers();
    clearEyeBlinkTimers();
    cancelEyesResetAnimation();
    cancelIdleDanceAnimation();

    if (softResetTimeoutRef.current) {
      window.clearTimeout(softResetTimeoutRef.current);
      softResetTimeoutRef.current = null;
    }

    if (bounceSoundTimeoutRef.current) {
      window.clearTimeout(bounceSoundTimeoutRef.current);
      bounceSoundTimeoutRef.current = null;
    }

    if (bounceAudioRef.current) {
      bounceAudioRef.current.pause();
      bounceAudioRef.current.currentTime = 0;
    }

    resetOrbDanceTransforms();
    resetEyesPosition();
    resetBlinkScale();

    isViewActHoveringRef.current = false;
    hasViewActSoundPlayedForCurrentHoverRef.current = false;

    softResetTimeoutRef.current = window.setTimeout(() => {
      if (!visibleRef.current) return;
      if (isPageHiddenRef.current) return;

      scheduleEyesPositionReset();
      startEyeBlinkLoop();

      window.setTimeout(() => {
        if (!visibleRef.current) return;
        if (isPageHiddenRef.current) return;
        if (isViewActHoveringRef.current) return;

        startIdleDanceLoop();
      }, 720);

      softResetTimeoutRef.current = null;
    }, 160);
  };

  const pauseOrbForHiddenTab = () => {
    isPageHiddenRef.current = true;

    clearIdleDanceTimers();
    clearEyeBlinkTimers();
    cancelEyesResetAnimation();
    cancelIdleDanceAnimation();

    if (softResetTimeoutRef.current) {
      window.clearTimeout(softResetTimeoutRef.current);
      softResetTimeoutRef.current = null;
    }

    if (bounceSoundTimeoutRef.current) {
      window.clearTimeout(bounceSoundTimeoutRef.current);
      bounceSoundTimeoutRef.current = null;
    }

    if (tabRestoreTimeoutRef.current) {
      window.clearTimeout(tabRestoreTimeoutRef.current);
      tabRestoreTimeoutRef.current = null;
    }

    if (hoverAudioRef.current) {
      hoverAudioRef.current.pause();
      hoverAudioRef.current.currentTime = 0;
    }

    if (bounceAudioRef.current) {
      bounceAudioRef.current.pause();
      bounceAudioRef.current.currentTime = 0;
    }

    resetOrbDanceTransforms();
    resetEyesPosition();
    resetBlinkScale();

    isViewActHoveringRef.current = false;
    hasViewActSoundPlayedForCurrentHoverRef.current = false;
  };

  const restoreOrbAfterTabReturn = () => {
    if (document.hidden) return;

    isPageHiddenRef.current = false;

    if (tabRestoreTimeoutRef.current) {
      window.clearTimeout(tabRestoreTimeoutRef.current);
      tabRestoreTimeoutRef.current = null;
    }

    tabRestoreTimeoutRef.current = window.setTimeout(() => {
      if (!visibleRef.current) return;

      resetOrbAnimationState();

      tabRestoreTimeoutRef.current = null;
    }, 180);
  };

  const keepOrbAliveOnSceneChange = () => {
    /**
     * Cambio de vista:
     * NO reseteamos orbRoot.
     * NO cortamos la animación si justo está saltando.
     * Solo liberamos hover, recentramos ojos y aseguramos que los loops sigan vivos.
     */
    isViewActHoveringRef.current = false;
    hasViewActSoundPlayedForCurrentHoverRef.current = false;

    if (isPageHiddenRef.current) return;
    if (!visibleRef.current) return;

    scheduleEyesPositionReset();
    startEyeBlinkLoop();

    window.setTimeout(() => {
      if (!visibleRef.current) return;
      if (isPageHiddenRef.current) return;
      if (isViewActHoveringRef.current) return;

      startIdleDanceLoop();
    }, 180);
  };

  useEffect(() => {
    if (!hasInitializedResetKeyWatcherRef.current) {
      hasInitializedResetKeyWatcherRef.current = true;
      return;
    }

    keepOrbAliveOnSceneChange();
  }, [resetKey]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseOrbForHiddenTab();
        return;
      }

      restoreOrbAfterTabReturn();
    };

    const handleWindowFocus = () => {
      restoreOrbAfterTabReturn();
    };

    const handlePageShow = () => {
      restoreOrbAfterTabReturn();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("pageshow", handlePageShow);

      if (tabRestoreTimeoutRef.current) {
        window.clearTimeout(tabRestoreTimeoutRef.current);
        tabRestoreTimeoutRef.current = null;
      }
    };
  }, [shouldRenderSpline]);

  const triggerIdleDance = () => {
    if (!visibleRef.current) return;
    if (isPageHiddenRef.current) return;
    if (isViewActHoveringRef.current) return;
    if (isIdleDanceAnimatingRef.current) return;

    animateOrbDanceByCode();
    playBounceSound(BOUNCE_SOUND_DELAY_MS);
    scheduleEyesPositionReset();
  };

  const startIdleDanceLoop = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!visibleRef.current) return;
    if (isPageHiddenRef.current) return;
    if (!shouldRenderSpline) return;
    if (!splineAppRef.current) return;
    if (!orbRootRef.current) return;

    if (isViewActHoveringRef.current) return;
    if (idleDanceLoopStartedRef.current) return;

    idleDanceLoopStartedRef.current = true;

    idleDanceStartTimeoutRef.current = window.setTimeout(() => {
      if (isPageHiddenRef.current) {
        clearIdleDanceTimers();
        return;
      }

      if (isViewActHoveringRef.current) {
        clearIdleDanceTimers();
        return;
      }

      triggerIdleDance();

      idleDanceIntervalRef.current = window.setInterval(() => {
        if (isPageHiddenRef.current) {
          clearIdleDanceTimers();
          return;
        }

        if (isViewActHoveringRef.current) {
          clearIdleDanceTimers();
          return;
        }

        triggerIdleDance();
      }, IDLE_DANCE_EVERY_MS);
    }, IDLE_DANCE_EVERY_MS);
  };

  const restartIdleDanceLoop = () => {
    clearIdleDanceTimers();

    if (isViewActHoveringRef.current) return;
    if (isPageHiddenRef.current) return;

    startIdleDanceLoop();
  };

  useEffect(() => {
    if (!visible) {
      clearIdleDanceTimers();
      clearEyeBlinkTimers();
      return;
    }

    if (isPageHiddenRef.current) return;

    startIdleDanceLoop();
    startEyeBlinkLoop();

    return () => {
      clearIdleDanceTimers();
      clearEyeBlinkTimers();
    };
  }, [visible, shouldRenderSpline]);

  const handleSplineMouseHover = (eventRaw: { target?: { name?: string } }) => {
    const targetName = eventRaw?.target?.name;

    if (targetName !== VIEW_ACT_OBJECT_NAME) return;
    if (!orbInteractionActive.current) return;
    if (isPageHiddenRef.current) return;

    isViewActHoveringRef.current = true;
    clearIdleDanceTimers();

    if (hasViewActSoundPlayedForCurrentHoverRef.current) {
      return;
    }

    hasViewActSoundPlayedForCurrentHoverRef.current = true;

    playHoverSound();
  };

  useEffect(() => {
    if (!visible || shouldRenderSpline) return;

    const timeout = window.setTimeout(() => {
      setShouldRenderSpline(true);
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [visible, shouldRenderSpline]);

  useEffect(() => {
    return () => {
      if (loadIdleTimeoutRef.current) window.clearTimeout(loadIdleTimeoutRef.current);
      cancelEyesResetAnimation();
      clearEyeBlinkTimers();
      clearIdleDanceTimers();
      cancelIdleDanceAnimation();

      if (bounceSoundTimeoutRef.current) {
        window.clearTimeout(bounceSoundTimeoutRef.current);
        bounceSoundTimeoutRef.current = null;
      }

      if (softResetTimeoutRef.current) {
        window.clearTimeout(softResetTimeoutRef.current);
        softResetTimeoutRef.current = null;
      }

      if (tabRestoreTimeoutRef.current) {
        window.clearTimeout(tabRestoreTimeoutRef.current);
        tabRestoreTimeoutRef.current = null;
      }

      resetOrbDanceTransforms();
    };
  }, []);

  const visibilityClasses = useMemo(() => {
    return visible
      ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
      : "pointer-events-none opacity-0 translate-y-3 scale-95";
  }, [visible]);

  const handleSplineLoad = (splineAppRaw: unknown) => {
    const splineApp = splineAppRaw as SplineApp;

    splineAppRef.current = splineApp;
    splineApp.setGlobalEvents?.(false);

    const orbRoot = splineApp.findObjectByName?.(ORB_ROOT_OBJECT_NAME);

    if (!orbRoot) {
      console.warn(`No encontré ${ORB_ROOT_OBJECT_NAME} en Spline`);
    } else {
      orbRootRef.current = orbRoot;
      applyTransformSnapshot(orbRootRef.current, ORB_ROOT_DANCE_STATES.base);
    }

    const eyesControl = splineApp.findObjectByName?.(
      EYES_CONTROL_OBJECT_NAME
    );

    if (!eyesControl) {
      console.warn(`No encontré ${EYES_CONTROL_OBJECT_NAME} en Spline`);
    }

    if (eyesControl) {
      eyesControlRef.current = eyesControl;

      centerPositionRef.current = {
        x: eyesControl.position.x,
        y: eyesControl.position.y,
        z: eyesControl.position.z,
      };
    }

    const eyeLeftBlink = splineApp.findObjectByName?.(
      EYE_LEFT_BLINK_OBJECT_NAME
    );

    const eyeRightBlink = splineApp.findObjectByName?.(
      EYE_RIGHT_BLINK_OBJECT_NAME
    );

    const blinkObjects = [eyeLeftBlink, eyeRightBlink].filter(
      (object) => object?.scale
    ) as SplineObject[];

    if (blinkObjects.length !== 2) {
      console.warn(
        "No encontré ambos objetos de parpadeo. Revisa que se llamen eyeLeftBlink y eyeRightBlink."
      );
    } else {
      blinkObjectsRef.current = blinkObjects;

      blinkBaseScalesRef.current = blinkObjects.map((object) => ({
        x: object.scale!.x,
        y: object.scale!.y,
        z: object.scale!.z,
      }));

      resetBlinkScale();
    }

    isViewActHoveringRef.current = false;
    hasViewActSoundPlayedForCurrentHoverRef.current = false;

    resetOrbDanceTransforms();
    scheduleEyesPositionReset();

    if (loadIdleTimeoutRef.current) window.clearTimeout(loadIdleTimeoutRef.current);
    loadIdleTimeoutRef.current = window.setTimeout(() => {
      loadIdleTimeoutRef.current = null;
      if (isPageHiddenRef.current) return;

      startIdleDanceLoop();
      startEyeBlinkLoop();
    }, 600);
    setIsSplineReady(true);
  };

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    if (isPageHiddenRef.current) return;

    const wrap = orbWrapRef.current;
    const eyesControl = eyesControlRef.current;
    const center = centerPositionRef.current;

    if (!wrap || !eyesControl || !center) return;

    cancelEyesResetAnimation();

    const rect = wrap.getBoundingClientRect();

    const normalizedX =
      ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    const normalizedY =
      ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    const safeX = Math.abs(normalizedX) < EYES_DEAD_ZONE ? 0 : normalizedX;
    const safeY = Math.abs(normalizedY) < EYES_DEAD_ZONE ? 0 : normalizedY;

    const targetX = center.x + safeX * EYES_MAX_X;
    const targetY = center.y - safeY * EYES_MAX_Y;

    eyesControl.position.x +=
      (targetX - eyesControl.position.x) * EYES_FOLLOW_SMOOTHNESS;

    eyesControl.position.y +=
      (targetY - eyesControl.position.y) * EYES_FOLLOW_SMOOTHNESS;

    eyesControl.position.z = center.z;
  };

  const handleOrbLeave = (resumeIdle: boolean) => {
    splineAppRef.current?.emitEventReverse?.("mouseHover", VIEW_ACT_OBJECT_NAME);
    isViewActHoveringRef.current = false;
    hasViewActSoundPlayedForCurrentHoverRef.current = false;

    if (resumeIdle) {
      scheduleEyesPositionReset();
      restartIdleDanceLoop();
    }
  };

  const orbInteractionActive = useOrbInteraction({
    wrapper: orbWrapRef,
    enabled: visible && isSplineReady,
    resetKey,
    onEnter: () => {
      splineAppRef.current?.emitEvent?.("mouseHover", VIEW_ACT_OBJECT_NAME);
      handleSplineMouseHover({ target: { name: VIEW_ACT_OBJECT_NAME } });
    },
    onLeave: handleOrbLeave,
    onMove: handleMouseMove,
  });

  useEffect(() => {
    if (!visible) return;
    if (isPageHiddenRef.current) return;

    scheduleEyesPositionReset();
    resetBlinkScale();
    startEyeBlinkLoop();
  }, [visible]);

  return (
    <div
      ref={orbWrapRef}
      className={[
        "rubik-orb-wrap fixed bottom-2 right-2 z-[9999] hidden md:block",
        "h-[320px] w-[320px]",
        "overflow-visible",
        "transition-all duration-300 ease-out",
        visibilityClasses,
        className,
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="relative h-full w-full overflow-visible">
        {!shouldRenderSpline && visible && (
          <>
            <div className="pointer-events-none absolute inset-[34px] rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-3xl" />
          </>
        )}

        {shouldRenderSpline && (
          <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            <div className="rubik-orb-spline relative h-[260px] w-[260px] overflow-visible">
              <Spline
                scene={SPLINE_SCENE_URL}
                onLoad={handleSplineLoad}
                onSplineMouseHover={handleSplineMouseHover}
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onPointerDown={handleSoundPointerDown}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.detail === 0) void toggleSound();
        }}
        className={[
          "absolute bottom-9 right-7 z-[10050]",
          "flex h-10 w-10 items-center justify-center rounded-full",
          "border border-white/15 bg-black/55 text-base text-white shadow-lg backdrop-blur-md",
          "transition duration-200 ease-out",
          "hover:scale-105 hover:bg-white/10",
          "active:scale-95",
          "pointer-events-auto select-none",
          soundEnabled ? "opacity-100" : "opacity-85",
        ].join(" ")}
        style={{
          touchAction: "manipulation",
        }}
        aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
        title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
      >
        {soundEnabled ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
