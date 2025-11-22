import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Star, Clock, Bell, MapPin, Wheat, Wallet, Mic, Signal, Wifi, Battery, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button';

export const Hero = () => {
   const ref = useRef(null);
   const { scrollY } = useScroll();

   // Mouse Tilt Effect
   const mouseX = useMotionValue(0);
   const mouseY = useMotionValue(0);

   const handleMouseMove = (e: React.MouseEvent) => {
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
   };

   const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
   const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

   // Scroll Parallax
   const yText = useTransform(scrollY, [0, 500], [0, 100]);
   const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

   return (
      <section
         ref={ref}
         className="relative min-h-screen flex flex-col bg-[#0F1111] overflow-hidden pt-32 lg:pt-40 pb-20"
         onMouseMove={handleMouseMove}
      >

         {/* Ambient Background Light */}
         <div className="absolute inset-0 pointer-events-none">
            {/* Top Left Teal Glow */}
            <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-raitha-teal/10 blur-[120px] animate-pulse-slow" />
            {/* Bottom Right Orange Glow */}
            <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-raitha-orange/5 blur-[100px]" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}></div>

            {/* Animated Glow Points on Grid */}
            <div className="absolute inset-0 overflow-hidden">
               {[...Array(5)].map((_, i) => (
                  <motion.div
                     key={i}
                     className="absolute w-1 h-1 bg-raitha-teal rounded-full blur-[1px]"
                     initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
                     animate={{
                        y: [null, Math.random() * -100 + "%"],
                        opacity: [0, 1, 0]
                     }}
                     transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
                  />
               ))}
            </div>
         </div>

         <div className="max-w-[1440px] mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-20 px-6 lg:px-12">

            {/* Left Content - Typography */}
            <motion.div
               style={{ y: yText, opacity: opacityHero }}
               className="lg:col-span-6 flex flex-col gap-8 z-30"
            >

               {/* Badge */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit"
               >
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-raitha-teal opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-raitha-teal"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-raitha-teal">Live in 28 States</span>
               </motion.div>

               {/* Headline */}
               <div className="relative">
                  <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] font-bold font-sans text-white tracking-tight">
                     <span className="block mb-2">The Future of</span>
                     <span className="block text-transparent bg-clip-text bg-gradient-to-r from-raitha-teal via-white to-raitha-sky animate-gradient pb-2">
                        Agriculture
                     </span>
                     <span className="block">Is Connected.</span>
                  </h1>
               </div>

               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-400 font-body max-w-lg leading-relaxed"
               >
                  Raitakarya connects <span className="text-white font-semibold">260M workers</span> with farmers instantly.
                  Voice-first matching, fair wages, and dignity for every hand that feeds the nation.
               </motion.p>

               {/* CTAs */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-4 mt-4"
               >
                  <Button variant="primary" icon={<ArrowRight size={18} />} className="h-14 px-8 text-lg shadow-[0_0_40px_-10px_rgba(33,142,141,0.5)]">
                     Get Started
                  </Button>
                  <Button variant="glass" icon={<Play size={18} fill="currentColor" />} className="h-14 px-8 text-lg bg-white/5 border-white/10 hover:bg-white/10 text-white">
                     Watch Demo
                  </Button>
               </motion.div>

               {/* Trust Indicators */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-6 mt-8 pt-8 border-t border-white/5"
               >
                  <div className="flex -space-x-4">
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0F1111] bg-gray-800 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110 hover:z-10 cursor-pointer">
                           <img src={`https://picsum.photos/100?random=${i + 10}`} alt="Partner" className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
                  <div className="flex flex-col">
                     <div className="flex items-center gap-1 text-raitha-wheat">
                        {'★★★★★'.split('').map((s, i) => <span key={i} className="text-lg">{s}</span>)}
                     </div>
                     <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Trusted by 500k+ Farmers</p>
                  </div>
               </motion.div>
            </motion.div>

            {/* Right Visual - 3D Phone Mockup */}
            <div className="lg:col-span-6 relative h-[600px] lg:h-[800px] flex items-center justify-center perspective-[2000px] z-10">
               <motion.div
                  style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                  className="relative w-[300px] h-[600px]"
               >

                  {/* Background Abstract Wheat (Floating Behind) */}
                  <motion.div
                     style={{ transform: 'translateZ(-40px)' }}
                     className="absolute top-1/4 -left-20 text-raitha-teal/10 rotate-[-15deg]"
                  >
                     <Wheat size={200} />
                  </motion.div>
                  <motion.div
                     style={{ transform: 'translateZ(-20px)' }}
                     className="absolute bottom-1/4 -right-10 text-raitha-orange/10 rotate-[15deg]"
                  >
                     <Wheat size={150} />
                  </motion.div>

                  {/* Floating Notification: Job Matched (Top Right) */}
                  <motion.div
                     initial={{ x: 40, y: 20, opacity: 0 }}
                     animate={{ x: 0, y: 0, opacity: 1 }}
                     transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                     className="absolute top-[10%] -right-[20%] w-[240px] p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20"
                     style={{ transform: 'translateZ(60px)' }}
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-500">
                           <CheckCircle2 size={20} />
                        </div>
                        <div>
                           <div className="text-xs text-gray-300 font-bold uppercase tracking-wide">Match Found!</div>
                           <div className="text-sm font-bold text-white">Singh Wheat Farms</div>
                        </div>
                     </div>
                     <div className="mt-3 flex justify-between items-center text-xs border-t border-white/10 pt-2">
                        <span className="text-gray-400">Rate: ₹650/day</span>
                        <span className="text-raitha-teal font-bold">Accepting...</span>
                     </div>
                  </motion.div>

                  {/* Floating Notification: Payment Received (Bottom Left) */}
                  <motion.div
                     initial={{ x: -40, y: 20, opacity: 0 }}
                     animate={{ x: 0, y: 0, opacity: 1 }}
                     transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                     className="absolute bottom-[15%] -left-[20%] w-[220px] p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20"
                     style={{ transform: 'translateZ(80px)' }}
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-raitha-orange/20 border border-raitha-orange/30 flex items-center justify-center text-raitha-orange">
                           <Wallet size={20} />
                        </div>
                        <div>
                           <div className="text-xs text-gray-300 font-bold uppercase tracking-wide">Payment Received</div>
                           <div className="text-lg font-bold text-white">₹ 850.00</div>
                        </div>
                     </div>
                  </motion.div>

                  {/* THE PHONE */}
                  <motion.div
                     style={{ transform: 'translateZ(20px)' }}
                     className="relative w-full h-full bg-[#0F1111] rounded-[48px] border-[6px] border-[#2a2a2a] shadow-[0_0_60px_rgba(33,142,141,0.15)] overflow-hidden ring-1 ring-white/10"
                  >
                     {/* Phone Frame Highlights */}
                     <div className="absolute inset-0 rounded-[42px] border-2 border-white/5 pointer-events-none z-30"></div>

                     {/* Screen Content */}
                     <div className="w-full h-full bg-[#F2F4F6] relative overflow-hidden">
                        {/* Top Status Bar */}
                        <div className="flex justify-between items-center px-6 py-4 text-xs font-medium text-gray-800">
                           <span>9:41</span>
                           <div className="flex items-center gap-1">
                              <Signal size={12} />
                              <Wifi size={12} />
                              <Battery size={12} />
                           </div>
                        </div>

                        {/* Dynamic Island */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[80px] h-[24px] bg-black rounded-full z-40"></div>

                        {/* App Header */}
                        <div className="px-6 pb-6 bg-white shadow-sm z-10 relative pt-2">
                           <div className="flex justify-between items-center mb-6">
                              <div className="flex items-center gap-3">
                                 <img src="https://picsum.photos/100?random=22" className="w-10 h-10 rounded-full border-2 border-raitha-teal" alt="Profile" />
                                 <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Hello</p>
                                    <p className="font-bold text-gray-800">Ramesh Kumar</p>
                                 </div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-600 relative">
                                 <Bell size={18} />
                                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                              </div>
                           </div>

                           {/* Earnings Widget */}
                           <div className="bg-raitha-teal rounded-2xl p-5 text-white shadow-lg shadow-raitha-teal/20 relative overflow-hidden">
                              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                              <p className="text-xs text-raitha-teal/20 font-bold uppercase mb-1 text-white/70">Today's Earnings</p>
                              <div className="flex justify-between items-end">
                                 <h3 className="text-3xl font-bold tracking-tight">₹ 850</h3>
                                 <span className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                    <TrendingUp size={10} /> +12%
                                 </span>
                              </div>
                           </div>
                        </div>

                        {/* App Body */}
                        <div className="px-6 py-6 flex flex-col gap-5">
                           {/* Voice Action Button */}
                           <div className="h-32 rounded-3xl bg-[#1F2121] relative overflow-hidden flex items-center justify-center shadow-xl cursor-pointer group">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#1F2121] to-black"></div>
                              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                              <div className="relative z-10 flex flex-col items-center">
                                 <div className="w-14 h-14 rounded-full bg-raitha-orange flex items-center justify-center mb-2 shadow-lg shadow-raitha-orange/30 group-hover:scale-110 transition-transform">
                                    <Mic className="text-white" size={24} />
                                 </div>
                                 <span className="text-white font-medium text-sm">Find Work</span>
                              </div>
                              {/* Animated Rings */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full animate-ping opacity-20"></div>
                           </div>

                           <div className="flex justify-between items-end px-1">
                              <p className="text-sm font-bold text-gray-400">Nearby Jobs</p>
                              <p className="text-xs text-raitha-teal font-bold">View All</p>
                           </div>

                           {/* Job Card 1 */}
                           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shadow-sm">🌾</div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-sm text-gray-800">Wheat Harvest</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">Singh Farms</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin size={8} /> 2km</span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-bold text-raitha-teal">₹650</p>
                              </div>
                           </div>

                           {/* Job Card 2 */}
                           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center opacity-60">
                              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-sm">🚜</div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-sm text-gray-800">Tractor Driver</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">Green Fields</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin size={8} /> 5km</span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-bold text-raitha-teal">₹800</p>
                              </div>
                           </div>
                        </div>

                     </div>
                  </motion.div>

               </motion.div>
            </div>
         </div>
      </section>
   );
};