"use client";
import React, { useState } from "react";
import { saveCheckoutAddress } from "../apis/checkout.api";

const mockSelectedCart = [
  {
    id: 1,
    name: "Product A",
    price: 100000,
    quantity: 2,
    image: "",
  },
  {
    id: 2,
    name: "Product B",
    price: 150000,
    quantity: 1,
    image: "",
  },
];

const countryOptions = ["Vietnam", "Singapore"];
const cityOptions = {
  Vietnam: ["Hanoi", "Ho Chi Minh City", "Da Nang"],
  Singapore: ["Singapore"],
};

const phonePrefixes = {
  Vietnam: "+84 ",
  Singapore: "+65 ",
};

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedCartItems] = useState(mockSelectedCart);

  const [form, setForm] = useState({
    userName: "",
    phoneNumber: "",
    street: "",
    city: "",
    country: "",
    zipCode: "",
    coupon: "",
  });

  const [errors, setErrors] = useState({});

  const cartTotal = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setForm((prev) => ({
        ...prev,
        country: value,
        city: "",
        phoneNumber: phonePrefixes[value] || "",
      }));
      setErrors((prev) => ({ ...prev, country: "", city: "", phoneNumber: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const isFormIncomplete =
    !form.userName.trim() ||
    !form.phoneNumber.trim() ||
    !form.street.trim() ||
    !form.city.trim() ||
    !form.country.trim() ||
    !form.zipCode.trim() ||
    !paymentMethod;

  const validateForm = () => {
    const newErrors = {};
    if (!form.userName.trim()) newErrors.userName = "Name is required";
    if (!form.phoneNumber.trim()) {
    newErrors.phoneNumber = "Phone number is required";
  } else {
    const rawPhone = form.phoneNumber.replace(/\s+/g, "");
    const expectedPrefix = phonePrefixes[form.country]?.replace(/\s+/g, "") || "";

    if (!rawPhone.startsWith(expectedPrefix)) {
      newErrors.phoneNumber = `Phone number must start with ${phonePrefixes[form.country] || "correct prefix"}`;
    } else {
      const numberWithoutPrefix = rawPhone.slice(expectedPrefix.length);
      const isValid = /^\d{6,10}$/.test(numberWithoutPrefix); // basic digit length rule

      if (!isValid) {
        newErrors.phoneNumber = "Phone number format is invalid";
      }
    }
  }
    if (!form.street.trim()) newErrors.street = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    if (!paymentMethod) newErrors.paymentMethod = "Select a payment method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
  if (!validateForm()) return;

  setIsProcessing(true);
  console.log("Submitting checkout with form data:", form);

  try {
    await saveCheckoutAddress({
      ...form,
      //paymentMethod,
      //items: selectedCartItems,
      //total: cartTotal,
    });

    setIsModalOpen(true);
  } catch (err) {
    alert("Checkout failed. Please try again.");
    console.error(err);
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="min-h-screen w-full bg-white text-primary py-10 px-4 font-roboto">
      <h1 className="text-3xl text-secondary font-bold font-urbanist text-center mb-10">
        CHECKOUT
      </h1>

      <div className="flex md:flex-col flex-row gap-8 max-w-7xl mx-auto">
        {/* Delivery Info */}
        <div className="bg-white border rounded-sm p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold mb-4 font-urbanist">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="name"
                value={form.userName}
                onChange={handleInputChange}
                type="text"
                placeholder="Name*"
                className="input-field"
              />
              {errors.userName && (
                <p className="text-red-500 text-sm">{errors.userName}</p>
              )}
            </div>

            <div>
              <select
                name="country"
                value={form.country}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select Country*</option>
                {countryOptions.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="address"
                value={form.street}
                onChange={handleInputChange}
                type="text"
                placeholder="Address*"
                className="input-field"
              />
              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street}</p>
              )}
            </div>

            <div>
              <input
                name="phone"
                value={form.phoneNumber}
                onChange={handleInputChange}
                type="text"
                placeholder="Phone Number*"
                className="input-field"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                name="city"
                value={form.city}
                onChange={handleInputChange}
                className="input-field"
                disabled={!form.country}
              >
                <option value="">Select City*</option>
                {(cityOptions[form.country] || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            <div>
              <input
                name="zip"
                value={form.zipCode}
                onChange={handleInputChange}
                type="text"
                placeholder="Zip code*"
                className="input-field"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border rounded-sm p-6 space-y-4 flex-1 max-h-[400px] overflow-y-auto">
          <h1 className="text-xl font-bold font-urbanist">Order Summary</h1>

          <div className="flex gap-2">
            <input
              name="coupon"
              value={form.coupon}
              onChange={handleInputChange}
              type="text"
              placeholder="Enter Coupon Code"
              className="input-field w-full"
            />
            <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium">
              Apply
            </button>
          </div>

          <h1 className="text-xl font-bold font-urbanist">
            Select Payment Method
          </h1>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash On Delivery
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card
            </label>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between text-base font-semibold">
              Total:
              <span className="text-red-500 text-xl">
                ₫{cartTotal.toLocaleString("vi-VN")}
              </span>
            </div>

            <button
              className={`mt-4 w-full py-2 font-medium transition duration-200 ${
                isFormIncomplete || isProcessing
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-primary text-white hover:opacity-90"
              }`}
              onClick={handleCheckout}
              disabled={isFormIncomplete || isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm checkout"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#F9F1E7] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center justify-center space-y-6">
            <img className="h-24 w-24" src="/check.png" alt="Checkmark Icon" />
            <h2 className="text-2xl text-[#008080] font-bold text-center">
              Thank You For Your Order
            </h2>
            <p className="text-center text-gray-700">
              Your order has been successfully placed. You can continue shopping
              or review your orders.
            </p>
            <div className="flex flex-row space-x-4">
              <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-white hover:text-black">
                Continue Shopping
              </button>
              <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-white hover:text-black">
                View Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
