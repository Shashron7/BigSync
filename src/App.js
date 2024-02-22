import "./App.css";
import Navbar from "./Components/Navbar";
import InputFile from "./Components/InputFile";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Vis from "./Components/Vis";
import View from "./Components/View";
import { useLocation } from "react-router-dom";
import Predict from "./Components/Predict";

function App() {
  
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div
          className="d-flex justify-content-center"
          style={{ marginTop: "20px" }}
        >
        </div>
        <Routes>
        <Route path="/" element={<InputFile />}></Route>

          <Route path="/view" element={<View />}></Route>
          <Route path="/vis" element={<Vis />}></Route>
          <Route path="/predict" element={<Predict />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
