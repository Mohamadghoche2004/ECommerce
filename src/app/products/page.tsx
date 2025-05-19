'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'error' | 'loaded'>>({});
  
  // Default image path
  const defaultImagePath = '/placeholder-image.svg';
  
  // Check if images exist
  useEffect(() => {
    if (products.length > 0) {
      products.forEach(product => {
        if (!imageStatus[product._id]) {
          setImageStatus(prev => ({ ...prev, [product._id]: 'loading' }));
          
          fetch(product.imageUrl, { method: 'HEAD' })
            .then(response => {
              if (!response.ok) throw new Error('Image not found');
              setImageStatus(prev => ({ ...prev, [product._id]: 'loaded' }));
            })
            .catch(() => {
              setImageStatus(prev => ({ ...prev, [product._id]: 'error' }));
            });
        }
      });
    }
  }, [products, imageStatus]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link 
          href="/products/add" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 w-full bg-gray-100">
                {imageStatus[product._id] !== 'loading' && (
                  <Image
                    src={imageStatus[product._id] === 'error' ? defaultImagePath : product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={imageStatus[product._id] === 'error'} // Skip optimization for local images
                  />
                )}
                {imageStatus[product._id] === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-500 text-sm">
                  Added on {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 