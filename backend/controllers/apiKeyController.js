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

