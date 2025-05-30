// folioxe/src/pages/ProductListingPage.jsx
import React from 'react';
import ProductCard from '../components/product/ProductCard.jsx'; // Adjust path as needed

// Mock data for products - later this will come from an API
const mockProducts = [
  {
    slug: 'sleek-portfolio-template',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Sleek+Portfolio',
    title: 'Sleek Portfolio Template',
    category: 'Portfolio',
    author: 'Studio UX',
    price: '$29.00',
  },
  {
    slug: 'minimalist-blog-theme',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Minimalist+Blog',
    title: 'Minimalist Blog Theme',
    category: 'WordPress Theme',
    author: 'ThemeCrafters',
    price: '$39.00',
  },
  {
    slug: 'e-commerce-ui-kit',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=E-commerce+Kit',
    title: 'E-commerce UI Kit',
    category: 'UI Kit',
    author: 'PixelPerfect',
    price: '$49.00',
  },
  {
    slug: 'corporate-brand-identity',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Corporate+Brand',
    title: 'Corporate Brand Identity',
    category: 'Branding',
    author: 'BrandMakers Inc.',
    price: '$99.00',
  },
  {
    slug: 'SaaS-landing-page',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=SaaS+Landing',
    title: 'SaaS Landing Page',
    category: 'Web Template',
    author: 'LaunchPro',
    price: '$19.00',
  },
  {
    slug: 'mobile-app-ui-concept',
    imageUrl: 'https://via.placeholder.com/400x300.png?text=Mobile+App+UI',
    title: 'Mobile App UI Concept',
    category: 'UI Kit',
    author: 'App Designers Co.',
    price: '$35.00',
  },
];

const ProductListingPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Explore Our Products
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Find the perfect assets for your next creative project.
        </p>
      </header>

      {mockProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No products found at the moment. Please check back later!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;