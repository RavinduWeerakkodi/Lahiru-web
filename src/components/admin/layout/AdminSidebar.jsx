
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaChartPie,
    FaFeather,
    FaComments,
    FaWhatsapp,
    FaUsers,
    FaTags,
    FaCog,
    FaSignOutAlt,
    FaUser,
    FaTimes,
    FaMagic
} from "react-icons/fa";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, limit, getDocs } from "firebase/firestore";

export default function AdminSidebar({ isOpen, setIsOpen }) {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const isActive = (path) => pathname === path;
    const closeSidebar = () => setIsOpen(false);

    const [userRole, setUserRole] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                if (currentUser.email === "ravindu@lahiruenterprises.com") {
                    setUserRole("superadmin");
                    setLoading(false);
                    return;
                }
                try {
                    const q = query(collection(db, "users"), where("email", "==", currentUser.email), limit(1));
                    const snapshot = await getDocs(q);
                    if (!snapshot.empty) {
                        const userData = snapshot.docs[0].data();
                        setUserRole(userData.role);
                        setUserPermissions(userData.permissions || []);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const allNavItems = [
        { id: "dashboard", name: "Dashboard", path: "/admin", icon: <FaChartPie /> },
        { id: "inquiries", name: "WhatsApp Clicks", path: "/admin/inquiries", icon: <FaWhatsapp /> },
        { id: "reviews", name: "Reviews", path: "/admin/reviews", icon: <FaComments /> },
        { id: "users", name: "Users & Roles", path: "/admin/users", icon: <FaUsers /> },
        { id: "settings", name: "Settings", path: "/admin/settings", icon: <FaCog /> },
    ];

    const allowedNavItems = allNavItems.filter(item => {
        if (loading) return false;
        if (!userRole) return false;
        if (userRole === "superadmin" || userRole === "admin") return true;
        if (userRole === "editor") {
            if (item.id === "dashboard") return true;
            return userPermissions.includes(item.id);
        }
        return false;
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            navigate("/admin/login");
        } catch (error) { }
    };

    return (
        <>
            {/* Overlay for mobile: Smooth Fade */}
            <div
                className={`
                    fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-all duration-300
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                onClick={closeSidebar}
            ></div>

            <aside className={`
                fixed inset-y-0 left-0 w-[280px] bg-brand-surface border-r border-white/5 flex flex-col p-6 z-[100] shadow-2xl transition-all duration-300 ease-in-out transform
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shadow-none lg:z-40 lg:shrink-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex items-center justify-between mb-8">
                    <div className="text-2xl font-bold text-brand-text flex items-center tracking-wide">
                        Lahiru Ent<span className="text-brand-gold drop-shadow-glow">.</span>
                    </div>
                    {/* Close button for mobile menu */}
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden text-brand-muted hover:text-brand-text p-2 rounded-lg bg-white/5"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="lg:hidden mb-4 border-b border-white/5 pb-2">
                    <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] px-4 opacity-70">Menu</p>
                </div>

                <nav className="flex flex-col gap-1.5 flex-grow overflow-y-auto no-scrollbar">
                    {allowedNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeSidebar}
                            className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive(item.path)
                                ? "text-brand-gold bg-brand-gold/10"
                                : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                                }`}
                        >
                            {isActive(item.path) && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-gold rounded-r-full"></div>
                            )}
                            <span className="w-6 text-center text-lg">{item.icon}</span>
                            <span className="font-medium tracking-wide text-[0.95rem]">{item.name}</span>
                        </Link>
                    ))}

                    <div className="my-4 border-t border-white/5 mx-2"></div>

                    <Link
                        to="/admin/profile"
                        onClick={closeSidebar}
                        className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative ${isActive("/admin/profile")
                            ? "text-brand-gold bg-brand-gold/10"
                            : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                            }`}
                    >
                        {isActive("/admin/profile") && (
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-gold rounded-r-full"></div>
                        )}
                        <span className="w-6 text-center text-lg"><FaUser /></span>
                        <span className="font-medium tracking-wide text-[0.95rem]">Profile Settings</span>
                    </Link>

                    <div className="flex-grow"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left mt-2"
                    >
                        <span className="w-6 text-center text-lg"><FaSignOutAlt /></span>
                        Logout Session
                    </button>
                </nav>
            </aside>
        </>
    );
}
