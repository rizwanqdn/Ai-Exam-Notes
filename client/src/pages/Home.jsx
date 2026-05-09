import React, { useState } from "react"; // Added useState
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Added to access userData
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal"; // Ensure you have the Modal component
import { setUserData } from "../redux/slice/userSlice";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // States for popups
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  const features = [
    {
      title: "Exam Notes",
      desc: "High-yield exam-oriented notes with revision points.",
      icon: "📘",
      color: "bg-blue-500",
      navigate: "/notes",
    },
    {
      title: "Project Notes",
      desc: "Well-structured content for assignments and projects.",
      icon: "📁",
      color: "bg-yellow-500",
      navigate: "/projectnotes",
    },
    {
      title: "Diagrams",
      desc: "Auto-generated visual diagrams for clarity.",
      icon: "📊",
      color: "bg-green-500",
      navigate: "/diagrams",
    },
    {
      title: "PDF Download",
      desc: "Download clean, printable PDFs instantly.",
      icon: "⬇️",
      color: "bg-blue-600",
      navigate: "/pdf",
    },
    {
      title: "History Notes",
      desc: "Find Your previous history",
      icon: "⬇️",
      color: "bg-cyan-400",
      navigate: "/history",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-indigo-100">
      {/* Pass functions to Navbar */}
      <Navbar
        onLogout={handleSignOut}
        openCredits={() => setIsCreditOpen(true)}
        openProfile={() => setIsProfileOpen(true)}
      />

      <main className="max-w-6xl mx-auto pt-32 pb-20 px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            Create Smart <br />{" "}
            <span className="text-gray-700">AI Notes in Seconds</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-lg">
            Generate exam-focused notes, project documentation, flow diagrams
            and revision-ready content using AI — faster, cleaner and smarter.
          </p>
          <button
            className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition transform shadow-xl shadow-black/20"
            onClick={() => navigate("/notes")}
          >
            Get Started
          </button>
        </div>

        <div className="flex-1 relative">
          <img
            src="https://img.freepik.com/free-vector/creative-team-concept-illustration_114360-3735.jpg"
            alt="Learning Illustration"
            className="w-full h-auto rounded-3xl"
          />
        </div>
      </main>

      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            // 1. Stagger the entrance animation using the index (i)
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            // 2. Handle hover and tap entirely in Framer Motion
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(f.navigate)}
            className="bg-black text-white p-8 rounded-[32px] shadow-xl shadow-black/10 cursor-pointer"
          >
            <div
              className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg`}
            >
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Credits Modal */}
      <Modal
        isOpen={isCreditOpen}
        onClose={() => setIsCreditOpen(false)}
        title="Credits"
      >
        <div className="text-center">
          <div className="text-5xl font-black text-indigo-600 mb-2">
            {userData?.credits || 0}
          </div>
          <p className="text-gray-500 mb-6">Remaining Generations</p>
          <button className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition"
          onClick={()=>navigate("/credits")}
          >
            Upgrade Plan
          </button>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Account"
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-3xl text-white font-bold mb-4">
            {userData?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-lg font-bold">{userData?.name}</h3>
          <p className="text-gray-500 mb-6">{userData?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full py-2 text-red-500 font-medium hover:bg-red-50 rounded-lg transition"
          >
            Logout Account
          </button>
        </div>
      </Modal>

      <Footer userData={userData} signOut={handleSignOut} />
    </div>
  );
}

export default Home;
