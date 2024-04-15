import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CarbonIntensity from "./CarbonIntensity";
import RegionDetails from "./RegionDetails"; // Import your RegionDetails component
import { Context } from "./Context";

const App = () => {
  const [region, setRegion] = useState();
  return (
    <Context.Provider value={{ region, setRegion }}>
      <Routes>
        <Route path="/" element={<CarbonIntensity />} />
        <Route path="/region/:id" element={<RegionDetails />} />
      </Routes>
    </Context.Provider>
  );
};

export default App;
