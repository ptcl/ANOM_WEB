import React, { useState } from 'react';

interface HealthResponse {
    success: boolean;
    message: string;
    timestamp: string;
    uptime?: string;
    version?: string;
    environment?: string;
}

const HealthCheckButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<HealthResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkHealth = async () => {
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch('https://api-dev.anom-archives.net/api/protocol/agents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data: HealthResponse = await res.json();
            setResponse(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erreur inconnue');
            }
            console.error('❌ Health check failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setResponse(null);
        setError(null);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                API Health Check
            </h2>

            <div className="flex gap-3 mb-6">
                <button
                    onClick={checkHealth}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        } text-white shadow-md`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Test en cours...</span>
                        </div>
                    ) : (
                        '🏥 Tester l\'API'
                    )}
                </button>

                {(response || error) && (
                    <button
                        onClick={clearResults}
                        className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        title="Effacer les résultats"
                    >
                        ✕
                    </button>
                )}
            </div>

            {response && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <h3 className="text-lg font-semibold text-green-800">
                        </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Message:</span>
                            <span className="ml-2 text-green-700">{response.message}</span>
                        </div>

                        {response.uptime && (
                            <div>
                                <span className="font-medium text-gray-700">Uptime:</span>
                                <span className="ml-2 text-green-700">{response.uptime}</span>
                            </div>
                        )}

                        {response.environment && (
                            <div>
                                <span className="font-medium text-gray-700">Environnement:</span>
                                <span className="ml-2 text-green-700 capitalize">{response.environment}</span>
                            </div>
                        )}

                        {response.version && (
                            <div>
                                <span className="font-medium text-gray-700">Version:</span>
                                <span className="ml-2 text-green-700">{response.version}</span>
                            </div>
                        )}

                        <div>
                            <span className="font-medium text-gray-700">Timestamp:</span>
                            <span className="ml-2 text-gray-600">
                                {new Date(response.timestamp).toLocaleString('fr-FR')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <h3 className="text-lg font-semibold text-red-800">
                            ❌ API Indisponible
                        </h3>
                    </div>

                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Erreur:</span>
                        <span className="ml-2 text-red-700">{error}</span>
                    </div>

                    <div className="mt-3 text-xs text-red-600 bg-red-100 p-2 rounded">
                        💡 Vérifiez que l&apos;API est démarrée et accessible
                    </div>
                </div>
            )}

            <div className="mt-6 text-xs text-gray-500 text-center">
                <p>🌐 Endpoint: /api/health</p>
                <p>🔗 api-dev.anom-archives.net</p>
            </div>
        </div>
    );
};

export default HealthCheckButton;