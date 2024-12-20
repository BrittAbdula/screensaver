import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-primary" style={{ stopColor: "currentColor", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "currentColor", stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: "currentColor", stopOpacity: 0.6 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Artistic frame */}
        <path
          d="M16 2L2 8V24L16 30L30 24V8L16 2Z"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Inner geometric pattern */}
        <path
          d="M16 6L6 10V22L16 26L26 22V10L16 6Z"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.6"
        />
        
        {/* Central element */}
        <g filter="url(#glow)">
          <path
            d="M16 10L10 13V19L16 22L22 19V13L16 10Z"
            fill="url(#logoGradient)"
            opacity="0.8"
          />
        </g>
        
        {/* Dynamic lines */}
        <path
          d="M16 2V6M2 8L6 10M30 8L26 10M16 26V30M2 24L6 22M30 24L26 22"
          stroke="url(#logoGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
      </svg>
      
      <span className="font-light tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
        <span className="font-extralight">Flip</span>
        <span className="font-medium">Verse</span>
      </span>
    </div>
  )
}
