import React from "react";
import { motion } from "framer-motion";
import { linkWithCredential, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slice/userSlice";

const features = [
  {
    icon: "🎁",
    title: "50 Free Credits",
    description: "Start with 50 credits to generate notes without paying.",
  },
  {
    icon: "📘",
    title: "Exam Notes",
    description: "High-yield, revision-ready exam-oriented notes.",
  },
  {
    icon: "📁",
    title: "Project Notes",
    description: "Well-structured documentation for assignments & projects.",
  },
  {
    icon: "📊",
    title: "Charts & Graphs",
    description: "Auto-generated diagrams, charts and flow graphs.",
  },
  {
    icon: "⬇️",
    title: "Free PDF Download",
    description: "Download clean, printable PDFs instantly.",
  },
];

// Animation variants for the staggered grid
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;
      const result = await axios.post(
        serverUrl + "/api/auth/google",
        {
          name,
          email,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      if (result) {
        console.log(result.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] p-6 md:p-12 font-sans flex flex-col items-center overflow-hidden">
      {/* Top Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl bg-[#1c1c1e] text-white rounded-3xl p-6 md:p-8 mb-12 md:mb-20 shadow-lg"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-1">ExamNotes AI</h2>
        <p className="text-gray-400 text-sm">
          AI-powered exam-oriented notes & revision
        </p>
      </motion.div>

      {/* Main Content Layout */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
        {/* Left Section - Hero & Auth */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex-1 w-full flex flex-col gap-8 lg:pt-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Unlock Smart <br /> AI Notes
          </h1>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="flex items-center justify-center gap-3 bg-[#1c1c1e] text-white px-8 py-4 rounded-2xl font-semibold w-fit hover:bg-black transition-colors shadow-md"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button>

          <div className="space-y-4 max-w-lg mt-2">
            <p className="text-gray-600 text-lg leading-relaxed">
              You get{" "}
              <span className="font-bold text-gray-800">50 FREE credits</span>{" "}
              to create exam notes, project notes, charts, graphs and download
              clean PDFs — instantly using AI.
            </p>
            <p className="text-gray-500 text-sm font-medium">
              Start with 50 free credits • Upgrade anytime for more credits •
              Instant access
            </p>
          </div>
        </motion.div>

        {/* Right Section - Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { type: "spring", stiffness: 400 },
              }}
              className="bg-[#1c1c1e] text-white p-6 md:p-7 rounded-[1.5rem] shadow-xl cursor-default"
            >
              <div className="text-3xl mb-4 drop-shadow-sm">{feature.icon}</div>
              <h3 className="text-[1.1rem] font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed pr-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;
