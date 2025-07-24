import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const orderStatuses = {
  'confirmed': { 
    label: 'Confirmed', 
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircleIcon,
    description: 'Your order has been confirmed and is being prepared'
  },
  'preparing': { 
    label: 'Preparing', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
    description: 'The restaurant is preparing your order'
  },
  'on-the-way': { 
    label: 'On the way', 
    color: 'bg-orange-100 text-orange-800',
    icon: TruckIcon,
    description: 'Your order is out for delivery'
  },
  'delivered': { 
    label: 'Delivered', 
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
    description: 'Your order has been delivered successfully'
  },
  'cancelled': { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
    description: 'This order was cancelled'
  }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load orders from localStorage (for demo)
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Add some demo orders if none exist
      if (savedOrders.length === 0) {
        const demoOrders = [
          {
            id: 1001,
            items: [
              { 
                id: 101, 
                name: "Classic Burger", 
                price: 12.99, 
                quantity: 2,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
                restaurantName: "Burger Palace"
              },
              { 
                id: 102, 
                name: "Cheese Fries", 
                price: 6.99, 
                quantity: 1,
                image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300",
                restaurantName: "Burger Palace"
              }
            ],
            subtotal: 32.97,
            deliveryFee: 2.99,
            serviceFee: 1.99,
            total: 37.95,
            status: 'delivered',
            estimatedDelivery: '25-35 minutes',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            restaurantName: "Burger Palace",
            restaurantId: 1
          },
          {
            id: 1002,
            items: [
              { 
                id: 201, 
                name: "Spaghetti Carbonara", 
                price: 15.99, 
                quantity: 1,
                image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300",
                restaurantName: "Pasta Corner"
              }
            ],
            subtotal: 15.99,
            deliveryFee: 1.99,
            serviceFee: 1.99,
            total: 19.97,
            status: 'on-the-way',
            estimatedDelivery: '30-40 minutes',
            createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
            restaurantName: "Pasta Corner",
            restaurantId: 2
          }
        ];
        
        localStorage.setItem('orders', JSON.stringify(demoOrders));
        setOrders(demoOrders);
      } else {
        setOrders(savedOrders);
      }
      
      setLoading(false);
    };

    loadOrders();
  }, [user, router]);

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantName: item.restaurantName,
        restaurantId: order.restaurantId
      });
    });
    toast.success('Items added to cart!');
    router.push('/cart');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDeliveryTime = (createdAt, estimatedDelivery) => {
    const orderTime = new Date(createdAt);
    const deliveryMinutes = parseInt(estimatedDelivery.split('-')[1]); // Take the upper bound
    const estimatedTime = new Date(orderTime.getTime() + deliveryMinutes * 60 * 1000);
    return estimatedTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-900 mb-2">Your Orders</h1>
            <p className="text-gray-600">Track your current and past orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="mx-auto h-32 w-32 text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">When you place your first order, it will appear here.</p>
              <button
                onClick={() => router.push('/restaurants')}
                className="btn-primary"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = orderStatuses[order.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-dark-900 mb-1">
                            Order #{order.id}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            From {order.restaurantName}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} mb-2`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusInfo.label}
                          </div>
                          <p className="text-lg font-bold text-dark-900">${order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Status Description */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{statusInfo.description}</p>
                        {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'on-the-way') && (
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span>
                              Estimated delivery: {getEstimatedDeliveryTime(order.createdAt, order.estimatedDelivery)}
                            </span>
                          </div>
                        )}
                        {order.deliveredAt && (
                          <div className="flex items-center mt-2 text-sm text-green-600">
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            <span>Delivered at {formatDate(order.deliveredAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-medium text-dark-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium text-dark-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span>${order.deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service Fee</span>
                            <span>${order.serviceFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleReorder(order)}
                          className="btn-primary flex items-center justify-center"
                        >
                          <ArrowPathIcon className="w-4 h-4 mr-2" />
                          Reorder
                        </button>
                        
                        {order.status === 'delivered' && (
                          <button className="btn-outline flex items-center justify-center">
                            ⭐ Rate Order
                          </button>
                        )}
                        
                        {(order.status === 'confirmed' || order.status === 'preparing') && (
                          <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center">
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Active Orders */}
                    {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'on-the-way') && (
                      <div className="px-6 pb-6">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: order.status === 'confirmed' ? '25%' : 
                                     order.status === 'preparing' ? '50%' : 
                                     order.status === 'on-the-way' ? '75%' : '100%'
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Confirmed</span>
                          <span>Preparing</span>
                          <span>On the way</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}