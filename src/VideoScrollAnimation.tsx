import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'motion/react';

const FRAME_COUNT = 240;
const DESKTOP_PREFIX = '/ezgif-6b331790844d04e2-jpg/ezgif-frame-';
const MOBILE_PREFIX = '/mobile-frames/ezgif-frame-';
const FRAME_EXT = '.jpg';

function getFrameSrc(index: number, isMobile: boolean) {
  const padded = String(index + 1).padStart(3, '0');
  const prefix = isMobile ? MOBILE_PREFIX : DESKTOP_PREFIX;
  return `${prefix}${padded}${FRAME_EXT}`;
}

export const VideoScrollAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Using useScroll to get progress of the entire page
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Determine if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Reset loaded state and images when isMobile changes
    setIsLoaded(false);
    setImages([]);

    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getFrameSrc(i, isMobile);
        img.onload = () => {
          loadedCount++;
          if (loadedCount === FRAME_COUNT) {
            setIsLoaded(true);
          }
        };
        // Handle error to prevent infinite loading if a frame is missing
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === FRAME_COUNT) {
            setIsLoaded(true);
          }
        };
        loadedImages.push(img);
      }
      setImages(loadedImages);
    };

    loadImages();
  }, [isMobile]);

  // Ensure initial frame is rendered when images are loaded
  useEffect(() => {
    if (isLoaded) {
      renderFrame(frameIndex.get());
    }
  }, [isLoaded]);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = images[Math.floor(index)];
    if (!img) return;

    // Clear and draw
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale image to fill/fit canvas
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    
    // For mobile, we might want to "cover" differently
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (canvas.width - img.width * ratio) / 2;
    const centerShiftY = (canvas.height - img.height * ratio) / 2;
    
    context.drawImage(
      img, 
      0, 0, img.width, img.height,
      centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
    );
  };

  // Update canvas on frame index change
  useMotionValueEvent(frameIndex, "change", (latest) => {
    renderFrame(latest);
  });

  // Handle initial render and resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
        canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
        renderFrame(frameIndex.get());
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, images]);

  return (
    <div className="fixed inset-0 w-full h-full -z-0 bg-black pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/20 font-sans tracking-widest uppercase text-[10px] px-8 text-center">
          Initializing {isMobile ? 'Mobile' : 'Desktop'} Sequence...
        </div>
      )}
    </div>
  );
};


