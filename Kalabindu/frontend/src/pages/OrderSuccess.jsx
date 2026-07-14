import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, address, items, subtotal, delivery, totalPayable } =
    location.state || {};

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Format order ID for display
  const orderId =
    order?._id || order?.orderId || order?.id || "—";

  // Estimated delivery: 5-7 days from now
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 6);
  const formattedDate = estimatedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4 md:p-8 flex items-start justify-center">
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
        className="w-full max-w-2xl"
      >
        {/* ── Success Banner ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-8 text-center">
            {/* Animated checkmark */}
            <div className="flex items-center justify-center mx-auto mb-4">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: visible ? "popIn 0.4s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">
              Order Confirmed! 🎉
            </h1>
            <p className="text-green-100 text-sm">
              Thank you for shopping with us. Your order is on its way!
            </p>
          </div>

          {/* Order Meta */}
          <div className="px-8 py-5 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-100 bg-gray-50">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
                Order ID
              </p>
              <p className="text-sm font-mono font-bold text-gray-800 break-all">
                #{orderId}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
                Estimated Delivery
              </p>
              <p className="text-sm font-semibold text-orange-600">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* ── Items Ordered ── */}
        {items && items.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="text-lg">🛍️</span>
              <h2 className="font-bold text-gray-800 text-base">
                Items Ordered ({items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map((item, idx) => (
                <div
                  key={item.productId?._id || idx}
                  className="px-6 py-4 flex items-center gap-4"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-12px)",
                    transition: `opacity 0.4s ease ${0.1 + idx * 0.07}s, transform 0.4s ease ${0.1 + idx * 0.07}s`,
                  }}
                >
                  {/* Product Image */}
                  {item.productId?.image ? (
                    <img
                      src={item.productId.image}
                      alt={item.productId?.title}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-2xl border border-orange-100">
                      🛒
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate text-sm">
                      {item.productId?.title || "Product"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty: {item.quantity} × ₹
                      {item.productId?.price?.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-gray-800 text-sm flex-shrink-0">
                    ₹{(item.productId?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* ── Delivery Address ── */}
          {address && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="text-lg">📦</span>
                <h2 className="font-bold text-gray-800 text-base">
                  Deliver To
                </h2>
              </div>
              <div className="px-6 py-4">
                <p className="font-bold text-gray-800 mb-1">{address.fullName}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {address.address}
                  <br />
                  {address.city}, {address.state} — {address.pincode}
                  {address.Country && (
                    <>
                      <br />
                      {address.Country}
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-3 font-medium">
                  📞 {address.phone}
                </p>
              </div>
            </div>
          )}

          {/* ── Payment Summary ── */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="text-lg">💳</span>
              <h2 className="font-bold text-gray-800 text-base">
                Payment Summary
              </h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              {subtotal !== undefined && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Items Subtotal</span>
                  <span>₹{Number(subtotal).toFixed(2)}</span>
                </div>
              )}
              {delivery !== undefined && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  {delivery === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>₹{Number(delivery).toFixed(2)}</span>
                  )}
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-900">
                <span>Total Paid</span>
                <span className="text-orange-500">
                  ₹{Number(totalPayable ?? subtotal).toFixed(2)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                <svg
                  className="w-4 h-4 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-green-700 font-semibold">
                  Payment Successful · Cash on Delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Order Tracking Steps ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="text-lg">🚚</span>
            <h2 className="font-bold text-gray-800 text-base">Order Status</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-start gap-0">
              {[
                { label: "Order Placed", icon: "✅", done: true },
                { label: "Processing", icon: "⚙️", done: false },
                { label: "Shipped", icon: "📦", done: false },
                { label: "Delivered", icon: "🏠", done: false },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 border-2 ${
                        step.done
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {step.done ? (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs">{step.icon}</span>
                      )}
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 ${
                          step.done ? "bg-green-400" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-semibold text-center ${
                      step.done ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-orange-200 text-sm uppercase tracking-wide"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 text-sm"
          >
            Back to Home
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 mb-2">
          A confirmation has been noted. Happy shopping! 🛍️
        </p>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
