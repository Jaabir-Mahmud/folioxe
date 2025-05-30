// folioxe/src/pages/ProductDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

// We'll use the same mock data structure for now.
// In a real app, you'd fetch this by slug/ID from an API.
// For now, let's redefine it here or ideally import from a shared mock data file.
const mockProducts = [
  {
    slug: 'sleek-portfolio-template',
    imageUrl: 'https://via.placeholder.com/800x600.png?text=Sleek+Portfolio+Large',
    title: 'Sleek Portfolio Template',
    category: 'Portfolio',
    author: 'Studio UX',
    price: '$29.00',
    description: 'A stunning and modern portfolio template designed for creatives who want to showcase their work with elegance and simplicity. Fully responsive and easy to customize with well-organized layers and components.',
    features: ['Fully Responsive', 'Easy to Customize', 'High Resolution', 'Well-organized Layers'],
    rating: 4.5,
    reviews: 12,
  },
  {
    slug: 'minimalist-blog-theme',
    imageUrl: 'https://via.placeholder.com/800x600.png?text=Minimalist+Blog+Large',
    title: 'Minimalist Blog Theme',
    category: 'WordPress Theme',
    author: 'ThemeCrafters',
    price: '$39.00',
    description: 'A clean, minimalist WordPress theme perfect for bloggers and writers who want their content to shine. Optimized for readability and performance, with a focus on great typography and white space.',
    features: ['SEO Optimized', 'Fast Loading', 'Gutenberg Ready', 'Multiple Layouts'],
    rating: 5,
    reviews: 8,
  },
  {
    slug: 'e-commerce-ui-kit',
    imageUrl: 'https://via.placeholder.com/800x600.png?text=E-commerce+Kit+Large',
    title: 'E-commerce UI Kit',
    category: 'UI Kit',
    author: 'PixelPerfect',
    price: '$49.00',
    description: 'A comprehensive UI kit for e-commerce applications, featuring a wide range of components and screens. Perfect for jumpstarting your online store design with a professional and modern look.',
    features: ['100+ Components', 'Vector Based', 'Style Guide Included', 'Dark & Light Mode'],
    rating: 4,
    reviews: 25,
  },
  {
    slug: 'corporate-brand-identity',
    imageUrl: 'https://via.placeholder.com/800x600.png?text=Corporate+Brand+Large',
    title: 'Corporate Brand Identity',
    category: 'Branding',
    author: 'BrandMakers Inc.',
    price: '$99.00',
    description: 'A complete branding package for corporate businesses. Includes logo variations, color palettes, typography guidelines, and mockups for various marketing materials. Establish a strong brand presence instantly.',
    features: ['Logo Files (AI, EPS, SVG)', 'Brand Guidelines PDF', 'Stationery Mockups', 'Social Media Kit'],
    rating: 4.8,
    reviews: 15,
  },
  {
    slug: 'SaaS-landing-page',
    imageUrl: 'https://via.placeholder.com/800x600.png?text=SaaS+Landing+Large',
    title: 'SaaS Landing Page',
    category: 'Web Template',
    author: 'LaunchPro',
    price: '$19.00',
    description: 'A high-converting landing page template for SaaS products. Modern design, focused on showcasing features and driving sign-ups. Easy to integrate with your backend or marketing tools.',
    features: ['Responsive Design', 'Conversion Optimized', 'Clean Code', 'Easy Integration'],
    rating: 4.2,
    reviews: 9,
  },
  {
    slug: 'mobile-app-ui-concept',
    imageUrl: 'https://via.placeholder.com/800x600.png?text=Mobile+App+UI+Large',
    title: 'Mobile App UI Concept',
    category: 'UI Kit',
    author: 'App Designers Co.',
    price: '$35.00',
    description: 'A creative and modern UI concept for mobile applications. Includes multiple screens for common app flows. Perfect for inspiration or as a starting point for your next mobile project.',
    features: ['Figma & Sketch Files', 'Pixel Perfect', 'User-friendly Flows', 'Multiple Screens'],
    rating: 4.6,
    reviews: 11,
  },
];


const ProductDetailPage = () => {
  const { productSlug } = useParams(); // Get the slug from the URL
  const product = mockProducts.find(p => p.slug === productSlug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Product Not Found!</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link to="/products" className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Back to Products
        </Link>
      </div>
    );
  }

  const { imageUrl, title, category, author, price, description, features, rating, reviews } = product;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:space-x-8">
        {/* Image Gallery Section (Simplified for now) */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600.png?text=Image+Error'; }}
          />
          {/* TODO: Add thumbnail gallery for multiple images later */}
        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2">
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            {category}
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            By <span className="font-semibold text-gray-700 dark:text-gray-300">{author}</span>
          </p>

          {/* Rating Placeholder */}
          <div className="flex items-center mb-4">
            {[...Array(Math.floor(rating || 0))].map((_, i) => (
              <svg key={`star-filled-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .09l2.939 5.865 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
            ))}
            {[...Array(5 - Math.floor(rating || 0))].map((_, i) => (
              <svg key={`star-empty-${i}`} className="w-5 h-5 text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .09l2.939 5.865 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
            ))}
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({reviews} reviews)</span>
          </div>

          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            {price}
          </p>

          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              {description}
            </p>
          </div>

          {features && features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5">
              Add to Cart
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* TODO: Reviews Section, Related Products Section */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
        {/* Placeholder for reviews */}
        <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;