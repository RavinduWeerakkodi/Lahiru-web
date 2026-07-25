
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, limit, getDocs, onSnapshot } from "firebase/firestore";

export default function AuthGuard({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Inactivity Timer (10 minutes)
    useEffect(() => {
        if (!user) return; // Only track for logged-in users

        let timeoutId;
        const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                console.log("Auto-signing out due to inactivity...");
                await auth.signOut();
                navigate("/admin/login");
            }, TIMEOUT_DURATION);
        };

        const handleActivity = () => {
            resetTimer();
        };

        // Events to track
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        // Setup listeners
        events.forEach(event => window.addEventListener(event, handleActivity));

        // Initial start
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [user, navigate]);

    useEffect(() => {
        let userUnsubscribe = null;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // 1. Check for hardcoded superadmin bypass
                const userEmail = currentUser.email ? currentUser.email.toLowerCase() : "";
                if (userEmail === "ravinduweerakkodi.rw@gmail.com" || userEmail === "ravindu@lahiruenterprises.com") {
                    if (location.pathname === "/admin/login") navigate("/admin");
                    setUser(currentUser);
                    setLoading(false);
                    return;
                }

                // 2. Real-time Check Firestore for existence
                try {
                    // We need to find the user doc by email first since we might not have doc ID = uid in legacy data
                    // However, we are making a constraint that email is unique.
                    const userQ = query(collection(db, "users"), where("email", "==", currentUser.email), limit(1));

                    // Initial check and setup real-time listener
                    // Note: onSnapshot with query works for this.
                    userUnsubscribe = onSnapshot(userQ, async (snapshot) => {
                        if (snapshot.empty) {
                            console.log("User document not found or deleted. Signing out.");
                            await auth.signOut();
                            setUser(null);
                            if (userUnsubscribe) userUnsubscribe(); // Stop listening
                            navigate("/admin/login");
                        } else {
                            // User exists
                            if (location.pathname === "/admin/login") navigate("/admin");
                            setUser(currentUser);
                        }
                        setLoading(false);
                    }, (error) => {
                        console.error("Auth listener error:", error);
                        setLoading(false);
                    });

                } catch (error) {
                    console.error("Auth check setup failed:", error);
                    setLoading(false);
                }
            } else {
                if (userUnsubscribe) userUnsubscribe();
                if (location.pathname !== "/admin/login") {
                    navigate("/admin/login");
                }
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
            if (userUnsubscribe) userUnsubscribe();
        };
    }, [navigate, location.pathname]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (!user && location.pathname !== "/admin/login") {
        return null; // Will redirect
    }

    return <>{children}</>;
}
