import { MessageCircle, Twitter, Facebook, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareButtonsProps {
  message?: string;
  url?: string;
  className?: string;
  variant?: "default" | "compact";
}

const SocialShareButtons = ({
  message = "I just pledged my support for the 1 Million Pledge for Tinubu & Abba! Join the movement 🇳🇬",
  url = typeof window !== "undefined" ? window.location.href : "https://millionvote.lovable.app",
  className = "",
  variant = "default",
}: SocialShareButtonsProps) => {
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      className: "bg-[hsl(134,61%,41%)] hover:bg-[hsl(134,61%,35%)] text-white",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      className: "bg-[hsl(203,89%,53%)] hover:bg-[hsl(203,89%,45%)] text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      className: "bg-[hsl(220,46%,48%)] hover:bg-[hsl(220,46%,40%)] text-white",
    },
  ];

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
          >
            <Button
              size="icon"
              className={`${link.className} rounded-full w-10 h-10 transition-transform hover:scale-110`}
              asChild
            >
              <span>
                <link.icon size={18} />
              </span>
            </Button>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-heading font-semibold text-muted-foreground">
        <Share2 size={16} />
        <span>Share your pledge</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className={`${link.className} font-heading font-semibold gap-2 transition-transform hover:scale-105`}
            >
              <link.icon size={18} />
              {link.name}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialShareButtons;
