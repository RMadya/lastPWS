const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const authenticateJWT = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/keys/generate:
 *   post:
 *     summary: Generate new API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key_name:
 *                 type: string
 *               tier:
 *                 type: string
 *                 enum: [free, premium]
 *     responses:
 *       201:
 *         description: API key generated
 */
router.post('/generate', authenticateJWT, apiKeyController.generateApiKey);

/**
 * @swagger
 * /api/keys:
 *   get:
 *     summary: Get user's API keys
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 */
router.get('/', authenticateJWT, apiKeyController.getUserApiKeys);

/**
 * @swagger
 * /api/keys/all:
 *   get:
 *     summary: Get all API keys (Admin only)
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all API keys
 */
router.get('/all', authenticateJWT, requireAdmin, apiKeyController.getAllApiKeys);

/**
 * @swagger
 * /api/keys/{id}/usage:
 *   get:
 *     summary: Get API key usage statistics
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usage statistics
 */
router.get('/:id/usage', authenticateJWT, apiKeyController.getApiKeyUsage);

/**
 * @swagger
 * /api/keys/{id}/revoke:
 *   put:
 *     summary: Revoke API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: API key revoked
 */
router.put('/:id/revoke', authenticateJWT, apiKeyController.revokeApiKey);

/**
 * @swagger
 * /api/keys/{id}:
 *   delete:
 *     summary: Delete API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: API key deleted
 */
router.delete('/:id', authenticateJWT, apiKeyController.deleteApiKey);

module.exports = router;
