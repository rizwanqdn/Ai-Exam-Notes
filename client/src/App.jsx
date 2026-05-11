import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/auth";
import axios from "axios";
import { getUser } from "./services/api";
import { useDispatch, useSelector } from "react-redux";
import History from "./pages/History";
import Credits from "./pages/Credits";
import Notes from "./pages/Notes";
import ViewNote from "./pages/viewNote";
import Diagrams from "./pages/diagrams";

export const serverUrl = "https://ai-exam-notes-server.onrender.com";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    getUser(dispatch);
  }, [dispatch]);

  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/auth"
          element={userData ? <Navigate to="/" replace /> : <Auth />}
        />
        <Route path="/history" element={<History />} />

        <Route path="/credits" element={<Credits />} />
        <Route path="/history" element={<History />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:id" element={<ViewNote />} />
        <Route path="/diagrams" element={<Diagrams />} />
      </Routes>
    </>
  );
}

export default App;
