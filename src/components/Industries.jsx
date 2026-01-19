import React from 'react';
import { motion } from 'framer-motion';
import { Home, Factory, Store, Globe } from 'lucide-react';

const Industries = () => {
  const industries = [
    {
      title: 'Small Scale Home Industries',
      description: 'Empowering home-based entrepreneurs with compact, efficient, and easy-to-operate machinery.',
      icon: Home,
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Large Commercial Factories',
      description: 'High-capacity, automated production lines for established snack manufacturers.',
      icon: Factory,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Hotels & Catering Services',
      description: 'Reliable equipment designed for high-volume kitchen operations and catering needs.',
      icon: Store,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Export-Oriented Manufacturers',
      description: 'International standard machinery supporting businesses targeting global markets.',
      icon: Globe,
      color: 'from-green-500 to-emerald-600'
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl ${industry.color}`}></div>

              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 h-full">
                <div className="mb-6 flex justify-center">
                  <industry.icon className="w-16 h-16 text-white" />
                </div>

                <h3 className="font-poppins font-bold text-xl mb-4 text-center">
                  {industry.title}
                </h3>

                <p className="text-gray-300 leading-relaxed text-center">
                  {industry.description}
                </p>

                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                  <p className="text-sm text-gray-400">
                    Tailored Solutions
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
          className="mt-20 text-center bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">Serving All of Sri Lanka</h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Based in Pethiyagoda, we serve clients island-wide. Whether you are operating in <strong>Colombo, Kandy, Gampaha, Kurunegala, or Galle</strong>, our delivery and installation teams are equipped to reach you. As the leading provider of the <strong>Murukku machine in Sri Lanka</strong>, we are committed to driving the success of food manufacturers in every province, from the Northern peninsula to the Southern coast.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;