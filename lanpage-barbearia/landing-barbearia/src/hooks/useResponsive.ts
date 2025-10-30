import { useState, useEffect } from 'react';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
  height: number;
}

export const useResponsive = (breakpoints: BreakpointConfig = defaultBreakpoints): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isWide: false,
        width: 1024,
        height: 768,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
      isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
      isWide: width >= breakpoints.wide,
      width,
      height,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
        isWide: width >= breakpoints.wide,
        width,
        height,
      });
    };

    // Debounce resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    
    // Initial call
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoints]);

  return state;
};

// Hook for specific breakpoint checks
export const useBreakpoint = (breakpoint: keyof BreakpointConfig): boolean => {
  const { isMobile, isTablet, isDesktop, isWide } = useResponsive();

  switch (breakpoint) {
    case 'mobile':
      return isMobile;
    case 'tablet':
      return isTablet;
    case 'desktop':
      return isDesktop;
    case 'wide':
      return isWide;
    default:
      return false;
  }
};

// Hook for orientation detection
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'landscape';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
};

// Hook for touch device detection
export const useTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
};

export default useResponsive;