import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
                <span className="font-heading font-bold text-primary-foreground text-sm">1M</span>
              </div>
              <div>
                <p className="font-heading font-bold text-sm">1 Million Pledge</p>
                <p className="text-xs text-primary-foreground/60">For Tinubu & Abba</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              A historic grassroots movement uniting Nigerians in support of progressive governance and national development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Register", "Track Pledge", "Analytics", "Volunteer"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail size={14} className="shrink-0" />
                info@1millionpledge.ng
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone size={14} className="shrink-0" />
                +234 800 PLEDGE
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                APC National Secretariat, Abuja
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Icon size={18} className="text-primary-foreground" />
                </a>
              ))}
            </div>
            <p className="text-primary-foreground/50 text-xs mt-6">
              #1MillionPledge #TinubuAbba
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-xs">
            © 2026 1 Million Pledge Campaign. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground/80 text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground/80 text-xs transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
