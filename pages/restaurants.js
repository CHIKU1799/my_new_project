import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Mock data for restaurants
const restaurantData = [
  {
    id: 1,
    name: "Burger Palace",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
    rating: 4.5,
    reviewCount: 150,
    deliveryTime: "25-35 min",
    cuisine: "Fast Food",
    distance: "2.1 km",
    deliveryFee: 2.99,
    isFavorite: false,
    isOpen: true,
    featured: true,
    priceRange: "$$",
    tags: ["burgers", "fries", "milkshakes"]
  },
  {
    id: 2,
    name: "Pasta Corner",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
    rating: 4.7,
    reviewCount: 203,
    deliveryTime: "30-40 min",
    cuisine: "Italian",
    distance: "1.8 km",
    deliveryFee: 1.99,
    isFavorite: true,
    isOpen: true,
    featured: true,
    priceRange: "$$$",
    tags: ["pasta", "pizza", "italian"]
  },
  {
    id: 3,
    name: "Asian Fusion",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    rating: 4.6,
    reviewCount: 89,
    deliveryTime: "20-30 min",
    cuisine: "Asian",
    distance: "3.2 km",
    deliveryFee: 3.99,
    isFavorite: false,
    isOpen: true,
    featured: true,
    priceRange: "$$",
    tags: ["asian", "sushi", "noodles"]
  },
  {
    id: 4,
    name: "Taco Fiesta",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
    rating: 4.3,
    reviewCount: 127,
    deliveryTime: "15-25 min",
    cuisine: "Mexican",
    distance: "1.5 km",
    deliveryFee: 1.99,
    isFavorite: false,
    isOpen: true,
    featured: false,
    priceRange: "$",
    tags: ["tacos", "burritos", "mexican"]
  },
  {
    id: 5,
    name: "India House",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
    rating: 4.4,
    reviewCount: 76,
    deliveryTime: "35-45 min",
    cuisine: "Indian",
    distance: "4.1 km",
    deliveryFee: 4.99,
    isFavorite: true,
    isOpen: false,
    featured: false,
    priceRange: "$$",
    tags: ["curry", "biryani", "indian"]
  },
  {
    id: 6,
    name: "Pizza Express",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    rating: 4.2,
    reviewCount: 234,
    deliveryTime: "20-30 min",
    cuisine: "Italian",
    distance: "2.8 km",
    deliveryFee: 2.99,
    isFavorite: false,
    isOpen: true,
    featured: false,
    priceRange: "$$",
    tags: ["pizza", "italian", "fast"]
  }
];

const cuisineFilters = [
  { name: "All", value: "" },
  { name: "Fast Food", value: "Fast Food" },
  { name: "Italian", value: "Italian" },
  { name: "Asian", value: "Asian" },
  { name: "Mexican", value: "Mexican" },
  { name: "Indian", value: "Indian" }
];

const sortOptions = [
  { name: "Featured", value: "featured" },
  { name: "Rating", value: "rating" },
  { name: "Delivery Time", value: "deliveryTime" },
  { name: "Distance", value: "distance" },
  { name: "Price", value: "price" }
];

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState(restaurantData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    let filtered = [...restaurantData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Cuisine filter
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }

    // Price range filter
    if (priceRange) {
      filtered = filtered.filter(restaurant => restaurant.priceRange === priceRange);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'price':
          return a.deliveryFee - b.deliveryFee;
        case 'featured':
        default:
          return b.featured - a.featured || b.rating - a.rating;
      }
    });

    setRestaurants(filtered);
  }, [searchTerm, selectedCuisine, sortBy, priceRange]);

  const toggleFavorite = (id) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === id
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant
      )
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-dark-900 mb-4">Restaurants Near You</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover amazing restaurants and order your favorite food for delivery or pickup
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center space-x-2"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cuisine Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {cuisineFilters.map((cuisine) => (
                        <option key={cuisine.value} value={cuisine.value}>
                          {cuisine.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Prices</option>
                      <option value="$">$ - Budget</option>
                      <option value="$$">$$ - Moderate</option>
                      <option value="$$$">$$$ - Expensive</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {restaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="card overflow-hidden group hover:scale-105 transition-transform">
                  <div className="relative h-48">
                    <Image
                      src={restaurant.image}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        restaurant.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {restaurant.featured && (
                      <div className="absolute top-3 right-12">
                        <span className="bg-secondary-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(restaurant.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <HeartIcon className={`w-5 h-5 ${restaurant.isFavorite ? 'text-primary-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-dark-900 group-hover:text-primary-500 transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <StarIconSolid className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                        <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-gray-600">{restaurant.cuisine}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{restaurant.priceRange}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{restaurant.distance}</span>
                      </div>
                      <span className="font-medium">${restaurant.deliveryFee} delivery</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {restaurant.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/restaurant/${restaurant.id}`}
                      className={`btn-primary w-full text-center ${!restaurant.isOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {restaurant.isOpen ? 'View Menu' : 'Currently Closed'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}