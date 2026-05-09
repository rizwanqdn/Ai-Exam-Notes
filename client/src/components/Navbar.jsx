import React from "react";
import { useSelector } from "react-redux";

const Navbar = ({ onLogout, openCredits }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-6xl bg-black/90 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full flex justify-between items-center shadow-2xl">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 font-bold text-xl cursor-pointer"
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">
            🚀
          </div>
          ExamNotes AI
        </div>

        <div className="flex items-center gap-6">
          {userData && (
            <div className="flex items-center gap-4">
              {/* Credits Trigger */}
              <button
                onClick={openCredits}
                className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-white/20 transition active:scale-95"
              >
                <span className="text-blue-400">◆</span> {userData.credits || 0}
                <span className="bg-white/20 rounded-full px-1 text-[10px]">
                  +
                </span>
              </button>

              {/* Sign Out Button (Optional: you can move this inside Profile popup) */}
              <button
                onClick={onLogout}
                className="hidden md:block text-sm bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-1 rounded-full transition"
              >
                Sign Out
              </button>

              {/* Profile Avatar Trigger */}
              <button className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full border border-white/20 flex items-center justify-center hover:ring-2 hover:ring-indigo-400 transition active:scale-90">
                {userData.name?.charAt(0).toUpperCase()}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
