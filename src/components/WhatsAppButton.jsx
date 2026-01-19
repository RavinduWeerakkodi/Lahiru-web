import React from 'react';
import { trackWhatsAppClick } from '@/lib/tracking';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '@/context/SettingsContext';

const WhatsAppButton = () => {
  const { getWhatsAppLink } = useSettings();

  const handleWhatsApp = () => {
    trackWhatsAppClick({ sourcePage: 'floating_button', serviceName: 'General Inquiry' });
    window.open(getWhatsAppLink("Hello, I have a question about your services."), '_blank');
  };

  return (
    <motion.button
      onClick={handleWhatsApp}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full p-4 shadow-2xl transition-colors"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
      ></motion.span>
    </motion.button>
  );
};

export default WhatsAppButton;