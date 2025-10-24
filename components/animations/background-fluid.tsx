"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

import { shaders } from "@/lib/shaders";

interface GradientConfig {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  colorIntensity: number;
  softness: number;
  speed: number;
  scale: number;
}

const config: GradientConfig = {
  color1: "#b8fff7",
  color2: "#6e3466",
  color3: "#0133ff",
  color4: "#66d1fe",
  colorIntensity: 1.0,
  softness: 1.0,
  speed: 0.5,
  scale: 1.0,
};

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  return [r, g, b];
}

export default function BackgroundFluid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const scene = new THREE.Scene();

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uColor1: { value: new THREE.Vector3(...hexToRgb(config.color1)) },
        uColor2: { value: new THREE.Vector3(...hexToRgb(config.color2)) },
        uColor3: { value: new THREE.Vector3(...hexToRgb(config.color3)) },
        uColor4: { value: new THREE.Vector3(...hexToRgb(config.color4)) },
        uColorIntensity: { value: config.colorIntensity },
        uSoftness: { value: config.softness },
        uSpeed: { value: config.speed },
        uScale: { value: config.scale },
      },
      vertexShader: shaders.vertex,
      fragmentShader: shaders.staticGradient,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, gradientMaterial);

    scene.add(plane);

    const animate = () => {
      const time = performance.now() * 0.001;

      gradientMaterial.uniforms.iTime.value = time;

      gradientMaterial.uniforms.uColorIntensity.value = config.colorIntensity;
      gradientMaterial.uniforms.uSoftness.value = config.softness;
      gradientMaterial.uniforms.uSpeed.value = config.speed;
      gradientMaterial.uniforms.uScale.value = config.scale;
      gradientMaterial.uniforms.uColor1.value.set(...hexToRgb(config.color1));
      gradientMaterial.uniforms.uColor2.value.set(...hexToRgb(config.color2));
      gradientMaterial.uniforms.uColor3.value.set(...hexToRgb(config.color3));
      gradientMaterial.uniforms.uColor4.value.set(...hexToRgb(config.color4));

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      gradientMaterial.uniforms.iResolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      window.removeEventListener("resize", handleResize);

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
      geometry.dispose();
      gradientMaterial.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-full" />
  );
}
