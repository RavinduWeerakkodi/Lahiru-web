import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wrench, Award, Clock, Headphones as HeadphonesIcon } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Award,
      title: 'Proven Expertise',
      description: 'Over 15 years of specialized experience in the local engineering sector, delivering high-performance machinery.'
    },
    {
      icon: Wrench,
      title: 'Custom Engineering',
      description: 'Tailor-made solutions to fit your specific factory layout and production capacity requirements.'
    },
    {
      icon: Shield,
      title: 'Superior Quality',
      description: 'Heavy-duty construction using high-grade materials for long-term reliability and food safety compliance.'
    },
    {
      icon: HeadphonesIcon,
      title: 'After-Sales Assurance',
      description: 'Reliable maintenance, spare parts availability, and dedicated technical support for all our machines.'
    },
    {
      icon: Clock,
      title: 'Local Manufacturing',
      description: 'Proudly made in Sri Lanka, ensuring quick service, easy communication, and deep understanding of local needs.'
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
