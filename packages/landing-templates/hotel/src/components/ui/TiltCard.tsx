'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  perspective?: number;
  glare?: boolean;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className = '',
  intensity = 0.4,
  perspective = 1200,
  glare = true,
  style: userStyle = {},
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const glareRef = useRef<HTMLDivElement>(null);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const update = useCallback(() => {
    const lf = hovering ? 0.1 : 0.06;
    current.current.x = lerp(current.current.x, target.current.x, lf);
    current.current.y = lerp(current.current.y, target.current.y, lf);

    const settled =
      !hovering &&
      Math.abs(current.current.x - target.current.x) < 0.001 &&
      Math.abs(current.current.y - target.current.y) < 0.001;

    const { x, y } = current.current;
    const rY = x * 6 * intensity;
    const rX = -y * 6 * intensity;

    if (ref.current) {
      ref.current.style.transform = `perspective(${perspective}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
    }

    if (glare && glareRef.current) {
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      glareRef.current.style.opacity = hovering ? '0.15' : '0';
      glareRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.25) 0%, transparent 80%)`;
    }

    if (settled) {
      rafId.current = null;
      return;
    }
    rafId.current = requestAnimationFrame(update);
  }, [hovering, intensity, perspective, glare]);

  useEffect(() => {
    if (hovering || target.current.x !== 0 || target.current.y !== 0) {
      if (!rafId.current) rafId.current = requestAnimationFrame(update);
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [hovering, update]);

  const onPointerEnter = useCallback(() => setHovering(true), []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    target.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    target.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  }, []);
  const onPointerLeave = useCallback(() => {
    setHovering(false);
    target.current.x = 0;
    target.current.y = 0;
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...userStyle,
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: hovering ? 'transform' : undefined,
      }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.3s',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
