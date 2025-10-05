/**
 * Image utility functions for handling and optimizing image URLs
 */

// Base path for images
export const IMAGE_BASE_PATH = 'https://enqlygo.com/storage/app/public';

/**
 * Normalize image URL to ensure it has proper base path
 * @param {string} imageUrl - The image URL to normalize
 * @returns {string|null} - Normalized image URL or null if no URL provided
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Add base path for relative URLs
  return `${IMAGE_BASE_PATH}/${imageUrl}`;
};

/**
 * Get the best available image from product/service data
 * @param {Object} item - The product or service object
 * @param {string} fallbackImage - Fallback image URL
 * @returns {string} - The best available image URL
 */
export const getBestImage = (item, fallbackImage = 'https://placehold.co/400x350/f8f9fa/0171BD?text=No+Image') => {
  if (!item) return fallbackImage;

  // Try different image properties in order of preference
  const imageSources = [
    // Service images
    item.images?.[0]?.image,
    item.image,
    item.service_image,
    // Salon images
    item.salonImage,
    item.owner_photo,
    item.salon_owner_photo
  ];

  // Find the first valid image
  for (const source of imageSources) {
    if (source) {
      const normalizedUrl = normalizeImageUrl(source);
      if (normalizedUrl) {
        return normalizedUrl;
      }
    }
  }

  return fallbackImage;
};

/**
 * Generate optimized image URL with size parameters
 * @param {string} imageUrl - Original image URL
 * @param {Object} options - Optimization options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {number} options.quality - Image quality (1-100)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return null;

  const normalizedUrl = normalizeImageUrl(imageUrl);
  if (!normalizedUrl) return null;

  // If it's a placeholder or external image, return as is
  if (normalizedUrl.includes('placehold.co') || 
      normalizedUrl.includes('http://') || 
      normalizedUrl.includes('https://')) {
    return normalizedUrl;
  }

  // For internal images, you could add optimization parameters
  // This is a placeholder for future image optimization service
  const { width, height, quality = 80 } = options;
  
  if (width || height || quality !== 80) {
    const params = new URLSearchParams();
    if (width) params.append('w', width);
    if (height) params.append('h', height);
    if (quality !== 80) params.append('q', quality);
    
    return `${normalizedUrl}?${params.toString()}`;
  }

  return normalizedUrl;
};

/**
 * Preload images for better performance
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 * @returns {Promise<Array>} - Promise that resolves when all images are loaded
 */
export const preloadImages = (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls)) {
    return Promise.resolve([]);
  }

  const promises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  });

  return Promise.all(promises);
};

/**
 * Get image dimensions from URL
 * @param {string} imageUrl - Image URL
 * @returns {Promise<Object>} - Promise that resolves with {width, height}
 */
export const getImageDimensions = (imageUrl) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl) {
      reject(new Error('No image URL provided'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };
    img.src = imageUrl;
  });
};

/**
 * Create a responsive image URL with multiple sizes
 * @param {string} baseUrl - Base image URL
 * @param {Array<number>} sizes - Array of sizes to generate
 * @returns {Object} - Object with size-specific URLs
 */
export const createResponsiveImages = (baseUrl, sizes = [400, 600, 800, 1200]) => {
  if (!baseUrl) return {};

  const responsiveImages = {};
  
  sizes.forEach(size => {
    responsiveImages[`w${size}`] = getOptimizedImageUrl(baseUrl, { width: size });
  });

  return responsiveImages;
};

/**
 * Check if image URL is valid
 * @param {string} imageUrl - Image URL to validate
 * @returns {boolean} - True if URL is valid
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  
  // Check for valid image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  return imageExtensions.test(imageUrl) || 
         imageUrl.includes('placehold.co') ||
         imageUrl.startsWith('data:image/');
};

/**
 * Generate placeholder image URL with text
 * @param {Object} options - Placeholder options
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {string} options.text - Text to display
 * @param {string} options.bgColor - Background color
 * @param {string} options.textColor - Text color
 * @returns {string} - Placeholder image URL
 */
export const generatePlaceholder = (options = {}) => {
  const {
    width = 400,
    height = 350,
    text = 'No Image',
    bgColor = 'f8f9fa',
    textColor = '0171BD'
  } = options;

  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
};