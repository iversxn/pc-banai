import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-16 py-6 text-center text-sm text-gray-400 border-t border-gray-700">
      <p>
        © {new Date().getFullYear()} PC Banai — Made for Bangladesh 🇧🇩 | Powered by live local retailer data
      </p>
    </footer>
  );
}
