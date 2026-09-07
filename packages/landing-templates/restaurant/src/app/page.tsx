'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

// ═══════════════════════════════════════════════════════════════
// AURELIA — Fine Dining Restaurant Template
// Premium landing page with custom cursor, lightbox, animations
// Next.js Image for lazy loading + WebP optimization
// ═══════════════════════════════════════════════════════════════

const galleryImages = [
  { src: '/gallery-1.webp', alt: 'Restaurant interior with warm lighting' },
  { src: '/gallery-2.webp', alt: 'Gourmet seafood dish presentation' },
  { src: '/gallery-3.webp', alt: 'Fine dining appetizer course' },
  { src: '/gallery-4.webp', alt: 'Bar area with premium spirits' },
  { src: '/gallery-5.webp', alt: 'Handmade pasta dish' },
  { src: '/gallery-6.webp', alt: 'Wine and dining atmosphere' },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    // ─── Custom Cursor ───
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const dot = document.createElement('div')
      const ring = document.createElement('div')
      dot.className = 'cursor-dot'
      ring.className = 'cursor-ring'
      document.body.appendChild(dot)
      document.body.appendChild(ring)

      let mouseX = 0, mouseY = 0
      let ringX = 0, ringY = 0

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
        dot.style.left = mouseX + 'px'
        dot.style.top = mouseY + 'px'
      })

      const animateRing = () => {
        ringX += (mouseX - ringX) * 0.15
        ringY += (mouseY - ringY) * 0.15
        ring.style.left = ringX + 'px'
        ring.style.top = ringY + 'px'
        requestAnimationFrame(animateRing)
      }
      animateRing()

      // Hover states
      const hoverElements = document.querySelectorAll('a, button, [data-lightbox]')
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'))
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'))
      })
    }

    // ─── Scroll Reveal ───
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.reveal, .reveal-scale, .stagger-children').forEach(el => {
      observer.observe(el)
    })

    // ─── Scroll Progress ───
    const progress = document.querySelector('.scroll-progress') as HTMLElement
    if (progress) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight)
        progress.style.transform = `scaleX(${scrolled})`
      })
    }

    // ─── Nav Scroll ───
    const nav = document.querySelector('.nav')
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav?.classList.add('nav--scrolled')
      } else {
        nav?.classList.remove('nav--scrolled')
      }
    })

    // ─── Keyboard ───
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null)
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  // Toggle body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <>
      {/* Page Loader */}
      <div className="page-loader">
        <div className="loader-logo">AURELIA</div>
      </div>

      {/* Scroll Progress */}
      <div className="scroll-progress" />

      {/* Navigation */}
      <nav className="nav">
        <a href="#" className="nav__logo">AURELIA</a>
        <ul className={`nav__links ${menuOpen ? 'is-open' : ''}`}>
          <li><a href="#menu" className="nav__link" onClick={() => setMenuOpen(false)}>Menu</a></li>
          <li><a href="#chef" className="nav__link" onClick={() => setMenuOpen(false)}>Chef</a></li>
          <li><a href="#gallery" className="nav__link" onClick={() => setMenuOpen(false)}>Gallery</a></li>
          <li><a href="#reservation" className="nav__link" onClick={() => setMenuOpen(false)}>Reserve</a></li>
          <li><a href="#contact" className="nav__link" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
        <button
          className={`nav__hamburger ${menuOpen ? 'is-active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <Image
            src="/hero.webp"
            alt="Fine dining restaurant interior"
            fill
            priority
            quality={85}
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="hero__content">
          <p className="hero__tagline">Fine Dining Experience</p>
          <h1 className="hero__title">Where Culinary Art Meets Elegance</h1>
          <p className="hero__subtitle">
            Discover seasonal tasting menus crafted with passion, featuring the finest local and imported ingredients.
          </p>
          <div className="hero__cta">
            <a href="#reservation" className="btn btn-primary">Reserve a Table</a>
            <a href="#menu" className="btn btn-outline">View Menu</a>
          </div>
        </div>
      </section>

      {/* About / Intro */}
      <section className="section section--light">
        <div className="section__header reveal">
          <p className="section__tagline" style={{ color: '#b8923f' }}>Our Philosophy</p>
          <h2 className="section__title" style={{ color: '#0a0a0a' }}>A Celebration of Flavor</h2>
          <p className="section__description">
            At Aurelia, we believe dining is an art form. Each dish tells a story of tradition, innovation, and the purest ingredients sourced from local farmers and artisans. Our chefs craft seasonal menus that honor the rhythm of nature while pushing culinary boundaries.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-children">
          <div className="text-center">
            <div className="text-5xl mb-4" style={{ color: '#c9a961' }}>✦</div>
            <h3 className="font-heading text-xl mb-2" style={{ color: '#0a0a0a' }}>Farm to Table</h3>
            <p style={{ color: 'rgba(10,10,10,0.6)' }}>Locally sourced ingredients from trusted partners</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4" style={{ color: '#c9a961' }}>✦</div>
            <h3 className="font-heading text-xl mb-2" style={{ color: '#0a0a0a' }}>Seasonal Menus</h3>
            <p style={{ color: 'rgba(10,10,10,0.6)' }}>Menus that evolve with the seasons</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4" style={{ color: '#c9a961' }}>✦</div>
            <h3 className="font-heading text-xl mb-2" style={{ color: '#0a0a0a' }}>Wine Pairing</h3>
            <p style={{ color: 'rgba(10,10,10,0.6)' }}>Curated wines to complement each course</p>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="section section--dark">
        <div className="section__header reveal">
          <p className="section__tagline">Tasting Menu</p>
          <h2 className="section__title">Our Signature Courses</h2>
          <p className="section__description">
            A journey through flavors, textures, and traditions. Our tasting menu changes with the seasons.
          </p>
        </div>

        <div className="menu-grid reveal">
          <div className="menu-category">
            <h3 className="menu-category__title">First Course</h3>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Hamachi Crudo</div>
              <div className="menu-item__desc">Yuzu, jalapeño, cilantro, crispy shallots</div>
            </div>
            <span className="menu-item__price">€28</span>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Foie Gras Terrine</div>
              <div className="menu-item__desc">Brioche, fig compote, aged balsamic</div>
            </div>
            <span className="menu-item__price">€36</span>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Burrata</div>
              <div className="menu-item__desc">Heirloom tomatoes, basil oil, sea salt</div>
            </div>
            <span className="menu-item__price">€24</span>
          </div>

          <div className="menu-category" style={{ marginTop: '3rem' }}>
            <h3 className="menu-category__title">Main Course</h3>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Wagyu Beef Tenderloin</div>
              <div className="menu-item__desc">Truffle jus, potato mousseline, seasonal vegetables</div>
            </div>
            <span className="menu-item__price">€72</span>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Dover Sole Meunière</div>
              <div className="menu-item__desc">Brown butter, capers, lemon, parsley</div>
            </div>
            <span className="menu-item__price">€58</span>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Duck Breast</div>
              <div className="menu-item__desc">Cherry gastrique, foie gras, salsify</div>
            </div>
            <span className="menu-item__price">€54</span>
          </div>

          <div className="menu-category" style={{ marginTop: '3rem' }}>
            <h3 className="menu-category__title">Dessert</h3>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Chocolate Soufflé</div>
              <div className="menu-item__desc">Valrhona dark chocolate, vanilla ice cream</div>
            </div>
            <span className="menu-item__price">€18</span>
          </div>

          <div className="menu-item">
            <div>
              <div className="menu-item__name">Tarte Tatin</div>
              <div className="menu-item__desc">Caramelized apples, crème fraîche</div>
            </div>
            <span className="menu-item__price">€16</span>
          </div>
        </div>

        <div className="text-center mt-12 reveal">
          <p className="text-sm text-neutral-700 mb-4">Tasting Menu (7 Courses) — €145 per person</p>
          <p className="text-sm text-neutral-700">Wine Pairing — €85 per person</p>
        </div>
      </section>

      {/* Chef */}
      <section id="chef" className="section section--dark">
        <div className="chef max-w-6xl mx-auto">
          <div className="chef__image reveal-scale">
            <Image
              src="/chef.webp"
              alt="Chef Marcus Reinhardt"
              width={500}
              height={600}
              quality={85}
              loading="lazy"
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
          </div>
          <div className="chef__content reveal">
            <p className="section__tagline">Meet the Chef</p>
            <h2 className="chef__name">Marcus Reinhardt</h2>
            <p className="chef__role">Executive Chef</p>
            <p className="chef__bio">
              With over 20 years of experience in Michelin-starred kitchens across Europe, Chef Marcus brings a unique vision to Aurelia. His philosophy centers on respecting ingredients while pushing creative boundaries.
            </p>
            <p className="chef__bio">
              &ldquo;Cooking is about emotion. Every plate should tell a story and create a memory that lingers long after the last bite.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section section--dark">
        <div className="section__header reveal">
          <p className="section__tagline">Gallery</p>
          <h2 className="section__title">Moments at Aurelia</h2>
        </div>

        <div className="gallery-grid max-w-6xl mx-auto stagger-children">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="gallery-item"
              data-lightbox={img.src}
              onClick={() => setLightboxImage(img.src)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={400}
                quality={80}
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Reservation */}
      <section id="reservation" className="section section--light">
        <div className="section__header reveal">
          <p className="section__tagline" style={{ color: '#b8923f' }}>Reservations</p>
          <h2 className="section__title" style={{ color: '#0a0a0a' }}>Book Your Experience</h2>
          <p className="section__description">
            Join us for an unforgettable evening. Reservations are recommended, especially for weekend dining.
          </p>
        </div>

        <form className="reservation-form reveal">
          <div className="form-row form-row--two">
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(10,10,10,0.6)' }}>Name</label>
              <input type="text" className="form-input" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a0a' }} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(10,10,10,0.6)' }}>Email</label>
              <input type="email" className="form-input" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a0a' }} placeholder="your@email.com" />
            </div>
          </div>

          <div className="form-row form-row--two">
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(10,10,10,0.6)' }}>Date</label>
              <input type="date" className="form-input" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a0a' }} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(10,10,10,0.6)' }}>Time</label>
              <select className="form-select" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a0a' }}>
                <option>18:00</option>
                <option>18:30</option>
                <option>19:00</option>
                <option>19:30</option>
                <option>20:00</option>
                <option>20:30</option>
                <option>21:00</option>
              </select>
            </div>
          </div>

          <div className="form-row form-row--two">
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(10,10,10,0.6)' }}>Guests</label>
              <select className="form-select" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a0a' }}>
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5 Guests</option>
                <option>6+ Guests</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(10,10,10,0.6)' }}>Phone</label>
              <input type="tel" className="form-input" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a0a' }} placeholder="+49 123 456 789" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(10,10,10,0.6)' }}>Special Requests</label>
              <textarea className="form-textarea" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.1)', color: '#0a0a0a' }} placeholder="Dietary restrictions, celebrations, seating preferences..." />
            </div>
          </div>

          <div className="text-center mt-8">
            <button type="submit" className="btn btn-primary">Request Reservation</button>
          </div>
        </form>
      </section>

      {/* Location */}
      <section id="contact" className="section section--dark">
        <div className="section__header reveal">
          <p className="section__tagline">Visit Us</p>
          <h2 className="section__title">Location & Hours</h2>
        </div>

        <div className="location-grid max-w-6xl mx-auto">
          <div className="location__map reveal-scale">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4!2d13.38!3d52.51!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDMwJzM2LjAiTiAxM8KwMjInNDguMCJF!5e0!3m2!1sen!2sde!4v1234567890"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="location__info reveal">
            <h3>Aurelia Restaurant</h3>

            <div className="location__detail">
              <span className="location__icon">📍</span>
              <div>
                <p>Charlottenstraße 50</p>
                <p>10117 Berlin, Germany</p>
              </div>
            </div>

            <div className="location__detail">
              <span className="location__icon">📞</span>
              <p>+49 30 123 456 789</p>
            </div>

            <div className="location__detail">
              <span className="location__icon">✉️</span>
              <p>reservations@aurelia.de</p>
            </div>

            <div className="location__detail">
              <span className="location__icon">🕐</span>
              <div>
                <p>Tuesday – Saturday: 18:00 – 23:00</p>
                <p>Sunday – Monday: Closed</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-neutral-700">
                Private dining room available for groups of 8-14 guests.
                <br />Contact us for exclusive events and wine dinners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__logo">AURELIA</div>
        <div className="footer__links">
          <a href="#menu" className="footer__link">Menu</a>
          <a href="#chef" className="footer__link">Our Chef</a>
          <a href="#gallery" className="footer__link">Gallery</a>
          <a href="#reservation" className="footer__link">Reservations</a>
          <a href="#contact" className="footer__link">Contact</a>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} Aurelia Restaurant. All rights reserved.</p>
      </footer>

      {/* Lightbox */}
      <div
        className={`lightbox ${lightboxImage ? 'is-open' : ''}`}
        onClick={() => setLightboxImage(null)}
      >
        <button className="lightbox__close" onClick={() => setLightboxImage(null)}>×</button>
        {lightboxImage && (
          <Image
            src={lightboxImage}
            alt="Gallery"
            width={1200}
            height={1200}
            quality={90}
            className="lightbox__image"
            onClick={(e) => e.stopPropagation()}
            style={{ objectFit: 'contain', maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto' }}
          />
        )}
      </div>
    </>
  )
}
