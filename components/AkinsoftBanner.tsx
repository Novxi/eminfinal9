import React, { useRef, useEffect } from 'react';

export const AkinsoftBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear container to prevent duplicate scripts on re-renders
      containerRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://www.akinsoft.com.tr/banners/widget.js';
      script.async = true;
      script.className = 'akinsoft_reklam';
      script.id = '320X100_1';
      script.setAttribute('data-id', '320X100_1');
      script.setAttribute('data-type', 'kampanya');
      script.setAttribute('data-size', '320X100');
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-[28px] border border-primary/20 overflow-hidden min-h-[200px] shadow-lg relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
    </div>
  );
};
