import { useState, useEffect } from 'react';
import api from '../services/api';
import './ApiKeys.css';

const ApiKeys = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [keyName, setKeyName] = useState('');
    const [tier, setTier] = useState('free');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        try {
            const response = await api.get('/keys');
            setApiKeys(response.data.data);
        } catch (error) {
            console.error('Error fetching API keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.post('/keys/generate', { key_name: keyName, tier });
            setSuccess('API key generated successfully!');
            setKeyName('');
            setTier('free');
            setShowForm(false);
            fetchApiKeys();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate API key');
        }
    };

    const handleRevoke = async (id) => {
        if (!confirm('Are you sure you want to revoke this API key?')) return;

        try {
            await api.put(`/keys/${id}/revoke`);
            setSuccess('API key revoked successfully');
            fetchApiKeys();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to revoke API key');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;

        try {
            await api.delete(`/keys/${id}`);
            setSuccess('API key deleted successfully');
            fetchApiKeys();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete API key');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('API key copied to clipboard!');
        setTimeout(() => setSuccess(''), 2000);
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="apikeys-container">
            <div className="container">
                <div className="apikeys-header">
                    <div>
                        <h1>API Keys</h1>
                        <p>Manage your BeanByte API keys for third-party integrations</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ Generate New Key'}
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {showForm && (
                    <div className="apikey-form-card">
                        <h3>Generate New API Key</h3>
                        <form onSubmit={handleGenerate}>
                            <div className="form-group">
                                <label className="form-label">Key Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={keyName}
                                    onChange={(e) => setKeyName(e.target.value)}
                                    placeholder="My App API Key"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tier</label>
                                <select
                                    className="form-select"
                                    value={tier}
                                    onChange={(e) => setTier(e.target.value)}
                                >
                                    <option value="free">Free (100 requests/day)</option>
                                    <option value="premium">Premium (1000 requests/day)</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Generate API Key
                            </button>
                        </form>
                    </div>
                )}

                <div className="apikeys-list">
                    {apiKeys.map((key) => (
                        <div key={key.id} className="apikey-card">
                            <div className="apikey-header">
                                <div>
                                    <h3>{key.key_name}</h3>
                                    <span className={`badge ${key.tier === 'premium' ? 'badge-info' : 'badge-success'}`}>
                                        {key.tier.toUpperCase()}
                                    </span>
                                    {!key.is_active && (
                                        <span className="badge badge-error">REVOKED</span>
                                    )}
                                </div>
                                <div className="apikey-actions">
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => copyToClipboard(key.api_key)}
                                    >
                                        Copy Key
                                    </button>
                                    {key.is_active && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleRevoke(key.id)}
                                        >
                                            Revoke
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(key.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="apikey-value">
                                <code>{key.api_key}</code>
                            </div>

                            <div className="apikey-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Requests Today:</span>
                                    <span className="stat-value">{key.requests_today || 0}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Created:</span>
                                    <span className="stat-value">
                                        {new Date(key.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                {key.revoked_at && (
                                    <div className="stat-item">
                                        <span className="stat-label">Revoked:</span>
                                        <span className="stat-value">
                                            {new Date(key.revoked_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {apiKeys.length === 0 && (
                    <div className="empty-state">
                        <p>No API keys yet. Generate your first API key to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiKeys;
