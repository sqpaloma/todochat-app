import { useState, useEffect } from 'react';

// SSR-safe responsive hook para Next.js
export function useResponsiveSSR() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    isMounted: false, // Flag para evitar hydration mismatch
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMounted: true,
      });
    };

    // Definir tamanho inicial apenas no cliente
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Retornar breakpoints apenas após montagem no cliente
  return {
    width: windowSize.width,
    height: windowSize.height,
    isMounted: windowSize.isMounted,
    // Valores safe para SSR (assumir desktop por padrão)
    isMobile: windowSize.isMounted ? windowSize.width < 768 : false,
    isTablet: windowSize.isMounted ? windowSize.width >= 768 && windowSize.width < 1024 : false,
    isDesktop: windowSize.isMounted ? windowSize.width >= 1024 : true,
    isLarge: windowSize.isMounted ? windowSize.width >= 1280 : true,
  };
}