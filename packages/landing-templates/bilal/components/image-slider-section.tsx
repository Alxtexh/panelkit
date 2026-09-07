"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for product screenshots
const screenshots = [
  {
    id: 1,
    title: "Analytics Dashboard",
    description: "Comprehensive analytics with real-time insights",
    image: "/placeholder.svg?height=600&width=800&text=Analytics+Dashboard",
  },
  {
    id: 2,
    title: "Team Collaboration",
    description: "Seamless team collaboration tools",
    image: "/placeholder.svg?height=600&width=800&text=Team+Collaboration",
  },
  {
    id: 3,
    title: "Project Management",
    description: "Advanced project management features",
    image: "/placeholder.svg?height=600&width=800&text=Project+Management",
  },
  {
    id: 4,
    title: "Mobile App",
    description: "Native mobile experience",
    image: "/placeholder.svg?height=600&width=800&text=Mobile+App",
  },
  {
    id: 5,
    title: "Reporting Suite",
    description: "Detailed reporting and insights",
    image: "/placeholder.svg?height=600&width=800&text=Reporting+Suite",
  },
]

export function ImageSliderSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
          onViewportEnter={() => setIsVisible(true)}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">See Our Platform in Action</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our intuitive interface and powerful features through these interactive screenshots.
          </p>
        </motion.div>

        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6">
          {/* Main Slider */}
          <div
            className="relative overflow-hidden rounded-lg md:rounded-xl shadow-lg"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out will-change-transform"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {screenshots.map((screenshot, index) => (
                <div key={screenshot.id} className="w-full flex-shrink-0 relative h-[280px] sm:h-[320px] md:h-[360px]">
                  <Image
                    src={screenshot.image || "/placeholder.svg"}
                    alt={screenshot.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px"
                    className="object-cover object-center"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg sm:text-xl font-bold mb-1">{screenshot.title}</h3>
                    <p className="text-sm sm:text-base opacity-90 line-clamp-2">{screenshot.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail Navigation */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3 sm:mt-4">
            {screenshots.map((screenshot, index) => (
              <motion.button
                key={screenshot.id}
                onClick={() => goToSlide(index)}
                className={`relative overflow-hidden rounded-md border transition-all duration-300 h-[60px] ${
                  index === currentSlide
                    ? "border-primary shadow-lg"
                    : "border-transparent hover:border-muted-foreground/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={screenshot.image || "/placeholder.svg"}
                  alt={screenshot.title}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium truncate">{screenshot.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
