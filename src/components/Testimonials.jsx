import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Pradeep Silva',
      business: 'Silva Snacks Industries',
      content: 'Outstanding quality machines! We purchased a murukku making machine 3 years ago and it still runs like new. The after-sales support is exceptional.',
      rating: 5,
      location: 'Colombo'
    },
    {
      name: 'Nimal Perera',
      business: 'Golden Murukku',
      content: 'Best investment for our business. The mixing machine and deep fryer have increased our production capacity by 300%. Highly recommend Lahiru Enterprises!',
      rating: 5,
      location: 'Kandy'
    },
    {
      name: 'Chaminda Fernando',
      business: 'Fernando Foods',
      content: 'Professional service from start to finish. They helped us choose the right equipment and provided excellent training. Our production efficiency has improved significantly.',
      rating: 5,
      location: 'Galle'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            What Our <span className="text-[#8B0000]">Clients Say</span>
          </h2>
          <div className="w-24 h-1 bg-[#8B0000] mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#8B0000]/10" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.business}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
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
          className="mt-16 text-center bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-2xl p-12"
        >
          <p className="text-white text-2xl font-semibold mb-4">
            Join 300+ Satisfied Customers
          </p>
          <p className="text-white/90 text-lg">
            Experience the Lahiru Enterprises difference today
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
