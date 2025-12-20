import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['077 222 7556', '075 222 7556'],
      action: 'Call us',
      href: 'tel:0772227556'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: ['lahiruenterprice@gmail.com'],
      action: 'Send email',
      href: 'mailto:lahiruenterprice@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Our Location',
      details: ['No: 465, Biyagama Road', 'Pethiyagoda, Sri Lanka'],
      action: 'Get directions',
      href: 'https://www.google.com/maps/place/Lahiru+Enterprises/@6.9553201,79.8988223,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae25993b78743a1:0x718b894ac776d8ec!8m2!3d6.9553201!4d79.9013972!16s%2Fg%2F11fm9sxy3x?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D'
    },
    {
      icon: Facebook,
      title: 'Facebook Page',
      details: ['/LahiruEnterprises'],
      action: 'Visit our page',
      href: 'https://www.facebook.com/LahiruEnterprises'
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
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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

       
export default Contact;
