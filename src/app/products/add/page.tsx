'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name || !image) {
      setError('Name and image are required');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add product');
      }
      
      router.push('/products');
      router.refresh();
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <Link 
          href="/products" 
          className="text-blue-500 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Product Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Preview:</p>
            <div className="relative h-48 w-full border rounded overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white ${
            loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
} 