
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react'; // Removed Send, Button, useToast, emailjs imports
import { useSettings } from '@/context/SettingsContext';

const Contact = () => {
  const { settings, loading: settingsLoading } = useSettings();

  if (settingsLoading) return null;

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [settings.contactPhone1, settings.contactPhone2].filter(Boolean),
      action: 'Call us',
      href: `tel:${settings.contactPhone1.replace(/\s+/g, '')}`
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: [settings.contactEmail],
      action: 'Send email',
      href: `mailto:${settings.contactEmail}`
    },
    {
      icon: MapPin,
      title: 'Our Location',
      details: [settings.contactAddress],
      action: 'Get directions',
      href: settings.contactMapLink
    },
    {
      icon: Facebook,
      title: 'Facebook Page',
      details: ['/LahiruEnterprises'],
      action: 'Visit our page',
      href: settings.social.facebook
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            Get In <span className="text-[#8B0000]">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-xl flex items-center justify-center mb-6">
                <info.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                {info.title}
              </h3>

              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 mb-1">
                  {detail}
                </p>
              ))}

              {info.href && (
                <a
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8B0000] font-semibold mt-4 hover:underline"
                >
                  {info.action} →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
