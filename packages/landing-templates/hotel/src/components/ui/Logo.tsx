'use client';

import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export function Logo({ variant = 'dark', className = '', showIcon = true, compact = false }: LogoProps) {
  const color = variant === 'dark' ? '#292524' : '#ffffff';
  const accentColor = variant === 'dark' ? '#8c7249' : '#d4c4a8';
  const size = compact ? 36 : 44;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {showIcon && (
        <Image
          src="/logo-mark.webp"
          alt="Can Serena"
          width={size}
          height={size}
          className={variant === 'light' ? 'brightness-0 invert' : ''}
        />
      )}
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif font-light ${compact ? 'text-xl lg:text-2xl tracking-[0.12em]' : 'text-2xl lg:text-3xl tracking-[0.15em]'}`}
          style={{ color }}
        >
          CAN SERENA
        </span>
        {!compact && (
          <span
            className="text-[9px] tracking-[0.4em] uppercase font-medium mt-1"
            style={{ color: accentColor }}
          >
            Mallorca
          </span>
        )}
      </div>
    </div>
  );
}
