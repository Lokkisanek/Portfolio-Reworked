'use client';

import { useState } from 'react';

export default function SpotifySetup() {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [scope, setScope] = useState('user-read-currently-playing');

    const redirectUri = 'http://localhost:3000/api/spotify-callback';

    const generateUrl = () => {
        const params = new URLSearchParams({
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: scope,
        });
        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl border border-gray-800">
                <h1 className="text-2xl font-bold mb-6 text-green-500">Spotify Setup</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Client ID</label>
                        <input
                            type="text"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Client Secret</label>
                        <input
                            type="text"
                            value={clientSecret}
                            onChange={(e) => setClientSecret(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                        />
                    </div>

                    <div className="pt-4">
                        <p className="text-sm text-gray-400 mb-2">1. Add this Redirect URI to your Spotify App settings:</p>
                        <code className="block bg-black p-2 rounded text-xs text-green-400 mb-4">{redirectUri}</code>

                        <p className="text-sm text-gray-400 mb-2">2. Click to Authorize:</p>
                        <a
                            href={generateUrl()}
                            className={`block w-full text-center py-3 rounded font-bold ${clientId ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 cursor-not-allowed'}`}
                            onClick={(e) => !clientId && e.preventDefault()}
                        >
                            Authorize with Spotify
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
