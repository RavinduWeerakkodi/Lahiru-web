import { trackWhatsAppClick } from '@/lib/tracking';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Products = () => {
  const products = [
    {
      name: 'Murukku Making Machine',
      description: 'Automated murukku extruder with adjustable speed control and interchangeable molds for various shapes and sizes.',
      features: ['Stainless steel construction', 'Variable speed control', 'Easy to clean', 'Multiple mold options'],
      // image: 'https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/c339940438d5c4d3d665b4c7be8b8e3b.jpg' // Image removed
    },
    {
      name: 'Murukku Mixing Machine',
      description: 'Heavy-duty dough mixer designed specifically for murukku batter preparation with consistent mixing results.',
      features: ['High capacity', 'Uniform mixing', 'Durable motor', 'Easy operation'],
      // image: 'https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/f8573eccafdea3c8308fe9b2dc26434c.jpg' // Image removed
    },
    {
      name: 'Deep Fryer',
      description: 'Industrial-grade deep fryer with temperature control and efficient oil circulation for perfect frying every time.',
      features: ['Temperature control', 'Oil filtration system', 'Energy efficient', 'Safety features'],
      // image: 'https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/53abeb4ac07ecd9e0f8db6f86f7bc894.jpg' // Image removed
    },
    {
      name: 'Strainer & Molds',
      description: 'Premium quality strainers and custom molds for creating various murukku shapes and designs.',
      features: ['Food-grade materials', 'Custom designs', 'Long-lasting', 'Easy maintenance'],
      // image: 'https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/2d2e237c160e26a84f3deb0c73f29211.jpg' // Image removed
    },
    {
      name: 'Dodol & Musket Making Machine',
      description: 'Specialized equipment for producing traditional dodol and musket with consistent quality and texture.',
      features: ['Automated cooking', 'Precise temperature', 'Consistent output', 'Stainless steel'],
      // image: 'https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/c339940438d5c4d3d665b4c7be8b8e3b.jpg' // Image removed
    },
    {
      name: 'Steamer Machine',
      description: 'High-capacity steaming equipment for various food processing applications with efficient heat distribution.',
      features: ['Large capacity', 'Even steaming', 'Energy efficient', 'Safety controls'],
      // image: 'https://horizons-cdn.hostinger.com/f3112c64-bb19-405f-807f-d9840f1c2c2c/f8573eccafdea3c8308fe9b2dc26434c.jpg' // Image removed
    }
  ];

  const handleInquiry = (productName) => {
    const phoneNumber = '94772227556';
    const message = `Hello, I am interested in the ${productName}. Could you please provide pricing information?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    trackWhatsAppClick({ sourcePage: 'products_section', serviceName: productName });
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            Our <span className="text-[#8B0000]">Products & Services</span>
          </h2>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive range of food processing machinery designed for efficiency, durability, and superior performance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Product image removed as per user request */}
              {/* <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div> */}

              <div className="p-6">
                <h3 className="font-poppins font-bold text-2xl text-gray-900 mb-3">
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-[#8B0000] rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleInquiry(product.name)}
                  className="w-full bg-[#8B0000] hover:bg-[#660000] text-white"
                >
                  Request Quote
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;