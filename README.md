# FoodEx - Food Delivery App

A comprehensive food delivery application built with Next.js (React) frontend and Python Flask backend, featuring a modern UI with red, black, white, and orange color scheme.

## 🚀 Features

### Frontend Features
- **Modern, Responsive Design** - Built with Tailwind CSS using the specified color scheme
- **User Authentication** - Login/Register with form validation
- **Restaurant Discovery** - Browse restaurants with search, filtering, and sorting
- **Menu Browsing** - View restaurant menus with detailed item information
- **Shopping Cart** - Add/remove items, quantity management, and cart persistence
- **Order Management** - Place orders, track order status, and view order history
- **Profile Management** - Update user profile and delivery information
- **Real-time Notifications** - Toast notifications for user actions
- **Mobile-First Design** - Fully responsive across all devices

### Backend Features
- **RESTful API** - Complete API with authentication and CRUD operations
- **JWT Authentication** - Secure user authentication with tokens
- **SQLite Database** - Lightweight database with user, restaurant, and order data
- **Order Tracking** - Real-time order status updates
- **Data Validation** - Input validation and error handling
- **CORS Support** - Cross-origin resource sharing for frontend integration

### Color Scheme
- **Primary Red** (#ef4444) - Main brand color, buttons, and highlights
- **Secondary Orange** (#f97316) - Accent color for features and CTAs
- **Dark Black** (#0f172a) - Text and dark UI elements
- **Clean White** (#ffffff) - Background and light UI elements

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with server-side rendering
- **React 18** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React Toastify** - Toast notifications
- **Axios** - HTTP client for API requests
- **React Context** - State management for cart and authentication

### Backend
- **Python Flask** - Lightweight web framework
- **SQLite** - File-based database
- **JWT** - JSON Web Tokens for authentication
- **Werkzeug** - Password hashing and security
- **Flask-CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Access the frontend:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r ../requirement.txt
   ```

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

4. **Backend API will be available at:**
   [http://localhost:5000](http://localhost:5000)

### Full Application Setup

1. **Start the backend server:**
   ```bash
   cd backend
   python app.py
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   npm run dev
   ```

3. **Access the complete application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory for frontend configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend Configuration
Update the `SECRET_KEY` in `backend/app.py` for production:

```python
app.config['SECRET_KEY'] = 'your-production-secret-key'
```

## 📱 Demo Account

For testing purposes, you can use the demo credentials:
- **Email:** demo@food.com
- **Password:** demo123

## 🎯 Usage

### For Users
1. **Register/Login** - Create an account or login with demo credentials
2. **Browse Restaurants** - Explore available restaurants and cuisines
3. **Add to Cart** - Select items and add them to your shopping cart
4. **Checkout** - Place your order with delivery information
5. **Track Orders** - Monitor your order status in real-time
6. **Manage Profile** - Update your delivery address and contact information

### For Developers
1. **API Endpoints** - RESTful API with comprehensive documentation
2. **Component Library** - Reusable React components with Tailwind CSS
3. **State Management** - React Context for global state
4. **Database Schema** - SQLite database with relational structure
5. **Authentication Flow** - JWT-based secure authentication

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Restaurant Endpoints
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant details with menu

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order status

### Utility Endpoints
- `GET /api/health` - Health check

## 🎨 UI Components

### Layout Components
- **Header** - Navigation with cart counter and user menu
- **Footer** - Company information and links
- **Layout** - Main wrapper component

### Feature Components
- **RestaurantCard** - Restaurant information display
- **MenuItemCard** - Menu item with add to cart functionality
- **CartItem** - Shopping cart item management
- **OrderCard** - Order status and details
- **AuthForms** - Login and registration forms

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set up PostgreSQL database (replace SQLite)
3. Configure environment variables
4. Deploy using Git or GitHub integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** - High-quality food images
- **Heroicons** - Beautiful SVG icons
- **Tailwind CSS** - Utility-first CSS framework
- **React Community** - Amazing ecosystem and tools

## 📞 Support

For support, email support@foodex.com or join our Slack channel.

---

**Built with ❤️ using the specified color palette: Red, Black, White, and Orange**