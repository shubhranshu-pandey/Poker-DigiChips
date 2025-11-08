'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RedisTest() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testRedis = async () => {
        setLoading(true);
        setResult('Testing...');

        try {
            const response = await fetch(`${API_URL}/redis/test`, {
                method: 'POST',
            });

            const data = await response.json();

            if (data.success) {
                setResult(`✓ Success! Written: ${data.written}, Read: ${data.read}, Match: ${data.match}`);
            } else {
                setResult(`✗ Failed: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            setResult(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 w-full max-w-md p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                Redis Test
            </h2>
            <button
                onClick={testRedis}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? 'Testing...' : 'Test Redis Read/Write'}
            </button>
            {result && (
                <div className="mt-4 p-3 bg-white dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-700">
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 wrap-break-word">
                        {result}
                    </p>
                </div>
            )}
        </div>
    );
}
