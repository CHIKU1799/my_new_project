from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import sqlite3
import os
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
CORS(app)

# Database setup
DATABASE = 'food_delivery.db'

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Restaurants table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS restaurants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image TEXT,
            rating REAL DEFAULT 0,
            review_count INTEGER DEFAULT 0,
            delivery_time TEXT,
            cuisine TEXT,
            distance TEXT,
            delivery_fee REAL,
            is_open BOOLEAN DEFAULT 1,
            featured BOOLEAN DEFAULT 0,
            price_range TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Menu items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            restaurant_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image TEXT,
            category TEXT,
            is_available BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
        )
    ''')
    
    # Orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            restaurant_id INTEGER,
            status TEXT DEFAULT 'confirmed',
            subtotal REAL,
            delivery_fee REAL,
            service_fee REAL,
            total REAL,
            delivery_address TEXT,
            estimated_delivery TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
        )
    ''')
    
    # Order items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            menu_item_id INTEGER,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def token_required(f):
    """Decorator to require authentication token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
    
    conn = get_db_connection()
    
    # Check if user already exists
    existing_user = conn.execute(
        'SELECT id FROM users WHERE email = ?', (data['email'],)
    ).fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({'message': 'User already exists'}), 400
    
    # Hash password and create user
    password_hash = generate_password_hash(data['password'])
    
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO users (name, email, password_hash, phone, address)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data['name'],
        data['email'],
        password_hash,
        data.get('phone', ''),
        data.get('address', '')
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM users WHERE email = ?', (data['email'],)
    ).fetchone()
    conn.close()
    
    if not user or not check_password_hash(user['password_hash'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'phone': user['phone'],
            'address': user['address']
        }
    })

# Restaurant endpoints
@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    """Get all restaurants with optional filters"""
    conn = get_db_connection()
    
    # Build query with filters
    query = 'SELECT * FROM restaurants WHERE 1=1'
    params = []
    
    # Filter by cuisine
    cuisine = request.args.get('cuisine')
    if cuisine:
        query += ' AND cuisine = ?'
        params.append(cuisine)
    
    # Filter by search term
    search = request.args.get('search')
    if search:
        query += ' AND (name LIKE ? OR cuisine LIKE ?)'
        params.extend([f'%{search}%', f'%{search}%'])
    
    # Sort options
    sort_by = request.args.get('sort', 'featured')
    if sort_by == 'rating':
        query += ' ORDER BY rating DESC'
    elif sort_by == 'distance':
        query += ' ORDER BY distance ASC'
    elif sort_by == 'delivery_fee':
        query += ' ORDER BY delivery_fee ASC'
    else:  # featured or default
        query += ' ORDER BY featured DESC, rating DESC'
    
    restaurants = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify([dict(restaurant) for restaurant in restaurants])

@app.route('/api/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    """Get restaurant details with menu"""
    conn = get_db_connection()
    
    restaurant = conn.execute(
        'SELECT * FROM restaurants WHERE id = ?', (restaurant_id,)
    ).fetchone()
    
    if not restaurant:
        conn.close()
        return jsonify({'message': 'Restaurant not found'}), 404
    
    menu_items = conn.execute(
        'SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = 1',
        (restaurant_id,)
    ).fetchall()
    
    conn.close()
    
    restaurant_data = dict(restaurant)
    restaurant_data['menu'] = [dict(item) for item in menu_items]
    
    return jsonify(restaurant_data)

# Order endpoints
@app.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user_id):
    """Create a new order"""
    data = request.get_json()
    
    required_fields = ['restaurant_id', 'items', 'subtotal', 'delivery_fee', 'service_fee', 'total']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create order
    cursor.execute('''
        INSERT INTO orders (user_id, restaurant_id, subtotal, delivery_fee, service_fee, total, delivery_address, estimated_delivery)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        current_user_id,
        data['restaurant_id'],
        data['subtotal'],
        data['delivery_fee'],
        data['service_fee'],
        data['total'],
        data.get('delivery_address', ''),
        data.get('estimated_delivery', '30-40 minutes')
    ))
    
    order_id = cursor.lastrowid
    
    # Add order items
    for item in data['items']:
        cursor.execute('''
            INSERT INTO order_items (order_id, menu_item_id, quantity, price)
            VALUES (?, ?, ?, ?)
        ''', (order_id, item['id'], item['quantity'], item['price']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Order created successfully', 'order_id': order_id}), 201

@app.route('/api/orders', methods=['GET'])
@token_required
def get_user_orders(current_user_id):
    """Get user's orders"""
    conn = get_db_connection()
    
    orders = conn.execute('''
        SELECT o.*, r.name as restaurant_name
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    ''', (current_user_id,)).fetchall()
    
    orders_data = []
    for order in orders:
        order_dict = dict(order)
        
        # Get order items
        items = conn.execute('''
            SELECT oi.*, mi.name, mi.image
            FROM order_items oi
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE oi.order_id = ?
        ''', (order['id'],)).fetchall()
        
        order_dict['items'] = [dict(item) for item in items]
        orders_data.append(order_dict)
    
    conn.close()
    return jsonify(orders_data)

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@token_required
def update_order_status(current_user_id, order_id):
    """Update order status"""
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    valid_statuses = ['confirmed', 'preparing', 'on-the-way', 'delivered', 'cancelled']
    if data['status'] not in valid_statuses:
        return jsonify({'message': 'Invalid status'}), 400
    
    conn = get_db_connection()
    
    # Verify order belongs to user
    order = conn.execute(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        (order_id, current_user_id)
    ).fetchone()
    
    if not order:
        conn.close()
        return jsonify({'message': 'Order not found'}), 404
    
    # Update status
    conn.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        (data['status'], order_id)
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Order status updated'})

# Profile endpoints
@app.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    """Get user profile"""
    conn = get_db_connection()
    user = conn.execute(
        'SELECT id, name, email, phone, address FROM users WHERE id = ?',
        (current_user_id,)
    ).fetchone()
    conn.close()
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify(dict(user))

@app.route('/api/auth/profile', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    """Update user profile"""
    data = request.get_json()
    
    conn = get_db_connection()
    
    # Build update query
    update_fields = []
    params = []
    
    for field in ['name', 'phone', 'address']:
        if field in data:
            update_fields.append(f'{field} = ?')
            params.append(data[field])
    
    if not update_fields:
        return jsonify({'message': 'No fields to update'}), 400
    
    params.append(current_user_id)
    query = f'UPDATE users SET {", ".join(update_fields)} WHERE id = ?'
    
    conn.execute(query, params)
    conn.commit()
    
    # Get updated user
    user = conn.execute(
        'SELECT id, name, email, phone, address FROM users WHERE id = ?',
        (current_user_id,)
    ).fetchone()
    
    conn.close()
    
    return jsonify(dict(user))

# Initialize database and add sample data
def seed_database():
    """Add sample data to the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if restaurants already exist
    existing = cursor.execute('SELECT COUNT(*) FROM restaurants').fetchone()[0]
    if existing > 0:
        conn.close()
        return
    
    # Sample restaurants
    restaurants = [
        (1, "Burger Palace", "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500", 
         4.5, 150, "25-35 min", "Fast Food", "2.1 km", 2.99, 1, 1, "$$"),
        (2, "Pasta Corner", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
         4.7, 203, "30-40 min", "Italian", "1.8 km", 1.99, 1, 1, "$$$"),
        (3, "Asian Fusion", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
         4.6, 89, "20-30 min", "Asian", "3.2 km", 3.99, 1, 1, "$$")
    ]
    
    cursor.executemany('''
        INSERT INTO restaurants (id, name, image, rating, review_count, delivery_time, cuisine, distance, delivery_fee, is_open, featured, price_range)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', restaurants)
    
    # Sample menu items
    menu_items = [
        (1, "Classic Burger", "Juicy beef patty with lettuce, tomato, and special sauce", 12.99, 
         "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", "Main Course"),
        (1, "Cheese Fries", "Crispy fries topped with melted cheese", 6.99,
         "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300", "Sides"),
        (2, "Spaghetti Carbonara", "Classic Italian pasta with eggs, cheese, and pancetta", 15.99,
         "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300", "Main Course"),
        (2, "Margherita Pizza", "Fresh tomato sauce, mozzarella, and basil", 18.99,
         "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300", "Pizza"),
        (3, "Chicken Teriyaki", "Grilled chicken with teriyaki glaze and steamed rice", 14.99,
         "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300", "Main Course"),
        (3, "Vegetable Fried Rice", "Wok-fried rice with mixed vegetables", 11.99,
         "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300", "Rice Dishes")
    ]
    
    cursor.executemany('''
        INSERT INTO menu_items (restaurant_id, name, description, price, image, category)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', menu_items)
    
    conn.commit()
    conn.close()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

if __name__ == '__main__':
    # Initialize database
    init_db()
    seed_database()
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)