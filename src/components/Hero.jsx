import React from 'react';
import { trackWhatsAppClick } from '@/lib/tracking';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
const Hero = () => {
  const { settings, getWhatsAppLink } = useSettings();

  const handleCall = () => {
    window.location.href = `tel:${settings.contactPhone1.replace(/\s+/g, '')}`;
  };
  const handleWhatsApp = () => {
    trackWhatsAppClick({ sourcePage: 'hero_section', serviceName: 'Hero CTA' });
    window.open(getWhatsAppLink("Hello! I'm interested in getting a quote."), '_blank');
  };
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000] via-[#660000] to-[#2d0000]"></div>

    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }} className="text-white">
          <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Lahiru Enterprises
          </motion.h1>

          <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-xl md:text-2xl mb-4 text-white/90">
            Your Specialist in Murukku Industry Machineries
          </motion.p>

          <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} className="text-lg mb-8 text-white/80">
            High-quality, durable machinery for the food processing industry. Trusted by businesses across Sri Lanka.
          </motion.p>

          <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.8
          }} className="flex flex-wrap gap-4">
            <Button onClick={handleCall} size="lg" className="bg-white text-[#8B0000] hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>

            <Button onClick={handleWhatsApp} size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-8 py-6 text-lg">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Us
            </Button>
          </motion.div>

          <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 1
          }} className="mt-8 flex items-center gap-6 text-white/80">
            <div>
              <p className="text-sm">Call us:</p>
              <p className="font-semibold text-white">{settings.contactPhone1}</p>
            </div>
            <div className="h-8 w-px bg-white/30"></div>
            <div>
              <p className="text-sm">Available:</p>
              <p className="font-semibold text-white">Mon - Sat, 8AM - 6PM</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/machine-oRecj.jpeg" alt="Lahiru Enterprises Murukku Making Machine" className="w-full h-auto" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          <motion.div animate={{
            y: [0, -10, 0]
          }} transition={{
            repeat: Infinity,
            duration: 2
          }} className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
            <p className="text-4xl font-bold text-[#8B0000]">15+</p>
            <p className="text-gray-600 font-medium">Years Experience</p>
          </motion.div>
        </motion.div>
      </div>
    </div>

    <motion.button onClick={scrollToContact} animate={{
      y: [0, 10, 0]
    }} transition={{
      repeat: Infinity,
      duration: 1.5
    }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
      <ChevronDown className="w-8 h-8" />
    </motion.button>
  </section>;
};
export default Hero;