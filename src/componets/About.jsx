import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Wrench, TrendingUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, label: 'Years of Excellence', value: '25+' },
    { icon: Users, label: 'Happy Clients', value: '500+' },
    { icon: Wrench, label: 'Machines Delivered', value: '1000+' },
    { icon: TrendingUp, label: 'Customer Satisfaction', value: '98%' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            About <span className="text-[#8B0000]">Lahiru Enterprises</span>
          </h2>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/f8573eccafdea3c8308fe9b2dc26434c.jpg"
              alt="Lahiru Enterprises manufacturing facility"
              className="rounded-2xl shadow-xl w-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="font-poppins font-bold text-3xl text-gray-900">
              Leading Manufacturer of Food Processing Equipment
            </h3>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Lahiru Enterprises has been at the forefront of manufacturing high-quality food processing machinery for over two decades. Specializing in murukku making machines and related equipment, we've built a reputation for reliability, innovation, and exceptional customer service.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Our machines are designed with precision engineering, using premium stainless steel components to ensure durability and hygiene. From small-scale businesses to large industrial operations, we provide customized solutions that meet your specific production needs.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Based in Pethiyagoda, Sri Lanka, we serve clients across the country, providing not just machinery but complete support including installation, training, and after-sales service.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <stat.icon className="w-12 h-12 text-[#8B0000] mx-auto mb-4" />
              <p className="font-poppins font-bold text-3xl text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;