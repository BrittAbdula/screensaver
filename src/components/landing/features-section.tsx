"use client"

import { motion } from "framer-motion"
import { Music, Settings, Monitor } from "lucide-react"

const features = [
  {
    icon: <Music className="w-10 h-10" />,
    title: "Curated Album Collection",
    description: "Display your favorite album artworks in a beautiful, dynamic layout that brings your screen to life."
  },
  {
    icon: <Settings className="w-10 h-10" />,
    title: "Customizable Display",
    description: "Personalize your screensaver by adding or removing albums, and adjusting the display settings to your preference."
  },
  {
    icon: <Monitor className="w-10 h-10" />,
    title: "Immersive Experience",
    description: "Transform your idle screen into an engaging visual experience that celebrates music and art."
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="mb-6 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
