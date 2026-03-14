import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { VolumeX, Volume2, ArrowDownRight, Globe, Zap, Shield, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VideoScrollAnimation } from './VideoScrollAnimation';
import { Cursor } from './components/ui/inverted-cursor';

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

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white selection:bg-white selection:text-black font-mono antialiased">
      {/* Global Inverted Cursor (Snowball) */}
      <Cursor size={40} />

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
            <div className="logo-text text-4xl md:text-7xl">Website<br />Cage</div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <p className="tech-label uppercase tracking-[0.3em] font-bold text-white/50 text-[10px] md:text-xs">System_Live</p>
              </div>
              <div className="tech-value border-l border-white/20 pl-4 py-1">
                <p className="font-black text-[10px] md:text-sm tracking-tight text-white/80">CAGE_V2.0.26</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col md:items-end md:text-right max-w-[320px]"
          >
            <p className="tech-label mb-4 md:mb-8 text-white/20 tracking-[0.4em] font-black italic text-[9px]">////// MANIFESTO_01</p>
            <div className="manifesto-body text-white/60 leading-relaxed font-light italic text-xs md:text-lg">
              <p>"Building the foundational layer for decentralized culture. Where identity meets high-fidelity experience."</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative flex flex-col gap-10 items-start pb-[max(2rem,env(safe-area-inset-bottom))]"
        >
          <div className="space-y-4">
            <div className="bottom-text group cursor-default">
              <p className="text-white/20 tracking-[0.4em] uppercase text-[8px] mb-2 font-black">Sequence_001</p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-white/20" />
                <p className="text-xs md:text-base font-light tracking-[0.2em] uppercase text-white/40">Scroll to Explore</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="flex items-center gap-4 group"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-white/5 rounded-full bg-white/5 backdrop-blur-xl group-hover:border-white/20 transition-all duration-500">
              {isSoundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </div>
            <span className="text-[9px] font-bold tracking-tighter opacity-30">{isSoundOn ? 'AUDIO_ON' : 'AUDIO_OFF'}</span>
          </button>
        </motion.div>
        
        {/* SECTION BOUNDARY: Fade out Hero to Video */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* Spacer for Video Scroll */}
      <section className="h-[250vh] pointer-events-none" />

      {/* Marquee Section */}
      <section className="relative h-[40vh] md:h-[60vh] flex items-center overflow-hidden z-30">
        {/* SECTION BOUNDARY: Top & Bottom Fades for Marquee */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        
        <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />
        
        <motion.div style={{ x: marqueeX }} className="relative z-20 flex whitespace-nowrap gap-12 md:gap-24">
          {[...Array(5)].map((_, i) => (
            <h2 key={i} className="font-sans font-black text-[12vh] md:text-[18vh] uppercase tracking-[0.1em] opacity-10">
              Onchain Revolution • Consumer Crypto • Digital Sovereignty •
            </h2>
          ))}
        </motion.div>
      </section>

      {/* Capabilities Section */}
      <section className="relative min-h-screen py-24 md:py-32 px-6 md:px-24 z-30">
        {/* SECTION BOUNDARY: Fade in from Video */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 md:mb-24">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              className="tech-label mb-4 text-[10px] uppercase tracking-widest"
            >
              01 // Capabilities
            </motion.p>
            <h2 className="font-sans font-black text-5xl md:text-8xl uppercase tracking-tighter leading-none">
              The<br />Future Cage.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-sm">
            <CapabilityCard 
              icon={Globe}
              title="Onchain"
              description="Deploying robust smart contracts and decentralized infrastructure."
              index={0}
            />
            <CapabilityCard 
              icon={Zap}
              title="Velocity"
              description="Rapid prototyping and deployment of consumer applications."
              index={1}
            />
            <CapabilityCard 
              icon={Shield}
              title="Security"
              description="Audited systems ensuring the safety of digital assets."
              index={2}
            />
            <CapabilityCard 
              icon={Cpu}
              title="Compute"
              description="High-performance edge computing with blockchain finality."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center p-6 z-30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="tech-label mb-8 text-[10px] uppercase tracking-[0.3em] opacity-40 italic">Ready to enter?</p>
          <h2 className="font-sans font-black text-6xl md:text-[14vw] uppercase tracking-tighter leading-none mb-12">
            Join.
          </h2>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "#fff" }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 bg-white/90 text-black font-sans font-black uppercase tracking-[0.3em] text-sm md:text-lg transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10"
          >
            Connect
          </motion.button>
        </motion.div>

        <footer className="absolute bottom-12 w-full px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 tech-label border-t border-white/5 pt-12 text-[9px] opacity-30 italic">
          <p>© 2026 Website Cage, Inc.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Github</a>
          </div>
        </footer>
      </section>
      
      {/* Subtle Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}

