
import React, { useState, useEffect } from "react";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useLocation } from "react-router-dom";

export default function AdminLayout({ children }) {
    const location = useLocation();
    const isLoginPage = location.pathname === "/admin/login";
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Auto-close sidebar when switching to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <AuthGuard>
            <div className="min-h-screen font-sans text-brand-text bg-brand-bg lg:flex">
                <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                <main className="flex-grow min-h-screen transition-all duration-300 w-full p-4 md:p-8">
                    <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
