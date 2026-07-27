import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Loader,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../utils/axios.js";
import Navbar from "../Components/auth/Navbar";
import Footer from "../Components/auth/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  const placeholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8e8e8' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const prodRes = await API.get(`/api/product/get/${id}`);
      const prod = prodRes.data.data;
      setProduct(prod);
      console.log("Product data:", prod);

      const allRes = await API.get(`/api/product/getall`);
      setAllProducts(allRes.data.data || []);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Product not found");
    } finally {
      setLoading(false);
    }
  };

  // Get images - handle ALL backend formats
  const getImages = () => {
    if (!product) return [placeholder];

    let imgs = [];

    // Format 1: product.images as array of objects with url
    if (Array.isArray(product.images) && product.images.length > 0) {
      imgs = product.images
        .map((img) => (typeof img === "object" ? img.url : img))
        .filter(Boolean);
    }

    // Format 2: product.image as object with url
    if (!imgs.length && product.image?.url) {
      imgs = [product.image.url];
    }

    // Format 3: product.imageUrl direct string
    if (!imgs.length && product.imageUrl) {
      imgs = [product.imageUrl];
    }

    // Format 4: product.images as array of strings
    if (!imgs.length && Array.isArray(product.images)) {
      imgs = product.images.filter((img) => typeof img === "string");
    }

    return imgs.length > 0 ? imgs : [placeholder];
  };

  const images = getImages();
  const currentImage = images[imageIdx];
  const rating = product?.rating || product?.ratingCount || 4.5;

  // Related products - same category or seller
  const related = allProducts
    .filter((p) => p._id !== id)
    .filter(
      (p) => p.category === product?.category || p.seller === product?.seller,
    )
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Loader size={50} className="text-green-800" />
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => nav("/")}
              className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
            >
              Back Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddCart = () => {
    if (!isAuthenticated) {
      nav("/login");
      return;
    }
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleImageError = (e) => {
    if (!e.target.src.startsWith("data:")) {
      e.target.src = placeholder;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-2 text-green-800 hover:text-green-700 font-semibold mb-6"
        >
          <ChevronLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-3">
            <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border border-stone-200 group flex items-center justify-center">
              <motion.img
                key={imageIdx}
                src={currentImage}
                alt={product?.name || "Product"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />

              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-md hover:shadow-lg z-10"
              >
                <Heart
                  size={20}
                  className={
                    liked ? "fill-red-500 text-red-500" : "text-gray-400"
                  }
                />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setImageIdx(
                        (i) => (i - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImageIdx((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIdx(idx)}
                    className={`w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden border-2 transition ${
                      imageIdx === idx ? "border-green-800" : "border-stone-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {product?.isNew && (
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                  New Arrival
                </span>
              )}
              {product?.stock <= 5 && product?.stock > 0 && (
                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">
                  Only {product?.stock} left
                </span>
              )}
              {product?.stock === 0 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
              {product?.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-bold text-sm">{rating}</span>
              <span className="text-xs text-gray-600">(0 reviews)</span>
            </div>

            <div className="py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-800">
                  {product?.price
                    ? `Rs.${product.price.toFixed(2)}`
                    : "Price TBA"}
                </span>
                {product?.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rs.{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100,
                      )}
                      % off
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-stone-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">
                SOLD BY
              </p>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                  🏪
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {product?.sellerName || "Aura Store"}
                  </p>
                  <p className="text-xs text-gray-600">
                    <Star
                      size={12}
                      className="inline fill-amber-500 text-amber-500"
                    />{" "}
                    4.8
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {product?.description}
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 text-xs">
              <div className="flex gap-2">
                <Truck size={16} className="text-green-800" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-gray-600">On orders over $50</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Shield size={16} className="text-green-800" />
                <div>
                  <p className="font-semibold">Secure</p>
                  <p className="text-gray-600">100% protected</p>
                </div>
              </div>
              <div className="flex gap-2">
                <RotateCcw size={16} className="text-green-800" />
                <div>
                  <p className="font-semibold">Returns</p>
                  <p className="text-gray-600">30-day easy</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Check size={16} className="text-green-800" />
                <div>
                  <p className="font-semibold">Verified</p>
                  <p className="text-gray-600">Authentic</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-stone-200">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-full w-fit px-2 py-1">
                  <button
                    onClick={() => {
                      const nq = quantity - 1;
                      if (nq >= 1) setQuantity(nq);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= (product?.stock || 100))
                        setQuantity(val);
                    }}
                    className="w-10 text-center text-sm font-bold bg-transparent outline-none"
                  />
                  <button
                    onClick={() => {
                      const nq = quantity + 1;
                      if (nq <= (product?.stock || 100)) setQuantity(nq);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!cartAdded ? (
                  <motion.button
                    key="add"
                    onClick={handleAddCart}
                    disabled={product?.stock === 0}
                    className={`w-full py-2.5 rounded-lg font-bold text-white flex items-center justify-center gap-2 text-sm transition ${
                      product?.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-800 hover:bg-green-700"
                    }`}
                  >
                    <ShoppingCart size={16} />
                    {product?.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </motion.button>
                ) : (
                  <motion.button
                    key="added"
                    className="w-full py-2.5 rounded-lg font-bold text-green-800 bg-green-100 flex items-center justify-center gap-2 text-sm"
                  >
                    <Check size={16} />
                    Added to Cart!
                  </motion.button>
                )}
              </AnimatePresence>

              <button className="w-full py-2.5 border-2 border-green-800 text-green-800 font-bold rounded-lg hover:bg-green-50 text-sm">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((prod) => (
                <motion.div
                
                  key={prod._id}
                  whileHover={{ y: -3 }}
                  onClick={() => nav(`/productdetails/${prod._id}`)}
                  className="bg-white rounded-lg overflow-hidden border border-stone-200 hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        Array.isArray(prod?.images) && prod.images[0]?.url
                          ? prod.images[0].url
                          : prod?.image?.url || placeholder
                      }
                      alt={prod?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = placeholder;
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-stone-900 text-sm truncate">
                      {prod?.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {prod?.category?.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-800 text-sm">
                        Rs.{prod?.price?.toFixed(2)}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="fill-amber-500 text-amber-500"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
