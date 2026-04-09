import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Wrench, TrendingUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, label: 'Years of Excellence', value: '15+' },
    { icon: Users, label: 'Happy Clients', value: '300+' },
    { icon: Wrench, label: 'Machines Delivered', value: '500+' },
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
              src="/about-machine"
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
              Lahiru Enterprises stands as a pioneer in the Sri Lankan engineering landscape, specializing in high-performance food processing machinery. With over 15 years of dedicated experience, we have mastered the art of manufacturing robust <strong>Murukku making machines</strong> that cater to the evolving needs of the local food industry. Located in Pethiyagoda, our facility combines traditional engineering values with modern technology to produce equipment that stands the test of time. We believe in empowering local entrepreneurs by providing machinery that increases productivity while maintaining the authentic taste of traditional snacks. Our commitment goes beyond manufacturing; we build lasting partnerships with our clients, helping them scale their businesses from home-based operations to industrial powerhouses.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              We offer a diverse range of <strong>snack processing machines</strong> designed to meet various production requirements. Our flagship <strong>industrial Murukku machine</strong> series features semi-automatic and fully automatic models, capable of producing different shapes and sizes of Murukku, Mixture, and Sev. Beyond Murukku, our expertise extends to custom <strong>food processing machinery in Sri Lanka</strong>, including oil fryers, dough mixers, and packaging support equipment. Every machine is built with food-grade stainless steel to ensure hygiene, durability, and compliance with safety standards, making them the ideal choice for quality-conscious manufacturers.
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
