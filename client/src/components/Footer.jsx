import axios from "axios";
import { signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slice/userSlice";

const Footer = ({ userData }) => {
  const dispatch = useDispatch();
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
  const navigate = useNavigate();

  // Renamed the key to "path" for clarity, but the logic is exactly yours
  const navLinks = [
    { title: "History", path: "/history" },
    { title: "Notes", path: "/notes" },
    { title: "Add Credits", path: "/credits" },
  ];

  return (
    <footer className="bg-gradient-to-b m-4 rounded-2xl from-black via-black/90 to-black border-t border-slate-200 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-gray-500 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                🚀
              </div>
              <span className="text-white/70">ExamNotes</span>
              <span className="text-blue-600">.AI</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Transform scattered lectures into high-yield study material,
              visual diagrams, and revision-ready PDFs in seconds. Built for the
              modern student.
            </p>
          </div>

          {/* Your Dynamic Quick Links */}
          <div>
            <h4 className="font-bold text-white/40 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-600/80">
              {navLinks.map((item, index) => (
                <li
                  key={index} // Added the required React key prop here
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer hover:text-blue-600 transition duration-200"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Extra Resources Column (Optional but recommended for balance) */}
          <div>
            <h4 className="font-bold text-white/40 mb-4">Resources</h4>
            <ul className="space-y-3 text-slate-500">
              {userData && (
                <button
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-red-600"
                >
                  Signout
                </button>
              )}
              <li className="cursor-pointer hover:text-blue-600 transition duration-200">
                Study Guides
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-600/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <div>
            © {new Date().getFullYear()} ExamNotes AI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-slate-600 transition duration-200">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-slate-600 transition duration-200">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
