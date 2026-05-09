import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbNotes } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegNoteSticky } from "react-icons/fa6";

import { submitPromtAi } from "../services/api";
import { setCredits } from "../redux/slice/userSlice";

function Notes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // State for text inputs
  const [topic, setTopic] = useState("");
  const [classLevel, setclassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [loading, setLoading] = useState(false);

  // State for toggles
  const [revisionMode, setIsRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeCharts] = useState(false);

  // State for UI & Data
  const [progress, setProgress] = useState(0);
  const [progressText, setprogressText] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setprogressText("");
      return;
    }
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 8;
      if (value >= 95) {
        value = 95;
        setprogressText("its almost done");
        clearInterval(interval);
      } else if (value > 70) {
        setprogressText("finalize notes");
      } else if (value > 50) {
        setprogressText("processing content");
      } else {
        setprogressText("Generating notes");
      }
      setProgress(Math.floor(value));
    }, 700);

    return () => clearInterval(interval);
  }, [loading, result]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = await submitPromtAi({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart,
      });
      console.log(revisionMode);
      console.log("Raw API Payload:", payload);

      if (!payload || !payload.data) {
        console.error("Error: The API returned undefined. Check your backend!");
        return;
      }

      dispatch(setCredits(payload.creditLeft));
      setResult(payload.data);
    } catch (error) {
      console.log("Error inside handleGenerate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6 md:p-10 font-sans">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="fixed top-0 left-0 md:p-10 p-4 right-0 z-50 flex justify-center px-4"
      >
        <div className="w-full bg-gradient-to-b from-black/80 via-gray-900/95 to-black border-t backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-2xl flex justify-between items-center shadow-2xl">
          {/* Logo Section */}
          <div
            className="flex items-center gap-2 font-bold text-xl cursor-pointer"
            onClick={() => {
              (window.scrollTo(0, 0), navigate("/"));
            }}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">
              🚀
            </div>
            <div className="flex text-sm md:text-md flex-col ">
              ExamNotes AI{" "}
              <span className="text-xs text-gray-400 font-normal">
                AI-Powered Exam oriented notes & revision
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
                  className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-2 hover:bg-white/20 transition active:scale-95 "
                  onClick={() => navigate("/history")}
                >
                  <span className="text-green-400">
                    <TbNotes size={20} />
                  </span>{" "}
                  Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mx-auto space-y-6 mt-32 md:mt-36 max-w-[1600px]">
        {/* Form Section (Dark Block) */}
        <div className="bg-gradient-to-b from-black/80 via-gray-900 to-black/80 border-t backdrop-blur-2xl rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-4">
            <input
              type="text"
              placeholder="Enter topic (e.g. Web Development)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 border border-white/5 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Class / Level (e.g. Class 10)"
                value={classLevel}
                onChange={(e) => setclassLevel(e.target.value)}
                className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 border border-white/5 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <input
                type="text"
                placeholder="Exam Type (e.g. CBSE, JEE, NEET)"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 border border-white/5 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Toggles Row */}
            <div className="flex flex-wrap items-center gap-6 py-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={revisionMode}
                    onChange={() => setIsRevisionMode(!revisionMode)}
                  />
                  <div
                    className={`block w-11 h-6 rounded-full transition-colors ${revisionMode ? "bg-blue-500" : "bg-white/20"}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${revisionMode ? "translate-x-5" : "translate-x-0"}`}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  Exam Revision Mode
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeDiagram}
                    onChange={() => setIncludeDiagram(!includeDiagram)}
                  />
                  <div
                    className={`block w-11 h-6 rounded-full transition-colors ${includeDiagram ? "bg-blue-500" : "bg-white/20"}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${includeDiagram ? "translate-x-5" : "translate-x-0"}`}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  Include Diagram
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={includeChart}
                    onChange={() => setIncludeCharts(!includeChart)}
                  />
                  <div
                    className={`block w-11 h-6 rounded-full transition-colors ${includeChart ? "bg-blue-500" : "bg-white/20"}`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${includeChart ? "translate-x-5" : "translate-x-0"}`}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                  Include Charts
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold text-lg rounded-2xl py-3 hover:bg-gray-200 transition-colors active:scale-[0.99] flex justify-center items-center gap-2 disabled:opacity-80"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Generate Notes"
              )}
            </button>

            {loading && (
              <div className="w-full mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.6 }}
                  className="bg-green-400/80 p-1 rounded-2xl h-2"
                ></motion.div>
                <p className="text-green-500 flex justify-between text-xs p-1 font-medium mt-1">
                  <span>{progressText}</span>
                  <span>{progress}%</span>
                </p>
                <p className="text-gray-400 text-center text-xs mt-2">
                  It may take 2-5 minutes, please don't close or refresh the
                  page.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Results Section (Light Block) */}
        <div className="bg-white rounded-3xl p-4 md:p-6 min-h-[400px] flex flex-col items-center justify-center shadow-lg border border-gray-100">
          {!result && (
            <div className="text-xl gap-3 flex flex-col justify-center items-center text-center animate-pulse opacity-60">
              <FaRegNoteSticky className="text-gray-300" size={50} />
              <p className="text-gray-400 font-medium text-lg">
                Generated notes will appear here
              </p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex md:flex-row flex-col w-full gap-6 items-start"
            >
              {/* LEFT SIDEBAR: Quick Exam View */}
              <div className="w-full md:w-[380px] md:sticky md:top-36 rounded-3xl border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                <div className="bg-blue-500 p-6">
                  <h1 className="text-white text-2xl font-extrabold text-center">
                    Quick Exam View
                  </h1>
                </div>

                <div className="p-4 space-y-4">
                  {/* Importance Badge */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <span className="font-bold text-gray-700">
                      Exam Importance:
                    </span>
                    <span className="text-lg tracking-widest">
                      {result.importance}
                    </span>
                  </div>

                  {/* Subtopics */}
                  <div>
                    <h2 className="font-bold text-gray-700 mb-3 px-2 flex items-center gap-2">
                      <TbNotes className="text-blue-500" /> Sub-Topics
                      (Priority)
                    </h2>
                    {result?.subTopics &&
                      Object.entries(result.subTopics).map(([star, topics]) => (
                        <div
                          className="mb-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                          key={star}
                        >
                          <p className="font-bold text-gray-800 mb-2">
                            {star} Priority
                          </p>
                          <ul className="pl-4 list-disc space-y-1">
                            {topics.map((item, i) => (
                              <li className="text-sm text-gray-600" key={i}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>

                  {/* Short Questions */}
                  {result?.questions?.short && (
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                      <h2 className="font-bold text-amber-900 mb-3">
                        ❓ Short Questions
                      </h2>
                      <div className="space-y-2">
                        {/* BUG FIXED HERE: Removed [] from short, i */}
                        {result.questions.short.map((short, i) => (
                          <div
                            key={i}
                            className="bg-white p-3 rounded-xl border border-amber-200/50 shadow-sm"
                          >
                            <p className="text-sm text-amber-900 font-medium">
                              Q{i + 1}. {short}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT MAIN CONTENT: Detailed Notes & Data */}
              <div className="flex-1 w-full rounded-3xl border border-gray-200 bg-white p-6 md:p-8 space-y-8 shadow-sm">
                {/* Header */}
                <div className="border-b border-gray-100 pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
                    {topic || "Generated Study Notes"}
                  </h1>
                  <div className="flex gap-2">
                    {classLevel && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                        {classLevel}
                      </span>
                    )}
                    {examType && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                        {examType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Detailed Notes (Markdown/Text) */}
                {result?.notes && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                      <TbNotes /> Detailed Notes
                    </h2>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium">
                      {result.notes}
                    </div>
                  </div>
                )}

                {/* Quick Revision Points */}
                {result?.revisionPoints && result.revisionPoints.length > 0 && (
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <h2 className="text-xl font-bold text-emerald-800 mb-4">
                      ⚡ Quick Revision Points
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {result.revisionPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-emerald-900 font-medium"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Long Answer Questions */}
                {result?.questions?.long &&
                  result.questions.long.length > 0 && (
                    <div className="bg-orange-50/30 p-6 rounded-2xl border border-orange-100">
                      <h2 className="text-xl font-bold text-orange-800 mb-4">
                        📝 Long Answer Practice
                      </h2>
                      <ul className="list-decimal pl-5 space-y-3">
                        {result.questions.long.map((q, i) => (
                          <li key={i} className="text-orange-900 font-medium">
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
