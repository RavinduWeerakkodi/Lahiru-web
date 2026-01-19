
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Plus, X, Loader2 } from 'lucide-react';
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, where } from "firebase/firestore";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [newReview, setNewReview] = useState({
    name: '',
    business: '', // promoting as 'Role / Business'
    location: '',
    rating: 5,
    content: ''
  });

  useEffect(() => {
    // Fetch only visible reviews or all? 
    // Usually for public site we might want only "approved" ones if we had an approval system.
    // For now, let's show all or maybe filtered if we add a 'status' field later.
    // Assuming 'visible' field exists or defaulting to showing all for now as per previous context.
    // Let's query all for now, or maybe only those marked meaningful if we had that.
    // Based on Admin Reviews logic, we didn't strictly filter there yet, but let's assume valid ones.

    // Changing to show all for now to see immediate result of submission
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Filter out hidden ones if we implemented a toggle in admin (we did 'visible' in admin)
      const visibleReviews = data.filter(r => r.visible !== false);
      setReviews(visibleReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleShowLess = () => {
    setVisibleCount(3);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        ...newReview,
        createdAt: serverTimestamp(),
        visible: true // Default to visible for now
      });
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
      setNewReview({ name: '', business: '', location: '', rating: 5, content: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: `Failed to submit review: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

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
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
            Don't just take our word for it - hear from our satisfied customers
          </p>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#8B0000] hover:bg-[#660000] text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Write a Review
          </Button>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No reviews yet. Be the first to write one!</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.slice(0, visibleCount).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }} // faster stagger
                className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative flex flex-col"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-[#8B0000]/10" />

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed italic flex-grow">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    {testimonial.business && <p className="text-sm text-gray-600">{testimonial.business}</p>}
                    {testimonial.location && <p className="text-xs text-gray-500">{testimonial.location}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Show More / Show Less Buttons */}
        {!loading && reviews.length > 3 && (
          <div className="flex justify-center mt-12 gap-4">
            {visibleCount < reviews.length && (
              <Button variant="outline" onClick={handleShowMore} className="border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white">
                Show More
              </Button>
            )}
            {visibleCount > 3 && (
              <Button variant="outline" onClick={handleShowLess} className="border-gray-500 text-gray-600 hover:bg-gray-100">
                Show Less
              </Button>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-2xl p-12"
        >
          <p className="text-white text-2xl font-semibold mb-4">
            Join {reviews.length > 50 ? reviews.length + '+' : 'our'} Satisfied Customers
          </p>
          <p className="text-white/90 text-lg">
            Experience the Lahiru Enterprises difference today
          </p>
        </motion.div>
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#8B0000] text-white">
                <h3 className="font-bold text-xl">Write a Review</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newReview.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business / Role</label>
                    <input
                      type="text"
                      name="business"
                      value={newReview.business}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] outline-none"
                      placeholder="CEO, MyCompany"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newReview.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] outline-none"
                    placeholder="Colombo, Sri Lanka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                  <textarea
                    name="content"
                    value={newReview.content}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000]/20 focus:border-[#8B0000] outline-none resize-none"
                    placeholder="Share your experience..."
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#8B0000] hover:bg-[#660000] text-white"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
