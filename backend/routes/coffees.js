const express = require('express');
const router = express.Router();
const coffeeController = require('../controllers/coffeeController');
const authenticateJWT = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const { optionalAPIKey } = require('../middleware/apiKeyAuth');

/**
 * @swagger
 * /api/coffees:
 *   get:
 *     summary: Get all coffees
 *     tags: [Coffees]
 *     parameters:
 *       - in: query
 *         name: kategori
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of coffees
 */
router.get('/', optionalAPIKey, coffeeController.getAllCoffees);

/**
 * @swagger
 * /api/coffees/categories:
 *   get:
 *     summary: Get all coffee categories
 *     tags: [Coffees]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', coffeeController.getCategories);

/**
 * @swagger
 * /api/coffees/{id}:
 *   get:
 *     summary: Get coffee by ID
 *     tags: [Coffees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coffee details
 */
router.get('/:id', optionalAPIKey, coffeeController.getCoffeeById);

/**
 * @swagger
 * /api/coffees:
 *   post:
 *     summary: Create new coffee (Admin only)
 *     tags: [Coffees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_coffee
 *               - harga
 *             properties:
 *               nama_coffee:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: integer
 *               kategori:
 *                 type: string
 *               gambar_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Coffee created
 */
router.post('/', authenticateJWT, requireAdmin, coffeeController.createCoffee);

/**
 * @swagger
 * /api/coffees/{id}:
 *   put:
 *     summary: Update coffee (Admin only)
 *     tags: [Coffees]
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
 *         description: Coffee updated
 */
router.put('/:id', authenticateJWT, requireAdmin, coffeeController.updateCoffee);

/**
 * @swagger
 * /api/coffees/{id}:
 *   delete:
 *     summary: Delete coffee (Admin only)
 *     tags: [Coffees]
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
 *         description: Coffee deleted
 */
router.delete('/:id', authenticateJWT, requireAdmin, coffeeController.deleteCoffee);

module.exports = router;
