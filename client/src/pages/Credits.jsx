import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbNotes, TbHistory, TbCheck, TbDiamond } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { serverUrl } from "../App"; // Adjust this path if necessary
import { setCredits } from "../redux/slice/userSlice";

// Helper function to load the Razorpay script dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Credits() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // States for payment processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();
  // Pricing plans for the UI
  // Note: Added 'numericPrice' to safely pass to the backend instead of "$4.99"
  const plans = [
    {
      id: 1,
      name: "Starter",
      credits: 50,
      price: "$4.99",
      numericPrice: 4.99,
      popular: false,
      desc: "Perfect for quick revisions and occasional study sessions.",
      features: ["50 AI Generations", "Standard Speed", "Basic Support"],
    },
    {
      id: 2,
      name: "Pro Student",
      credits: 250,
      price: "$14.99",
      numericPrice: 14.99,
      popular: true,
      desc: "Our most popular plan. Best for upcoming midterms and finals.",
      features: [
        "250 AI Generations",
        "Priority Generation",
        "24/7 Email Support",
        "Detailed Diagrams",
      ],
    },
    {
      id: 3,
      name: "Ultra Genius",
      credits: 1000,
      price: "$39.99",
      numericPrice: 39.99,
      popular: false,
      desc: "For heavy study sessions, group projects, and educators.",
      features: [
        "1000 AI Generations",
        "Lightning Fast",
        "Premium Support",
        "Early Access Features",
      ],
    },
  ];

  const handleSubmit = async (planPrice, credits, planOffer, planId) => {
    setIsProcessing(true);
    setLoadingPlan(planId);

    try {
      // 1. Load Razorpay
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );

      if (!res) {
        alert(
          "Razorpay failed to load. Please check your internet connection.",
        );
        setIsProcessing(false);
        setLoadingPlan(null);
        return;
      }

      // 2. Create Order on Backend
      const result = await axios.post(
        `${serverUrl}/api/razorpay/order`,
        {
          planId: planOffer,
          amount: planPrice,
          credits: credits,
        },
        { withCredentials: true },
      );

      // 3. Open Razorpay Window
      const { amount, id: order_id, currency } = result.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is in your .env file
        amount: amount,
        currency: currency,
        name: "ExamNotes AI",
        description: `Upgrade to ${planOffer} Plan`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // 4. Verify Payment
            const verifyResult = await axios.post(
              `${serverUrl}/api/razorpay/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true },
            );
            console.log(verifyResult);
            if (verifyResult.data.success) {
              alert("Payment Successful! Credits added.");
              dispatch(setCredits(verifyResult.data.creditLeft));
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#4f46e5" }, // Indigo color to match your app theme
        modal: {
          ondismiss: function () {
            // Handle if user closes the modal without paying
            setIsProcessing(false);
            setLoadingPlan(null);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong while initiating the payment.");
      setIsProcessing(false);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6 md:p-10 font-sans flex flex-col">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 md:p-10 p-4 right-0 z-50 flex justify-center px-4"
      >
        <div className="w-full max-w-[1600px] bg-gradient-to-b from-black/80 via-gray-900/95 to-black border-t backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-2xl flex justify-between items-center shadow-2xl">
          {/* Logo Section */}
          <div
            className="flex items-center gap-2 font-bold text-xl cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">
              🚀
            </div>
            <div className="flex text-sm md:text-md flex-col ">
              ExamNotes AI{" "}
              <span className="text-xs text-gray-400 font-normal">
                Credits & Billing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {userData && (
              <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                <button
                  onClick={() => navigate("/history")}
                  className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-2 hover:bg-white/20 transition active:scale-95 "
                >
                  <TbHistory size={18} className="text-blue-400" /> History
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-2 hover:bg-white/20 transition active:scale-95 "
                >
                  <TbNotes size={18} className="text-green-400" /> New Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <div className="mx-auto w-full max-w-[1200px] mt-32 md:mt-36 pb-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition mb-6 px-2 w-fit"
        >
          <IoArrowBackOutline size={20} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-10"
        >
          {/* Current Balance Hero Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
                  <TbDiamond className="text-blue-400" /> Your Credits
                </h1>
                <p className="text-indigo-200 text-lg max-w-md">
                  1 Credit = 1 Comprehensive AI Study Note Generation (including
                  subtopics, questions, and revision points).
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 min-w-[250px] text-center shadow-inner">
                <p className="text-indigo-200 font-medium mb-1 uppercase tracking-widest text-sm">
                  Available Balance
                </p>
                <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300 flex items-center justify-center gap-2">
                  <span className="text-blue-300 text-4xl">◆</span>
                  {userData?.credits || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Plans Section */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Top Up Your Credits
              </h2>
              <p className="text-gray-500">
                Choose the perfect plan for your exam season. No monthly
                subscriptions, pay as you go.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-3xl p-8 flex flex-col shadow-lg border-2 transition-transform hover:-translate-y-2 ${
                    plan.popular
                      ? "border-blue-500 shadow-blue-500/20"
                      : "border-gray-100"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6 border-b border-gray-100 pb-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-end justify-center gap-1 mb-2">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 font-medium pb-1">
                        / one-time
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mt-2 border border-blue-100">
                      <TbDiamond /> {plan.credits} Credits
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-6 text-center">
                    {plan.desc}
                  </p>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-700 font-medium text-sm"
                      >
                        <div
                          className={`p-1 rounded-full ${
                            plan.popular
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <TbCheck size={16} />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      handleSubmit(
                        plan.numericPrice,
                        plan.credits,
                        plan.name,
                        plan.id,
                      )
                    }
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                      isProcessing
                        ? "opacity-60 cursor-not-allowed bg-gray-400 text-white"
                        : plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-95"
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <AiOutlineLoading3Quarters className="animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      `Buy ${plan.credits} Credits`
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Credits;
