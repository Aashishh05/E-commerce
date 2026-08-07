import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Truck,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../Components/auth/Navbar";
import Footer from "../../Components/auth/Footer";
import API from "../../utils/axios";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const nav = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState("address");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when your order arrives",
      color: "emerald",
      badge: "Most Popular",
    },
    {
      id: "esewa",
      name: "eSewa",
      icon: Smartphone,
      description: "Pay via Esewa",
      color: "purple",
      logo: "📱",
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: CreditCard,
      description: "Pay via Khalti",
      color: "purple",
      logo: "🎫",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, or other cards",
      color: "blue",
      logo: "💳",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 2500 ? 0 : 100;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const validateAddress = () => {
    const newErrors = {};

    if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!address.phone.trim()) newErrors.phone = "Phone number is required";
    if (!address.street.trim()) newErrors.street = "Street address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State/Province is required";

    const phoneRegex = /^[0-9]{10}$/;
    if (address.phone && !phoneRegex.test(address.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleContinueToPayment = () => {
    if (validateAddress()) {
      setCurrentStep("payment");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        shippingAddress: {
          fullName: address.fullName,
          email: address.email,
          phone: address.phone,
          address: address.street,
          city: address.city,
          state: address.state,
        },
        paymentMethod: selectedPayment,
        shippingPrice: shipping,
        orderNotes,
      };

      console.log("📤 Sending order data:", orderData);
      console.log("📦 Cart items:", cartItems);

      const res = await API.post("/api/order/create", orderData);

      console.log("✅ Order response:", res);

      if (res.data.success) {
        const orderId = res.data.order._id;

        if (selectedPayment === "cod") {
          toast.success("Order placed successfully!");
          nav("/order", { state: { orderId } });
        } else if (selectedPayment === "esewa") {
          nav("/payment", {
            state: {
              paymentMethod: "esewa",
              orderId: orderId,
              amount: total, // total amount
            },
          });
          // Implement eSewa payment gateway integration
          // window.location.href = esewa_payment_url;
        } else if (selectedPayment === "khalti") {
          toast.success("Redirecting to Khalti payment...");
          // Implement Khalti payment gateway integration
          // window.location.href = khalti_payment_url;
        } else if (selectedPayment === "card") {
          toast.success("Redirecting to payment gateway...");
          // Implement card payment gateway integration
          // window.location.href = stripe_payment_url;
        }
      }
    } catch (error) {
      console.error("❌ Order error:", error);
      console.error("❌ Error response:", error.response?.data);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="mb-8"
        >
          <button
            onClick={() => nav("/cart")}
            className="flex items-center gap-2 text-green-800 hover:text-green-700 font-semibold mb-6"
          >
            <ChevronLeft size={20} /> Back to Cart
          </button>
          <h1 className="font-serif text-5xl font-bold text-stone-900">
            Checkout
          </h1>
          <p className="text-stone-600 mt-2 text-base font-semibold">
            {currentStep === "address"
              ? "Step 1: Delivery Address"
              : "Step 2: Payment Method"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === "address" ? (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-full bg-green-50 border border-green-200">
                      <MapPin size={24} className="text-green-800" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900">
                      Shipping Address
                    </h2>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-5"
                  >
                    <motion.div
                      variants={slideUp}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={address.fullName}
                          onChange={handleAddressChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition ${
                            errors.fullName
                              ? "border-red-400 bg-red-50"
                              : "border-stone-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          }`}
                        />
                        {errors.fullName && (
                          <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={address.email}
                          onChange={handleAddressChange}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 bg-stone-50 outline-none cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={slideUp}>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        placeholder="98XXXXXXXXX"
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition ${
                          errors.phone
                            ? "border-red-400 bg-red-50"
                            : "border-stone-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.phone}
                        </p>
                      )}
                    </motion.div>

                    <motion.div variants={slideUp}>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        placeholder="123 Main Street, Apt 4B"
                        className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition ${
                          errors.street
                            ? "border-red-400 bg-red-50"
                            : "border-stone-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        }`}
                      />
                      {errors.street && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.street}
                        </p>
                      )}
                    </motion.div>
                    <motion.div
                      variants={slideUp}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          placeholder="Kathmandu"
                          className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition ${
                            errors.city
                              ? "border-red-400 bg-red-50"
                              : "border-stone-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">
                          State/Province <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={address.state}
                          onChange={handleAddressChange}
                          placeholder="Bagmati"
                          className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition ${
                            errors.state
                              ? "border-red-400 bg-red-50"
                              : "border-stone-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.state}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    <motion.div variants={slideUp}>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Add special instructions for your order..."
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
                      />
                    </motion.div>

                    <motion.div variants={slideUp} className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleContinueToPayment}
                        className="w-full py-4 bg-green-800 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-base cursor-pointer"
                      >
                        Continue to Payment
                        <ArrowRight size={18} />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-full bg-blue-50 border border-blue-200">
                        <CreditCard size={24} className="text-blue-800" />
                      </div>
                      <h2 className="text-2xl font-bold text-stone-900">
                        Payment Method
                      </h2>
                    </div>

                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {paymentMethods.map((method, idx) => {
                        const IconComponent = method.icon;
                        return (
                          <motion.div
                            key={method.id}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                  duration: 0.3,
                                  delay: idx * 0.05,
                                },
                              },
                            }}
                          >
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              onClick={() => setSelectedPayment(method.id)}
                              className={`w-full p-5 rounded-xl border-2 transition text-left flex items-start gap-4 ${
                                selectedPayment === method.id
                                  ? "border-green-600 bg-green-50"
                                  : "border-stone-200 bg-white hover:border-stone-300"
                              }`}
                            >
                              <div
                                className={`p-3 rounded-lg flex-shrink-0 mt-1 ${
                                  selectedPayment === method.id
                                    ? "bg-green-200 text-green-800"
                                    : "bg-stone-100 text-stone-600"
                                }`}
                              >
                                {method.logo ? (
                                  <span className="text-2xl">
                                    {method.logo}
                                  </span>
                                ) : (
                                  <IconComponent size={20} />
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-stone-900">
                                    {method.name}
                                  </h3>
                                  {method.badge && (
                                    <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full font-bold">
                                      {method.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-stone-600">
                                  {method.description}
                                </p>
                              </div>

                              {selectedPayment === method.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    duration: 0.2,
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                  className="p-1 rounded-full bg-green-600 text-white flex-shrink-0 mt-1"
                                >
                                  <CheckCircle size={20} />
                                </motion.div>
                              )}
                            </motion.button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-full bg-orange-50 border border-orange-200">
                        <Truck size={24} className="text-orange-800" />
                      </div>
                      <h2 className="text-xl font-bold text-stone-900">
                        Delivery Address
                      </h2>
                    </div>

                    <div className="bg-stone-50 rounded-lg p-5 border border-stone-200">
                      <p className="font-bold text-stone-900 mb-2">
                        {address.fullName}
                      </p>
                      <p className="text-sm text-stone-700 mb-1">
                        {address.street}
                      </p>
                      <p className="text-sm text-stone-700 mb-1">
                        {address.city}, {address.state}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 text-sm mt-3">
                        <span className="flex items-center gap-2 text-stone-700">
                          <Mail size={16} /> {address.email}
                        </span>
                        <span className="flex items-center gap-2 text-stone-700">
                          <Phone size={16} /> {address.phone}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setCurrentStep("address")}
                      className="mt-4 text-green-800 hover:text-green-700 font-semibold text-sm"
                    >
                      ← Edit Address
                    </motion.button>
                  </div>

                  <motion.div
                    variants={slideUp}
                    className="bg-white rounded-xl border border-stone-200 p-6 md:p-8 shadow-sm"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={loading || !selectedPayment}
                      className="w-full py-4 bg-green-800 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-base"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Lock size={18} />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Place Order & Pay
                        </>
                      )}
                    </motion.button>
                    <p className="text-xs text-stone-500 text-center mt-3 flex items-center justify-center gap-1">
                      <Lock size={12} /> Your payment is secure and encrypted
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm sticky top-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-stone-200">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-stone-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </motion.div>
                ))}

                <div className="flex justify-between text-sm pt-2">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-semibold">
                    Rs.{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">
                    Shipping{" "}
                    {shipping === 0 && (
                      <span className="text-green-700 font-semibold">
                        (Free)
                      </span>
                    )}
                  </span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `Rs.${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Tax (10%)</span>
                  <span className="font-semibold">Rs.{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-stone-900 mb-6">
                <span>Total</span>
                <span className="text-green-800">Rs.{total.toFixed(2)}</span>
              </div>

              <div className="space-y-2 text-xs text-stone-600 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <CheckCircle
                    size={14}
                    className="text-green-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Secure checkout</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle
                    size={14}
                    className="text-green-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Free shipping on orders over Rs.2500</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle
                    size={14}
                    className="text-green-700 flex-shrink-0 mt-0.5"
                  />
                  <span>Easy returns within 30 days</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
