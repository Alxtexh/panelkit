'use client';

type DemoBannerProps = {
  templateName: string;
  buyUrl: string;
};

/**
 * Optional upstream demo affordance. It stays disabled in the PanelKit
 * bundle unless DEMO_MODE is explicitly enabled, so the imported landing
 * page keeps its original presentation by default.
 */
export function DemoBanner({ templateName, buyUrl }: DemoBannerProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-3 bg-black px-4 py-2 text-xs text-white">
      <span>Previewing {templateName}</span>
      <a className="underline underline-offset-2" href={buyUrl}>
        Get the template
      </a>
    </div>
  );
}
