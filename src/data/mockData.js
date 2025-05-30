// folioxe/src/data/mockData.js
const defaultProducts = [
  {
    slug: 'sleek-portfolio-template-default',
    imageUrl: '/src/assets/image/default1.jpg', // UPDATED
    title: 'Sleek Portfolio Template (Default)',
    category: 'Portfolio',
    author: 'Studio UX',
    price: '29.00',
    description: 'A stunning and sleek portfolio template designed for creatives. Fully responsive and easy to customize.',
    features: ['Fully Responsive', 'Easy to Customize', 'Retina Ready'],
    rating: 4.5,
    reviewsCount: 12,
    submittedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    submittedBy: 'defaultUser',
    demoUrl: '',
    thumbnailFileName: 'sleek_thumb.jpg', // This field becomes less relevant if imageUrl is predefined
    mainFileName: 'sleek_portfolio.zip',
    tags: ['portfolio', 'creative', 'modern', 'minimal'],
  },
  {
    slug: 'minimalist-blog-theme-default',
    imageUrl: 'src/assets/image/default2.jpg', // UPDATED
    title: 'Minimalist Blog Theme (Default)',
    category: 'WordPress Theme',
    author: 'ThemeCrafters',
    price: '39.00',
    description: 'A minimalist WordPress theme perfect for bloggers and writers. Focus on your content.',
    features: ['SEO Optimized', 'Fast Loading', 'Gutenberg Ready'],
    rating: 4.8,
    reviewsCount: 35,
    submittedAt: new Date('2024-01-20T11:00:00Z').toISOString(),
    submittedBy: 'defaultUser',
    demoUrl: 'https://example.com/minimalist-demo',
    thumbnailFileName: 'minimal_thumb.jpg',
    mainFileName: 'minimal_theme.zip',
    tags: ['blog', 'wordpress', 'minimal', 'clean'],
  },
  {
    slug: 'modern-ui-kit-default',
    imageUrl: '/src/assets/image/default3.jpg', // UPDATED
    title: 'Modern UI Kit (Default)',
    category: 'UI Kit',
    author: 'PixelPerfect',
    price: '49.00',
    description: 'A comprehensive UI kit with modern components for web and mobile apps.',
    features: ['100+ Components', 'Dark & Light Mode', 'Vector Based'],
    rating: 4.2,
    reviewsCount: 25,
    submittedAt: new Date('2024-02-01T14:30:00Z').toISOString(),
    submittedBy: 'defaultUser',
    demoUrl: '',
    thumbnailFileName: 'uikit_thumb.png',
    mainFileName: 'modern_uikit.fig',
    tags: ['ui', 'kit', 'design', 'modern', 'web', 'mobile'],
  },
  {
    slug: 'minimalist-blog-theme-default',
    imageUrl: 'src/assets/image/default4.jpg', // UPDATED
    title: 'Minimalist Blog Theme (Default)',
    category: 'WordPress Theme',
    author: 'ThemeCrafters',
    price: '39.00',
    description: 'A minimalist WordPress theme perfect for bloggers and writers. Focus on your content.',
    features: ['SEO Optimized', 'Fast Loading', 'Gutenberg Ready'],
    rating: 4.8,
    reviewsCount: 35,
    submittedAt: new Date('2024-01-20T11:00:00Z').toISOString(),
    submittedBy: 'defaultUser',
    demoUrl: 'https://example.com/minimalist-demo',
    thumbnailFileName: 'minimal_thumb.jpg',
    mainFileName: 'minimal_theme.zip',
    tags: ['blog', 'wordpress', 'minimal', 'clean'],
  },
];

const LOCAL_STORAGE_KEY = 'folioxeProducts';

export const getProducts = () => {
  // ... (console logs can remain for debugging) ...
  // The rest of this function remains the same
  console.log(`[mockData.js - getProducts] Attempting to get products from localStorage. Key: ${LOCAL_STORAGE_KEY}`);
  try {
    const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      // console.log("[mockData.js - getProducts] Found products in localStorage:", parsedProducts);
      return parsedProducts;
    } else {
      console.log("[mockData.js - getProducts] No products in localStorage. Seeding with defaults:", defaultProducts);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
  } catch (error) {
    console.error("[mockData.js - getProducts] Error accessing localStorage for products:", error);
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProducts));
    } catch (e) {
        console.error("[mockData.js - getProducts] Failed to set defaults in localStorage after error:", e);
    }
    return defaultProducts;
  }
};

export const mockProducts = getProducts();