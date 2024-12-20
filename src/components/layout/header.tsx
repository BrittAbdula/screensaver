"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Settings, Grid, Home } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  if (isFullscreen) {
    return null
  }

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/gallery", label: "Gallery", icon: Grid },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="font-light tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:opacity-80 transition-opacity"
          >
            <span className="font-extralight">Flip</span>
            <span className="font-medium">Verse</span>
          </Link>

          <nav className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 rounded-md text-sm font-light tracking-wide transition-colors
                    ${isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-md"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
