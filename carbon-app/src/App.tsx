import React, { useState, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import CarbonIntensity from "./CarbonIntensity";
import RegionDetails from "./RegionDetails";
import { Context } from "./Context";

// Define types for region and regional data if available
type RegionType = string | undefined;
type RegionalDataType = Record<string, any> | undefined;

const App: React.FC = () => {
  const [region, setRegion] = useState<RegionType>(undefined);
  const [regionalData, setRegionalData] = useState<RegionalDataType>(undefined);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({ region, setRegion, regionalData, setRegionalData }),
    [region, regionalData]
  );

  return (
    <Context.Provider value={contextValue}>
      <Routes>
        <Route path="/" element={<CarbonIntensity />} />
        <Route path="/region/:id" element={<RegionDetails />} />
      </Routes>
    </Context.Provider>
  );
};

export default App;
