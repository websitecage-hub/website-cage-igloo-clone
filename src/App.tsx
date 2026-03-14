import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { VolumeX, Volume2, ArrowDownRight, Globe, Zap, Shield, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VideoScrollAnimation } from './VideoScrollAnimation';

function CapabilityCard({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-8 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/5 transition-all duration-500"
    >
      <div className="mb-6 text-white/40 group-hover:text-white transition-colors">
        <Icon size={32} strokeWidth={1} />
      </div>
      <h3 className="text-xl font-sans font-black uppercase mb-4 tracking-tighter">{title}</h3>
      <p className="tech-label opacity-60 group-hover:opacity-100 transition-opacity">{description}</p>
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
    <div ref={containerRef} className="relative w-full bg-black text-white selection:bg-white selection:text-black">
      {/* Background Video Animation */}
      <VideoScrollAnimation />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-between p-8 md:p-12 z-20 overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative flex justify-between items-start w-full"
        >
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-10"
          >
            <div className="logo-text">Website<br />Cage</div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <p className="tech-label uppercase tracking-widest text-[#FFF]">System Active</p>
              </div>
              <div className="tech-value border-l-2 border-white/20 pl-4 py-1">
                <p className="font-bold">Website Cage // v2.0.26</p>
                <p className="opacity-50">Onchain Community Infrastructure</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col items-end text-right max-w-[320px]"
          >
            <p className="tech-label mb-8 text-white/40 tracking-[0.3em]">////// CORE_MANIFESTO</p>
            <div className="manifesto-body text-white/90 leading-relaxed font-light italic text-lg">
              <p>"Building the foundational layer for decentralized culture. Where sovereign digital identity meets high-fidelity consumer experiences."</p>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="px-3 py-1 border border-white/10 text-[10px] uppercase tracking-tighter opacity-40">Auth: Verif</div>
              <div className="px-3 py-1 border border-white/10 text-[10px] uppercase tracking-tighter opacity-40">Node: 0x4f...a2</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative flex flex-col gap-10 items-start"
        >
          <div className="space-y-4">
            <div className="bottom-text group cursor-default">
              <p className="text-white/30 tracking-[0.4em] uppercase text-[9px] mb-2 font-black transition-all group-hover:tracking-[0.6em] group-hover:text-white duration-500">Initiating Sequence: 001</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-white/20" />
                <p className="text-lg font-light tracking-wide">Scroll to Deep Dive</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-500 bg-white/5 backdrop-blur-md">
                {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </div>
              <div className="flex flex-col items-start leading-none gap-1">
                <span className="text-[10px] uppercase tracking-widest opacity-40">Audio Output</span>
                <span className="text-xs font-bold">{isSoundOn ? 'Active_Stream' : 'Muted_Feed'}</span>
              </div>
            </button>
          </div>
        </motion.div>
      </section>


      {/* Spacer for Video Scroll */}
      <section className="h-[200vh] pointer-events-none" />

      {/* Marquee Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden z-10 bg-black/60 backdrop-blur-2xl border-y border-white/10">
        <motion.div style={{ x: marqueeX }} className="flex whitespace-nowrap gap-20">
          {[...Array(5)].map((_, i) => (
            <h2 key={i} className="font-sans font-black text-[18vh] uppercase tracking-tighter opacity-10">
              Onchain Revolution • Consumer Crypto • Digital Sovereignty •
            </h2>
          ))}
        </motion.div>
      </section>

      {/* Capabilities Section */}
      <section className="relative min-h-screen py-32 px-8 md:px-24 z-10 bg-gradient-to-b from-transparent via-black/80 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              className="tech-label mb-4"
            >
              01 // Capabilities
            </motion.p>
            <h2 className="font-sans font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none">
              Building the<br />Future Cage.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-sm">
            <CapabilityCard 
              icon={Globe}
              title="Onchain"
              description="Deploying robust smart contracts and decentralized infrastructure for the next billion users."
              index={0}
            />
            <CapabilityCard 
              icon={Zap}
              title="Velocity"
              description="Rapid prototyping and deployment of consumer-facing crypto applications."
              index={1}
            />
            <CapabilityCard 
              icon={Shield}
              title="Security"
              description="Audited systems ensuring the safety of digital assets and user sovereignty."
              index={2}
            />
            <CapabilityCard 
              icon={Cpu}
              title="Compute"
              description="High-performance edge computing integrated with blockchain finality."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative h-screen flex flex-col items-center justify-center p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="tech-label mb-8">Ready to enter the cage?</p>
          <h2 className="font-sans font-black text-7xl md:text-[14vw] uppercase tracking-tighter leading-none mb-12">
            Join Us.
          </h2>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "#f0f0f0" }}
            whileTap={{ scale: 0.98 }}
            className="px-16 py-8 bg-white text-black font-sans font-black uppercase tracking-[0.2em] text-xl transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.2)]"
          >
            Connect Wallet
          </motion.button>
        </motion.div>

        <footer className="absolute bottom-12 w-full px-12 flex flex-col md:flex-row justify-between items-center gap-6 tech-label border-t border-white/5 pt-12">
          <p className="opacity-40">© 2026 Website Cage, Inc.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors opacity-60 hover:opacity-100 uppercase tracking-widest text-[10px]">Twitter / X</a>
            <a href="#" className="hover:text-white transition-colors opacity-60 hover:opacity-100 uppercase tracking-widest text-[10px]">Discord</a>
            <a href="#" className="hover:text-white transition-colors opacity-60 hover:opacity-100 uppercase tracking-widest text-[10px]">Github</a>
          </div>
        </footer>
      </section>
      
      {/* Subtle Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}

