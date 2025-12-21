import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import emailjs from 'emailjs-com';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize EmailJS with your public key
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

      if (!serviceId || !templateId) {
        throw new Error('EmailJS configuration is missing');
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: 'lahiruenterprice@gmail.com',
          cc_email: 'ravinduweerakkodi.rw@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          phone_number: formData.phone,
          message: formData.message
        }
      );

      toast({
        title: 'Message Sent!',
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      toast({
        title: 'Error sending message',
        description: 'Please try calling us directly at 077 222 7556 or emailing lahiruenterprice@gmail.com',
      });
    } finally {
      setLoading(false);
    }
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
      href: 'https://www.google.com/maps/place/Lahiru+Enterprises/@6.9553201,79.8988223,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae25993b78743a1:0x718b894ac776d8ec!8m2!3d6.9553201!4d79.9013972!16s%2Fg%2F11fm9sx[...]'
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

        <div className="grid lg:grid-cols-1 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-6">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/20 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/20 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/20 outline-none transition-all"
                    placeholder="07X XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className={`w-full bg-[#8B0000] hover:bg-[#660000] text-white py-6 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
       
export default Contact;
