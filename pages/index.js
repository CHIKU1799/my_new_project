import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { 
  StarIcon, 
  ClockIcon, 
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  HeartIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Mock data
const featuredRestaurants = [
  {
    id: 1,
    name: "Burger Palace",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
    rating: 4.5,
    deliveryTime: "25-35 min",
    cuisine: "Fast Food",
    distance: "2.1 km",
    isFavorite: false,
    featured: true,
    menu: [
      { id: 101, name: "Classic Burger", price: 12.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300" },
      { id: 102, name: "Cheese Fries", price: 6.99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300" },
    ]
  },
  {
    id: 2,
    name: "Pasta Corner",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
    rating: 4.7,
    deliveryTime: "30-40 min",
    cuisine: "Italian",
    distance: "1.8 km",
    isFavorite: true,
    featured: true,
    menu: [
      { id: 201, name: "Spaghetti Carbonara", price: 15.99, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300" },
      { id: 202, name: "Margherita Pizza", price: 18.99, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300" },
    ]
  },
  {
    id: 3,
    name: "Asian Fusion",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    rating: 4.6,
    deliveryTime: "20-30 min",
    cuisine: "Asian",
    distance: "3.2 km",
    isFavorite: false,
    featured: true,
    menu: [
      { id: 301, name: "Chicken Teriyaki", price: 14.99, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300" },
      { id: 302, name: "Vegetable Fried Rice", price: 11.99, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300" },
    ]
  },
];

const cuisineTypes = [
  { name: "Italian", icon: "🍝", count: 23 },
  { name: "Chinese", icon: "🥡", count: 18 },
  { name: "Mexican", icon: "🌮", count: 15 },
  { name: "Indian", icon: "🍛", count: 12 },
  { name: "Japanese", icon: "🍱", count: 9 },
  { name: "American", icon: "🍔", count: 28 },
];

const features = [
  {
    icon: TruckIcon,
    title: "Fast Delivery",
    description: "Get your food delivered in 30 minutes or less"
  },
  {
    icon: ShieldCheckIcon,
    title: "Quality Assured",
    description: "We ensure the highest quality standards for all our partners"
  },
  {
    icon: CurrencyDollarIcon,
    title: "Best Prices",
    description: "Competitive prices with regular discounts and offers"
  },
  {
    icon: PhoneIcon,
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your needs"
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredItems, setFeaturedItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Extract featured menu items from restaurants
    const items = featuredRestaurants.flatMap(restaurant => 
      restaurant.menu.map(item => ({
        ...item,
        restaurantName: restaurant.name,
        restaurantId: restaurant.id,
        deliveryTime: restaurant.deliveryTime
      }))
    );
    setFeaturedItems(items);
  }, []);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantName: item.restaurantName,
      restaurantId: item.restaurantId
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Delicious Food
              <span className="block text-secondary-200">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
              Order from your favorite restaurants and get fresh, hot meals delivered to your doorstep in minutes.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 text-lg"
                />
                <button className="absolute right-2 top-2 bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/restaurants" className="bg-white text-primary-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Browse Restaurants
              </Link>
              <Link href="/offers" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-500 transition-colors">
                View Offers
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Food Icons */}
        <div className="absolute top-20 left-10 animate-bounce-gentle">
          <div className="text-6xl opacity-20">🍕</div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <div className="text-4xl opacity-20">🍔</div>
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
          <div className="text-5xl opacity-20">🍜</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 mb-4">Why Choose FoodEx?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best food delivery experience with quality, speed, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Cuisines */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 mb-4">Popular Cuisines</h2>
            <p className="text-gray-600">Explore a variety of cuisines from around the world</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cuisineTypes.map((cuisine, index) => (
              <Link
                key={index}
                href={`/cuisine/${cuisine.name.toLowerCase()}`}
                className="card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-4xl mb-3">{cuisine.icon}</div>
                <h3 className="font-semibold text-dark-900 mb-1">{cuisine.name}</h3>
                <p className="text-sm text-gray-500">{cuisine.count} restaurants</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-dark-900 mb-4">Featured Restaurants</h2>
              <p className="text-gray-600">Top-rated restaurants in your area</p>
            </div>
            <Link href="/restaurants" className="btn-primary">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="card overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                    <HeartIcon className={`w-5 h-5 ${restaurant.isFavorite ? 'text-primary-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-dark-900">{restaurant.name}</h3>
                    <div className="flex items-center space-x-1">
                      <StarIconSolid className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{restaurant.distance}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/restaurant/${restaurant.id}`}
                    className="btn-primary w-full text-center"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 mb-4">Today's Special</h2>
            <p className="text-gray-600">Don't miss these amazing dishes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-dark-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.restaurantName}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-500">${item.price}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 bg-gradient-to-r from-dark-900 to-dark-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Download Our App</h2>
              <p className="text-gray-300 text-lg mb-8">
                Get the FoodEx mobile app for faster ordering, exclusive deals, and real-time tracking of your orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="bg-white text-dark-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
                  <span className="mr-3">📱</span>
                  Download for iOS
                </a>
                <a href="#" className="bg-white text-dark-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center">
                  <span className="mr-3">🤖</span>
                  Download for Android
                </a>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 inline-block">
                <div className="text-8xl">📱</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}