"use client"

import { motion } from "framer-motion"
import { Zap, Shield, BarChart3, Users, Cloud, Smartphone } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with sub-second response times and real-time updates across all your devices.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption, SOC 2 compliance, and advanced threat protection.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Powerful insights with AI-driven analytics, custom dashboards, and predictive forecasting.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless collaboration tools with real-time editing, comments, and workflow automation.",
  },
  {
    icon: Cloud,
    title: "Cloud Native",
    description: "Built for the cloud with automatic scaling, 99.9% uptime, and global CDN distribution.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Native mobile apps and responsive design ensure perfect experience on any device.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Features for Modern Teams</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to streamline your workflow, boost productivity, and scale your business efficiently.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-background rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6"
              >
                <feature.icon className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
