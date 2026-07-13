import React from "react";
import { Leaf, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-stone-100 border-t border-green-800">
      {/* Main Footer Links */}
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
            {/* Social Icons (using inline SVGs for maximum reliability) */}
            <div className="flex gap-4">
              {[
                {
                  icon: (
                    <svg
                      className="w-4.5 h-4.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  label: "Facebook",
                },
                {
                  icon: (
                    <svg
                      className="w-4.5 h-4.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.051 1.96.23 2.504.442a4.902 4.902 0 01-1.67 1.089 4.902 4.902 0 01-1.089 1.669c.212.544.393 1.364.442 2.504.044.925.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.051 1.14-.23 1.96-.442 2.504a4.902 4.902 0 01-1.089 1.67 4.902 4.902 0 01-1.67 1.089c-.544.212-1.364.393-2.504.442-.925.044-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.14-.051-1.96-.23-2.504-.442a4.902 4.902 0 01-1.67-1.089 4.902 4.902 0 01-1.089-1.67c-.212-.544-.393-1.364-.442-2.504-.044-.925-.054-1.28-.054-3.71s.01-2.784.054-3.71c.051-1.14.23-1.96.442-2.504a4.902 4.902 0 011.089-1.67 4.902 4.902 0 011.67-1.089c.544-.212 1.364-.393 2.504-.442.925-.044 1.28-.054 3.71-.054zm-1.14 8.86a3.28 3.28 0 100 6.56 3.28 3.28 0 000-6.56zm4.708-3.07a.96.96 0 100-1.92.96.96 0 000 1.92z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  label: "Instagram",
                },
                {
                  icon: (
                    <svg
                      className="w-4.5 h-4.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  label: "Twitter",
                },
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

          {/* Customer Care (Daraz Style) */}
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

          {/* Partner & Sell (Multivendor Specific) */}
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

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-green-800 to-transparent my-8"></div>

        {/* Bottom Bar */}
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

      {/* Brand Stripe Accent */}
      <div className="h-1 bg-gradient-to-r from-green-400 via-amber-500 to-green-400"></div>
    </footer>
  );
};

export default Footer;
