
import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { FaTrash, FaWhatsapp, FaGlobe, FaMobileAlt, FaDesktop } from 'react-icons/fa';

export default function WhatsAppClicks() {
    const [clicks, setClicks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setClicks(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching clicks:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this log?")) {
            try {
                await deleteDoc(doc(db, "inquiries", id));
            } catch (error) {
                console.error("Error deleting log:", error);
            }
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text">WhatsApp Clicks</h1>
                    <p className="text-brand-muted mt-1">Real-time logs of customer WhatsApp interactions.</p>
                </div>
                <div className="px-4 py-2 bg-brand-surface border border-white/10 rounded-lg">
                    <span className="text-2xl font-bold text-brand-gold mr-2">{clicks.length}</span>
                    <span className="text-brand-muted text-sm uppercase tracking-wide">Total Clicks</span>
                </div>
            </div>

            <div className="bg-brand-surface/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-brand-muted">Loading logs...</div>
                ) : clicks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                            <FaWhatsapp className="text-3xl text-brand-muted" />
                        </div>
                        <p className="text-brand-muted text-lg">No WhatsApp clicks recorded yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-brand-muted text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Time</th>
                                    <th className="px-6 py-4 font-semibold">Service / CTA</th>
                                    <th className="px-6 py-4 font-semibold">Source Page</th>
                                    <th className="px-6 py-4 font-semibold">Device</th>
                                    <th className="px-6 py-4 font-semibold">Language</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {clicks.map((click) => (
                                    <tr key={click.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-brand-muted text-sm whitespace-nowrap">
                                            {formatDate(click.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-brand-text font-medium">{click.service?.type || "General"}</span>
                                        </td>
                                        <td className="px-6 py-4 text-brand-muted text-sm">
                                            {click.source?.page}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-brand-text/80 text-sm capitalize">
                                                {click.source?.device === 'mobile' ? <FaMobileAlt /> : <FaDesktop />}
                                                {click.source?.device}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-brand-text/80 text-sm uppercase">
                                                <FaGlobe className="text-brand-muted" />
                                                {click.customer?.language}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(click.id)}
                                                className="p-2 text-brand-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Log"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
