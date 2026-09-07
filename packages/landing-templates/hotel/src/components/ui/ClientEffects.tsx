'use client';

import dynamic from 'next/dynamic';

const SmoothScroll = dynamic(
  () => import('@/components/ui/SmoothScroll').then(mod => ({ default: mod.SmoothScroll })),
  { ssr: false }
);
const CursorTrail = dynamic(
  () => import('@/components/ui/CursorTrail').then(mod => ({ default: mod.CursorTrail })),
  { ssr: false }
);

export function ClientEffects({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <CursorTrail />
      {children}
    </SmoothScroll>
  );
}
