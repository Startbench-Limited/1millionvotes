import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import campaignLogo from "@/assets/campaign-logo.png";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Register", href: "#register" },
  { label: "Track Pledge", href: "#track" },
  { label: "Analytics", href: "#analytics" },
  { label: "Volunteer", href: "#volunteer" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center">
          <img
            src={campaignLogo}
            alt="Tinubu & Abba 1 Million Pledge 2027"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="font-heading font-semibold">
              My Dashboard
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="default" size="sm" className="font-heading font-semibold shadow-primary">
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full mt-2 font-heading font-semibold">
                My Dashboard
              </Button>
            </Link>
            <Link to="/admin" onClick={() => setMobileOpen(false)}>
              <Button variant="default" className="w-full mt-2 font-heading font-semibold shadow-primary">
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
