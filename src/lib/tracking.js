
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, writeBatch, Timestamp, doc, setDoc, increment } from "firebase/firestore";

/**
 * Tracks a WhatsApp click event in Firestore.
 * @param {Object} details - Additional details about the click (e.g., source, service).
 */
export const trackWhatsAppClick = async (details = {}) => {
    try {
        const { sourcePage, serviceName, language } = details;

        // Basic device detection
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const deviceType = isMobile ? "mobile" : "desktop";

        await addDoc(collection(db, "inquiries"), {
            createdAt: serverTimestamp(),
            source: {
                page: sourcePage || window.location.pathname,
                device: deviceType,
                referrer: document.referrer || "Direct"
            },
            service: {
                type: serviceName || "General"
            },
            customer: {
                language: language || navigator.language.split('-')[0]
            }
        });
        console.log("WhatsApp click tracked");
    } catch (error) {
        console.error("Error tracking WhatsApp click:", error);
    }
};

/**
 * Deletes inquiries older than 10 days.
 */
export const cleanupOldData = async () => {
    try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const q = query(
            collection(db, "inquiries"),
            where("createdAt", "<", Timestamp.fromDate(tenDaysAgo))
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return;
        }

        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`Cleaned up ${snapshot.size} old records.`);
    } catch (error) {
        // Silent fail
    }
};

/**
 * Tracks unique daily visitors.
 * Should be called once per session/day.
 */
export const trackVisitor = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = localStorage.getItem('last_visit_date');

        if (lastVisit === today) {
            return; // Already tracked for today
        }

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const deviceType = isMobile ? "mobile" : "desktop";

        const statsRef = doc(db, "daily_stats", today);

        await setDoc(statsRef, {
            date: today,
            visitors: increment(1),
            devices: {
                [deviceType]: increment(1)
            }
        }, { merge: true });

        localStorage.setItem('last_visit_date', today);
        console.log("Visitor tracked");
    } catch (error) {
        console.error("Error tracking visitor:", error);
    }
};
