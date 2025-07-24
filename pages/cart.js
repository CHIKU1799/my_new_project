import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  MinusIcon, 
  PlusIcon, 
  TrashIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const deliveryFee = 2.99;
  const serviceFee = 1.99;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee + serviceFee;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.info('Please login to continue with checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsCheckingOut(true);
    
    // Simulate checkout process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      const order = {
        id: Date.now(),
        items: items,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        serviceFee: serviceFee,
        total: total,
        status: 'confirmed',
        estimatedDelivery: '25-35 minutes',
        createdAt: new Date().toISOString()
      };

      // Save order to localStorage for demo
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.unshift(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShoppingCartIcon className="mx-auto h-32 w-32 text-gray-400" />
              <h2 className="mt-6 text-3xl font-bold text-dark-900">Your cart is empty</h2>
              <p className="mt-4 text-gray-600 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to see items here.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => router.push('/restaurants')}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-dark-900">Your Order</h2>
                  <p className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-dark-900">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.restaurantName}</p>
                              <p className="text-lg font-bold text-primary-500 mt-1">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-dark-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-dark-900">Order Summary</h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">${serviceFee.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-dark-900">Total</span>
                      <span className="text-2xl font-bold text-primary-500">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <TruckIcon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Delivery Info</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>Estimated delivery: 25-35 minutes</span>
                    </div>
                    {user && (
                      <p className="text-sm text-gray-600 mt-2">
                        Delivering to: {user.address || '123 Demo Street, Demo City'}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`w-full btn-primary mt-6 ${isCheckingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-dots">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                        <span className="ml-3">Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CreditCardIcon className="w-5 h-5 mr-2" />
                        <span>Proceed to Checkout</span>
                      </div>
                    )}
                  </button>

                  {!user && (
                    <p className="text-sm text-gray-600 text-center mt-4">
                      Please <span className="text-primary-500 font-medium">login</span> to continue with checkout
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}