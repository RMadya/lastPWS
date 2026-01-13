const db = require('../config/database');

/**
 * Get all users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id_user, nama, email, role, created_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

/**
 * Get user by ID (Admin only)
 */
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query(
            'SELECT id_user, nama, email, role, created_at FROM users WHERE id_user = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's order count
        const [orderCount] = await db.query(
            'SELECT COUNT(*) as total_orders, SUM(total_price) as total_spent FROM orders WHERE id_user = ?',
            [id]
        );

        // Get user's API keys count
        const [keyCount] = await db.query(
            'SELECT COUNT(*) as total_keys FROM api_keys WHERE id_user = ?',
            [id]
        );

        res.json({
            success: true,
            data: {
                ...users[0],
                stats: {
                    total_orders: orderCount[0].total_orders || 0,
                    total_spent: orderCount[0].total_spent || 0,
                    total_api_keys: keyCount[0].total_keys || 0
                }
            }
        });
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};

/**
 * Update user role (Admin only)
 */
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Valid values: user, admin'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET role = ? WHERE id_user = ?',
            [role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully'
        });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};

/**
 * Delete user (Admin only)
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (parseInt(id) === req.user.id_user) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const [result] = await db.query(
            'DELETE FROM users WHERE id_user = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};
