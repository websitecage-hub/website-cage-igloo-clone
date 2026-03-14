import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { VolumeX, Volume2, ArrowDownRight, Globe, Zap, Shield, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VideoScrollAnimation } from './VideoScrollAnimation';
import { Cursor } from './components/ui/inverted-cursor';

import { ParticleBackground } from './components/ui/particle-background';

function CapabilityCard({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-8 md:p-10 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-all duration-500"
    >
      <div className="mb-6 text-white/40 group-hover:text-white transition-colors">
        <Icon size={32} strokeWidth={1} />
      </div>
      <h3 className="text-xl font-sans font-black uppercase mb-4 tracking-tighter">{title}</h3>
      <p className="tech-label opacity-60 group-hover:opacity-100 transition-opacity leading-relaxed">{description}</p>
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
        <ArrowDownRight size={16} />
      </div>
    </motion.div>
  );
}

export default function App() {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const marqueeX = useTransform(scrollYProgress, [0, 1], [0, -1500]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const storyOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.55], [0, 1, 1, 0]);
  const storyScale = useTransform(scrollYProgress, [0.15, 0.35], [0.9, 1]);

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white selection:bg-white selection:text-black font-mono antialiased">
      {/* Global Inverted Cursor (Snowball) */}
      <Cursor size={45} />
      
      {/* Interactive Global Particle Background (Snow/Mist Particles) */}
      <ParticleBackground />

      {/* Background Video Animation */}
      <VideoScrollAnimation />

      {/* Hero Section */}
      <section className="relative min-h-[100svh] w-full flex flex-col justify-between p-6 md:p-16 z-20 overflow-hidden pt-[max(2rem,env(safe-area-inset-top))]">
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative flex flex-col md:flex-row justify-between items-start w-full gap-8 md:gap-0"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 md:gap-10"
          >
            <div className="logo-text text-4xl md:text-7xl drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">Igloo<br />Sanctuary</div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <p className="tech-label uppercase tracking-[0.3em] font-bold text-cyan-200/70 text-[10px] md:text-xs">Thermal_Stable</p>
              </div>
              <div className="tech-value border-l border-white/20 pl-4 py-1">
                <p className="font-black text-[10px] md:text-sm tracking-tight text-white/90">PROJECT_IGLOO_V1</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col md:items-end md:text-right max-w-[325px]"
          >
            <p className="tech-label mb-4 md:mb-8 text-white/40 tracking-[0.4em] font-black italic text-[9px]">////// THE_GENESIS</p>
            <div className="manifesto-body text-white/80 leading-relaxed font-light italic text-xs md:text-lg drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]">
              <p>"Architecture built from ice, designed for the digital fire. A shelter for the sovereign mind."</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative flex flex-col gap-10 items-start pb-[max(2rem,env(safe-area-inset-bottom))]"
        >
          <div className="space-y-4">
            <div className="bottom-text group cursor-default">
              <p className="text-cyan-400/40 tracking-[0.4em] uppercase text-[8px] mb-2 font-black">Outer_Rim_001</p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-white/40" />
                <p className="text-xs md:text-base font-light tracking-[0.2em] uppercase text-white/60">Step into the Cold</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NARRATIVE SECTION: Text with Snow Effect */}
      <section className="relative h-[200vh] pointer-events-none flex flex-col items-center justify-start pt-[50vh] z-20">
        <motion.div 
          style={{ opacity: storyOpacity, scale: storyScale }}
          className="max-w-3xl px-8 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 relative">
            Frozen in Code.
            {/* Subtle Snow-on-Text effect via overlay */}
            <span className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen animate-pulse" />
          </h2>
          <p className="text-lg md:text-2xl text-white/60 leading-relaxed font-light italic">
            "In the heart of the void, we found the frost. An igloo wasn't just a shelter; it was the first boundary between the chaos of the storm and the warmth of a new consensus."
          </p>
          <div className="mt-12 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                className="w-0.5 h-12 bg-gradient-to-b from-cyan-400 to-transparent"
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center overflow-hidden z-30">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#eff6ff]/40 via-[#eff6ff]/10 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#eff6ff]/40 via-[#eff6ff]/10 to-transparent z-10 pointer-events-none" />
        
        <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-[80px]" />
        
        <motion.div style={{ x: marqueeX }} className="relative z-20 flex whitespace-nowrap gap-12 md:gap-24">
          {[...Array(5)].map((_, i) => (
            <h2 key={i} className="font-sans font-black text-[12vh] md:text-[18vh] uppercase tracking-[0.1em] text-white/[0.15] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Modular Bricks • Thermal Core • Eternal Frost • Digital Sanctuary •
            </h2>
          ))}
        </motion.div>
      </section>

      {/* Capabilities Section */}
      <section className="relative min-h-screen py-24 md:py-32 px-6 md:px-24 z-30">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#eff6ff]/50 via-[#eff6ff]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[60px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 md:mb-24">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              className="tech-label mb-4 text-[10px] uppercase tracking-widest text-cyan-400/50 underline underline-offset-8"
            >
              01 // The Build
            </motion.p>
            <h2 className="font-sans font-black text-5xl md:text-8xl uppercase tracking-tighter leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Crafting<br />Sanctuary.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-sm backdrop-blur-md">
            <CapabilityCard 
              icon={Globe}
              title="Foundation"
              description="Ice bricks carved for maximum structural integrity and data persistence."
              index={0}
            />
            <CapabilityCard 
              icon={Zap}
              title="Energy"
              description="Harnessing the thermal gradient to power decentralized identities."
              index={1}
            />
            <CapabilityCard 
              icon={Shield}
              title="Insulation"
              description="Protecting your digital assets from the volatility of the outer storms."
              index={2}
            />
            <CapabilityCard 
              icon={Cpu}
              title="Core"
              description="A living, breathing heart of code at the center of the dome."
              index={3}
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#eff6ff]/50 via-[#eff6ff]/10 to-transparent pointer-events-none" />
      </section>

      {/* Final Call to Action */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center p-6 z-30">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#eff6ff]/50 via-[#eff6ff]/10 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center relative z-10"
        >
          <p className="tech-label mb-8 text-[10px] uppercase tracking-[0.3em] opacity-60 italic text-white/70">The storm is coming.</p>
          <h2 className="font-sans font-black text-6xl md:text-[14vw] uppercase tracking-tighter leading-none mb-12 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Enter.
          </h2>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#fff", boxShadow: "0 0 50px rgba(52, 211, 235, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-14 py-6 bg-white text-black font-sans font-black uppercase tracking-[0.3em] text-sm md:text-lg transition-all shadow-[0_0_80px_rgba(255,255,255,0.2)] border border-white/20"
          >
            Claim Shelter
          </motion.button>
        </motion.div>

        <footer className="absolute bottom-12 w-full px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 tech-label border-t border-white/10 pt-12 text-[9px] opacity-40 italic">
          <p>© 2026 IGLOO SANCTUARY • THE FROZEN PROTOCOL</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-cyan-400 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Coordinates</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Commune</a>
          </div>
        </footer>
      </section>
      
      {/* Subtle Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}


