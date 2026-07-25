
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const cleanEmail = email.trim();

        try {
            await setPersistence(auth, browserSessionPersistence);
            await signInWithEmailAndPassword(auth, cleanEmail, password);
            navigate("/admin");
        } catch (err) {
            console.error("Login error:", err);

            // Auto-provision superadmin account if not created yet in Firebase Auth
            const lowerEmail = cleanEmail.toLowerCase();
            const isAllowedAutoProvision = lowerEmail === "ravinduweerakkodi.rw@gmail.com" || lowerEmail === "ravindu@lahiruenterprises.com";
            const isUserNotFound = err.code === "auth/user-not-found" || err.code === "auth/invalid-credential";

            if (isAllowedAutoProvision && isUserNotFound) {
                try {
                    const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
                    await setDoc(doc(db, "users", userCred.user.uid), {
                        displayName: "Ravindu",
                        email: cleanEmail,
                        role: "admin",
                        createdAt: serverTimestamp()
                    });
                    navigate("/admin");
                    return;
                } catch (createErr) {
                    console.error("Auto-provision error:", createErr);
                }
            }

            if (err.code === "auth/wrong-password") {
                setError("Incorrect password. Please check and try again.");
            } else if (err.code === "auth/user-not-found") {
                setError("No user found with this email address.");
            } else if (err.code === "auth/invalid-credential") {
                setError("Invalid login credentials. Please check your email and password.");
            } else if (err.code === "auth/too-many-requests") {
                setError("Access blocked due to multiple failed login attempts. Please try again later.");
            } else {
                setError(err.message || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
            <div className="bg-gray-900/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative">
                <h2 className="text-3xl font-bold text-center text-yellow-500 mb-2">Lahiru Enterprises</h2>
                <p className="text-center text-gray-400 mb-8">Admin Panel Login</p>

                {error && (
                    <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
