
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

function Home() {
    return (
        <>
            <Helmet>
                <title>Murukku Machine Sri Lanka | Industrial Food Machinery Manufacturers</title>
                <meta name="description" content="Leading manufacturer of Murukku making machines and food processing machinery in Sri Lanka. 15+ years of trust, custom solutions, and island-wide support." />
                <meta name="keywords" content="murukku machine sri lanka, murukku making machine, food processing machinery sri lanka, snack processing machines, industrial murukku machine, automatic murukku machine, murukku machine price sri lanka, murukku cutter machine, electric murukku machine, mixture making machine, murukku bites machine, cassava bites machine, slicing machines" />
                <meta name="author" content="Lahiru Enterprises" />
                <meta property="og:title" content="Murukku Machine Sri Lanka | Industrial Food Machinery Manufacturers" />
                <meta property="og:description" content="Leading manufacturer of Murukku making machines and food processing machinery in Sri Lanka. 15+ years of trust, custom solutions, and island-wide support." />
                <meta property="og:type" content="business.business" />
                <meta property="og:url" content="https://lahiruenterprises.netlify.app/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Murukku Machine Sri Lanka | Industrial Food Machinery Manufacturers" />
                <meta name="twitter:description" content="Leading manufacturer of Murukku making machines and food processing machinery in Sri Lanka. 15+ years of trust, custom solutions, and island-wide support." />
                <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "Lahiru Enterprises",
                        "image": "https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/machine-oRecj.jpeg",
                        "description": "Lahiru Enterprises specializes in manufacturing high-quality murukku making machines and food processing equipment",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "No: 465, Biyagama Road",
                            "addressLocality": "Pethiyagoda",
                            "addressCountry": "LK"
                        },
                        "telephone": "0772227556",
                        "email": "lahiruenterprice@gmail.com",
                        "url": "https://lahiruenterprises.netlify.app/",
                        "sameAs": ["https://www.facebook.com/LahiruEnterprises"],
                        "priceRange": "$$$"
                    })}
                </script>
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

export default Home;
