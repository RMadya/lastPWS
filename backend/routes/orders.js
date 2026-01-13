const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateJWT = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const { authenticateAPIKey } = require('../middleware/apiKeyAuth');

// Middleware to allow both JWT and API Key authentication
const dualAuth = (req, res, next) => {
    const hasJWT = req.headers.authorization;
    const hasAPIKey = req.headers['x-api-key'];

    if (hasJWT) {
        return authenticateJWT(req, res, next);
    } else if (hasAPIKey) {
        return authenticateAPIKey(req, res, next);
    } else {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Provide either JWT token or API key.'
        });
    }
};

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', dualAuth, orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/stats:
 *   get:
 *     summary: Get order statistics (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics
 */
router.get('/stats', authenticateJWT, requireAdmin, orderController.getOrderStats);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:id', dualAuth, orderController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_coffee
 *               - quantity
 *             properties:
 *               id_coffee:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               ukuran:
 *                 type: string
 *                 enum: [reguler, large]
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', dualAuth, orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [menunggu, diproses, selesai, dibatalkan]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/:id', authenticateJWT, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
