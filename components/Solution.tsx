import React, { useRef, useState } from 'react';
import { Mic, Cpu, Zap, GraduationCap, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(33, 142, 141, 0.15)"
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-raitha-teal/10 bg-white/50 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full flex flex-col z-10">
        {children}
      </div>
    </div>
  );
};

export const Solution = () => {
  const features = [
    {
      icon: <Mic className="w-8 h-8 text-raitha-teal" />,
      title: "Voice-First for All",
      desc: "65% of workers are illiterate. Our voice interface in 11 Indian languages makes technology accessible to everyone.",
      accent: "bg-raitha-teal/10"
    },
    {
      icon: <Cpu className="w-8 h-8 text-raitha-sky" />,
      title: "AI-Powered Matching",
      desc: "Advanced algorithms match the right worker to the right job based on skills, location, ratings, and availability.",
      accent: "bg-raitha-sky/10"
    },
    {
      icon: <Zap className="w-8 h-8 text-raitha-wheat" />,
      title: "Escrow & Instant Pay",
      desc: "Money held securely in escrow. Released instantly to workers after verified completion. No delays, no disputes.",
      accent: "bg-raitha-wheat/10"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-raitha-orange" />,
      title: "Upskilling Platform",
      desc: "Free training courses, digital certifications, skill badges. Workers earn 15-25% premium for certified skills.",
      accent: "bg-raitha-orange/10"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-raitha-teal" />,
      title: "Safety & Trust",
      desc: "GPS verification, ratings system, SOS features, women's safety tools. Every job verified, every worker protected.",
      accent: "bg-raitha-teal/10"
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "End-to-End Platform",
      desc: "Job posting, discovery, booking, attendance, payment, rating - everything in one seamless experience.",
      accent: "bg-blue-500/10"
    }
  ];

  return (
    <section id="solution" className="py-32 bg-raitha-cream relative overflow-hidden">

      {/* Decorative Floating Glass Elements */}
      <div className="absolute top-20 left-[5%] w-32 h-32 rounded-3xl bg-gradient-to-br from-white/60 to-white/10 border border-white/40 backdrop-blur-xl shadow-lg rotate-12 animate-float pointer-events-none z-0" />
      <div className="absolute bottom-40 right-[2%] w-40 h-40 rounded-full bg-gradient-to-bl from-raitha-teal/10 to-white/20 border border-white/30 backdrop-blur-xl shadow-lg animate-float-delayed pointer-events-none z-0" />
      <div className="absolute top-1/3 right-[15%] w-20 h-20 rounded-xl bg-gradient-to-tr from-raitha-sky/10 to-white/10 border border-white/20 backdrop-blur-md rotate-45 animate-float pointer-events-none z-0 opacity-70" />
      <div className="absolute bottom-10 left-[20%] w-24 h-24 rounded-full bg-gradient-to-br from-raitha-orange/10 to-white/10 border border-white/20 backdrop-blur-md animate-float-delayed pointer-events-none z-0 opacity-70" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

        <div className="text-center mb-20">
          <span className="text-raitha-teal font-bold tracking-[0.2em] text-xs uppercase mb-4 block">The Solution</span>
          <h2 className="text-4xl md:text-6xl font-bold text-raitha-charcoal mb-6 tracking-tight">
            One Platform. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-raitha-teal to-raitha-sky">Complete Transformation.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Raitakarya eliminates middlemen, connects farmers directly with workers through intelligent matching, transparent pricing, and instant payments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <SpotlightCard key={index} className="p-8">
              <div className={`w-16 h-16 rounded-2xl ${feature.accent} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-raitha-charcoal mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                {feature.desc}
              </p>
              <div className="flex items-center text-raitha-teal font-bold text-sm group cursor-pointer">
                <span>Learn more</span>
                <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </SpotlightCard>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button variant="primary" className="h-14 px-10 text-lg shadow-2xl shadow-raitha-teal/20">
            See How It Works
          </Button>
        </div>

      </div>
    </section>
  );
};