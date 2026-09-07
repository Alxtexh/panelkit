'use client';

import { useEffect, useRef } from 'react';

export function CursorTrail() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const count = 10;
    const size = 10;
    const color = '#d4c4a8';
    const smooth = 0.12;
    const dots: HTMLDivElement[] = [];
    const trail: { x: number; y: number }[] = [];
    const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let raf: number;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      Object.assign(dot.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: size * 3 + 'px',
        height: size * 3 + 'px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: '9999',
        willChange: 'transform',
        opacity: String(0.6 - i * 0.04),
        mixBlendMode: 'screen',
      });
      document.body.appendChild(dot);
      dots.push(dot);
      trail.push({ x: cursor.x, y: cursor.y });
    }

    const onMouseMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    document.addEventListener('mousemove', onMouseMove);

    function animate() {
      for (let i = 0; i < trail.length; i++) {
        const target = i === 0 ? cursor : trail[i - 1];
        const s = smooth + i * 0.01;
        trail[i].x += (target.x - trail[i].x) * s;
        trail[i].y += (target.y - trail[i].y) * s;

        const dotSize = size * 3;
        dots[i].style.transform = `translate3d(${trail[i].x - dotSize / 2}px, ${trail[i].y - dotSize / 2}px, 0)`;
      }
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
      dots.forEach((dot) => dot.remove());
    };
  }, []);

  return null;
}
