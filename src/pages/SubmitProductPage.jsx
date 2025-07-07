import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { db } from '../firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage as appwriteStorage, ID as AppwriteID } from '../appwriteClient.js';

const SubmitProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mainFile, setMainFile] = useState(null);
  const [demoUrl, setDemoUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mainFileUploadProgress, setMainFileUploadProgress] = useState(0);

  const categories = ["Portfolio", "WordPress Theme", "UI Kit", "Branding", "Web Template", "Icon Set", "Other"];
  const APPWRITE_ASSET_BUCKET_ID = '683a18bc0017007f6313'; // Replace with your actual bucket ID

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setError('');
    } else {
      setThumbnailFile(null);
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP).');
    }
  };

  const handleMainFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainFile(file);
      setError('');
    } else {
      setMainFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);
    setMainFileUploadProgress(0);

    if (!user || !user.uid) {
      setError('You must be logged in to submit a product.');
      return;
    }

    if (!title || !description || !category || !price || !thumbnailFile || !mainFile) {
      setError('Please fill in all required fields and upload both thumbnail and main product file.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price.');
      return;
    }

    if (!APPWRITE_ASSET_BUCKET_ID || APPWRITE_ASSET_BUCKET_ID === 'YOUR_APPWRITE_BUCKET_ID') {
      setError('Appwrite bucket ID is not configured.');
      return;
    }

    setLoading(true);

    let imageUrl = '';
    let mainFileUrl = '';
    let uploadedThumbnail = null;
    let uploadedMainFile = null;

    try {
      // Upload Thumbnail
      if (thumbnailFile) {
        const thumbnailFileId = AppwriteID.unique();
        const thumbnailPath = `product_thumbnails/${user.uid}/${thumbnailFileId}_${thumbnailFile.name.replace(/\s+/g, '_')}`;
        uploadedThumbnail = await appwriteStorage.createFile(
          APPWRITE_ASSET_BUCKET_ID,
          thumbnailFileId,
          thumbnailFile,
          undefined,
          (progress) => setUploadProgress(Math.round((progress.loaded / progress.total) * 100))
        );
        imageUrl = appwriteStorage.getFileView(APPWRITE_ASSET_BUCKET_ID, uploadedThumbnail.$id);
        if (!imageUrl) throw new Error('Failed to get thumbnail URL from Appwrite.');
      } else {
        throw new Error('Thumbnail image is required.');
      }

      // Upload Main File
      if (mainFile) {
        const mainFileId = AppwriteID.unique();
        const mainFilePath = `product_files/${user.uid}/${mainFileId}_${mainFile.name.replace(/\s+/g, '_')}`;
        uploadedMainFile = await appwriteStorage.createFile(
          APPWRITE_ASSET_BUCKET_ID,
          mainFileId,
          mainFile,
          undefined,
          (progress) => setMainFileUploadProgress(Math.round((progress.loaded / progress.total) * 100))
        );
        mainFileUrl = appwriteStorage.getFileDownload(APPWRITE_ASSET_BUCKET_ID, uploadedMainFile.$id);
        if (!mainFileUrl) throw new Error('Failed to get main file URL from Appwrite.');
      } else {
        throw new Error('Main product file is required.');
      }

      const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-5);

      const productData = {
        slug,
        title,
        description,
        category,
        price: parsedPrice,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        imageUrl,
        thumbnailFileName: thumbnailFile?.name || null,
        thumbnailFileId: uploadedThumbnail?.$id || null,
        mainFileUrl,
        mainFileName: mainFile?.name || null,
        mainFileId: uploadedMainFile?.$id || null,
        demoUrl: demoUrl || null,
        authorName: user?.displayName || user?.email || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        rating: 0,
        features: [],
        reviewsCount: 0,
      };

      const productsCollectionRef = collection(db, "products");
      const docRef = await addDoc(productsCollectionRef, productData);

      setSuccess(`Product "${title}" submitted successfully! ID: ${docRef.id}`);

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
      setTags('');
      setDemoUrl('');
      setThumbnailFile(null);
      setMainFile(null);
      setUploadProgress(0);
      setMainFileUploadProgress(0);

      if (document.getElementById('thumbnail')) document.getElementById('thumbnail').value = '';
      if (document.getElementById('mainFile')) document.getElementById('mainFile').value = '';
    } catch (err) {
      console.error("🔥 Submission error:", err);
      let errorMessage = "Failed to submit product. Please try again.";
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response && err.response.message) {
        errorMessage = `Appwrite Error: ${err.response.message} (Type: ${err.response.type}, Code: ${err.response.code})`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Submit Your Product</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Fill in the details below to upload and publish your product.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg dark:bg-green-900 dark:text-green-200">
                {success}
              </div>
            )}

            {/* Thumbnail Upload Progress */}
            {loading && thumbnailFile && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-200">
                  Uploading thumbnail: {uploadProgress}%
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Main File Upload Progress */}
            {loading && mainFile && mainFileUploadProgress > 0 && mainFileUploadProgress < 100 && (
              <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-200">
                  Uploading main file: {mainFileUploadProgress}%
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-2.5 rounded-full"
                    style={{ width: `${mainFileUploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Details Fields */}
              <div className="space-y-6">
                {/* Title */}
                <div className="group">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div className="group">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={loading}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  ></textarea>
                </div>

                {/* Category */}
                <div className="group">
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="group">
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Tags */}
                <div className="group">
                  <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={loading}
                    placeholder="e.g., ui kit, dashboard, react"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Demo URL */}
                <div className="group">
                  <label htmlFor="demoUrl" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    id="demoUrl"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    disabled={loading}
                    placeholder="https://your-product-demo.com" 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Files Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">File Uploads</h2>

                {/* Thumbnail Upload */}
                <div className="group">
                  <label htmlFor="thumbnail" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="thumbnail"
                    onChange={handleThumbnailChange}
                    accept="image/*"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                  {thumbnailFile && (
                    <div className="mt-2">
                      <img src={URL.createObjectURL(thumbnailFile)} alt="Preview" className="max-h-40 rounded-md shadow-sm" />
                      <p className="text-sm text-gray-500 mt-1">Selected: {thumbnailFile.name}</p>
                    </div>
                  )}
                </div>

                {/* Main File Upload */}
                <div className="group">
                  <label htmlFor="mainFile" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Main Product File (e.g., ZIP, PDF) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="mainFile"
                    onChange={handleMainFileChange}
                    accept=".zip,.rar,.7z,.pdf,.fig,.sketch,.xd,.psd,.ai"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                  {mainFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Selected File: <strong>{mainFile.name}</strong></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitProductPage;