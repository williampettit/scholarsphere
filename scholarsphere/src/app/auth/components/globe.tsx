"use client";

import { useEffect, useRef } from "react";

import createGlobe, { type COBEOptions, type Marker } from "cobe";

// extend to include rotation speed params
interface GlobeProps extends Omit<COBEOptions, "onRender"> {
  className?: string;
  phiStep: number;
  thetaStep: number;
}

// (longitude, latitude)
const UNIVERSITY_COORDINATES: { [key: string]: [number, number] } = {
  uga: [33.9558, -83.3745],
  tcu: [32.70801, -97.3628],
  mit: [42.359722, -71.091944],
};

const UNIVERSITY_MARKERS = Object.values(UNIVERSITY_COORDINATES).map(
  (location): Marker => ({ location, size: 0.035 }),
);

const DEFAULT_GLOBE_PROPS: GlobeProps = {
  //
  markers: UNIVERSITY_MARKERS,

  // rotation speeds
  phiStep: 0.001,
  thetaStep: -0.002,

  // initial rotation
  phi: 0.0,
  theta: 0.0,

  // primary variables to tweak
  width: 800,
  height: 800,
  scale: 4.0,
  offset: [0, -100],
  devicePixelRatio: 2.0,
  mapSamples: 24_000,

  // colors
  baseColor: [0.8, 0.4, 0.2],
  glowColor: [0.07, 0.06, 0.06],
  markerColor: [0.75, 0.35, 0.15],
  mapBrightness: 4.0,
  diffuse: 1.2,
  opacity: 0.8,
  dark: 1.0,
};

export function Globe(customGlobeProps: Partial<GlobeProps> = {}) {
  const { phiStep, thetaStep, className, ...globeProps } = {
    ...DEFAULT_GLOBE_PROPS,
    ...customGlobeProps,
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    let phi = 0.0;
    let theta = 0.0;

    const globe = createGlobe(canvasRef.current, {
      ...globeProps,
      onRender: (state) => {
        state.phi = phi;
        phi += phiStep;

        state.theta = theta;
        theta += thetaStep;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [canvasRef, phiStep, thetaStep, globeProps]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        aspectRatio: 1.0,
      }}
    />
  );
}
