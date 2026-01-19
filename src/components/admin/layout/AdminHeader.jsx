
import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";

export default function AdminHeader({ onMenuClick }) {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/admin/login");
        } catch (error) { }
    };

    if (!user) return null;

    return (
        <header className="flex items-center justify-between py-4 mb-6 relative z-50">
            {/* Hamburger Button for mobile */}
            <button
                onClick={onMenuClick}
                className="lg:hidden flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-surface border border-white/10 text-brand-gold hover:bg-brand-gold/10 transition-all group active:scale-95 shadow-sm"
            >
                <FaBars className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-xs font-bold uppercase tracking-widest">Menu</span>
            </button>

            <div className="flex-grow"></div>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 bg-brand-surface/80 backdrop-blur-md border border-white/5 py-1.5 px-3 md:py-2 md:px-4 rounded-full hover:bg-brand-gold/5 hover:border-brand-gold/20 transition-all group shadow-sm"
                >
                    <div className="hidden sm:flex flex-col items-end mr-1">
                        <span className="text-brand-text font-semibold text-xs md:text-sm leading-tight group-hover:text-brand-gold transition-colors">
                            {user.displayName || "Admin User"}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-brand-muted uppercase tracking-widest opacity-60">
                            {user.email?.split('@')[0]}
                        </span>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-brand-gold/40 to-brand-gold-dark/40 p-[1px] group-hover:from-brand-gold transition-all">
                        <div className="w-full h-full rounded-full bg-brand-surface flex items-center justify-center overflow-hidden text-lg md:text-2xl text-brand-gold/80 group-hover:text-brand-gold transition-colors">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle />
                            )}
                        </div>
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-brand-surface/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 transform origin-top-right animate-fade-in-up z-[60]">
                        <div className="px-5 py-3 border-b border-white/5 mb-2">
                            <p className="text-[9px] text-brand-gold/60 font-bold uppercase tracking-[0.2em] mb-1">Signed in as</p>
                            <p className="text-sm font-semibold text-brand-text truncate">{user.email}</p>
                        </div>
                        {/* ... items ... */}

                        <Link
                            to="/admin/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaUserCircle className="text-base" />
                            Your Profile
                        </Link>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <span>🌐</span>
                            Visit Live Site
                        </a>

                        <div className="my-2 border-t border-white/5"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                        >
                            <span>🚪</span>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
            )}
        </header>
    );
}
