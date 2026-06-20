import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { GamerHeader } from './components/GamerHeader.jsx';
import { GamerFooter } from './components/GamerFooter.jsx';
import { CartPage } from './routes/CartPage.jsx';
import { CheckoutPage } from './routes/CheckoutPage.jsx';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen game-bg text-white font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-falkon-bg scanline relative">
          
          {/* Immersive technical grid background overlay */}
          <div className="absolute inset-0 pointer-events-none z-0" />

          {/* Core Content */}
          <div className="relative z-10 flex flex-col min-h-screen justify-between">
            <div>
              <GamerHeader />
              <Routes>
                <Route path="/" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
            </div>
            
            <GamerFooter />
          </div>

        </div>
      </Router>
    </CartProvider>
  );
}
