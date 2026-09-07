"use client";

import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    <div className="select-none leading-relaxed text-sm">{description}</div>

    <div className="flex w-full select-none items-center justify-start gap-3">
      <img src={img} alt={name} className="size-8 rounded-full" />

      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

interface Testimonial {
  id: string;
  name: string;
  role: string;
  img: string;
  description: React.ReactNode;
}

export function SocialProofTestimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div className="h-full">
      <div className="relative max-h-[750px] overflow-hidden">
        <div className="gap-0 md:columns-2 xl:columns-3">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
                  "[--duration:60s]": i === 1,
                  "[--duration:30s]": i === 2,
                  "[--duration:70s]": i === 3,
                })}
              >
                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                  <TestimonialCard {...card} key={idx} />
                ))}
              </Marquee>
            ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/6 md:h-1/5 w-full bg-gradient-to-t from-background from-20%"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/6 md:h-1/5 w-full bg-gradient-to-b from-background from-20%"></div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const testimonials = [
    {
      id: "1",
      name: "Emma Thompson",
      role: "Yoga Instructor",
      img: "/joyful-woman.png",
      description: (
        <p>
          Serenity has become an essential part of my daily routine. The sleep
          stories have completely transformed my nights, and I wake up feeling
          refreshed every morning.
        </p>
      ),
    },
    {
      id: "2",
      name: "David Chen",
      role: "Software Engineer",
      img: "/cheerful-asian-man.png",
      description: (
        <p>
          As someone who deals with anxiety, this app has been life-changing.
          The guided meditations help me stay centered during stressful
          workdays.
        </p>
      ),
    },
    {
      id: "3",
      name: "Sarah Williams",
      role: "Healthcare Professional",
      img: "/joyful-curls.png",
      description: (
        <p>
          I recommend Serenity to all my patients who struggle with stress. The
          breathing exercises are simple yet incredibly effective for quick
          calm.
        </p>
      ),
    },
    {
      id: "4",
      name: "Michael Johnson",
      role: "Business Executive",
      img: "/joyful-woman.png",
      description: (
        <p>
          Serenity has helped me maintain focus and clarity in high-pressure
          situations. The mindfulness exercises are perfect for quick breaks
          between meetings.
        </p>
      ),
    },
    {
      id: "5",
      name: "Olivia Rodriguez",
      role: "Student",
      img: "/cheerful-asian-man.png",
      description: (
        <p>
          As a college student, I often struggle with sleep and anxiety.
          Serenity's guided meditations have significantly improved my sleep
          quality and overall well-being.
        </p>
      ),
    },
    {
      id: "6",
      name: "James Wilson",
      role: "Retired Veteran",
      img: "/joyful-curls.png",
      description: (
        <p>
          The PTSD-focused meditations in Serenity have been instrumental in my
          healing journey. I'm grateful for this tool that supports veterans
          like myself.
        </p>
      ),
    },
    {
      id: "7",
      name: "Aisha Patel",
      role: "Teacher",
      img: "/joyful-woman.png",
      description: (
        <p>
          I use Serenity's short meditations with my students to help them focus
          before exams. It's made a noticeable difference in their stress levels
          and performance.
        </p>
      ),
    },
    {
      id: "8",
      name: "Robert Tanaka",
      role: "Athlete",
      img: "/cheerful-asian-man.png",
      description: (
        <p>
          Serenity's visualization exercises have greatly enhanced my pre-game
          mental preparation. It's become an essential part of my training
          regimen.
        </p>
      ),
    },
    {
      id: "9",
      name: "Elena Gonzalez",
      role: "Artist",
      img: "/joyful-curls.png",
      description: (
        <p>
          The creativity-boosting meditations in Serenity have helped me
          overcome artist's block numerous times. It's like a secret weapon for
          inspiration!
        </p>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      id="testimonials"
      className="w-full py-12 md:py-24 lg:py-32"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              What Our Users Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Thousands of people have transformed their lives with Serenity.
            </p>
          </div>
        </motion.div>
        <SocialProofTestimonials testimonials={testimonials} />
      </div>
    </motion.section>
  );
}
