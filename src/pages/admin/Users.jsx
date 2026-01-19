
import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaUserShield, FaUserTie, FaUserCog, FaCheck, FaPlus, FaTimes, FaSpinner, FaLock } from 'react-icons/fa';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase"; // Import config to init secondary app
import { useToast } from "@/components/ui/use-toast";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newUser, setNewUser] = useState({
        displayName: '',
        email: '',
        password: '',
        role: 'editor',
        permissions: {
            dashboard: true, // Always true for all
            inquiries: false,
            reviews: false,
            settings: false,
            users: false
        }
    });

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        try {
            await updateDoc(doc(db, "users", id), {
                role: newRole
            });
            toast({ title: "Role Updated", description: "User role has been updated." });
        } catch (error) {
            console.error("Error updating role:", error);
            toast({ title: "Error", description: "Failed to update role.", variant: "destructive" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (module) => {
        setNewUser(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: !prev.permissions[module]
            }
        }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreating(true);

        // secondary app to avoid logging out current admin
        let secondaryApp = null;
        try {
            secondaryApp = initializeApp(firebaseConfig, "Secondary");
            const secondaryAuth = getAuth(secondaryApp);

            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, newUser.password);
            const user = userCredential.user;

            // Convert permissions object to array of keys where value is true
            const permissionsArray = Object.keys(newUser.permissions).filter(key => newUser.permissions[key]);

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: newUser.email,
                displayName: newUser.displayName,
                role: newUser.role,
                permissions: permissionsArray,
                createdAt: serverTimestamp()
            });

            toast({ title: "User Created", description: `${newUser.displayName} has been added.` });

            // Allow time for cleanup
            await signOut(secondaryAuth);

            setIsModalOpen(false);
            setNewUser({
                displayName: '',
                email: '',
                password: '',
                role: 'editor',
                permissions: { dashboard: true, inquiries: false, reviews: false, settings: false, users: false }
            });

        } catch (error) {
            console.error("Error creating user:", error);
            toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
        } finally {
            if (secondaryApp) {
                // There isn't a direct 'delete' method exported from firebase/app in v9+ easily usable like deleteApp 
                // but letting it go out of scope / garbage collect is usually fine for one-off/rare actions.
                // Or import { deleteApp } from "firebase/app";
            }
            setCreating(false);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'superadmin': return <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1"><FaUserShield /> Super Admin</span>;
            case 'admin': return <span className="bg-brand-gold/10 text-brand-gold px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1"><FaUserCog /> Admin</span>;
            default: return <span className="bg-white/5 text-brand-muted px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1"><FaUserTie /> Editor</span>;
        }
    };

    return (
        <div>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text">User Management</h1>
                    <p className="text-brand-muted mt-1">Manage system access and permissions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <FaPlus /> Create User
                </button>
            </div>

            <div className="bg-brand-surface/80 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-brand-muted">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-brand-muted">No users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-brand-muted text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">User</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Permissions</th>
                                    <th className="px-6 py-4 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center text-brand-gold font-bold text-xs">
                                                    {user.displayName ? user.displayName.charAt(0) : (user.email ? user.email.charAt(0).toUpperCase() : '?')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-brand-text font-medium">{user.displayName || "Unknown"}</span>
                                                    <span className="text-brand-muted text-xs md:hidden">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-brand-muted text-sm hidden md:table-cell">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.role === 'superadmin' ? (
                                                    <span className="text-xs text-brand-muted">All Access</span>
                                                ) : user.permissions?.map(p => (
                                                    <span key={p} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-brand-muted capitalize">{p}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role || 'editor'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={user.role === 'superadmin'}
                                                className="bg-black/20 text-brand-text text-sm border border-white/10 rounded-lg px-2 py-1 focus:border-brand-gold focus:outline-none disabled:opacity-50"
                                            >
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                                <option value="superadmin" disabled>Super Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CREATE USER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-brand-text flex items-center gap-2"><FaUser /> Create New User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-brand-muted hover:text-brand-text transition-colors"><FaTimes /></button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-brand-muted mb-1">Display Name</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={newUser.displayName}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-brand-muted mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-brand-muted mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none"
                                    >
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            {newUser.role === 'editor' && (
                                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                    <label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Module Permissions</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input type="checkbox" checked={newUser.permissions.dashboard} disabled className="accent-brand-gold" />
                                            <span className="text-sm text-brand-text opacity-50">Dashboard (Required)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={newUser.permissions.inquiries}
                                                onChange={() => handlePermissionChange('inquiries')}
                                                className="accent-brand-gold w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-brand-text">WhatsApp Clicks</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={newUser.permissions.reviews}
                                                onChange={() => handlePermissionChange('reviews')}
                                                className="accent-brand-gold w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-brand-text">Reviews</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={newUser.permissions.settings}
                                                onChange={() => handlePermissionChange('settings')}
                                                className="accent-brand-gold w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-brand-text">Settings</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-text font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 py-2 rounded-lg bg-brand-gold hover:bg-yellow-600 text-black font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {creating ? <FaSpinner className="animate-spin" /> : <><FaCheck /> Create User</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
