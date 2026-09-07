"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export function PricingSection() {
  const plans: PricingPlan[] = [
    {
      name: "Basic",
      price: "Free",
      description: "Start your meditation journey",
      features: [
        "5 guided meditations",
        "Basic sleep sounds",
        "Breathing exercises",
        "Mood tracking",
      ],
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Unlock your full potential",
      features: [
        "Unlimited meditations",
        "Full sleep story library",
        "Advanced breathing techniques",
        "Personalized recommendations",
        "Offline access",
      ],
      popular: true,
    },
    {
      name: "Family",
      price: "$14.99",
      period: "per month",
      description: "Share mindfulness with loved ones",
      features: [
        "Everything in Premium",
        "Up to 6 family members",
        "Family progress tracking",
        "Shared meditation goals",
        "Kids content",
        "Priority support",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="pricing"
      className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full">
              Pricing
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for your meditation journey.
            </p>
          </div>
        </motion.div>
        <motion.div
          className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <Card
                className={`flex flex-col flex-1 border ${
                  plan.popular ? "bg-background" : "bg-card"
                }`}
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-medium">{plan.name}</h3>
                      {plan.popular && (
                        <Badge variant="secondary">Popular</Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full rounded-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
