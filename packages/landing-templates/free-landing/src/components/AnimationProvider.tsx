'use client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: Lenis | null = null
    const deferLenis = typeof requestIdleCallback !== 'undefined' ? requestIdleCallback : (cb: () => void) => setTimeout(cb, 0)
    const lenisId = deferLenis(() => {
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => lenis!.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)
    })

    // Custom cursor
    if (window.matchMedia('(pointer: fine)').matches) {
      const cursor = document.createElement('div'); cursor.className = 'custom-cursor'
      const dot = document.createElement('div'); dot.className = 'custom-cursor-dot'
      document.body.appendChild(cursor); document.body.appendChild(dot)
      let cx = 0, cy = 0, fx = 0, fy = 0
      const onMove = (e: MouseEvent) => { cx = e.clientX; cy = e.clientY; cursor.classList.add('visible'); dot.classList.add('visible') }
      document.addEventListener('mousemove', onMove)
      gsap.ticker.add(() => { fx += (cx - fx) * 0.15; fy += (cy - fy) * 0.15; cursor.style.transform = `translate(${fx - 20}px, ${fy - 20}px)`; dot.style.transform = `translate(${cx - 3}px, ${cy - 3}px)` })
      const addH = () => cursor.classList.add('hover')
      const rmH = () => { cursor.classList.remove('hover', 'view') }
      const addV = () => cursor.classList.add('view')
      const observe = () => {
        document.querySelectorAll('a, button').forEach(el => { el.addEventListener('mouseenter', addH); el.addEventListener('mouseleave', rmH) })
        document.querySelectorAll('[data-cursor="view"]').forEach(el => { el.addEventListener('mouseenter', addV); el.addEventListener('mouseleave', rmH) })
      }
      observe()
      let mo: MutationObserver | null = null
      const deferMo = typeof requestIdleCallback !== 'undefined' ? requestIdleCallback : (cb: () => void) => setTimeout(cb, 0)
      deferMo(() => { mo = new MutationObserver(observe); mo.observe(document.body, { childList: true, subtree: true }) })
    }

    // Magnetic buttons
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e: any) => {
        const r = (btn as HTMLElement).getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * 0.3
        const y = (e.clientY - r.top - r.height / 2) * 0.3
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' })
      })
      btn.addEventListener('mouseleave', () => { gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }) })
    })

    // Reveal animations
    const revealTypes = [
      { sel: '.reveal-up', props: { y: 0 } },
      { sel: '.reveal-left', props: { x: 0 } },
      { sel: '.reveal-right', props: { x: 0 } },
      { sel: '.reveal-scale', props: { scale: 1 } },
    ]
    revealTypes.forEach(({ sel, props }) => {
      gsap.utils.toArray<HTMLElement>(sel).forEach(el => {
        gsap.to(el, { ...props, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      })
    })

    return () => { if (lenis) lenis.destroy() }
  }, [])

  return <>{children}</>
}
