import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StatItem = ({ value, label, delay = 0 }: { value: string, label: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-raitha-teal/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10 border border-white/5 bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center hover:border-raitha-teal/30 transition-colors duration-300">
      <div className="font-mono text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-2 tracking-tight">{value}</div>
      <div className="text-raitha-sky font-bold text-xs tracking-[0.2em] uppercase">{label}</div>
    </div>
  </motion.div>
);

const PulsingDot = ({
  cx,
  cy,
  delay,
  color = "#32B8C6",
  onMouseEnter,
  onMouseLeave
}: {
  cx: number,
  cy: number,
  delay: number,
  color?: string,
  onMouseEnter?: () => void,
  onMouseLeave?: () => void
}) => (
  <g
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="cursor-pointer group"
  >
    {/* Invisible Hover Target (Larger area for better UX) */}
    <circle cx={cx} cy={cy} r="24" fill="transparent" />

    {/* Main Dot - Scales in and shifts color from white to target */}
    <motion.circle
      cx={cx}
      cy={cy}
      r="4"
      initial={{ scale: 0, fill: "#ffffff" }}
      animate={{ scale: 1, fill: color }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      className="drop-shadow-[0_0_10px_currentColor] transition-transform duration-300 group-hover:scale-150"
    />

    {/* Pulse Ring 1 - Primary Ripple */}
    <motion.circle
      cx={cx}
      cy={cy}
      r="4"
      fill="none"
      stroke={color}
      strokeWidth="2"
      initial={{ r: 4, opacity: 1 }}
      animate={{ r: 20, opacity: 0 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: delay,
        ease: "easeOut"
      }}
    />

    {/* Pulse Ring 2 - Secondary Larger Ripple */}
    <motion.circle
      cx={cx}
      cy={cy}
      r="4"
      fill="none"
      stroke={color}
      strokeWidth="1"
      initial={{ r: 4, opacity: 0.5 }}
      animate={{ r: 35, opacity: 0 }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        delay: delay + 0.4,
        ease: "easeOut"
      }}
    />
  </g>
);

export const Impact = () => {
  const [hoveredLocation, setHoveredLocation] = useState<{ id: string, cx: number, cy: number, color: string, name: string, stat: string } | null>(null);

  const indiaPath = "M 266,62 L 256,75 L 226,83 L 206,112 L 197,145 L 172,168 L 145,184 L 125,215 L 131,235 L 131,260 L 148,285 L 165,296 L 175,315 L 185,345 L 201,385 L 225,435 L 245,485 L 265,545 L 285,565 L 305,545 L 325,495 L 345,465 L 355,435 L 370,405 L 385,385 L 405,365 L 425,355 L 445,345 L 465,325 L 475,305 L 485,285 L 495,265 L 525,245 L 515,235 L 495,225 L 475,215 L 465,195 L 455,185 L 465,175 L 485,165 L 475,145 L 465,135 L 445,125 L 425,135 L 405,125 L 385,115 L 365,105 L 345,95 L 325,85 L 305,65 Z";

  const mapLocations = [
    { id: 'punjab', cx: 226, cy: 83, delay: 0.2, color: "#F4C430", name: "Punjab", stat: "98% Utilization" },
    { id: 'up', cx: 340, cy: 180, delay: 0.4, color: "#32B8C6", name: "Uttar Pradesh", stat: "1.2M Workers" },
    { id: 'gujarat', cx: 131, cy: 235, delay: 0.6, color: "#E68161", name: "Gujarat", stat: "High Adoption" },
    { id: 'maharashtra', cx: 201, cy: 385, delay: 0.8, color: "#32B8C6", name: "Maharashtra", stat: "450k Farmers" },
    { id: 'andhra', cx: 300, cy: 420, delay: 1.0, color: "#F4C430", name: "Andhra Pradesh", stat: "Fastest Growth" },
    { id: 'bengal', cx: 455, cy: 230, delay: 1.2, color: "#E68161", name: "West Bengal", stat: "Emerging Hub" },
  ];

  return (
    <section id="impact" className="py-32 bg-[#0B0D0D] relative overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(33,142,141,0.05),transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-raitha-teal/20 to-transparent"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-raitha-teal animate-pulse"></span>
              <span className="text-raitha-teal font-bold tracking-[0.2em] text-xs uppercase">Live Impact</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-none tracking-tight">
              Scaling Trust <br />
              <span className="text-gray-600">Across India.</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-white">28</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">States Live</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">11</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Languages</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">

          {/* Stats Column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 content-start">
            <StatItem value="5M+" label="Verified Workers" delay={0} />
            <StatItem value="500K+" label="Farmer Partners" delay={0.1} />
            <StatItem value="25M+" label="Jobs Completed" delay={0.2} />
            <StatItem value="₹13.5K Cr" label="GMV Processed" delay={0.3} />

            <div className="col-span-2 mt-8 bg-raitha-teal/10 border border-raitha-teal/20 rounded-2xl p-6">
              <div className="text-sm text-raitha-teal font-bold mb-2">Impact Note</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                By eliminating middlemen, Raitakarya has directly transferred <span className="text-white font-bold">₹2,300 Crores</span> of additional income to rural households this year.
              </p>
            </div>
          </div>

          {/* Holographic Map Column */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Map Container */}
            <div className="relative w-full max-w-[600px] aspect-[0.9]">

              {/* Scanning Laser Effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-raitha-teal/50 to-transparent blur-sm z-20"
                animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <svg viewBox="0 0 600 600" className="w-full h-full drop-shadow-[0_0_20px_rgba(33,142,141,0.2)]">
                <defs>
                  <pattern id="dotPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="rgba(50, 184, 198, 0.3)" />
                  </pattern>
                  <linearGradient id="mapFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1F2121" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#1F2121" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Map Silhouette Fill */}
                <path d={indiaPath} fill="url(#dotPattern)" />

                {/* Map Stroke */}
                <motion.path
                  d={indiaPath}
                  fill="none"
                  stroke="rgba(50, 184, 198, 0.5)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />

                {/* Active Nodes from Data */}
                {mapLocations.map((loc) => (
                  <PulsingDot
                    key={loc.id}
                    cx={loc.cx}
                    cy={loc.cy}
                    delay={loc.delay}
                    color={loc.color}
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                  />
                ))}

                {/* Connecting Data Lines */}
                <motion.line x1="226" y1="83" x2="340" y2="180" stroke="rgba(50,184,198,0.2)" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                <motion.line x1="340" y1="180" x2="455" y2="230" stroke="rgba(50,184,198,0.2)" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                <motion.line x1="131" y1="235" x2="201" y2="385" stroke="rgba(50,184,198,0.2)" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              </svg>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {hoveredLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-[140%]"
                    style={{
                      left: `${(hoveredLocation.cx / 600) * 100}%`,
                      top: `${(hoveredLocation.cy / 600) * 100}%`,
                    }}
                  >
                    <div
                      className="bg-[#0F1111]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl border-l-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-[160px]"
                      style={{ borderLeftColor: hoveredLocation.color }}
                    >
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Region Stats</div>
                      <div className="font-bold text-white text-base mb-0.5">{hoveredLocation.name}</div>
                      <div className="text-xs font-bold" style={{ color: hoveredLocation.color }}>{hoveredLocation.stat}</div>
                    </div>
                    {/* Tooltip Triangle */}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#0F1111]/90 absolute left-1/2 -translate-x-1/2 bottom-[-6px]"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};