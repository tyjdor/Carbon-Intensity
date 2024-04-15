import React, { useState, useEffect } from "react";

const CarbonIntensity = () => {
  const [intensityForecast, setIntensityForecast] = useState<number | null>(
    null
  );
  const [carbonIntensity, setCarbonIntensity] = useState<number | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [regionalData, setRegionalData] = useState<any | null>(null);

  useEffect(() => {
    const fetchCarbonIntensity = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `https://api.carbonintensity.org.uk/intensity?date=${currentDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch carbon intensity");
        }
        const data = await response.json();
        const intensityValue = data.data[0].intensity.actual;
        const carbonIntensity = data.data[0].intensity.forecast;
        setCarbonIntensity(carbonIntensity);
        setIntensityForecast(intensityValue);
      } catch (error) {
        console.error("Error fetching carbon intensity:", error);
      }
    };

    fetchCarbonIntensity();
  }, []);

  const fetchRegionalIntensity = async (regionId: number) => {
    try {
      const response = await fetch(
        `https://api.carbonintensity.org.uk/regional/regionid/${regionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch regional carbon intensity data");
      }
      const data = await response.json();
      const forecast = data.data[0]?.data[0]?.intensity?.forecast;
      const generationMix = data.data[0]?.data[0]?.generationmix;
      return { forecast, generationMix };
    } catch (error) {
      console.error("Error fetching regional carbon intensity data:", error);
      return null;
    }
  };

  const handleRegionChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRegionId = parseInt(event.target.value);
    setSelectedRegionId(selectedRegionId);
    const regionalData = await fetchRegionalIntensity(selectedRegionId);
    setRegionalData(regionalData);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "1 1 50%", paddingRight: "10px" }}>
          <h1>Today's Carbon Intensity Forecast</h1>
          <p>Forecast for UK: {intensityForecast} gCO2/kWh</p>
          <h2>Select a region:</h2>
          <select value={selectedRegionId || ""} onChange={handleRegionChange}>
            <option value="">Choose Region</option>
            <option value="3">North West England</option>
            <option value="scotland">Scotland</option>
            <option value="wales">Wales</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div style={{ flex: "1 1 50%" }}>
          {regionalData && (
            <div>
              <h2>Regional Data</h2>
              <p>Forecast: {regionalData.forecast} gCO2/kWh</p>
              <h3>Generation Mix:</h3>
              <ul>
                {regionalData.generationMix.map((fuel: any, index: number) => (
                  <li key={index}>
                    {fuel.fuel}: {fuel.perc}%
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2>Today's Total Carbon Intensity</h2>
        <table
          style={{ borderCollapse: "collapse", border: "1px solid black" }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Actual Intensity</th>
              <th>Forecast Intensity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{new Date().toLocaleDateString()}</td>
              <td>{intensityForecast} gCO2/kWh</td>
              <td>{carbonIntensity} gCO2/kWh</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CarbonIntensity;
