import React from "react";
import { motion } from "framer-motion";
import { Leaf, Phone, Mail, MapPin, ShieldCheck, ArrowRight } from "lucide-react";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const linkVariants = {
    initial: { x: 0, color: "#f5f3f0" },
    hover: {
      x: 6,
      color: "#fef3c7",
      transition: { duration: 0.2 },
    },
  };

  const footerSections = [
    {
      title: "Customer Care",
      links: [
        "Help Center",
        "How to Buy & Pay",
        "Returns & Refunds",
        "Shipping & Delivery",
        "Track Your Order",
        "Corporate & Bulk Purchasing",
      ],
    },
    {
      title: "Earn with Aura",
      links: [
        "Sell on Aura Marketplace",
        "Merchant Partner Portal",
        "Affiliate Program",
        "Sustainability Guidelines for Sellers",
        "Logistics & Fulfillment by Aura",
        "Vendor Success Stories",
      ],
    },
  ];

  const socialIcons = [
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.051 1.96.23 2.504.442a4.902 4.902 0 011.089 1.089 4.902 4.902 0 011.089 1.089c.212.544.393 1.364.442 2.504.044.925.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.051 1.14-.23 1.96-.442 2.504a4.902 4.902 0 01-1.089 1.67 4.902 4.902 0 01-1.089 1.089c-.544.212-1.364.393-2.504.442-.925.044-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.14-.051-1.96-.23-2.504-.442a4.902 4.902 0 01-1.67-1.089 4.902 4.902 0 01-1.089-1.67c-.212-.544-.393-1.364-.442-2.504-.044-.925-.054-1.28-.054-3.71s.01-2.784.054-3.71c.051-1.14.23-1.96.442-2.504a4.902 4.902 0 011.089-1.67 4.902 4.902 0 011.67-1.089c.544-.212 1.364-.393 2.504-.442.925-.044 1.28-.054 3.71-.054zm-1.14 8.86a3.28 3.28 0 100 6.56 3.28 3.28 0 000-6.56zm4.708-3.07a.96.96 0 100-1.92.96.96 0 000 1.92z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  const policyLinks = [
    "Privacy Policy",
    "Terms of Service",
    "Intellectual Property Policy",
    "Vulnerability Disclosure",
  ];

  return (
    <footer className="bg-gradient-to-b from-green-900 via-green-950 to-green-900 text-stone-100 border-t border-green-800/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand Info */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="flex items-center gap-2.5 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Leaf size={28} className="text-green-300" />
              </motion.div>
              <h3 className="font-serif text-2xl font-bold tracking-wide">
                AURA
              </h3>
            </motion.div>
            <p className="text-green-100 text-sm leading-relaxed mb-6 font-light">
              A premium, sustainable multivendor marketplace connecting
              eco-conscious sellers with global shoppers. Handcrafted quality,
              natural ingredients, and authentic products for conscious living.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mb-2">
              {socialIcons.map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full bg-green-800/50 hover:bg-green-700 text-green-200 hover:text-green-100 flex items-center justify-center transition-all border border-green-700/50 hover:border-green-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(6, 78, 59, 0.8)",
                    y: -3,
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIdx) => (
            <motion.div key={section.title} variants={itemVariants}>
              <motion.h4
                className="font-serif text-lg font-semibold mb-5 text-green-200 flex items-center gap-2"
                whileHover={{ x: 4 }}
              >
                {section.title}
                <motion.div
                  className="w-1 h-1 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.h4>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link, idx) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + sectionIdx * 0.1 + idx * 0.05 }}
                  >
                    <motion.a
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      variants={linkVariants}
                      initial="initial"
                      whileHover="hover"
                      className="text-green-100 hover:text-green-300 transition-colors flex items-center gap-2 group"
                    >
                      <motion.span
                        className="w-1 h-1 rounded-full bg-green-400"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                      />
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Details */}
          <motion.div variants={itemVariants}>
            <motion.h4
              className="font-serif text-lg font-semibold mb-5 text-green-200 flex items-center gap-2"
              whileHover={{ x: 4 }}
            >
              Connect & Visit
              <motion.div
                className="w-1 h-1 rounded-full bg-green-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.h4>
            <ul className="space-y-3.5 text-sm">
              {[
                {
                  icon: Phone,
                  label: "+91 1122 235 2900",
                  href: "tel:+91112223",
                },
                {
                  icon: Mail,
                  label: "support@auramarketplace.com",
                  href: "mailto:support@auramarketplace.com",
                },
                {
                  icon: MapPin,
                  label: "Kathmandu, Nepal",
                  href: "#",
                },
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-green-300 shrink-0 mt-0.5"
                  >
                    <item.icon size={16} />
                  </motion.div>
                  <motion.a
                    href={item.href}
                    whileHover={{ x: 3 }}
                    className="text-green-100 hover:text-green-300 transition-colors"
                  >
                    {item.label}
                  </motion.a>
                </motion.li>
              ))}

              <motion.li
                className="pt-4 border-t border-green-800 flex items-center gap-2.5 text-xs text-green-300 font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShieldCheck size={18} />
                </motion.div>
                <span>100% Secure Shopping (SSL Encrypted)</span>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-green-700/40 to-transparent my-10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />

        {/* Bottom Bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm text-green-100 text-center md:text-left"
          >
            &copy; {new Date().getFullYear()} Aura Marketplace. All rights
            reserved. Connecting independent artisans and eco-conscious brands
            globally.
          </motion.p>

          <div className="flex flex-wrap gap-6 text-sm text-green-100 justify-center">
            {policyLinks.map((link, idx) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                whileHover={{ color: "#fef3c7", x: 2 }}
                className="hover:text-green-300 transition-colors relative group"
              >
                {link}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-green-400 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Brand Stripe Accent */}
      <motion.div
        className="h-1.5 bg-gradient-to-r from-green-400 via-amber-400 to-green-400 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </footer>
  );
};

export default Footer;