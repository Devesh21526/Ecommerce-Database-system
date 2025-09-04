# E-Business Management System - Backend Implementation Guide

## Overview

This guide provides comprehensive instructions for implementing a modern Node.js backend API that integrates with your existing EBMS MySQL database schema. The backend will serve the frontend web application with secure, role-based authentication and full CRUD operations.

## Architecture

The backend follows a modular architecture with clear separation of concerns:

- **Controllers**: Handle business logic for each user role
- **Models**: Define database interactions and data validation
- **Middleware**: Handle authentication, authorization, and validation
- **Routes**: Define API endpoints and route handlers
- **Config**: Manage database connections and environment settings

## Database Configuration

### Connection Pool Setup (config/database.js)

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'EBMS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

module.exports = pool;
```

### Environment Configuration (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=EBMS

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Authentication System

### JWT Configuration (config/auth.js)

```javascript
require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'fallback_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
```

### Authentication Middleware (middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        req.user = decoded;
        next();
    });
};

module.exports = { authenticateToken };
```

### Role-Based Access Control (middleware/roleCheck.js)

```javascript
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

module.exports = { checkRole };
```

## API Controllers

### Authentication Controller (controllers/authController.js)

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const authConfig = require('../config/auth');

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and role are required'
            });
        }

        // Determine table based on role
        let table, userIdField;
        switch (role) {
            case 'admin':
                table = 'admin';
                userIdField = 'adminID';
                break;
            case 'supplier':
                table = 'supplier';
                userIdField = 'supplierID';
                break;
            case 'customer':
                table = 'customer';
                userIdField = 'customerID';
                break;
            case 'delivery_agent':
                table = 'delivery_agent';
                userIdField = 'daID';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role'
                });
        }

        // Query user from appropriate table
        const [users] = await pool.execute(
            `SELECT ${userIdField} as id, first_name, middle_initial, last_name, email, pwd FROM ${table} WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.pwd);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: role,
                name: `${user.first_name} ${user.middle_initial || ''} ${user.last_name || ''}`.trim()
            },
            authConfig.secret,
            { expiresIn: authConfig.expiresIn }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.middle_initial || ''} ${user.last_name || ''}`.trim(),
                role: role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = { login };
```

### Admin Controller (controllers/adminController.js)

```javascript
const pool = require('../config/database');

const getDashboardStats = async (req, res) => {
    try {
        // Get system statistics
        const [customerCount] = await pool.execute('SELECT COUNT(*) as count FROM customer');
        const [supplierCount] = await pool.execute('SELECT COUNT(*) as count FROM supplier');
        const [daCount] = await pool.execute('SELECT COUNT(*) as count FROM delivery_agent');
        const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');

        // Get monthly revenue data
        const [revenueData] = await pool.execute(`
            SELECT 
                YEAR(order_date) AS year,
                MONTH(order_date) AS month,
                COUNT(orders.orderID) AS order_count,
                SUM(price * order_product.quantity) AS revenue
            FROM orders
            JOIN order_product ON orders.orderID = order_product.orderID
            JOIN product ON order_product.productID = product.productID
            WHERE order_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY YEAR(order_date), MONTH(order_date)
            ORDER BY year DESC, month DESC
        `);

        // Get top products
        const [topProducts] = await pool.execute(`
            SELECT 
                p.productID, 
                p.name, 
                p.price, 
                SUM(op.quantity) AS total_sold,
                AVG(pr.rating) AS avg_rating
            FROM product p
            LEFT JOIN order_product op ON p.productID = op.productID
            LEFT JOIN product_review pr ON p.productID = pr.productID
            GROUP BY p.productID
            ORDER BY total_sold DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            data: {
                stats: {
                    customers: customerCount[0].count,
                    suppliers: supplierCount[0].count,
                    delivery_agents: daCount[0].count,
                    orders: orderCount[0].count
                },
                revenue_data: revenueData,
                top_products: topProducts
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const { role } = req.params;
        let table, idField;

        switch (role) {
            case 'customers':
                table = 'customer';
                idField = 'customerID';
                break;
            case 'suppliers':
                table = 'supplier';
                idField = 'supplierID';
                break;
            case 'delivery_agents':
                table = 'delivery_agent';
                idField = 'daID';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user role'
                });
        }

        const [users] = await pool.execute(
            `SELECT ${idField} as id, first_name, middle_initial, last_name, email FROM ${table}`
        );

        res.json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
};

module.exports = {
    getDashboardStats,
    getUsers
};
```

### Customer Controller (controllers/customerController.js)

```javascript
const pool = require('../config/database');

const getProducts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 12 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                p.productID, 
                p.name, 
                p.price, 
                p.quantity,
                p.product_description,
                AVG(pr.rating) AS avg_rating,
                COUNT(pr.rating) AS review_count,
                CONCAT(s.first_name, ' ', s.last_name) AS supplier_name
            FROM product p
            LEFT JOIN product_review pr ON p.productID = pr.productID
            LEFT JOIN supplier s ON p.supplierID = s.supplierID
        `;

        const conditions = [];
        const params = [];

        if (search) {
            conditions.push('p.name LIKE ?');
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` 
            GROUP BY p.productID
            ORDER BY p.name ASC
            LIMIT ? OFFSET ?
        `;

        params.push(parseInt(limit), parseInt(offset));

        const [products] = await pool.execute(query, params);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products'
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productID, quantity = 1 } = req.body;
        const customerID = req.user.id;

        // Check if product exists and has sufficient stock
        const [products] = await pool.execute(
            'SELECT quantity FROM product WHERE productID = ?',
            [productID]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (products[0].quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Check if item already in cart
        const [existingItems] = await pool.execute(
            'SELECT quantity FROM cart WHERE customerID = ? AND productID = ?',
            [customerID, productID]
        );

        if (existingItems.length > 0) {
            // Update quantity
            await pool.execute(
                'UPDATE cart SET quantity = quantity + ? WHERE customerID = ? AND productID = ?',
                [quantity, customerID, productID]
            );
        } else {
            // Add new item
            await pool.execute(
                'INSERT INTO cart (customerID, productID, quantity) VALUES (?, ?, ?)',
                [customerID, productID, quantity]
            );
        }

        res.json({
            success: true,
            message: 'Product added to cart'
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding product to cart'
        });
    }
};

const getCart = async (req, res) => {
    try {
        const customerID = req.user.id;

        const [cartItems] = await pool.execute(`
            SELECT 
                c.productID,
                c.quantity,
                p.name,
                p.price,
                (c.quantity * p.price) AS total_price
            FROM cart c
            JOIN product p ON c.productID = p.productID
            WHERE c.customerID = ?
        `, [customerID]);

        const totalAmount = cartItems.reduce((sum, item) => sum + item.total_price, 0);

        res.json({
            success: true,
            data: {
                items: cartItems,
                total_amount: totalAmount,
                total_items: cartItems.length
            }
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
};

const placeOrder = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const customerID = req.user.id;

        // Get cart items
        const [cartItems] = await connection.execute(`
            SELECT c.productID, c.quantity, p.price
            FROM cart c
            JOIN product p ON c.productID = p.productID
            WHERE c.customerID = ?
        `, [customerID]);

        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Get available delivery agent
        const [agents] = await connection.execute(
            'SELECT daID FROM delivery_agent WHERE availability = 1 ORDER BY daID ASC LIMIT 1'
        );

        if (agents.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'No delivery agents available'
            });
        }

        const daID = agents[0].daID;

        // Create order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (customerID, daID, order_date) VALUES (?, ?, CURDATE())',
            [customerID, daID]
        );

        const orderID = orderResult.insertId;

        // Add order items
        for (const item of cartItems) {
            await connection.execute(
                'INSERT INTO order_product (orderID, productID, quantity) VALUES (?, ?, ?)',
                [orderID, item.productID, item.quantity]
            );

            // Update product stock
            await connection.execute(
                'UPDATE product SET quantity = quantity - ? WHERE productID = ?',
                [item.quantity, item.productID]
            );
        }

        // Clear cart
        await connection.execute('DELETE FROM cart WHERE customerID = ?', [customerID]);

        // Update delivery agent availability
        await connection.execute(
            'UPDATE delivery_agent SET availability = 0 WHERE daID = ?',
            [daID]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Order placed successfully',
            order_id: orderID
        });

    } catch (error) {
        await connection.rollback();
        console.error('Place order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error placing order'
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    getProducts,
    addToCart,
    getCart,
    placeOrder
};
```

## API Routes

### Main Server Setup (server.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');
const supplierRoutes = require('./routes/supplier');
const deliveryRoutes = require('./routes/delivery');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/delivery', deliveryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'EBMS API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 EBMS API server is running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
```

### Authentication Routes (routes/auth.js)

```javascript
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', login);

module.exports = router;
```

### Customer Routes (routes/customer.js)

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { 
    getProducts, 
    addToCart, 
    getCart, 
    placeOrder 
} = require('../controllers/customerController');

// Apply authentication to all customer routes
router.use(authenticateToken);
router.use(checkRole(['customer']));

/**
 * @route   GET /api/customer/products
 * @desc    Get products with search and pagination
 * @access  Private (Customer)
 */
router.get('/products', getProducts);

/**
 * @route   POST /api/customer/cart
 * @desc    Add product to cart
 * @access  Private (Customer)
 */
router.post('/cart', addToCart);

/**
 * @route   GET /api/customer/cart
 * @desc    Get customer's cart
 * @access  Private (Customer)
 */
router.get('/cart', getCart);

/**
 * @route   POST /api/customer/orders
 * @desc    Place a new order
 * @access  Private (Customer)
 */
router.post('/orders', placeOrder);

module.exports = router;
```

## Package.json Dependencies

```json
{
  "name": "ebms-backend-api",
  "version": "1.0.0",
  "description": "E-Business Management System Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}
```

## Installation and Setup Instructions

### 1. Project Setup
```bash
# Create project directory
mkdir ebms-backend-api
cd ebms-backend-api

# Initialize npm project
npm init -y

# Install dependencies
npm install express mysql2 jsonwebtoken bcryptjs cors dotenv helmet express-rate-limit express-validator

# Install development dependencies
npm install --save-dev nodemon jest
```

### 2. Database Setup
- Use your existing EBMS database schema
- Add password hashing for existing users (run migration script)
- Ensure all foreign key constraints are properly set

### 3. Environment Configuration
Create a `.env` file with your database credentials and JWT secret.

### 4. Testing the API
```bash
# Start the development server
npm run dev

# Test endpoints with curl or Postman
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ebms.com","password":"admin123","role":"admin"}'
```

## Security Best Practices

1. **Password Hashing**: All passwords should be hashed using bcrypt
2. **JWT Security**: Use strong secrets and reasonable expiration times
3. **Input Validation**: Validate and sanitize all user inputs
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **CORS**: Configure CORS properly for your frontend domain
6. **HTTPS**: Always use HTTPS in production
7. **Environment Variables**: Keep sensitive data in environment variables
8. **SQL Injection Prevention**: Use parameterized queries

## Performance Optimization

1. **Connection Pooling**: Use MySQL connection pooling
2. **Caching**: Implement Redis caching for frequently accessed data
3. **Compression**: Use gzip compression for responses
4. **Pagination**: Implement pagination for large datasets
5. **Indexing**: Ensure proper database indexing
6. **Query Optimization**: Optimize SQL queries for better performance

## Integration with Frontend

The frontend application can now connect to this backend API using the provided endpoints:

1. **Authentication**: Use `/api/auth/login` for user login
2. **Role-based Data**: Each user role has specific endpoints
3. **Real-time Updates**: Consider implementing WebSocket for real-time features
4. **Error Handling**: Implement proper error handling on the frontend
5. **Loading States**: Show loading states during API calls

This backend implementation provides a solid foundation for your EBMS frontend application with secure authentication, role-based access control, and comprehensive CRUD operations for all entities in your existing database schema.