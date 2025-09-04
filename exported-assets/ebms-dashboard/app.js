// Sample data from the provided JSON
const sampleData = {
  "users": {
    "admin": [
      {"id": 1, "email": "admin@ebms.com", "password": "admin123", "name": "System Administrator", "role": "admin"}
    ],
    "suppliers": [
      {"id": 1, "email": "supplier1@ebms.com", "password": "supplier123", "name": "TechCorp Electronics", "role": "supplier", "rating": 4.5, "products": 25},
      {"id": 2, "email": "supplier2@ebms.com", "password": "supplier123", "name": "Fashion Forward", "role": "supplier", "rating": 4.2, "products": 18},
      {"id": 3, "email": "supplier3@ebms.com", "password": "supplier123", "name": "Home Essentials", "role": "supplier", "rating": 4.7, "products": 32}
    ],
    "customers": [
      {"id": 1, "email": "customer1@ebms.com", "password": "customer123", "name": "John Smith", "role": "customer", "wallet_balance": 1500.00, "orders": 12},
      {"id": 2, "email": "customer2@ebms.com", "password": "customer123", "name": "Sarah Johnson", "role": "customer", "wallet_balance": 850.50, "orders": 8},
      {"id": 3, "email": "customer3@ebms.com", "password": "customer123", "name": "Mike Davis", "role": "customer", "wallet_balance": 2200.75, "orders": 15}
    ],
    "delivery_agents": [
      {"id": 1, "email": "agent1@ebms.com", "password": "agent123", "name": "Alex Rodriguez", "role": "delivery_agent", "rating": 4.8, "deliveries": 145, "availability": true},
      {"id": 2, "email": "agent2@ebms.com", "password": "agent123", "name": "Maria Garcia", "role": "delivery_agent", "rating": 4.6, "deliveries": 132, "availability": false},
      {"id": 3, "email": "agent3@ebms.com", "password": "agent123", "name": "James Wilson", "role": "delivery_agent", "rating": 4.9, "deliveries": 189, "availability": true}
    ]
  },
  "products": [
    {"id": 1, "name": "iPhone 15 Pro", "price": 999.99, "category": "Electronics", "supplier_id": 1, "stock": 25, "rating": 4.5, "description": "Latest Apple smartphone with advanced features"},
    {"id": 2, "name": "Samsung Galaxy S24", "price": 899.99, "category": "Electronics", "supplier_id": 1, "stock": 18, "rating": 4.3, "description": "Premium Android smartphone"},
    {"id": 3, "name": "Designer Jeans", "price": 129.99, "category": "Fashion", "supplier_id": 2, "stock": 45, "rating": 4.1, "description": "Premium denim jeans"},
    {"id": 4, "name": "Wireless Headphones", "price": 199.99, "category": "Electronics", "supplier_id": 1, "stock": 32, "rating": 4.7, "description": "High-quality wireless audio"},
    {"id": 5, "name": "Coffee Maker", "price": 89.99, "category": "Home", "supplier_id": 3, "stock": 15, "rating": 4.2, "description": "Programmable coffee machine"},
    {"id": 6, "name": "Laptop Stand", "price": 49.99, "category": "Electronics", "supplier_id": 1, "stock": 28, "rating": 4.4, "description": "Ergonomic laptop stand"},
    {"id": 7, "name": "Running Shoes", "price": 159.99, "category": "Fashion", "supplier_id": 2, "stock": 22, "rating": 4.6, "description": "Professional running shoes"},
    {"id": 8, "name": "Smart Watch", "price": 299.99, "category": "Electronics", "supplier_id": 1, "stock": 12, "rating": 4.8, "description": "Advanced fitness tracking"},
    {"id": 9, "name": "Kitchen Mixer", "price": 199.99, "category": "Home", "supplier_id": 3, "stock": 8, "rating": 4.3, "description": "Professional kitchen mixer"},
    {"id": 10, "name": "Backpack", "price": 79.99, "category": "Fashion", "supplier_id": 2, "stock": 35, "rating": 4.2, "description": "Durable travel backpack"}
  ],
  "orders": [
    {"id": 1, "customer_id": 1, "delivery_agent_id": 1, "total": 1199.98, "status": "delivered", "date": "2024-12-15", "items": [{"product_id": 1, "quantity": 1}, {"product_id": 4, "quantity": 1}]},
    {"id": 2, "customer_id": 2, "delivery_agent_id": 2, "total": 289.98, "status": "in_transit", "date": "2024-12-20", "items": [{"product_id": 3, "quantity": 1}, {"product_id": 7, "quantity": 1}]},
    {"id": 3, "customer_id": 3, "delivery_agent_id": 1, "total": 649.97, "status": "processing", "date": "2024-12-22", "items": [{"product_id": 8, "quantity": 1}, {"product_id": 5, "quantity": 2}]},
    {"id": 4, "customer_id": 1, "delivery_agent_id": 3, "total": 129.98, "status": "delivered", "date": "2024-12-18", "items": [{"product_id": 6, "quantity": 1}, {"product_id": 10, "quantity": 1}]}
  ],
  "analytics": {
    "monthly_revenue": [
      {"month": "Jan", "revenue": 45000, "orders": 120},
      {"month": "Feb", "revenue": 52000, "orders": 135},
      {"month": "Mar", "revenue": 48000, "orders": 128},
      {"month": "Apr", "revenue": 61000, "orders": 155},
      {"month": "May", "revenue": 58000, "orders": 148},
      {"month": "Jun", "revenue": 67000, "orders": 172},
      {"month": "Jul", "revenue": 71000, "orders": 185},
      {"month": "Aug", "revenue": 69000, "orders": 178},
      {"month": "Sep", "revenue": 74000, "orders": 192},
      {"month": "Oct", "revenue": 78000, "orders": 201},
      {"month": "Nov", "revenue": 82000, "orders": 215},
      {"month": "Dec", "revenue": 89000, "orders": 235}
    ],
    "top_categories": [
      {"category": "Electronics", "sales": 45000, "percentage": 35},
      {"category": "Fashion", "sales": 32000, "percentage": 28},
      {"category": "Home", "sales": 28000, "percentage": 22},
      {"category": "Sports", "sales": 15000, "percentage": 15}
    ]
  }
};

// Application state
let currentUser = null;
let cart = [];
let filteredProducts = [...sampleData.products];

// Navigation menus for different roles
const navigationMenus = {
  admin: [
    { name: 'Dashboard', id: 'admin-dashboard', active: true },
    { name: 'Analytics', id: 'admin-dashboard', active: false },
    { name: 'User Management', id: 'admin-dashboard', active: false },
    { name: 'System Settings', id: 'admin-dashboard', active: false }
  ],
  supplier: [
    { name: 'Dashboard', id: 'supplier-dashboard', active: true },
    { name: 'Products', id: 'supplier-dashboard', active: false },
    { name: 'Orders', id: 'supplier-dashboard', active: false },
    { name: 'Analytics', id: 'supplier-dashboard', active: false }
  ],
  customer: [
    { name: 'Dashboard', id: 'customer-dashboard', active: true },
    { name: 'Products', id: 'customer-dashboard', active: false },
    { name: 'Orders', id: 'customer-dashboard', active: false },
    { name: 'Wallet', id: 'customer-dashboard', active: false }
  ],
  delivery_agent: [
    { name: 'Dashboard', id: 'delivery-dashboard', active: true },
    { name: 'Deliveries', id: 'delivery-dashboard', active: false },
    { name: 'Performance', id: 'delivery-dashboard', active: false },
    { name: 'Earnings', id: 'delivery-dashboard', active: false }
  ]
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    setupEventListeners();
    showLoginPage();
});

// Event listeners setup
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener added');
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Logout button listener added');
    }
    
    // Cart modal events
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const closeCart2 = document.getElementById('close-cart-2');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cartBtn) cartBtn.addEventListener('click', showCartModal);
    if (closeCart) closeCart.addEventListener('click', hideCartModal);
    if (closeCart2) closeCart2.addEventListener('click', hideCartModal);
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
    
    // Product modal events
    const addProductBtn = document.getElementById('add-product-btn');
    const closeProductModal = document.getElementById('close-product-modal');
    const cancelProduct = document.getElementById('cancel-product');
    const productForm = document.getElementById('product-form');
    
    if (addProductBtn) addProductBtn.addEventListener('click', showProductModal);
    if (closeProductModal) closeProductModal.addEventListener('click', hideProductModal);
    if (cancelProduct) cancelProduct.addEventListener('click', hideProductModal);
    if (productForm) productForm.addEventListener('submit', handleProductSubmit);
    
    // Search and filter events
    const productSearch = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (productSearch) productSearch.addEventListener('input', handleProductSearch);
    if (categoryFilter) categoryFilter.addEventListener('change', handleCategoryFilter);
    
    console.log('All event listeners set up');
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const roleSelect = document.getElementById('user-role');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!roleSelect || !emailInput || !passwordInput) {
        console.error('Form elements not found');
        return;
    }
    
    const role = roleSelect.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    
    console.log('Login attempt:', { role, email });
    
    if (!role) {
        showLoginError('Please select a user role');
        return;
    }
    
    if (!email || !password) {
        showLoginError('Please enter email and password');
        return;
    }
    
    const user = authenticateUser(role, email, password);
    if (user) {
        console.log('User authenticated:', user);
        currentUser = user;
        showApp();
        loadDashboard();
    } else {
        console.log('Authentication failed');
        showLoginError('Invalid credentials. Please try again.');
    }
}

function authenticateUser(role, email, password) {
    console.log('Authenticating user with role:', role);
    
    // Map role to the correct data structure
    let users;
    if (role === 'admin') {
        users = sampleData.users.admin;
    } else if (role === 'supplier') {
        users = sampleData.users.suppliers;
    } else if (role === 'customer') {
        users = sampleData.users.customers;
    } else if (role === 'delivery_agent') {
        users = sampleData.users.delivery_agents;
    }
    
    if (!users) {
        console.log('No users found for role:', role);
        return null;
    }
    
    const user = users.find(user => user.email === email && user.password === password);
    console.log('User found:', user);
    return user;
}

function showLoginError(message) {
    const loginError = document.getElementById('login-error');
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.remove('hidden');
        setTimeout(() => {
            loginError.classList.add('hidden');
        }, 5000);
    }
}

function handleLogout() {
    console.log('Logging out user');
    currentUser = null;
    cart = [];
    showLoginPage();
}

function showLoginPage() {
    console.log('Showing login page');
    const loginPage = document.getElementById('login-page');
    const app = document.getElementById('app');
    
    if (loginPage) loginPage.classList.remove('hidden');
    if (app) app.classList.add('hidden');
    
    // Reset form
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.reset();
}

function showApp() {
    console.log('Showing main app');
    const loginPage = document.getElementById('login-page');
    const app = document.getElementById('app');
    const userNameSpan = document.getElementById('user-name');
    
    if (loginPage) loginPage.classList.add('hidden');
    if (app) app.classList.remove('hidden');
    if (userNameSpan) userNameSpan.textContent = currentUser.name;
    
    setupNavigation();
}

// Navigation setup
function setupNavigation() {
    console.log('Setting up navigation for role:', currentUser.role);
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    
    const menu = navigationMenus[currentUser.role];
    navMenu.innerHTML = '';
    
    menu.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.href = '#';
        a.className = `nav-link ${item.active ? 'active' : ''}`;
        a.textContent = item.name;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Nav item clicked:', item.name);
            switchDashboard(item.id);
            updateActiveNavItem(a);
        });
        
        li.appendChild(a);
        navMenu.appendChild(li);
    });
}

function updateActiveNavItem(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function switchDashboard(dashboardId) {
    console.log('Switching to dashboard:', dashboardId);
    document.querySelectorAll('.dashboard-content').forEach(dashboard => {
        dashboard.classList.add('hidden');
    });
    
    const targetDashboard = document.getElementById(dashboardId);
    if (targetDashboard) {
        targetDashboard.classList.remove('hidden');
        console.log('Dashboard switched successfully');
    } else {
        console.error('Dashboard not found:', dashboardId);
    }
}

// Dashboard loading functions
function loadDashboard() {
    console.log('Loading dashboard for role:', currentUser.role);
    
    const roleTitle = {
        admin: 'Admin Dashboard',
        supplier: 'Supplier Dashboard', 
        customer: 'Customer Dashboard',
        delivery_agent: 'Delivery Agent Dashboard'
    };
    
    const dashboardTitle = document.getElementById('dashboard-title');
    if (dashboardTitle) {
        dashboardTitle.textContent = roleTitle[currentUser.role];
    }
    
    switch(currentUser.role) {
        case 'admin':
            loadAdminDashboard();
            break;
        case 'supplier':
            loadSupplierDashboard();
            break;
        case 'customer':
            loadCustomerDashboard();
            break;
        case 'delivery_agent':
            loadDeliveryDashboard();
            break;
    }
    
    // Show the appropriate dashboard
    const dashboardMap = {
        'admin': 'admin-dashboard',
        'supplier': 'supplier-dashboard',
        'customer': 'customer-dashboard',
        'delivery_agent': 'delivery-dashboard'
    };
    
    document.querySelectorAll('.dashboard-content').forEach(dashboard => {
        dashboard.classList.add('hidden');
    });
    
    const targetDashboard = document.getElementById(dashboardMap[currentUser.role]);
    if (targetDashboard) {
        targetDashboard.classList.remove('hidden');
        console.log('Dashboard loaded successfully');
    }
}

// Admin Dashboard
function loadAdminDashboard() {
    console.log('Loading admin dashboard');
    
    // Calculate statistics
    const totalUsers = Object.values(sampleData.users).flat().length;
    const totalOrders = sampleData.orders.length;
    const monthlyRevenue = sampleData.analytics.monthly_revenue[11].revenue; // December
    const activeSuppliers = sampleData.users.suppliers.length;
    
    // Update stat cards
    const totalUsersEl = document.getElementById('total-users');
    const totalOrdersEl = document.getElementById('total-orders');
    const monthlyRevenueEl = document.getElementById('monthly-revenue');
    const activeSuppliersEl = document.getElementById('active-suppliers');
    
    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (monthlyRevenueEl) monthlyRevenueEl.textContent = `$${monthlyRevenue.toLocaleString()}`;
    if (activeSuppliersEl) activeSuppliersEl.textContent = activeSuppliers;
    
    // Load charts and table
    setTimeout(() => {
        loadRevenueChart();
        loadCategoryChart();
        loadUsersTable();
    }, 100);
}

function loadRevenueChart() {
    const chartCanvas = document.getElementById('revenue-chart');
    if (!chartCanvas) return;
    
    try {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampleData.analytics.monthly_revenue.map(item => item.month),
                datasets: [{
                    label: 'Revenue',
                    data: sampleData.analytics.monthly_revenue.map(item => item.revenue),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
        console.log('Revenue chart loaded');
    } catch (error) {
        console.error('Error loading revenue chart:', error);
    }
}

function loadCategoryChart() {
    const chartCanvas = document.getElementById('category-chart');
    if (!chartCanvas) return;
    
    try {
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sampleData.analytics.top_categories.map(item => item.category),
                datasets: [{
                    data: sampleData.analytics.top_categories.map(item => item.percentage),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        console.log('Category chart loaded');
    } catch (error) {
        console.error('Error loading category chart:', error);
    }
}

function loadUsersTable() {
    const tbody = document.querySelector('#users-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    Object.values(sampleData.users).flat().forEach(user => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="status-badge status-${user.role.replace('_', '-')}">${user.role.replace('_', ' ')}</span></td>
            <td><span class="status-badge status-delivered">Active</span></td>
        `;
    });
    
    console.log('Users table loaded');
}

// Supplier Dashboard
function loadSupplierDashboard() {
    console.log('Loading supplier dashboard');
    
    const supplierProducts = sampleData.products.filter(p => p.supplier_id === currentUser.id);
    const totalSales = supplierProducts.reduce((sum, p) => sum + (p.price * (50 - p.stock)), 0);
    
    const supplierProductsEl = document.getElementById('supplier-products');
    const supplierSalesEl = document.getElementById('supplier-sales');
    const supplierRatingEl = document.getElementById('supplier-rating');
    const supplierOrdersEl = document.getElementById('supplier-orders');
    
    if (supplierProductsEl) supplierProductsEl.textContent = supplierProducts.length;
    if (supplierSalesEl) supplierSalesEl.textContent = `$${totalSales.toLocaleString()}`;
    if (supplierRatingEl) supplierRatingEl.textContent = currentUser.rating + '★';
    if (supplierOrdersEl) supplierOrdersEl.textContent = currentUser.products || 0;
    
    loadProductsTable();
}

function loadProductsTable() {
    const tbody = document.querySelector('#products-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const supplierProducts = sampleData.products.filter(p => p.supplier_id === currentUser.id);
    
    supplierProducts.forEach(product => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.rating}★</td>
            <td>
                <button class="btn btn--secondary btn--sm" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn--outline btn--sm" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
    });
}

// Customer Dashboard
function loadCustomerDashboard() {
    console.log('Loading customer dashboard');
    
    const walletBalanceEl = document.getElementById('wallet-balance');
    if (walletBalanceEl) {
        walletBalanceEl.textContent = `$${currentUser.wallet_balance.toFixed(2)}`;
    }
    
    updateCartCount();
    loadProductsGrid();
    loadCustomerOrders();
}

function loadProductsGrid() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-meta">
                <span>Stock: ${product.stock}</span>
                <span class="product-rating">${product.rating}★</span>
            </div>
            <div class="product-actions">
                <button class="btn btn--primary btn--sm" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn btn--secondary btn--sm" onclick="addToWishlist(${product.id})">♡</button>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

function loadCustomerOrders() {
    const tbody = document.querySelector('#customer-orders-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const customerOrders = sampleData.orders.filter(o => o.customer_id === currentUser.id);
    
    customerOrders.forEach(order => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.date}</td>
            <td>$${order.total}</td>
            <td><span class="status-badge status-${order.status}">${order.status.replace('_', ' ')}</span></td>
            <td><button class="btn btn--secondary btn--sm" onclick="trackOrder(${order.id})">Track</button></td>
        `;
    });
}

// Delivery Agent Dashboard  
function loadDeliveryDashboard() {
    console.log('Loading delivery agent dashboard');
    
    const agentDeliveriesEl = document.getElementById('agent-deliveries');
    const agentRatingEl = document.getElementById('agent-rating');
    const agentEarningsEl = document.getElementById('agent-earnings');
    const agentStatusEl = document.getElementById('agent-status');
    
    if (agentDeliveriesEl) agentDeliveriesEl.textContent = currentUser.deliveries;
    if (agentRatingEl) agentRatingEl.textContent = currentUser.rating + '★';
    if (agentEarningsEl) agentEarningsEl.textContent = '$' + (currentUser.deliveries * 15).toLocaleString();
    if (agentStatusEl) agentStatusEl.textContent = currentUser.availability ? 'Available' : 'Busy';
    
    loadDeliveriesTable();
}

function loadDeliveriesTable() {
    const tbody = document.querySelector('#deliveries-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const agentDeliveries = sampleData.orders.filter(o => o.delivery_agent_id === currentUser.id);
    
    agentDeliveries.forEach(order => {
        const customer = Object.values(sampleData.users).flat().find(u => u.id === order.customer_id);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${customer ? customer.name : 'Unknown'}</td>
            <td>$${order.total}</td>
            <td><span class="status-badge status-${order.status}">${order.status.replace('_', ' ')}</span></td>
            <td>
                <button class="btn btn--primary btn--sm" onclick="updateDeliveryStatus(${order.id})">Update</button>
            </td>
        `;
    });
}

// Cart functionality
function addToCart(productId) {
    const product = sampleData.products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }
    
    updateCartCount();
    showNotification('Product added to cart!');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

function showCartModal() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    
    if (!modal || !cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">$${item.product.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                <button class="quantity-btn" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
        total += item.product.price * item.quantity;
    });
    
    const cartTotalEl = document.getElementById('cart-total');
    if (cartTotalEl) {
        cartTotalEl.textContent = total.toFixed(2);
    }
    
    modal.classList.remove('hidden');
}

function hideCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    showCartModal(); // Refresh modal
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    showCartModal(); // Refresh modal
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    if (total > currentUser.wallet_balance) {
        showNotification('Insufficient wallet balance!');
        return;
    }
    
    // Simulate order processing
    currentUser.wallet_balance -= total;
    cart = [];
    updateCartCount();
    hideCartModal();
    
    const walletBalanceEl = document.getElementById('wallet-balance');
    if (walletBalanceEl) {
        walletBalanceEl.textContent = `$${currentUser.wallet_balance.toFixed(2)}`;
    }
    
    showNotification('Order placed successfully!');
}

// Product management
function showProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const form = document.getElementById('product-form');
        if (form) form.reset();
    }
}

function hideProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const newProduct = {
        id: sampleData.products.length + 1,
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        stock: parseInt(document.getElementById('product-stock').value),
        description: document.getElementById('product-description').value,
        supplier_id: currentUser.id,
        rating: 4.0
    };
    
    sampleData.products.push(newProduct);
    loadProductsTable();
    hideProductModal();
    showNotification('Product added successfully!');
}

// Search and filter
function handleProductSearch(e) {
    filterProducts();
}

function handleCategoryFilter(e) {
    filterProducts();
}

function filterProducts() {
    const searchInput = document.getElementById('product-search');
    const categorySelect = document.getElementById('category-filter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categorySelect ? categorySelect.value : '';
    
    filteredProducts = sampleData.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    loadProductsGrid();
}

// Utility functions
function showNotification(message) {
    alert(message);
}

function editProduct(productId) {
    showNotification('Edit functionality would be implemented here');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = sampleData.products.findIndex(p => p.id === productId);
        if (index > -1) {
            sampleData.products.splice(index, 1);
            loadProductsTable();
            showNotification('Product deleted successfully!');
        }
    }
}

function trackOrder(orderId) {
    showNotification(`Tracking order #${orderId}`);
}

function updateDeliveryStatus(orderId) {
    showNotification(`Update delivery status for order #${orderId}`);
}

function addToWishlist(productId) {
    showNotification('Product added to wishlist!');
}