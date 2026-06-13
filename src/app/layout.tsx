import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Lohagarh Turf – Book Your Turf in Bharatpur',
  description: 'Book premium sports turf at Lohagarh, beside Keoladeo National Park, Bharatpur, Rajasthan. Football, Box Cricket, Frisbee and more.',
  keywords: ['turf booking', 'sports turf', 'bharatpur', 'lohagarh', 'football', 'cricket', 'keoladeo'],
  openGraph: {
    title: 'Lohagarh Turf',
    description: 'Book premium sports turf in Bharatpur',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-white">
              <Navigation />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </CartProvider>
        </AuthProvider>
        {/* Firebase reCAPTCHA container */}
        <div id="recaptcha-container" />
      </body>
    </html>
  );
}
