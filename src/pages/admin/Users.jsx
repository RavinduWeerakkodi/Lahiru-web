
import React, { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, doc, updateDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { FaUserShield, FaUserTie, FaUserCog, FaCheck, FaPlus, FaTimes, FaSpinner, FaUser, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseConfig } from "@/lib/firebase"; // Import config to init secondary app
import { useToast } from "@/components/ui/use-toast";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const currentUser = getAuth().currentUser;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // If null, we are creating
    const [userToDelete, setUserToDelete] = useState(null);

    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        role: 'editor',
        permissions: {
            dashboard: true,
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

    // Helper to get permission booleans from array or default
    const getPermissionsState = (role, permissionsArray = []) => {
        const allPerms = { dashboard: true, inquiries: false, reviews: false, settings: false, users: false };

        if (role === 'admin') {
            // Admin gets everything
            Object.keys(allPerms).forEach(k => allPerms[k] = true);
        } else {
            // Editor gets what exists in array
            if (Array.isArray(permissionsArray)) {
                permissionsArray.forEach(p => {
                    if (allPerms.hasOwnProperty(p)) allPerms[p] = true;
                });
            }
        }
        return allPerms;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role') {
            // If switching to admin, auto-select all permissions
            if (value === 'admin') {
                setFormData(prev => ({
                    ...prev,
                    role: value,
                    permissions: { dashboard: true, inquiries: true, reviews: true, settings: true, users: true }
                }));
            } else {
                // Reset to default editor perms if switching back
                setFormData(prev => ({
                    ...prev,
                    role: value,
                    permissions: { dashboard: true, inquiries: false, reviews: false, settings: false, users: false }
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePermissionChange = (module) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: !prev.permissions[module]
            }
        }));
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            displayName: '',
            email: '',
            password: '',
            role: 'editor',
            permissions: { dashboard: true, inquiries: false, reviews: false, settings: false, users: false }
        });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            displayName: user.displayName || '',
            email: user.email || '',
            password: '', // Password mostly separate update, keep blank
            role: user.role || 'editor',
            permissions: getPermissionsState(user.role, user.permissions)
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);

        // Convert permissions object to array
        const permissionsArray = Object.keys(formData.permissions).filter(key => formData.permissions[key]);

        try {
            if (editingUser) {
                // Update existing user
                const updateData = {
                    displayName: formData.displayName,
                    role: formData.role,
                    permissions: permissionsArray
                };
                // Note: Email/Password updates not handled here for existing users via simple Firestore update
                // The Profile page handles self-updates. Admin editing other user's auth email/pass requires Admin SDK backend.

                await updateDoc(doc(db, "users", editingUser.id), updateData);
                toast({ title: "User Updated", description: `${formData.displayName} updated successfully.` });
            } else {
                // Create new user
                // Secondary app to avoid logging out current admin
                let secondaryApp = null;
                try {
                    secondaryApp = initializeApp(firebaseConfig, "Secondary");
                    const secondaryAuth = getAuth(secondaryApp);

                    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
                    const user = userCredential.user;

                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        email: formData.email,
                        displayName: formData.displayName,
                        role: formData.role,
                        permissions: permissionsArray,
                        createdAt: serverTimestamp()
                    });

                    toast({ title: "User Created", description: `${formData.displayName} has been added.` });
                    await signOut(secondaryAuth);
                } finally {
                    // Cleanup happens implicitly
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving user:", error);
            toast({ title: "Operation Failed", description: error.message, variant: "destructive" });
        } finally {
            setCreating(false);
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteDoc(doc(db, "users", userToDelete.id));
            toast({ title: "User Deleted", description: "User has been removed from the system." });
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return <span className="bg-brand-gold/10 text-brand-gold px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1"><FaUserCog /> Admin</span>;
            case 'superadmin': return <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1"><FaUserShield /> Super Admin</span>; // Legacy support
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
                    onClick={openCreateModal}
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
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
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
                                                {/* If admin or legacy superadmin, show All Access */}
                                                {(user.role === 'admin' || user.role === 'superadmin') ? (
                                                    <span className="text-xs text-brand-muted">All Access</span>
                                                ) : (Array.isArray(user.permissions) ? user.permissions : []).map(p => (
                                                    <span key={p} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-brand-muted capitalize">{p}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-2 text-brand-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    disabled={user.email === currentUser?.email}
                                                    className={`p-2 rounded-lg transition-colors ${user.email === currentUser?.email
                                                            ? 'text-brand-muted bg-white/5 cursor-not-allowed opacity-50'
                                                            : 'text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20'
                                                        }`}
                                                    title={user.email === currentUser?.email ? "You cannot delete yourself" : "Delete User"}
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CREATE/EDIT USER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                                <FaUser /> {editingUser ? 'Edit User' : 'Create New User'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-brand-muted hover:text-brand-text transition-colors"><FaTimes /></button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-brand-muted mb-1">Display Name</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
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
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!!editingUser} // Cannot change email in edit mode (simple version)
                                    className={`w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none ${editingUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    required
                                />
                                {editingUser && <p className="text-xs text-brand-muted mt-1">Email cannot be changed.</p>}
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-brand-muted mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-brand-text focus:border-brand-gold outline-none"
                                    >
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            {formData.role === 'editor' && (
                                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                    <label className="block text-xs font-bold text-brand-muted mb-2 uppercase tracking-wider">Module Permissions</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input type="checkbox" checked={formData.permissions.dashboard} disabled className="accent-brand-gold" />
                                            <span className="text-sm text-brand-text opacity-50">Dashboard (Required)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.inquiries}
                                                onChange={() => handlePermissionChange('inquiries')}
                                                className="accent-brand-gold w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-brand-text">WhatsApp Clicks</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.reviews}
                                                onChange={() => handlePermissionChange('reviews')}
                                                className="accent-brand-gold w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-brand-text">Reviews</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.settings}
                                                onChange={() => handlePermissionChange('settings')}
                                                className="accent-brand-gold w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-brand-text">Settings</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.users}
                                                onChange={() => handlePermissionChange('users')}
                                                className="accent-brand-gold w-4 h-4 rounded"
                                            />
                                            <span className="text-sm text-brand-text">Users</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {formData.role === 'admin' && (
                                <div className="mt-2 p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/20">
                                    <p className="text-sm text-brand-gold flex items-center gap-2">
                                        <FaUserCog /> Admin has full access to all modules.
                                    </p>
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
                                    {creating ? <FaSpinner className="animate-spin" /> : <><FaCheck /> {editingUser ? 'Update' : 'Create'}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="mx-auto w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <FaExclamationTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>
                        <p className="text-brand-muted mb-6">
                            Are you sure you want to delete <strong>{userToDelete?.displayName}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-text font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
