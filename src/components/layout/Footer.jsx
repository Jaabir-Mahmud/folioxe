// folioxe/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation links

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Placeholder social media icons (replace with actual SVGs or an icon library later)
  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'FB' }, // Replace '#' with actual links
    { name: 'Twitter', href: '#', icon: 'TW' },
    { name: 'Instagram', href: '#', icon: 'IG' },
    { name: 'LinkedIn', href: '#', icon: 'LI' },
  ];

  const footerNavLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Mission (Optional) */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              FolioXe
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your creative marketplace for digital assets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerNavLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Contact (Optional) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={link.name}
                >
                  {/* Replace with actual SVG icons later */}
                  <span className="sr-only">{link.name}</span>
                  <div className="w-6 h-6 border border-gray-400 dark:border-gray-500 rounded-full flex items-center justify-center text-xs">
                    {link.icon} {/* Placeholder text icon */}
                  </div>
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: <a href="mailto:support@folioxe.com" className="hover:text-blue-600 dark:hover:text-blue-400">support@folioxe.com</a>
            </p>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} FolioXe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;