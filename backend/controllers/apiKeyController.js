const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * Generate new API key
 */
exports.generateApiKey = async (req, res) => {
    try {
        const { key_name, tier } = req.body;
        const userId = req.user.id_user;

        // Generate unique API key
        const apiKey = `bbt_${uuidv4().replace(/-/g, '')}`;

        // Validate tier
        const validTiers = ['free', 'premium'];
        const selectedTier = validTiers.includes(tier) ? tier : 'free';

        // Insert API key
        const [result] = await db.query(
            `INSERT INTO api_keys (id_user, api_key, key_name, tier, is_active) 
       VALUES (?, ?, ?, ?, TRUE)`,
            [userId, apiKey, key_name || 'My API Key', selectedTier]
        );

        res.status(201).json({
            success: true,
            message: 'API key generated successfully',
            data: {
                id: result.insertId,
                api_key: apiKey,
                key_name: key_name || 'My API Key',
                tier: selectedTier,
                created_at: new Date()
            }
        });
    } catch (error) {
        console.error('Generate API Key Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate API key'
        });
    }
};

/**
 * Get user's API keys
 */
exports.getUserApiKeys = async (req, res) => {
    try {
        const userId = req.user.id_user;

        const [keys] = await db.query(
            `SELECT id, api_key, key_name, tier, is_active, requests_today, 
              last_request_date, created_at, revoked_at
       FROM api_keys 
       WHERE id_user = ?
       ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            count: keys.length,
            data: keys
        });
    } catch (error) {
        console.error('Get API Keys Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch API keys'
        });
    }
};

/**
 * Get all API keys (Admin only)
 */
exports.getAllApiKeys = async (req, res) => {
    try {
        const [keys] = await db.query(
            `SELECT k.*, u.nama as user_name, u.email as user_email
       FROM api_keys k
       JOIN users u ON k.id_user = u.id_user
       ORDER BY k.created_at DESC`
        );

        res.json({
            success: true,
            count: keys.length,
            data: keys
        });
    } catch (error) {
        console.error('Get All API Keys Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch API keys'
        });
    }
};

/**
 * Revoke API key
 */
exports.revokeApiKey = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id_user;
        const isAdmin = req.user.role === 'admin';

        // Check if key exists and belongs to user (or user is admin)
        let query = 'SELECT * FROM api_keys WHERE id = ?';
        const params = [id];

        if (!isAdmin) {
            query += ' AND id_user = ?';
            params.push(userId);
        }

        const [keys] = await db.query(query, params);

        if (keys.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'API key not found'
            });
        }

        // Revoke key
        await db.query(
            'UPDATE api_keys SET is_active = FALSE, revoked_at = NOW() WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'API key revoked successfully'
        });
    } catch (error) {
        console.error('Revoke API Key Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to revoke API key'
        });
    }
};

/**
 * Delete API key
 */
exports.deleteApiKey = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id_user;
        const isAdmin = req.user.role === 'admin';

        let query = 'DELETE FROM api_keys WHERE id = ?';
        const params = [id];

        if (!isAdmin) {
            query += ' AND id_user = ?';
            params.push(userId);
        }

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'API key not found'
            });
        }

        res.json({
            success: true,
            message: 'API key deleted successfully'
        });
    } catch (error) {
        console.error('Delete API Key Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete API key'
        });
    }
};

/**
 * Get API key usage statistics
 */
exports.getApiKeyUsage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id_user;
        const isAdmin = req.user.role === 'admin';

        // Check if key exists and belongs to user
        let query = 'SELECT * FROM api_keys WHERE id = ?';
        const params = [id];

        if (!isAdmin) {
            query += ' AND id_user = ?';
            params.push(userId);
        }

        const [keys] = await db.query(query, params);

        if (keys.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'API key not found'
            });
        }

        const keyData = keys[0];

        // Get usage logs
        const [logs] = await db.query(
            `SELECT endpoint, method, status_code, COUNT(*) as count
       FROM api_usage_logs
       WHERE api_key_id = ?
       GROUP BY endpoint, method, status_code
       ORDER BY count DESC`,
            [id]
        );

        // Get daily usage for last 7 days
        const [dailyUsage] = await db.query(
            `SELECT DATE(request_date) as date, COUNT(*) as requests
       FROM api_usage_logs
       WHERE api_key_id = ? AND request_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(request_date)
       ORDER BY date DESC`,
            [id]
        );

        // Get total requests
        const [total] = await db.query(
            'SELECT COUNT(*) as total_requests FROM api_usage_logs WHERE api_key_id = ?',
            [id]
        );

        res.json({
            success: true,
            data: {
                key_info: {
                    id: keyData.id,
                    key_name: keyData.key_name,
                    tier: keyData.tier,
                    requests_today: keyData.requests_today,
                    is_active: keyData.is_active
                },
                total_requests: total[0].total_requests,
                daily_usage: dailyUsage,
                endpoint_usage: logs
            }
        });
    } catch (error) {
        console.error('Get Usage Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch usage statistics'
        });
    }
};
