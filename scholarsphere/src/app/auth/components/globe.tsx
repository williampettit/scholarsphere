"use client";

import { useEffect, useRef } from "react";

import createGlobe from "cobe";

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = "100%";
  const canvasHeight = "100%";

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    let phi = 0;
    let theta = 0;

    const globeWidth = 800;
    const globeHeight = 800;
    const globeScale = 4;

    const globeOffsetX = 0;
    const globeOffsetY = -100;

    const globe = createGlobe(canvasRef.current, {
      width: globeWidth,
      height: globeHeight,
      offset: [globeOffsetX, globeOffsetY],
      scale: globeScale,
      devicePixelRatio: 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16_000,
      mapBrightness: 4,
      markerColor: [0.9, 0.9, 0.9],
      baseColor: [0.8, 0.4, 0.2],
      glowColor: [0.07, 0.06, 0.06],
      opacity: 0.8,
      markers: [
        // longitude latitude
        // { location: [37.7595, -122.4367], size: 0.03 },
        // { location: [40.7128, -74.006], size: 0.1 }
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.

        state.phi = phi;
        phi += 0.01 / 10;

        state.theta = theta;
        theta -= 0.01 / 5;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        maxWidth: "100%",
        aspectRatio: 1,
      }}
    />
  );
}
