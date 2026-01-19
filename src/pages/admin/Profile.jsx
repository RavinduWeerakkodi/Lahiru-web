
import React, { useState, useEffect } from 'react';
import { auth, db } from "@/lib/firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { FaUser, FaLock, FaSave, FaSpinner, FaKey } from 'react-icons/fa';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Form States
    const [displayName, setDisplayName] = useState('');
    const [updatingName, setUpdatingName] = useState(false);

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [updatingPassword, setUpdatingPassword] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');

                // Fetch additional role info if needed, though mostly auth object suffices for profile
                // try {
                //     const docRef = doc(db, "users", currentUser.uid);
                //     const docSnap = await getDoc(docRef);
                //     if (docSnap.exists()) {
                //         // Set extended data if we had any
                //     }
                // } catch(e) {}
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        if (!user) return;
        setUpdatingName(true);

        try {
            await updateProfile(user, { displayName });

            // Sync to Firestore if user doc exists
            const userRef = doc(db, "users", user.uid);
            // Check if doc exists first or just update (update fails if doc doesn't exist)
            // For now, try update, catch error if specific handling needed
            try {
                await updateDoc(userRef, { displayName });
            } catch (err) {
                console.log("Firestore doc update skipped or failed (might be legacy user):", err);
            }

            toast({ title: "Success", description: "Profile name updated successfully." });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ title: "Error", description: "Failed to update profile name.", variant: "destructive" });
        } finally {
            setUpdatingName(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (passwords.new !== passwords.confirm) {
            toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
            return;
        }

        if (passwords.new.length < 6) {
            toast({ title: "Error", description: "Password should be at least 6 characters.", variant: "destructive" });
            return;
        }

        setUpdatingPassword(true);

        try {
            // Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, passwords.current);
            await reauthenticateWithCredential(user, credential);

            // Update Password
            await updatePassword(user, passwords.new);

            toast({ title: "Success", description: "Password changed successfully." });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error("Error changing password:", error);
            if (error.code === 'auth/wrong-password') {
                toast({ title: "Error", description: "Incorrect current password.", variant: "destructive" });
            } else {
                toast({ title: "Error", description: "Failed to update password. Please try again.", variant: "destructive" });
            }
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-brand-muted">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-text">Profile Settings</h1>
                <p className="text-brand-muted mt-1">Manage your account information and security.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Profile Information Card */}
                <div className="bg-brand-surface/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl h-fit">
                    <h2 className="text-xl font-semibold text-brand-text mb-6 flex items-center gap-2">
                        <FaUser className="text-brand-gold" /> Personal Information
                    </h2>

                    <form onSubmit={handleNameUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-brand-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-brand-muted/50 mt-1">Email cannot be changed.</p>
                        </div>

                        <div>
                            <label className="block text-sm text-brand-muted mb-1">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none transition-colors"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={updatingName}
                                className="w-full bg-brand-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {updatingName ? <FaSpinner className="animate-spin" /> : <><FaSave /> Update Profile</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password Card */}
                <div className="bg-brand-surface/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl h-fit">
                    <h2 className="text-xl font-semibold text-brand-text mb-6 flex items-center gap-2">
                        <FaLock className="text-brand-gold" /> Security
                    </h2>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm text-brand-muted mb-1">Current Password</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"><FaKey /></span>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-brand-text focus:border-brand-gold outline-none transition-colors"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-white/5"></div>

                        <div>
                            <label className="block text-sm text-brand-muted mb-1">New Password</label>
                            <input
                                type="password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none transition-colors"
                                placeholder="Min. 6 characters"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-brand-muted mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none transition-colors"
                                placeholder="Re-enter new password"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={updatingPassword}
                                className="w-full bg-white/5 hover:bg-white/10 text-brand-text font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {updatingPassword ? <FaSpinner className="animate-spin" /> : <><FaLock /> Change Password</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
