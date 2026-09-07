"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <div className="absolute -z-10 top-0 right-0 w-[600px] h-[600px] bg-linear-to-bl from-primary/20 to-purple-100/20 rounded-full blur-3xl opacity-50"></div>
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
        >
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
                <Badge className="inline-flex bg-primary/10 text-primary border-0 rounded-full">
                  New Release v2.0
                </Badge>
              </motion.div>
              <motion.h1
                className="text-3xl font-semibold tracking-tight sm:text-5xl xl:text-6xl/none"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                Find Your <span className="gradient-text">Inner Peace</span>
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                Discover mindfulness, reduce stress, and improve your sleep with
                guided meditations designed for modern life.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <Button asChild size="lg" className="rounded-full gap-2">
                <Link href="#download">
                  <Icons.apple className="size-4" />
                  Download on App Store
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="#learn-more">
                  Learn More
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-sm"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <div className="flex">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
              </div>
              <span className="text-muted-foreground">
                <strong>4.9/5</strong> from over 10,000+ reviews
              </span>
            </motion.div>
          </div>
          <motion.div
            className="flex items-center justify-center"
            variants={{
              hidden: { opacity: 0, y: -20 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <div className="relative animate-float">
              <div className="absolute -z-10 inset-0 bg-linear-to-tr from-primary/20 to-purple-300/20 rounded-[2.5rem] blur-xl"></div>
              <Image
                src="/iphone.png"
                alt="Serenity App Screenshot"
                width={400}
                height={600}
                className="rounded-[2.5rem] border border-white/20"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
