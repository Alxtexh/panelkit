import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface PanelKitLandingContent {
  brand?: string
  tagline?: string
  loginHref?: string
  registerHref?: string
  dashboardHref?: string
  dataUrl?: string
}

declare global {
  interface Window {
    __PANELKIT_LANDING__?: PanelKitLandingContent
  }
}

const ContentContext = createContext<PanelKitLandingContent>({})

export function PanelKitLandingProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PanelKitLandingContent>(() => window.__PANELKIT_LANDING__ ?? {})

  useEffect(() => {
    const url = content.dataUrl
    if (!url) return

    fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => payload && setContent((current) => ({ ...current, ...payload })))
      .catch(() => undefined)
  }, [content.dataUrl])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function usePanelKitLanding() {
  return useContext(ContentContext)
}
