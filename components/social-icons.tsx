import Link from "next/link"
import { Facebook, Instagram, Mail, Phone, Video } from "lucide-react"

interface SocialIconsProps {
  variant?: "header" | "footer"
}

export function SocialIcons({ variant = "footer" }: SocialIconsProps) {
  const isHeader = variant === "header"

  // Different styles based on placement
  const containerClasses = isHeader ? "flex items-center gap-2" : "flex items-center gap-4"
  const iconContainerClasses = isHeader
    ? "p-1 rounded-full text-white hover:bg-white/20 transition-colors"
    : "bg-white p-2 rounded-full text-brand-pink hover:text-brand-pink-dark transition-colors"
  const iconSize = isHeader ? 18 : 24

  return (
    <div className={containerClasses}>
      <Link href="https://www.facebook.com/profile.php?id=61575199135422" target="_blank" rel="noopener noreferrer">
        <div className={iconContainerClasses}>
          <Facebook size={iconSize} />
          <span className="sr-only">Facebook</span>
        </div>
      </Link>
      <Link href="https://www.instagram.com/juez.juliavillagomezmartinez/" target="_blank" rel="noopener noreferrer">
        <div className={iconContainerClasses}>
          <Instagram size={iconSize} />
          <span className="sr-only">Instagram</span>
        </div>
      </Link>
      <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
        <div className={iconContainerClasses}>
          <Video size={iconSize} />
          <span className="sr-only">TikTok</span>
        </div>
      </Link>
      <Link href="mailto:lic.juliavillagomez31@gmail.com">
        <div className={iconContainerClasses}>
          <Mail size={iconSize} />
          <span className="sr-only">Email</span>
        </div>
      </Link>
      <Link href="tel:2294224577">
        <div className={iconContainerClasses}>
          <Phone size={iconSize} />
          <span className="sr-only">Teléfono</span>
        </div>
      </Link>
      <Link href="https://wa.me/2294224577" target="_blank" rel="noopener noreferrer">
        <div className={iconContainerClasses}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M9.5 13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5Z" />
          </svg>
          <span className="sr-only">WhatsApp</span>
        </div>
      </Link>
    </div>
  )
}
