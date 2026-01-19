
import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { FaTrash, FaStar, FaPlus, FaTimes, FaQuoteLeft } from 'react-icons/fa';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Review Form State
    const [newReview, setNewReview] = useState({
        name: "",
        rating: 5,
        comment: "",
        role: "Customer" // e.g. "CEO of X" or just "uu"
    });

    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setReviews(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteDoc(doc(db, "reviews", id));
            } catch (error) {
                console.error("Error deleting review:", error);
            }
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "reviews"), {
                ...newReview,
                createdAt: serverTimestamp(),
                isVisible: true
            });
            setIsModalOpen(false);
            setNewReview({ name: "", rating: 5, comment: "", role: "Customer" });
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const toggleVisibility = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, "reviews", id), {
                isVisible: !currentStatus
            });
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text">Reviews Management</h1>
                    <p className="text-brand-muted mt-1">Manage customer testimonials and feedback.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-gold text-brand-bg font-bold px-4 py-2 rounded-xl hover:bg-brand-gold-light transition-colors"
                >
                    <FaPlus /> Add Review
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-brand-muted col-span-full text-center py-12">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-brand-surface border border-white/5 rounded-2xl">
                        <p className="text-brand-muted">No reviews yet. Add one!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className={`group relative p-6 rounded-2xl border transition-all duration-300 ${review.isVisible ? "bg-brand-surface border-white/5" : "bg-brand-surface/50 border-white/5 opacity-60"}`}>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => toggleVisibility(review.id, review.isVisible)}
                                    className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-brand-muted"
                                >
                                    {review.isVisible ? "Hide" : "Show"}
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="text-red-400 hover:bg-red-500/10 p-1.5 rounded"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            <div className="flex items-center gap-1 text-brand-gold mb-3 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? "text-brand-gold" : "text-white/10"} />
                                ))}
                            </div>

                            <FaQuoteLeft className="text-brand-muted/20 text-4xl absolute top-6 left-6 -z-10" />

                            <p className="text-brand-text opacity-90 mb-4 line-clamp-3 italic">"{review.comment}"</p>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center text-brand-gold font-bold text-xs ring-1 ring-white/10">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-brand-text">{review.name}</h4>
                                    <p className="text-xs text-brand-muted">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Review Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1c2e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-brand-text">Add New Review</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-brand-muted hover:text-white">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddReview} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                                    value={newReview.name}
                                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Role / Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Verified Customer"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                                    value={newReview.role}
                                    onChange={e => setNewReview({ ...newReview, role: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className={`text-2xl transition-transform active:scale-90 ${star <= newReview.rating ? "text-brand-gold" : "text-white/10"}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Feedback</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold focus:outline-none transition-colors resize-none"
                                    value={newReview.comment}
                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-gold text-brand-bg font-bold py-3 rounded-xl hover:bg-brand-gold-light transition-colors mt-2"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
