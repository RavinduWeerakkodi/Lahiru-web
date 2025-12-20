import React from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Products';
import Industries from '@/components/Industries';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

function App() {
  return (
    <>
      <Helmet>
        <title>Lahiru Enterprises - Your Specialist in Murukku Industry Machineries</title>
        <meta name="description" content="Lahiru Enterprises specializes in manufacturing high-quality murukku making machines, deep fryers, and food processing equipment in Sri Lanka. Contact us for industrial machinery solutions." />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero />
          <About />
          <Products />
          <Industries />
          <WhyChooseUs />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <WhatsAppButton />
        <Toaster />
      </div>
    </>
  );
}

export default App;