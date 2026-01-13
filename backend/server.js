const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const coffeeRoutes = require('./routes/coffees');
const orderRoutes = require('./routes/orders');
const apiKeyRoutes = require('./routes/apiKeys');
const userRoutes = require('./routes/users');

// Import Swagger
const { specs, swaggerUi } = require('./swagger/swagger');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BeanByte API Documentation'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coffees', coffeeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to BeanByte Open API',
        version: '1.0.0',
        documentation: `http://localhost:${PORT}/api/docs`,
        endpoints: {
            auth: '/api/auth',
            coffees: '/api/coffees',
            orders: '/api/orders',
            apiKeys: '/api/keys',
            users: '/api/users'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║                                                        ║');
    console.log('║           🚀 BeanByte Open API Server 🚀              ║');
    console.log('║                                                        ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║  Server running on: http://localhost:${PORT}             ║`);
    console.log(`║  API Documentation: http://localhost:${PORT}/api/docs    ║`);
    console.log('║                                                        ║');
    console.log('║  Endpoints:                                            ║');
    console.log('║  • Authentication: /api/auth                           ║');
    console.log('║  • Coffees:        /api/coffees                        ║');
    console.log('║  • Orders:         /api/orders                         ║');
    console.log('║  • API Keys:       /api/keys                           ║');
    console.log('║  • Users:          /api/users                          ║');
    console.log('║                                                        ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
});

module.exports = app;
