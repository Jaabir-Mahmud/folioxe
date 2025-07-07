import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social SVGs
  const socials = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.646.59-2.542.698a4.48 4.48 0 001.963-2.475 8.94 8.94 0 01-2.828 1.082A4.48 4.48 0 0016.11 4c-2.482 0-4.495 2.013-4.495 4.495 0 .352.04.695.116 1.022C7.728 9.37 4.1 7.555 1.67 4.905a4.48 4.48 0 00-.608 2.262c0 1.56.795 2.936 2.006 3.744a4.48 4.48 0 01-2.037-.563v.057c0 2.18 1.55 4.002 3.604 4.418a4.48 4.48 0 01-2.03.077c.573 1.788 2.24 3.09 4.213 3.125A8.98 8.98 0 012 19.54a12.68 12.68 0 006.88 2.017c8.253 0 12.77-6.837 12.77-12.77 0-.195-.004-.39-.013-.583A9.13 9.13 0 0024 4.59a8.94 8.94 0 01-2.54.697z" /></svg>
      )
    },
    {
      name: 'GitHub',
      href: 'https://github.com/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.848-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" clipRule="evenodd" /></svg>
      )
    },
    {
      name: 'Email',
      href: 'mailto:support@folioxe.com',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" /></svg>
      )
    }
  ];

  const footerNavLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Browse', href: '/browse' },
    { name: 'Submit', href: '/submit-product' },
    { name: 'Dashboard', href: '/seller-dashboard' },
    
  ];

  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">FolioXe</Link>
          
         
          <span className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Your creative marketplace for digital assets.</span>
          <hr className="w-24 border-t-2 border-dashed border-blue-400 dark:border-blue-500 my-3" style={{borderRadius: '9999px', borderStyle: 'dashed'}} />
           <Link
            to="/xabir"
            className="mb-1 text-xl font-bold text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 transition-colors"
            style={{ letterSpacing: '0.09em' }}
          >
            Xabir
          </Link>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Quick Links</h3>
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
        {/* Socials */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Connect With Us</h3>
          <div className="flex gap-5 mb-4">
            {socials.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition" aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Email: <a href="mailto:support@folioxe.com" className="hover:text-blue-600 dark:hover:text-blue-400">support@folioxe.com</a>
          </p>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} FolioXe. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
