import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from './ui/Logo';

export const Footer = () => {
  return (
    <footer id="footer" className="bg-raitha-charcoal pt-20 pb-10 text-white">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Logo variant="white" className="h-8" />
              <span className="text-xl font-bold">Raitakarya</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Khet se Khushhaali.<br />Transforming India's agricultural labor market through technology and trust.</p>
            <div className="flex gap-4 text-gray-400">
              <a href="https://twitter.com/raitakarya" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-raitha-teal hover:text-white transition-all cursor-pointer">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com/company/raitakarya" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-raitha-teal hover:text-white transition-all cursor-pointer">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com/raitakarya" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-raitha-teal hover:text-white transition-all cursor-pointer">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-raitha-teal transition-colors">For Workers</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">For Farmers</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-raitha-teal transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">Impact Report</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">Partners</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-raitha-teal transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-raitha-teal transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h4 className="font-bold mb-4 text-raitha-teal">Get in Touch</h4>
            <p className="text-sm text-gray-400 mb-2">raitakarya@gmail.com</p>
            <p className="text-sm text-gray-400 mb-2">+91-9880973453</p>
            <p className="text-xs text-gray-500 mt-4">Bangalore, India</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 Raitakarya. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>for India's farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};