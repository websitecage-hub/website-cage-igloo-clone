"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"

interface CursorProps {
  size?: number
}

const TRAIL_COUNT = 6;

export const Cursor: React.FC<CursorProps> = ({ size = 45 }) => {
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number>(null);
  const previousPositions = useRef(Array(TRAIL_COUNT).fill({ x: -size, y: -size }));

  const mousePos = useRef({ x: -size, y: -size });
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const animate = useCallback(() => {
    previousPositions.current.forEach((prev, i) => {
      const trailNode = trailRefs.current[i];
      if (!trailNode) return;

      // Use the raw mouse ref for zero-latency tracking
      const targetX = i === 0 ? mousePos.current.x : previousPositions.current[i - 1].x;
      const targetY = i === 0 ? mousePos.current.y : previousPositions.current[i - 1].y;

      const speed = 0.3 - i * 0.045;
      const newX = prev.x + (targetX - prev.x) * speed;
      const newY = prev.y + (targetY - prev.y) * speed;

      previousPositions.current[i] = { x: newX, y: newY };
      const currentSize = size * (1 - i * 0.12);
      const hoverScale = isHovering ? 0.6 : 1;
      
      trailNode.style.transform = `translate3d(${newX - currentSize / 2}px, ${newY - currentSize / 2}px, 0) scale(${hoverScale})`;
      trailNode.style.opacity = `${(visible ? 1 : 0) * (1 - i * 0.15)}`;
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [size, visible, isHovering]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Update hovering state less frequently or only when it actually changes
      const target = e.target as HTMLElement;
      const isTextOrInteractive = 
        window.getComputedStyle(target).cursor === 'pointer' || 
        ['A', 'BUTTON', 'H1', 'H2', 'H3', 'P', 'SPAN'].includes(target.tagName) ||
        target.closest('a') || target.closest('button');

      setIsHovering(prev => prev !== !!isTextOrInteractive ? !!isTextOrInteractive : prev);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate, visible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] hidden lg:block overflow-hidden">
      {[...Array(TRAIL_COUNT)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          className="pointer-events-none absolute top-0 left-0 will-change-transform mix-blend-difference"
          style={{
            width: size * (1 - i * 0.12),
            height: size * (1 - i * 0.12),
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            backgroundImage: 'url("/snowball.png")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            zIndex: TRAIL_COUNT - i
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default Cursor;

