import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-8">Welcome to Our E-Commerce Store</h1>
      <div className="flex justify-center gap-4">
        <Link 
          href="/products" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
        >
          View Products
        </Link>
      </div>
    </div>
  );
}
