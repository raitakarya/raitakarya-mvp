import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', href: '#solution' },
    { name: 'Impact', href: '#impact' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#footer' },
  ];

  // Dynamic text color based on scroll state
  const textColorClass = isScrolled ? 'text-raitha-slate' : 'text-white';
  const hoverColorClass = isScrolled ? 'text-raitha-teal' : 'text-raitha-sky';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${isScrolled ? 'pt-4' : 'pt-6'
          }`}
      >
        <div
          className={`relative flex items-center justify-between transition-all duration-500 ${isScrolled
              ? 'w-[90%] max-w-[1200px] h-16 px-6 rounded-full bg-raitha-cream/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)]'
              : 'w-full max-w-[1440px] h-20 px-8 bg-transparent'
            }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <Logo variant={isScrolled ? 'color' : 'white'} className="h-8" />
            <span className={`font-sans font-bold text-xl tracking-tight transition-colors duration-300 ${isScrolled ? 'text-raitha-charcoal' : 'text-white'}`}>
              Raitakarya
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <div className={`flex items-center px-2 py-1.5 rounded-full transition-all duration-500 ${isScrolled ? '' : 'bg-white/10 backdrop-blur-md border border-white/10'}`}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-5 py-2 text-sm font-medium transition-colors rounded-full group overflow-hidden ${isScrolled ? 'text-raitha-slate hover:text-raitha-teal' : 'text-white/90 hover:text-white'}`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className={`absolute inset-0 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 origin-center ${isScrolled ? 'bg-raitha-teal/5' : 'bg-white/20'}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${textColorClass} hover:${hoverColorClass}`}>
              <Globe size={16} />
              <span>EN</span>
            </button>
            <div className={`h-4 w-px ${isScrolled ? 'bg-raitha-charcoal/10' : 'bg-white/20'}`} />
            <a href="#" className={`font-medium text-sm transition-colors ${textColorClass} hover:${hoverColorClass}`}>
              Sign In
            </a>
            <Button variant={isScrolled ? "primary" : "secondary"} className="!py-2 !px-5 !text-sm !h-10 shadow-none border-0">
              Download App
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? 'text-raitha-charcoal hover:bg-raitha-teal/10' : 'text-white hover:bg-white/10'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-raitha-charcoal/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-raitha-cream shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <Logo variant="color" className="h-6" />
                  <span className="font-bold text-lg text-raitha-charcoal">Raitakarya</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <X size={20} className="text-raitha-charcoal" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    href={link.href}
                    className="text-2xl font-bold text-raitha-charcoal hover:text-raitha-teal transition-colors border-b border-gray-100 pb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <Button variant="primary" className="w-full mb-4">
                  Download App
                </Button>
                <div className="flex justify-center text-sm text-raitha-mediumGray">
                  v1.0.2 • Bengaluru
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};