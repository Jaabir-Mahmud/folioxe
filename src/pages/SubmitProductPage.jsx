// folioxe/src/pages/SubmitProductPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
// We no longer need getProducts from mockData for submission itself
// import { getProducts } from '../data/mockData.js'; 
import { db } from '../firebase.js'; // 1. Import db (Firestore instance)
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // 2. Import Firestore functions

const SubmitProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null); // For file name, actual upload later
  const [mainFile, setMainFile] = useState(null);       // For file name, actual upload later
  const [demoUrl, setDemoUrl] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ["Portfolio", "WordPress Theme", "UI Kit", "Branding", "Web Template", "Icon Set", "Other"];

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleMainFileChange = (e) => {
    setMainFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to submit a product.');
      // Or redirect to login: navigate('/login');
      return;
    }

    if (!title || !description || !category || !price /* || !thumbnailFile || !mainFile */ ) {
      // For now, file uploads are optional in terms of blocking submission,
      // as we are not yet handling actual uploads, only their names.
      // You can make them strictly required by uncommenting.
      setError('Please fill in all required fields (Title, Description, Category, Price).');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        setError('Please enter a valid price.');
        return;
    }

    setLoading(true);

    // Create a slug (simple version)
    const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-5);

    // Placeholder for imageUrl. Actual image upload to Firebase Storage will provide this URL.
    const imageUrl = thumbnailFile ? `/images/mock-uploads/${thumbnailFile.name}` : '/images/submitted_product_placeholder.jpg'; // Mock path

    const productData = {
      slug,
      title,
      description,
      category,
      price: parsedPrice, // Store as number
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      imageUrl, // Placeholder, will be replaced by Firebase Storage URL
      thumbnailFileName: thumbnailFile?.name || null,
      mainFileName: mainFile?.name || null,
      demoUrl,
      authorName: user?.displayName || user?.email || 'Anonymous', // Author's display name
      authorId: user.uid, // ID of the user submitting
      createdAt: serverTimestamp(), // Firestore server-side timestamp
      updatedAt: serverTimestamp(),
      // Default values, these would be updated by other processes (e.g. reviews)
      rating: 0,
      reviewsCount: 0,
      features: [], // Example: Add a way to input features later
      // status: 'pending_review', // Example: for an approval process
    };

    console.log("Submitting Product Data to Firestore:", productData);

    try {
      // 3. Add a new document with a generated ID to the "products" collection
      const productsCollectionRef = collection(db, "products");
      const docRef = await addDoc(productsCollectionRef, productData);

      console.log("Document written with ID: ", docRef.id);
      setSuccess(`Product "${title}" submitted successfully! It will be reviewed shortly. (ID: ${docRef.id})`);
      setLoading(false);

      // Clear form fields
      setTitle(''); 
      setDescription(''); 
      setCategory(''); 
      setPrice(''); 
      setTags('');
      setThumbnailFile(null); 
      setMainFile(null); 
      setDemoUrl('');
      if (document.getElementById('thumbnail')) document.getElementById('thumbnail').value = '';
      if (document.getElementById('mainFile')) document.getElementById('mainFile').value = '';

      // Optional: redirect after a delay or to a "thank you" page
      // setTimeout(() => navigate('/products'), 2000); // Or to a seller dashboard
    } catch (firestoreError) {
      console.error("Error adding document to Firestore: ", firestoreError);
      setError("Could not submit product. Please try again. " + firestoreError.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Submit Your Product
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Share your amazing digital assets with the FolioXe community.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">

        {error && <div className="mb-6 p-3 bg-red-100 dark:bg-red-700 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-md text-sm">{error}</div>}
        {success && <div className="mb-6 p-3 bg-green-100 dark:bg-green-700 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-100 rounded-md text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Title <span className="text-red-500">*</span></label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" required disabled={loading} />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" required disabled={loading}></textarea>
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category <span className="text-red-500">*</span></label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" required disabled={loading}>
                <option value="" disabled>Select a category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (USD) <span className="text-red-500">*</span></label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0.01" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" placeholder="e.g., 19.99" required disabled={loading} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
            <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" placeholder="e.g., modern, minimal, react, portfolio" disabled={loading} />
          </div>

          {/* Demo URL */}
          <div>
            <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Demo URL (Optional)</label>
            <input type="url" id="demoUrl" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" placeholder="https://example.com/demo" disabled={loading} />
          </div>

          {/* File Inputs */}
          <div className="space-y-4">
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Thumbnail (e.g., JPG, PNG) <span className="text-red-500">*</span></label>
              <input type="file" id="thumbnail" onChange={handleThumbnailChange} accept="image/jpeg,image/png,image/webp,image/gif" className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-800 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-700 disabled:opacity-50" /*required*/ disabled={loading} />
              {thumbnailFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selected: {thumbnailFile.name}</p>}
            </div>
            <div>
              <label htmlFor="mainFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Product File (e.g., ZIP) <span className="text-red-500">*</span></label>
              <input type="file" id="mainFile" onChange={handleMainFileChange} accept=".zip,.rar,.7z,application/pdf" className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-800 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-700 disabled:opacity-50" /*required*/ disabled={loading} />
              {mainFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selected: {mainFile.name}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Product for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProductPage;