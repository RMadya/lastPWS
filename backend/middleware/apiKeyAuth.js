const db = require('../config/database');
require('dotenv').config();

/**
 * API Key Authentication Middleware
 * Verifies API key from X-API-Key header and enforces rate limits
 */
const authenticateAPIKey = async (req, res, next) => {
    try {
        // Get API key from header
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: 'API key required. Include X-API-Key header.'
            });
        }

        // Verify API key exists and is active
        const [keys] = await db.query(
            'SELECT * FROM api_keys WHERE api_key = ? AND is_active = TRUE',
            [apiKey]
        );

        if (keys.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or revoked API key'
            });
        }

        const keyData = keys[0];

        // Check rate limit
        const today = new Date().toISOString().split('T')[0];
        const limit = keyData.tier === 'premium'
            ? parseInt(process.env.RATE_LIMIT_PREMIUM_TIER)
            : parseInt(process.env.RATE_LIMIT_FREE_TIER);

        // Reset counter if it's a new day
        if (keyData.last_request_date !== today) {
            await db.query(
                'UPDATE api_keys SET requests_today = 0, last_request_date = ? WHERE id = ?',
                [today, keyData.id]
            );
            keyData.requests_today = 0;
        }

        // Check if limit exceeded
        if (keyData.requests_today >= limit) {
            return res.status(429).json({
                success: false,
                message: `Rate limit exceeded. ${keyData.tier} tier allows ${limit} requests per day.`,
                limit: limit,
                used: keyData.requests_today,
                reset_at: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
            });
        }

        // Increment request counter
        await db.query(
            'UPDATE api_keys SET requests_today = requests_today + 1, last_request_date = ? WHERE id = ?',
            [today, keyData.id]
        );

        // Log API usage
        await db.query(
            `INSERT INTO api_usage_logs (api_key_id, endpoint, method, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?)`,
            [
                keyData.id,
                req.originalUrl,
                req.method,
                req.ip || req.connection.remoteAddress,
                req.headers['user-agent'] || 'Unknown'
            ]
        );

        // Attach API key data to request
        req.apiKey = {
            id: keyData.id,
            id_user: keyData.id_user,
            tier: keyData.tier,
            requests_today: keyData.requests_today + 1,
            limit: limit
        };

        next();
    } catch (error) {
        console.error('API Key Auth Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

/**
 * Optional API Key Authentication
 * Allows both authenticated and public access
 */
const optionalAPIKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        // No API key provided, continue as public request
        return next();
    }

    // API key provided, authenticate it
    return authenticateAPIKey(req, res, next);
};

module.exports = {
    authenticateAPIKey,
    optionalAPIKey
};
