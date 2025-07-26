// app/checkout/page.tsx

"use client";

import React from "react";
import CheckoutForm from "../../components/CheckoutForm";

const CheckoutPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
        <CheckoutForm />
      </div>
    </main>
  );
};

export default CheckoutPage;
