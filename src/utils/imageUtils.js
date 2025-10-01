/**
 * Image optimization utilities
 * أدوات تحسين الصور
 */

// Default placeholder image
export const DEFAULT_IMAGE = '/src/assets/images/الاسنان.png';

// Image URL builder with fallback
export const buildImageUrl = (path, baseUrl = 'https://enqlygo.com') => {
  if (!path || typeof path !== 'string') return DEFAULT_IMAGE;
  if (path.startsWith('http')) return path;
  if (path.startsWith('storage/')) return `${baseUrl}/${path}`;
  if (path.startsWith('/')) return `${baseUrl}${path}`;
  return `${baseUrl}/${path.replace(/^\/+/, '')}`;
};

// Image preloader component
export const ImagePreloader = ({ src, onLoad, onError }) => {
  const img = new Image();
  img.onload = onLoad;
  img.onerror = onError;
  img.src = src;
};

// Optimized image component with lazy loading
export const OptimizedImage = ({ 
  src, 
  alt, 
  fallback = DEFAULT_IMAGE, 
  className = '', 
  style = {},
  ...props 
}) => {
  const [imageSrc, setImageSrc] = React.useState(src || fallback);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setImageSrc(fallback);
      setIsLoading(false);
      setHasError(true);
    };
    img.src = src;
  }, [src, fallback]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      {...props}
    />
  );
};

// Image compression utility (client-side)
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Generate responsive image srcset
export const generateSrcSet = (baseUrl, widths = [320, 640, 1024, 1280]) => {
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
};











