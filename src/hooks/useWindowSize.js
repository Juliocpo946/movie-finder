import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../utils';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < BREAKPOINTS.MD;
  const isTablet = windowSize.width >= BREAKPOINTS.MD && windowSize.width < BREAKPOINTS.LG;
  const isDesktop = windowSize.width >= BREAKPOINTS.LG;

  return {
    ...windowSize,
    isMobile,
    isTablet,
    isDesktop
  };
};