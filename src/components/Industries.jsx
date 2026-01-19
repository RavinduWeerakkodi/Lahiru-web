import React from 'react';
import { motion } from 'framer-motion';

const Industries = () => {
  const industries = [
    {
      title: 'Murukku Production',
      description: 'Complete solutions for traditional and modern murukku manufacturing facilities',
      icon: <img src="/murukku-icon.png" alt="Murukku" className="w-32 h-32 object-cover mx-auto rounded-lg shadow-lg" />,
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Dodol Manufacturing',
      description: 'Specialized equipment for traditional Sri Lankan dodol production',
      icon: <img src="/dodol-icon.png" alt="Dodol" className="w-32 h-32 object-cover mx-auto rounded-lg shadow-lg" />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Musket Production',
      description: 'Efficient machinery for large-scale musket manufacturing operations',
      icon: <img src="/musket-icon.jpg" alt="Musket" className="w-32 h-32 object-cover mx-auto rounded-lg shadow-lg" />,
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <section id="industries" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-4">
            Industries We <span className="text-[#8B0000]">Serve</span>
          </h2>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Providing specialized machinery solutions across multiple food processing sectors
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-[#8B0000] to-[#660000]"></div>

              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                <div className="text-6xl mb-6">{industry.icon}</div>

                <h3 className="font-poppins font-bold text-2xl mb-4">
                  {industry.title}
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  {industry.description}
                </p>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-gray-400">
                    Custom solutions available
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-300 mb-4">
            Need machinery for a different industry?
          </p>
          <p className="text-gray-400">
            We offer custom manufacturing solutions. Contact us to discuss your requirements.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;