// CarbonIntensity.tsx

import React, { useState, useEffect, FC } from "react";

let CarbonIntensity = () => {
  const [carbonIntensity, setCarbonIntensity] = useState<number | null>(null);

  useEffect(() => {
    const fetchCarbonIntensity = async () => {
      try {
        console.log("test");
        const currentDate = new Date().toISOString().split("T")[0];
        console.log(currentDate);
        const response = await fetch(
          `https://api.carbonintensity.org.uk/intensity?date=${currentDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch carbon intensity");
        }
        const data = await response.json();
        const intensityValue = data.data[0].intensity.actual;
        setCarbonIntensity(intensityValue);
      } catch (error) {
        console.error("Error fetching carbon intensity:", error);
      }
    };

    fetchCarbonIntensity();
  }, []);

  return (
    <>
      <h1>Today's Carbon Intensity</h1>
      {carbonIntensity !== null ? (
        <p>Overall Carbon Intensity: {carbonIntensity} gCO2/kWh</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default CarbonIntensity;
