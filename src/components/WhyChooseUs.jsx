import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wrench, Award, Clock, Headphones as HeadphonesIcon } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'All our machines are built with high-grade stainless steel and premium components ensuring long-lasting performance and hygiene compliance.'
    },
    {
      icon: Wrench,
      title: 'Expert Engineering',
      description: 'Over 15 years of experience in designing and manufacturing food processing equipment with precision and innovation.'
    },
    {
      icon: Award,
      title: 'Proven Reliability',
      description: 'Trusted by 300+ businesses across Sri Lanka with a 98% customer satisfaction rate and minimal downtime.'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Quick turnaround times with efficient manufacturing processes. Most orders delivered within 3-6 weeks.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Complete Support',
      description: 'Comprehensive after-sales service including installation, training, maintenance, and spare parts availability.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            Why Choose <span className="text-[#8B0000]">Lahiru Enterprises</span>
          </h2>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            We're committed to delivering excellence in every aspect of our business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.slice(0, 3).map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <reason.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
                {reason.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
          {reasons.slice(3, 5).map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <reason.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-4">
                {reason.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
