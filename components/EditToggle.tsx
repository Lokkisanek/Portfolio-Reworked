'use client';

import { useEdit } from '@/context/EditContext';
import { useState } from 'react';
import { Lock, Unlock, Edit3, X } from 'lucide-react';

export default function EditToggle() {
    const { isAuthenticated, isEditing, login, toggleEdit } = useEdit();
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setIsOpen(false);
            setPassword('');
            setError(false);
        } else {
            setError(true);
        }
    };

    if (isAuthenticated) {
        return (
            <button
                onClick={toggleEdit}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-all ${isEditing ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
            >
                {isEditing ? <Unlock className="text-white" /> : <Lock className="text-white" />}
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg z-50"
            >
                <Edit3 />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center">
                    <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md relative border border-gray-800">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:border-blue-500 outline-none"
                                    placeholder="Enter admin password"
                                    autoFocus
                                />
                                {error && <p className="text-red-500 text-sm mt-2">Incorrect password</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold transition"
                            >
                                Login
                            </button>
                        </form>
                        <p className="text-gray-500 text-xs mt-4 text-center">Default: admin123</p>
                    </div>
                </div>
            )}
        </>
    );
}
