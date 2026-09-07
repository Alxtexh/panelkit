'use client';

import { useEffect, useRef } from 'react';

interface AnimatedHeadingProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
}

export function AnimatedHeading({
  children,
  as: Tag = 'h1',
  className = '',
  delay = 0,
}: AnimatedHeadingProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cleanup: (() => void) | undefined;

    Promise.all([
      import('gsap'),
      import('split-type'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapModule, SplitTypeModule, ScrollTriggerModule]) => {
      const gsap = gsapModule.default;
      const SplitType = SplitTypeModule.default;
      gsap.registerPlugin(ScrollTriggerModule.ScrollTrigger);

      if (!textRef.current) return;

      const split = new SplitType(textRef.current, { types: 'words' });

      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      tl.from(split.words, {
        y: 30,
        opacity: 0,
        rotationX: -40,
        filter: 'blur(4px)',
        duration: 0.8,
        stagger: { each: 0.05, from: 'start' },
        ease: 'power3.out',
      });

      cleanup = () => {
        tl.kill();
        split.revert();
      };
    });

    return () => cleanup?.();
  }, [children, delay]);

  return (
    <Tag ref={textRef as any} className={className}>
      {children}
    </Tag>
  );
}
