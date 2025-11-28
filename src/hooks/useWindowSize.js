import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../utils';

const useWindowSize = () => {
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
  const isSmall = windowSize.width < BREAKPOINTS.SM;
  const isMedium = windowSize.width >= BREAKPOINTS.SM && windowSize.width < BREAKPOINTS.LG;
  const isLarge = windowSize.width >= BREAKPOINTS.LG && windowSize.width < BREAKPOINTS.XL;
  const isExtraLarge = windowSize.width >= BREAKPOINTS.XL;

  return {
    ...windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge
  };
};

export { useWindowSize };