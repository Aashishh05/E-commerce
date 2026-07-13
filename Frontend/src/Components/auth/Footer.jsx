import React from "react";
import {
  Leaf,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ShieldCheck,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-stone-100 border-t border-green-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={24} className="text-green-300 animate-pulse" />
              <h3 className="font-serif text-2xl font-bold tracking-wide">
                AURA
              </h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed mb-6">
              A premium, sustainable multivendor marketplace connecting
              eco-conscious sellers with global shoppers. Handcrafted quality,
              natural ingredients, and authentic products.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={18} />, label: "Facebook" },
                { icon: <Instagram size={18} />, label: "Instagram" },
                { icon: <Twitter size={18} />, label: "Twitter" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-green-800 hover:bg-green-700 text-green-200 hover:text-white flex items-center justify-center transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-green-200">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Help Center",
                "How to Buy & Pay",
                "Returns & Refunds",
                "Shipping & Delivery",
                "Track Your Order",
                "Corporate & Bulk Purchasing",
              ].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-green-100 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Earn with Aura */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-green-200">
              Earn with Aura
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Sell on Aura Marketplace",
                "Merchant Partner Portal",
                "Affiliate Program",
                "Sustainability Guidelines for Sellers",
                "Logistics & Fulfillment by Aura",
                "Vendor Success Stories",
              ].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-green-100 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-green-200">
              Connect & Visit
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-green-300" />
                <a
                  href="tel:+91112223"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  +91 1122 235 2900
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-green-300" />
                <a
                  href="mailto:support@auramarketplace.com"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  support@auramarketplace.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-green-300 shrink-0 mt-0.5" />
                <span className="text-green-100">Kathmandu, Nepal</span>
              </li>
              <li className="pt-4 border-t border-green-800 flex items-center gap-2 text-xs text-green-300">
                <ShieldCheck size={18} />
                <span>100% Secure Shopping (SSL Encrypted)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-green-800 to-transparent my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-green-100">
            &copy; {new Date().getFullYear()} Aura Marketplace. All rights
            reserved. Connecting independent artisans and brands.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-green-100 justify-center">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Intellectual Property Policy",
              "Vulnerability Disclosure",
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-green-400 via-amber-500 to-green-400"></div>
    </footer>
  );
};

export default Footer;
