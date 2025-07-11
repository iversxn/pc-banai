import React from 'react';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
