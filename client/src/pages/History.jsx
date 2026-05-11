import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TbNotes, TbHistory } from "react-icons/tb";
import { FaRegFolderOpen } from "react-icons/fa6";
import {
  MdOutlineDateRange,
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ViewNote from "./viewNote";
import { FaArrowRight } from "react-icons/fa";

function History() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [notesHistory, setNotesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(serverUrl + "/api/gemini/fetchnotes", {
          withCredentials: true,
        });

        const historyData = response.data?.data || response.data || [];
        const sortedData = Array.isArray(historyData)
          ? historyData.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            )
          : [];

        setNotesHistory(sortedData);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // --- PAGINATION MATH ---
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notesHistory.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notesHistory.length / notesPerPage);

  useEffect(() => {
    setSelectedNoteId(null);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#f8fafc] md:p-8 p-4 font-sans flex flex-col items-center">
      {/* ADVANCED GLASSMORPHISM HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 px-4 py-4 flex justify-center"
      >
        <div className="w-full max-w-7xl bg-white/70 backdrop-blur-xl border border-white/40 text-gray-800 px-6 py-3.5 rounded-3xl flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              🚀
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight">
                ExamNotes AI
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Study History
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userData && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate("/credits")}
                  className="bg-gray-100/80 hover:bg-gray-200 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 text-gray-700"
                >
                  <span className="text-blue-500">◆</span>{" "}
                  {userData.credits || 0}
                </button>
                <button
                  onClick={() => navigate("/notes")}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
                >
                  <TbNotes size={18} /> New Note
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* MAIN DASHBOARD WRAPPER */}
      <div className="w-full max-w-7xl mt-28 md:mt-32 flex flex-col flex-1 h-[calc(100vh-160px)]">
        {/* Title Section */}
        <div
          className={`flex items-center gap-3 mb-6 px-2 transition-all ${selectedNoteId ? "hidden lg:flex" : "flex"}`}
        >
          <div className="bg-white shadow-sm border border-gray-100 p-2.5 rounded-2xl text-blue-600">
            <TbHistory size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Your Saved Notes
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Pick up right where you left off.
            </p>
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <AiOutlineLoading3Quarters
              className="animate-spin text-blue-500 mb-4"
              size={40}
            />
            <p className="text-gray-500 font-medium">Fetching history...</p>
          </div>
        )}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center bg-white rounded-3xl border border-gray-100">
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center max-w-md">
              <p className="font-bold mb-2">Oops!</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && notesHistory.length === 0 && (
          <div className="flex-1 bg-white rounded-3xl flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 p-8">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FaRegFolderOpen className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No history found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              You haven't generated any study notes yet. Head over to the
              generator to create your first set of notes!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95 shadow-gray-900/20"
            >
              Generate Notes Now
            </button>
          </div>
        )}

        {/* APP-LIKE MASTER DETAIL CONTAINER */}
        {!loading && !error && notesHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex w-full bg-white rounded-[2rem] border border-gray-200/80 shadow-[0_8px_40px_rgba(0,0,0,0.04)] overflow-hidden relative"
          >
            {/* LEFT COLUMN: THE LIST */}
            {/* Added mode="wait" to prevent layout glitches during exit animation */}
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed ? (
                <motion.div
                  key="expanded-sidebar"
                  initial={{ opacity: 0, width: 0 }}
                  // 1. Set back to "auto" so it relies on our Tailwind classes below!
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  // 2. The Magic Classes: flex-1 on mobile (full width), but fixed 270px on desktop!
                  className={`relative flex-col bg-white h-full overflow-hidden flex-shrink-0 border-r border-gray-100 ${
                    selectedNoteId
                      ? "hidden lg:flex lg:w-[270px]"
                      : "flex flex-1 w-full lg:flex-none lg:w-[270px]"
                  }`}
                >
                  {/* Inner wrapper prevents text from squishing while width shrinks */}
                  <div className="w-full min-w-full lg:min-w-[270px] flex flex-col h-full">
                    <div className="p-5 bg-white/50 backdrop-blur-md z-10 top-0 flex justify-between items-center">
                      <h2 className="font-semibold text-gray-800">
                        Recent Studies{" "}
                        <span className="text-gray-400 font-normal ml-1">
                          ({notesHistory.length})
                        </span>
                      </h2>
                      {/* DESKTOP: Collapse Sidebar Button */}
                      {!isSidebarCollapsed && (
                        <button
                          onClick={() => setIsSidebarCollapsed(true)}
                          className="hidden animate-pulse lg:flex items-center gap-1 text-gray-500 hover:text-blue-600 font-medium bg-white hover:bg-blue-50 border border-gray-200 px-1 py-1 rounded-lg transition-all text-[12px]"
                        >
                          <MdArrowBack size={12} /> Hide
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto  p-2 space-y-3 custom-scrollbar">
                      {currentNotes.map((note, index) => (
                        <motion.div
                          key={note._id || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                          onClick={() => setSelectedNoteId(note._id)}
                          className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
                            selectedNoteId === note._id
                              ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                              : "border-white bg-white shadow-sm hover:border-gray-200 hover:shadow-md"
                          }`}
                        >
                          <h3
                            className={`font-bold text-sm line-clamp-2 leading-snug mb-2 ${selectedNoteId === note._id ? "text-blue-900" : "text-gray-800"}`}
                          >
                            {note.topic || "Untitled Topic"}
                          </h3>

                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center text-[11px] text-gray-400 gap-1 font-medium">
                              <MdOutlineDateRange size={14} />
                              {formatDate(note.createdAt)}
                            </div>

                            <div className="flex gap-1">
                              {note.classLevel && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${selectedNoteId === note._id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                                >
                                  {note.classLevel}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* PAGINATION FOOTER */}
                    {totalPages > 1 && (
                      <div className="border border-gray-200 bg-white m-2 py-1 px-2 flex justify-between items-center z-10 rounded-xl">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
                        >
                          <MdChevronLeft size={22} />
                        </button>

                        <span className="text-xs font-bold text-gray-500 tracking-widest">
                          {currentPage} / {totalPages}
                        </span>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
                        >
                          <MdChevronRight size={22} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* COLLAPSED SIDEBAR STRIP (Desktop Only) */
                /* Converted to motion.div with a unique key so AnimatePresence recognizes it */
                <motion.div
                  key="collapsed-sidebar"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 20 }} // Animates open to ~40px wide
                  exit={{ opacity: 0, width: 0 }} // Animates closed
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="hidden lg:flex bg-gray-50 hover:bg-gray-100 cursor-pointer items-center justify-center border-r border-gray-200 transition-colors flex-col gap-4 py-2 overflow-hidden"
                  title="Expand List"
                >
                  <div className="min-w-[10px] flex flex-col items-center justify-center gap-4">
                    <FaArrowRight size={10} className="text-black" />
                    <div
                      className="text-black"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      <span className="font-semibold text-sm tracking-widest uppercase">
                        Open List
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RIGHT COLUMN: THE VIEWER */}
            <div
              className={`flex-1 flex-col overflow-hidden ${selectedNoteId ? "flex" : "hidden lg:flex"}`}
            >
              {/* Dynamic Header for Viewer */}
              {selectedNoteId && (
                <div className="flex items-center px-4 py-3 z-20">
                  {/* MOBILE: Back to List Button */}
                  <button
                    onClick={() => setSelectedNoteId(null)}
                    className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <MdArrowBack size={20} /> Back
                  </button>
                </div>
              )}

              {/* Dynamic Content */}
              <div className="flex-1 overflow-y-auto m-2 ">
                <AnimatePresence mode="wait">
                  {selectedNoteId ? (
                    <motion.div
                      key={selectedNoteId}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-full"
                    >
                      <ViewNote id={selectedNoteId} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col h-full items-center justify-center text-gray-400 pointer-events-none"
                    >
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
                        <TbNotes size={40} className="text-gray-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600">
                        Select a Note
                      </h3>
                      <p className="text-sm mt-2 text-gray-400 max-w-xs text-center">
                        Tap a study note from the list on the left to view your
                        generated content here.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default History;
