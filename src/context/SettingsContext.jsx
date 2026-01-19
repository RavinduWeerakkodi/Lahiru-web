
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, "settings", "general");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Ensure defaults and structure
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    social: { ...prev.social, ...(data.social || {}) }
                }));
            }
            setLoading(false);
        }, (error) => {
            console.error("Error listening to settings:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getWhatsAppLink = (message = "") => {
        const number = settings.whatsappNumber.replace(/[^0-9]/g, '');
        const text = message ? `?text=${encodeURIComponent(message)}` : "";
        return `https://wa.me/${number}${text}`;
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, getWhatsAppLink }}>
            {children}
        </SettingsContext.Provider>
    );
};
