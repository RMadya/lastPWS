const db = require('../config/database');

/**
 * Get all coffees
 */
exports.getAllCoffees = async (req, res) => {
    try {
        const { kategori, search } = req.query;

        let query = 'SELECT * FROM coffees WHERE 1=1';
        const params = [];

        // Filter by category
        if (kategori) {
            query += ' AND kategori = ?';
            params.push(kategori);
        }

        // Search by name
        if (search) {
            query += ' AND nama_coffee LIKE ?';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const [coffees] = await db.query(query, params);

        res.json({
            success: true,
            count: coffees.length,
            data: coffees
        });
    } catch (error) {
        console.error('Get Coffees Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coffees'
        });
    }
};

/**
 * Get coffee by ID
 */
exports.getCoffeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const [coffees] = await db.query(
            'SELECT * FROM coffees WHERE id_coffee = ?',
            [id]
        );

        if (coffees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Coffee not found'
            });
        }

        res.json({
            success: true,
            data: coffees[0]
        });
    } catch (error) {
        console.error('Get Coffee Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coffee'
        });
    }
};

/**
 * Create new coffee (Admin only)
 */
exports.createCoffee = async (req, res) => {
    try {
        const { nama_coffee, deskripsi, harga, stok, kategori, gambar_url } = req.body;

        // Validation
        if (!nama_coffee || !harga) {
            return res.status(400).json({
                success: false,
                message: 'Coffee name and price are required'
            });
        }

        const [result] = await db.query(
            `INSERT INTO coffees (nama_coffee, deskripsi, harga, stok, kategori, gambar_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [nama_coffee, deskripsi, harga, stok || 0, kategori, gambar_url]
        );

        res.status(201).json({
            success: true,
            message: 'Coffee created successfully',
            data: {
                id_coffee: result.insertId,
                nama_coffee,
                deskripsi,
                harga,
                stok: stok || 0,
                kategori,
                gambar_url
            }
        });
    } catch (error) {
        console.error('Create Coffee Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create coffee'
        });
    }
};

/**
 * Update coffee (Admin only)
 */
exports.updateCoffee = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_coffee, deskripsi, harga, stok, kategori, gambar_url } = req.body;

        // Check if coffee exists
        const [existing] = await db.query(
            'SELECT id_coffee FROM coffees WHERE id_coffee = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Coffee not found'
            });
        }

        await db.query(
            `UPDATE coffees 
       SET nama_coffee = ?, deskripsi = ?, harga = ?, stok = ?, kategori = ?, gambar_url = ?
       WHERE id_coffee = ?`,
            [nama_coffee, deskripsi, harga, stok, kategori, gambar_url, id]
        );

        res.json({
            success: true,
            message: 'Coffee updated successfully'
        });
    } catch (error) {
        console.error('Update Coffee Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update coffee'
        });
    }
};

/**
 * Delete coffee (Admin only)
 */
exports.deleteCoffee = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM coffees WHERE id_coffee = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Coffee not found'
            });
        }

        res.json({
            success: true,
            message: 'Coffee deleted successfully'
        });
    } catch (error) {
        console.error('Delete Coffee Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete coffee'
        });
    }
};

/**
 * Get coffee categories
 */
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT DISTINCT kategori FROM coffees WHERE kategori IS NOT NULL ORDER BY kategori'
        );

        res.json({
            success: true,
            data: categories.map(c => c.kategori)
        });
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
};
