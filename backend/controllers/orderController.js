const db = require('../config/database');

/**
 * Get all orders
 * - Users: only their orders
 * - Admins: all orders
 */
exports.getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
      SELECT o.*, u.nama as user_name, u.email as user_email, 
             c.nama_coffee, c.gambar_url as coffee_image
      FROM orders o
      JOIN users u ON o.id_user = u.id_user
      JOIN coffees c ON o.id_coffee = c.id_coffee
      WHERE 1=1
    `;
        const params = [];

        // If not admin, only show user's own orders
        if (req.user && req.user.role !== 'admin') {
            query += ' AND o.id_user = ?';
            params.push(req.user.id_user);
        } else if (req.apiKey) {
            // If using API key, show orders for that user
            query += ' AND o.id_user = ?';
            params.push(req.apiKey.id_user);
        }

        // Filter by status
        if (status) {
            query += ' AND o.status = ?';
            params.push(status);
        }

        query += ' ORDER BY o.order_date DESC';

        const [orders] = await db.query(query, params);

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

/**
 * Get order by ID
 */
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        let query = `
      SELECT o.*, u.nama as user_name, u.email as user_email,
             c.nama_coffee, c.gambar_url as coffee_image
      FROM orders o
      JOIN users u ON o.id_user = u.id_user
      JOIN coffees c ON o.id_coffee = c.id_coffee
      WHERE o.id_order = ?
    `;
        const params = [id];

        // If not admin, only allow viewing own orders
        if (req.user && req.user.role !== 'admin') {
            query += ' AND o.id_user = ?';
            params.push(req.user.id_user);
        } else if (req.apiKey) {
            query += ' AND o.id_user = ?';
            params.push(req.apiKey.id_user);
        }

        const [orders] = await db.query(query, params);

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: orders[0]
        });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
};

/**
 * Create new order
 */
exports.createOrder = async (req, res) => {
    try {
        const { id_coffee, quantity, ukuran } = req.body;

        // Get user ID from JWT or API key
        const userId = req.user ? req.user.id_user : req.apiKey.id_user;

        // Validation
        if (!id_coffee || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Coffee ID and quantity are required'
            });
        }

        // Check coffee exists and has enough stock
        const [coffees] = await db.query(
            'SELECT * FROM coffees WHERE id_coffee = ?',
            [id_coffee]
        );

        if (coffees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Coffee not found'
            });
        }

        const coffee = coffees[0];

        if (coffee.stok < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${coffee.stok}`
            });
        }

        // Calculate total price
        let total_price = coffee.harga * quantity;
        if (ukuran === 'large') {
            total_price += 5000 * quantity; // Add 5000 for large size
        }

        // Create order
        const [result] = await db.query(
            `INSERT INTO orders (id_user, id_coffee, quantity, ukuran, total_price, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, id_coffee, quantity, ukuran || 'reguler', total_price, 'menunggu']
        );

        // Update coffee stock
        await db.query(
            'UPDATE coffees SET stok = stok - ? WHERE id_coffee = ?',
            [quantity, id_coffee]
        );

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                id_order: result.insertId,
                id_coffee,
                quantity,
                ukuran: ukuran || 'reguler',
                total_price,
                status: 'menunggu'
            }
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
};

/**
 * Update order status (Admin only)
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['menunggu', 'diproses', 'selesai', 'dibatalkan'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Valid values: ' + validStatuses.join(', ')
            });
        }

        // Check if order exists
        const [existing] = await db.query(
            'SELECT * FROM orders WHERE id_order = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const order = existing[0];

        // If canceling order, restore stock
        if (status === 'dibatalkan' && order.status !== 'dibatalkan') {
            await db.query(
                'UPDATE coffees SET stok = stok + ? WHERE id_coffee = ?',
                [order.quantity, order.id_coffee]
            );
        }

        // Update order status
        await db.query(
            'UPDATE orders SET status = ? WHERE id_order = ?',
            [status, id]
        );

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Update Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};

/**
 * Get order statistics (Admin only)
 */
exports.getOrderStats = async (req, res) => {
    try {
        const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'dibatalkan' THEN 1 ELSE 0 END) as cancelled,
        SUM(total_price) as total_revenue
      FROM orders
    `);

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
};
