import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { TbNotes, TbChartPie, TbBinaryTree } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { serverUrl } from "../App";
import mermaid from "mermaid";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Colors for the Recharts Pie Chart
const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

function ViewNote({ id }) {
  // const { id } = useParams(); // Gets the note ID from the URL
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Note Data
  useEffect(() => {
    const fetchSingleNote = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${serverUrl}/api/gemini/fetchnotes/${id}`,
          {
            withCredentials: true,
          },
        );

        const noteData = response.data?.data || response.data;
        setNote(noteData);
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to load this note. It might have been deleted.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSingleNote();
  }, [id]);

  // 2. Initialize Mermaid.js when note data successfully loads
  useEffect(() => {
    if (note?.content?.diagram) {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "Inter, sans-serif",
      });
      // Small timeout ensures the DOM has rendered the <div className="mermaid"> element before scanning
      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, [note]);

  // Helper to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen    font-sans flex flex-col">
      {/* MAIN CONTENT AREA */}
      <div className="mx-auto w-full max-w-[1200px]">
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100">
            <AiOutlineLoading3Quarters
              className="animate-spin text-blue-500 mb-4"
              size={40}
            />
            <p className="text-gray-500 font-medium">Loading your notes...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-10 rounded-3xl text-center shadow-sm">
            <p className="text-xl font-bold mb-2">Oops!</p>
            <p>{error}</p>
            <button
              onClick={() => navigate("/history")}
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition"
            >
              Return to History
            </button>
          </div>
        )}

        {/* NOTE DATA VIEW */}
        {note && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            {/* Header Block */}
            <div className="bg-white rounded-3xl p-5  flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 capitalize mb-3">
                  {note.topic}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {note.classLevel && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 text-sm px-3 py-1 rounded-full font-bold uppercase">
                      Class {note.classLevel}
                    </span>
                  )}
                  {note.examType && (
                    <span className="bg-purple-50 text-purple-700 border border-purple-100 text-sm px-3 py-1 rounded-full font-bold uppercase">
                      {note.examType}
                    </span>
                  )}
                  <span className="text-gray-400 text-sm font-medium pl-2">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
              </div>

              {note.content?.importance && (
                <div className="bg-yellow-50 border border-yellow-200 px-6 py-3 rounded-2xl flex flex-col items-center">
                  <span className="text-xs text-yellow-700 font-bold uppercase tracking-wider mb-1">
                    Importance
                  </span>
                  <span className="text-2xl tracking-widest">
                    {note.content.importance}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col w-full md:flex-row gap-2 items-start">
              {/* LEFT COLUMN: Subtopics & Short Questions */}
              <div className="w-full md:w-1/3 space-y-2 ">
                {/* SubTopics */}
                {note.content?.subTopics && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                      Sub-Topics Tracker
                    </h2>
                    <div className="space-y-4">
                      {Object.entries(note.content.subTopics).map(
                        ([star, topics]) => (
                          <div key={star}>
                            <p className="font-bold text-gray-700 mb-1">
                              {star} Priority
                            </p>
                            <ul className="pl-4 border-l-2 border-gray-100 space-y-2">
                              {topics.map((item, i) => (
                                <li
                                  className="text-sm text-gray-600 font-medium"
                                  key={i}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Short Questions */}
                {note.content?.questions?.short && (
                  <div className="bg-amber-50 rounded-3xl p-3 border border-amber-100 shadow-sm">
                    <h2 className="text-lg font-bold text-amber-900 mb-2 border-b border-amber-200 pb-2">
                      Short Questions
                    </h2>
                    <div className="space-y-2">
                      {note.content.questions.short.map((short, i) => (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-xl shadow-sm text-sm text-amber-900 font-medium"
                        >
                          <span className="font-bold text-amber-500 mr-2">
                            Q{i + 1}.
                          </span>{" "}
                          {short}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Detailed Notes, Revision, Long Questions, Diagrams, Charts */}
              <div className="flex-1 w-full space-y-2">
                {/* Detailed Notes */}
                {note.content?.notes && (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                      <TbNotes /> Detailed Study Notes
                    </h2>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-light text-[15px]">
                      {note.content.notes}
                    </div>
                  </div>
                )}

                {/* Quick Revision */}
                {note.content?.revisionPoints && (
                  <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-emerald-800 mb-6">
                      ⚡ Quick Revision Points
                    </h2>
                    <ul className="list-disc pl-5 space-y-3">
                      {note.content.revisionPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-emerald-900 font-medium leading-relaxed"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Long Questions */}
                {note.content?.questions?.long && (
                  <div className="bg-orange-50/50 p-8 rounded-3xl border border-orange-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-orange-800 mb-6">
                      📝 Long Answer Practice
                    </h2>
                    <ul className="list-decimal pl-5 space-y-4">
                      {note.content.questions.long.map((q, i) => (
                        <li
                          key={i}
                          className="text-orange-900 font-medium leading-relaxed"
                        >
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* VISUALS SECTION: Mermaid Architecture Flow */}
                {note.content?.diagram &&
                  note.content.diagram.type === "graph" && (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                        <TbBinaryTree /> Architecture Flow
                      </h2>
                      <div className="flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-6 overflow-x-auto">
                        <div className="mermaid">
                          {note.content.diagram.data}
                        </div>
                      </div>
                    </div>
                  )}

                {/* VISUALS SECTION: Recharts Pie Chart */}
                {note.content?.charts &&
                  note.content.charts.length > 0 &&
                  note.content.charts[0].type === "pie" && (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                        <TbChartPie />{" "}
                        {note.content.charts[0].title || "Data Breakdown"}
                      </h2>

                      {/* 👇 THIS IS THE FIX: Strict height and width applied to the wrapper */}
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={note.content.charts[0].data}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {note.content.charts[0].data.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ),
                              )}
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
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ViewNote;
