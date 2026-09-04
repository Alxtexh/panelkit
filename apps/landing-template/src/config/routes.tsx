import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Landing = lazy(() => import('@/app/landing/page'))

export interface RouteConfig {
  path: string
  element: React.ReactNode
  children?: RouteConfig[]
}

// This package intentionally ships only the reusable landing page.
// PanelKit owns authenticated dashboard and application routes.
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Navigate to="landing" replace />,
  },
  {
    path: '/landing',
    element: <Landing />,
  },
]
