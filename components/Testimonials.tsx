import React from 'react';
import { Star } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export const Testimonials = () => {
  return (
    <section className="py-32 bg-raitha-cream">
      <div className="max-w-[1440px] mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-raitha-charcoal">Voices from the Field</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard className="bg-white/60 border-white/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 bg-[url('https://picsum.photos/100/100?random=1')] bg-cover"></div>
              <div>
                <div className="font-bold text-raitha-charcoal">Ramesh Kumar</div>
                <div className="text-sm text-raitha-mediumGray">Worker, Bihar</div>
              </div>
            </div>
            <div className="flex gap-1 text-raitha-wheat mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-raitha-earth italic">"I used to work only 120 days a year. Now I work 200+ days and earn ₹30,000 more annually. Raitakarya changed my life."</p>
          </GlassCard>

          <GlassCard className="bg-white/60 border-white/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 bg-[url('https://picsum.photos/100/100?random=2')] bg-cover"></div>
              <div>
                <div className="font-bold text-raitha-charcoal">Harpreet Singh</div>
                <div className="text-sm text-raitha-mediumGray">Farmer, Punjab</div>
              </div>
            </div>
            <div className="flex gap-1 text-raitha-wheat mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-raitha-earth italic">"I saved ₹1.2 lakhs this harvest by hiring directly. Workers arrived on time, completed work perfectly. No contractor stress!"</p>
          </GlassCard>

          <GlassCard className="bg-white/60 border-white/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 bg-[url('https://picsum.photos/100/100?random=3')] bg-cover"></div>
              <div>
                <div className="font-bold text-raitha-charcoal">Lakshmi Group</div>
                <div className="text-sm text-raitha-mediumGray">Warangal</div>
              </div>
            </div>
            <div className="flex gap-1 text-raitha-wheat mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-raitha-earth italic">"Our team now earns 40% more. We choose safe verified farmers. Direct payment means no exploitation. We are empowered."</p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};