"use client"

import { memo } from "react"
import { motion } from "framer-motion"

interface NavigationItemProps {
  name: string
  href: string
  index: number
  onClick: (href: string) => void
}

export const NavigationItem = memo(function NavigationItem({ name, href, index, onClick }: NavigationItemProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onClick(href)}
      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      {name}
    </motion.button>
  )
})
