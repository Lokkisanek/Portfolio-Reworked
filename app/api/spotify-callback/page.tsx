'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [error, setError] = useState('');

    const exchangeToken = async () => {
        try {
            const basic = btoa(`${clientId}:${clientSecret}`);
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${basic}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code || '',
                    redirect_uri: 'http://localhost:3000/api/spotify-callback',
                }),
            });

            const data = await response.json();
            if (data.refresh_token) {
                setRefreshToken(data.refresh_token);
            } else {
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError(String(err));
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-gray-900 p-8 rounded-xl border border-gray-800">
                <h1 className="text-2xl font-bold mb-6 text-green-500">Almost Done!</h1>

                {!refreshToken ? (
                    <div className="space-y-4">
                        <p className="text-gray-300">We received the code. Now please re-enter your Client ID and Secret to exchange it for the Refresh Token.</p>

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

                        <button
                            onClick={exchangeToken}
                            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold"
                        >
                            Get Refresh Token
                        </button>

                        {error && <div className="text-red-500 bg-red-900/20 p-4 rounded mt-4 break-all">{error}</div>}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-green-900/20 border border-green-500/50 p-4 rounded">
                            <h3 className="font-bold text-green-400 mb-2">Success! Here are your credentials:</h3>
                            <p className="text-sm text-gray-300 mb-4">Copy these into your <code className="text-white">.env.local</code> file.</p>

                            <div className="space-y-2 font-mono text-xs bg-black p-4 rounded overflow-x-auto">
                                <div className="text-gray-400">SPOTIFY_CLIENT_ID=<span className="text-white">{clientId}</span></div>
                                <div className="text-gray-400">SPOTIFY_CLIENT_SECRET=<span className="text-white">{clientSecret}</span></div>
                                <div className="text-gray-400">SPOTIFY_REFRESH_TOKEN=<span className="text-green-400">{refreshToken}</span></div>
                            </div>
                        </div>

                        <p className="text-center text-gray-400">After saving the file, restart the server to see the widget work!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SpotifyCallback() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
