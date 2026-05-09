import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbNotes, TbHistory, TbChartPie, TbBinaryTree } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";
import mermaid from "mermaid";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Import your dummy data (or pass this as props/fetch it)
import { dummyNotesResponse } from "../data/dummyData";

// Colors for the Recharts Pie Chart
const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

function Diagrams() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Using dummy data for immediate UI rendering
  const { content, topic, classLevel, examType } = dummyNotesResponse.data;
  const { diagram, charts } = content;

  // Initialize Mermaid.js when the component mounts
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
    });
    mermaid.contentLoaded();
  }, [diagram]);

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
                Visual Learning
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
          <IoArrowBackOutline size={20} /> Back to Notes
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          {/* Header Block */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 capitalize mb-3">
              Visuals: {topic || "Study Topic"}
            </h1>
            <div className="flex gap-2">
              {classLevel && (
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium uppercase">
                  Class {classLevel}
                </span>
              )}
              {examType && (
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium uppercase">
                  {examType}
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-4">
              Explore the architectural flow and statistical breakdowns
              generated for this topic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. MERMAID FLOWCHART DIAGRAM */}
            {diagram && diagram.type === "graph" && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col h-full">
                <h2 className="text-xl font-bold text-indigo-800 mb-6 flex items-center gap-2 border-b border-indigo-100 pb-4">
                  <TbBinaryTree size={24} /> Architecture Flow
                </h2>
                <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-4 overflow-x-auto">
                  {/* Mermaid requires the class "mermaid" to auto-render the text inside */}
                  <div className="mermaid">{diagram.data}</div>
                </div>
              </div>
            )}

            {/* 2. RECHARTS PIE CHART */}
            {charts && charts.length > 0 && charts[0].type === "pie" && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col h-full">
                <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2 border-b border-blue-100 pb-4">
                  <TbChartPie size={24} /> {charts[0].title || "Data Breakdown"}
                </h2>
                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts[0].data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {charts[0].data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Diagrams;
