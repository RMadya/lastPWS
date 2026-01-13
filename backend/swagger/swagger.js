const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BeanByte Open API',
            version: '1.0.0',
            description: 'Coffee Shop Management System with Open API',
            contact: {
                name: 'BeanByte Support',
                email: 'support@beanbyte.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                },
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                    description: 'Enter your API key'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id_user: { type: 'integer' },
                        nama: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Coffee: {
                    type: 'object',
                    properties: {
                        id_coffee: { type: 'integer' },
                        nama_coffee: { type: 'string' },
                        deskripsi: { type: 'string' },
                        harga: { type: 'number' },
                        stok: { type: 'integer' },
                        kategori: { type: 'string' },
                        gambar_url: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        id_order: { type: 'integer' },
                        id_user: { type: 'integer' },
                        id_coffee: { type: 'integer' },
                        quantity: { type: 'integer' },
                        ukuran: { type: 'string', enum: ['reguler', 'large'] },
                        total_price: { type: 'number' },
                        status: { type: 'string', enum: ['menunggu', 'diproses', 'selesai', 'dibatalkan'] },
                        order_date: { type: 'string', format: 'date-time' }
                    }
                },
                ApiKey: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        api_key: { type: 'string' },
                        key_name: { type: 'string' },
                        tier: { type: 'string', enum: ['free', 'premium'] },
                        is_active: { type: 'boolean' },
                        requests_today: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' }
                    }
                }
            }
        },
        tags: [
            { name: 'Authentication', description: 'User authentication endpoints' },
            { name: 'Coffees', description: 'Coffee menu management' },
            { name: 'Orders', description: 'Order management' },
            { name: 'API Keys', description: 'API key management for developers' },
            { name: 'Users', description: 'User management (Admin only)' }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
