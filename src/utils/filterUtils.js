/**
 * Utility functions for filtering and sorting products/services
 */

/**
 * Sort options configuration
 */
export const SORT_OPTIONS = [
  { value: 'default', label: 'الافتراضي', sortFn: null },
  { value: 'newest', label: 'الأحدث', sortFn: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
  { value: 'popular', label: 'الأكثر شعبية', sortFn: (a, b) => (b.reviews_count || 0) - (a.reviews_count || 0) },
  { value: 'price-low', label: 'الأقل سعر', sortFn: (a, b) => (a.price || 0) - (b.price || 0) },
  { value: 'price-high', label: 'الأعلى سعر', sortFn: (a, b) => (b.price || 0) - (a.price || 0) },
  { value: 'rating', label: 'الأعلى تقييماً', sortFn: (a, b) => (b.reviews_avg_rating || 0) - (a.reviews_avg_rating || 0) }
];

/**
 * Filter configuration
 */
export const FILTER_CONFIG = {
  price: {
    min: 0,
    max: 10000,
    step: 100
  },
  rating: {
    min: 0,
    max: 5,
    step: 0.5
  },
  discount: {
    min: 0,
    max: 100,
    step: 5
  }
};

/**
 * Apply filters to products array
 * @param {Array} products - Array of products to filter
 * @param {Object} filters - Filter object
 * @param {number} filters.priceFrom - Minimum price
 * @param {number} filters.priceTo - Maximum price
 * @param {boolean} filters.showDiscountsOnly - Show only discounted items
 * @param {number} filters.minRating - Minimum rating
 * @param {Array} filters.categories - Selected categories
 * @returns {Array} - Filtered products array
 */
export const applyFilters = (products, filters = {}) => {
  if (!products || !Array.isArray(products)) return [];

  let filtered = [...products];

  // Filter by price range
  if (filters.priceFrom !== undefined && filters.priceFrom !== '') {
    filtered = filtered.filter(item => (item.price || 0) >= Number(filters.priceFrom));
  }

  if (filters.priceTo !== undefined && filters.priceTo !== '') {
    filtered = filtered.filter(item => (item.price || 0) <= Number(filters.priceTo));
  }

  // Filter by discounts only
  if (filters.showDiscountsOnly) {
    filtered = filtered.filter(item => item.discount && item.discount > 0);
  }

  // Filter by minimum rating
  if (filters.minRating !== undefined && filters.minRating > 0) {
    filtered = filtered.filter(item => (item.reviews_avg_rating || 0) >= filters.minRating);
  }

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(item => {
      if (!item.category_id) return false;
      return filters.categories.includes(item.category_id.toString());
    });
  }

  // Filter by search term
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const searchTerm = filters.searchTerm.toLowerCase().trim();
    filtered = filtered.filter(item => {
      const title = (item.title_ar || item.title || '').toLowerCase();
      const description = (item.about_ar || item.about || '').toLowerCase();
      return title.includes(searchTerm) || description.includes(searchTerm);
    });
  }

  return filtered;
};

/**
 * Apply sorting to products array
 * @param {Array} products - Array of products to sort
 * @param {string} sortBy - Sort option value
 * @returns {Array} - Sorted products array
 */
export const applySorting = (products, sortBy = 'default') => {
  if (!products || !Array.isArray(products)) return [];

  const sortOption = SORT_OPTIONS.find(option => option.value === sortBy);
  
  if (!sortOption || !sortOption.sortFn) {
    return [...products];
  }

  return [...products].sort(sortOption.sortFn);
};

/**
 * Combined filter and sort function for better performance
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter object
 * @param {string} sortBy - Sort option value
 * @returns {Array} - Filtered and sorted products array
 */
export const filterAndSort = (products, filters = {}, sortBy = 'default') => {
  const filtered = applyFilters(products, filters);
  return applySorting(filtered, sortBy);
};

/**
 * Get filter statistics for UI display
 * @param {Array} products - Array of products
 * @param {Object} filters - Current filters
 * @returns {Object} - Filter statistics
 */
export const getFilterStats = (products, filters = {}) => {
  if (!products || !Array.isArray(products)) {
    return {
      total: 0,
      filtered: 0,
      priceRange: { min: 0, max: 0 },
      averageRating: 0,
      discountCount: 0
    };
  }

  const total = products.length;
  const filtered = applyFilters(products, filters);
  const filteredCount = filtered.length;

  // Calculate price range
  const prices = products.map(p => p.price || 0).filter(p => p > 0);
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0
  };

  // Calculate average rating
  const ratings = products.map(p => p.reviews_avg_rating || 0).filter(r => r > 0);
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
    : 0;

  // Count items with discounts
  const discountCount = products.filter(p => p.discount && p.discount > 0).length;

  return {
    total,
    filtered: filteredCount,
    priceRange,
    averageRating: Math.round(averageRating * 10) / 10,
    discountCount
  };
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Search products with fuzzy matching
 * @param {Array} products - Array of products
 * @param {string} query - Search query
 * @returns {Array} - Search results
 */
export const fuzzySearch = (products, query) => {
  if (!query || !query.trim()) return products;

  const searchTerm = query.toLowerCase().trim();
  
  return products.filter(product => {
    const title = (product.title_ar || product.title || '').toLowerCase();
    const description = (product.about_ar || product.about || '').toLowerCase();
    const category = (product.category_name || '').toLowerCase();
    
    // Simple fuzzy matching - check if search term is contained in any field
    return title.includes(searchTerm) || 
           description.includes(searchTerm) || 
           category.includes(searchTerm);
  });
};

/**
 * Get unique categories from products
 * @param {Array} products - Array of products
 * @returns {Array} - Array of unique categories
 */
export const getUniqueCategories = (products) => {
  if (!products || !Array.isArray(products)) return [];

  const categoryMap = new Map();
  
  products.forEach(product => {
    if (product.category_id && product.category_name) {
      if (!categoryMap.has(product.category_id)) {
        categoryMap.set(product.category_id, {
          id: product.category_id,
          name: product.category_name
        });
      }
    }
  });

  return Array.from(categoryMap.values());
};

/**
 * Validate filter values
 * @param {Object} filters - Filter object to validate
 * @returns {Object} - Validated and sanitized filters
 */
export const validateFilters = (filters = {}) => {
  const validated = {};

  // Validate price range
  if (filters.priceFrom !== undefined && filters.priceFrom !== '') {
    const priceFrom = Number(filters.priceFrom);
    if (!isNaN(priceFrom) && priceFrom >= 0) {
      validated.priceFrom = priceFrom;
    }
  }

  if (filters.priceTo !== undefined && filters.priceTo !== '') {
    const priceTo = Number(filters.priceTo);
    if (!isNaN(priceTo) && priceTo >= 0) {
      validated.priceTo = priceTo;
    }
  }

  // Validate boolean filters
  validated.showDiscountsOnly = Boolean(filters.showDiscountsOnly);
  validated.minRating = Number(filters.minRating) || 0;

  // Validate categories
  if (filters.categories && Array.isArray(filters.categories)) {
    validated.categories = filters.categories.filter(cat => 
      cat && typeof cat === 'string'
    );
  }

  // Validate search term
  if (filters.searchTerm && typeof filters.searchTerm === 'string') {
    validated.searchTerm = filters.searchTerm.trim();
  }

  return validated;
};
