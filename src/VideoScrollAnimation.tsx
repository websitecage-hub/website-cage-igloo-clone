import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'motion/react';
import { Spinner } from './components/ui/spinner';

const DESKTOP_FRAME_COUNT = 182;
const MOBILE_FRAME_COUNT = 172;
const DESKTOP_PREFIX = '/pc%20frame/';
const MOBILE_PREFIX = '/mobile%20frame/';
const FRAME_EXT = '.jpg';

function getFrameSrc(index: number, isMobile: boolean) {
  const padded = String(index + 1).padStart(4, '0');
  const prefix = isMobile ? MOBILE_PREFIX : DESKTOP_PREFIX;
  return `${prefix}${padded}${FRAME_EXT}`;
}

export const VideoScrollAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Get scroll progress
  const { scrollYProgress } = useScroll();
  
  // Create a smoothed spring value for the scroll progress to eliminate jerky movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  // Current frame count based on device
  const currentTotalFrames = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;

  // Transform smoothed progress to frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, currentTotalFrames - 1]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    setLoadProgress(0);
    setImages([]);

    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;
      const totalToLoad = isMobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;

      for (let i = 0; i < totalToLoad; i++) {
        const img = new Image();
        img.src = getFrameSrc(i, isMobile);
        img.onload = () => {
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / totalToLoad) * 100));
          if (loadedCount === totalToLoad) {
            setIsLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalToLoad) {
            setIsLoaded(true);
          }
        };
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };

    loadImages();
  }, [isMobile]);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const img = images[Math.floor(index)];
    if (!img) return;

    requestAnimationFrame(() => {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;
      
      context.drawImage(
        img, 
        0, 0, img.width, img.height,
        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
      );
    });
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    renderFrame(latest);
  });

  useEffect(() => {
    const setupCanvas = () => {
      if (canvasRef.current) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        renderFrame(frameIndex.get());
      }
    };

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    setupCanvas();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isLoaded, images]);

  return (
    <div className="fixed inset-0 w-full h-full -z-0 bg-black pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-[100]">
          <Spinner size="lg" className="mb-8 text-white/30" speed="normal" />
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] tracking-[0.6em] uppercase text-white/10 font-mono">Initializing_Core</span>
            <div className="w-12 h-px bg-white/5 overflow-hidden">
              <motion.div 
                className="h-full bg-white/20"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono tabular-nums text-white/20 tracking-widest">{loadProgress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};






