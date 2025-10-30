import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  aspectRatio?: 'square' | '16-9' | '4-3' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder,
  aspectRatio = 'auto',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-ratio-1-1';
      case '16-9':
        return 'aspect-ratio-16-9';
      case '4-3':
        return 'aspect-ratio-4-3';
      default:
        return '';
    }
  };

  const defaultPlaceholder = `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=loading%20placeholder%20gradient%20background&image_size=square`;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-gray-200',
        getAspectRatioClass(),
        className
      )}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 loading-skeleton" />
      )}

      {/* Placeholder image */}
      {!isInView && !hasError && (
        <img
          src={placeholder || defaultPlaceholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          loading="eager"
        />
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Erro ao carregar imagem</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;