import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbNotes, TbHistory } from "react-icons/tb";
import { FaRegFolderOpen } from "react-icons/fa6";
import { MdOutlineDateRange, MdArrowForwardIos } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function History() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [notesHistory, setNotesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(serverUrl + "/api/gemini/fetchnotes", {
          withCredentials: true,
        });

        console.log("Fetched History:", response.data);

        // Safely set the data based on how your backend wraps it (e.g., response.data.data or response.data)
        const historyData = response.data?.data || response.data || [];

        // Sort by newest first (optional, if backend doesn't do it)
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

  // Helper to format the MongoDB ISO date into a readable string
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
                Study History
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {userData && (
              <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                <button
                  onClick={() => navigate("/credits")}
                  className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-white/20 transition active:scale-95"
                >
                  <span className="text-blue-400">◆</span>{" "}
                  {userData.credits || 0}
                  <span className="bg-white/20 rounded-full px-1 text-[10px]">
                    +
                  </span>
                </button>

                <button
                  onClick={() => navigate("/notes")}
                  className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-2 hover:bg-white/20 transition active:scale-95 "
                >
                  <span className="text-blue-400">
                    <TbNotes size={20} />
                  </span>{" "}
                  New Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <div className="mx-auto w-full max-w-[1400px] mt-32 md:mt-36">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <TbHistory size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Saved Notes
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Access all your previously generated study materials
            </p>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AiOutlineLoading3Quarters
              className="animate-spin text-blue-500 mb-4"
              size={40}
            />
            <p className="text-gray-500 font-medium">
              Fetching your study history...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <p className="font-bold mb-2">Oops!</p>
            <p>{error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && notesHistory.length === 0 && (
          <div className="bg-white rounded-3xl p-10 min-h-[400px] flex flex-col items-center justify-center shadow-sm border border-gray-100">
            <FaRegFolderOpen className="text-gray-300 mb-4" size={60} />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No history found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't generated any study notes yet. Head over to the
              generator to create your first set of notes!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition active:scale-95"
            >
              Generate Notes Now
            </button>
          </div>
        )}

        {/* GRID OF HISTORY CARDS */}
        {!loading && !error && notesHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10"
          >
            {notesHistory.map((note, index) => (
              <motion.div
                key={note._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                // Assuming you'll create a route like /notes/:id to view the full note later
                onClick={() => navigate(`/notes/${note._id}`)}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                      <TbNotes size={20} />
                    </div>
                    {/* Stars */}
                    {note.content?.importance && (
                      <span className="text-sm tracking-widest bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                        {note.content.importance}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 capitalize mb-3 line-clamp-2">
                    {note.topic || "Untitled Topic"}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.classLevel && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium uppercase">
                        Class {note.classLevel}
                      </span>
                    )}
                    {note.examType && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium uppercase">
                        {note.examType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 gap-1.5 font-medium">
                    <MdOutlineDateRange size={16} />
                    {formatDate(note.createdAt)}
                  </div>

                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm font-bold">
                    View <MdArrowForwardIos size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default History;
