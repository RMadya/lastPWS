const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

/**
 * Register new user
 */
exports.register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        // Validation
        if (!nama || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if email already exists
        const [existingUsers] = await db.query(
            'SELECT id_user FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
            [nama, email, hashedPassword, 'user']
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id_user: result.insertId,
                nama,
                email,
                role: 'user'
            }
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

