
import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaSave, FaGlobe, FaWhatsapp, FaEnvelope, FaPhone, FaTools, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaMapMarkedAlt } from 'react-icons/fa';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        contactEmail: "info@lahiruenterprises.com",
        contactPhone1: "077 222 7556",
        contactPhone2: "",
        contactAddress: "",
        contactMapLink: "",
        whatsappNumber: "94772227556",
        social: {
            facebook: "",
            instagram: "",
            linkedin: ""
        },
        maintenanceMode: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "general");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Migration: If 'contactPhone' exists but 'contactPhone1' doesn't, use it.
                    const phone1 = data.contactPhone1 || data.contactPhone || "";

                    setSettings(prev => ({
                        ...prev,
                        ...data,
                        contactPhone1: phone1, // Ensure migration
                        social: { ...prev.social, ...(data.social || {}) }
                    }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("social.")) {
            const socialKey = name.split(".")[1];
            setSettings(prev => ({
                ...prev,
                social: {
                    ...prev.social,
                    [socialKey]: value
                }
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "general"), settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert(`Failed to save settings: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center p-12 text-brand-muted">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-text">Platform Settings</h1>
                <p className="text-brand-muted mt-1">Configure global application settings.</p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl">
                    <h2 className="text-xl font-semibold text-brand-text mb-6 flex items-center gap-2">
                        <FaPhone className="text-brand-gold" /> Contact Details
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                <FaEnvelope /> Support Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                    <FaPhone /> Phone 01
                                </label>
                                <input
                                    type="text"
                                    name="contactPhone1"
                                    value={settings.contactPhone1}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                    <FaPhone /> Phone 02
                                </label>
                                <input
                                    type="text"
                                    name="contactPhone2"
                                    value={settings.contactPhone2}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                <FaMapMarkerAlt /> Physical Address
                            </label>
                            <textarea
                                name="contactAddress"
                                rows="3"
                                value={settings.contactAddress}
                                onChange={handleChange}
                                placeholder="123 Street Name, City, Country"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors resize-none"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                <FaMapMarkedAlt /> Google Map Link
                            </label>
                            <input
                                type="text"
                                name="contactMapLink"
                                value={settings.contactMapLink}
                                onChange={handleChange}
                                placeholder="https://maps.app.goo.gl/..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                <FaWhatsapp /> WhatsApp Number
                            </label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={settings.whatsappNumber}
                                onChange={handleChange}
                                placeholder="947..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                            />
                            <p className="text-[10px] text-brand-muted mt-1">Used for floating buttons and CTA links.</p>
                        </div>
                    </div>
                </div>

                {/* Social Media & System */}
                <div className="space-y-8">
                    <div className="p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl">
                        <h2 className="text-xl font-semibold text-brand-text mb-6 flex items-center gap-2">
                            <FaGlobe className="text-brand-gold" /> Social Media
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                    <FaFacebook /> Facebook URL
                                </label>
                                <input
                                    type="text"
                                    name="social.facebook"
                                    value={settings.social.facebook}
                                    onChange={handleChange}
                                    placeholder="https://facebook.com/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                    <FaInstagram /> Instagram URL
                                </label>
                                <input
                                    type="text"
                                    name="social.instagram"
                                    value={settings.social.instagram}
                                    onChange={handleChange}
                                    placeholder="https://instagram.com/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-muted uppercase mb-1 flex items-center gap-2">
                                    <FaLinkedin /> LinkedIn URL
                                </label>
                                <input
                                    type="text"
                                    name="social.linkedin"
                                    value={settings.social.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-brand-text focus:border-brand-gold focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-surface/80 backdrop-blur-md border border-white/5 shadow-xl">
                        <h2 className="text-xl font-semibold text-brand-text mb-6 flex items-center gap-2">
                            <FaTools className="text-brand-gold" /> System
                        </h2>
                        <div className="flex items-center gap-4 p-4 bg-brand-bg/50 rounded-xl border border-white/5">
                            <div className="flex-grow">
                                <label className="text-sm font-bold text-brand-text block">Maintenance Mode</label>
                                <p className="text-xs text-brand-muted">Temporarily disable the public facing site.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-brand-gold text-brand-bg font-bold px-8 py-4 rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50 shadow-lg shadow-brand-gold/10"
                    >
                        {saving ? "Saving..." : <><FaSave /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
