import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Context";
import "./CarbonIntensity.css"; // Import CSS file
import RegionDropdown from "./RegionDropdown";
import RegionDataTable from "./RegionDataTable";

const CarbonIntensity = () => {
  const [intensityForecast, setIntensityForecast] = useState<number | null>(
    null
  );
  const [carbonIntensity, setCarbonIntensity] = useState<number | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [pastData, setPastData] = useState<any | null>(null);
  const [pastMonthData, setPastMonthData] = useState<any | null>(null);
  const [selectedRegionData, setSelectedRegionData] = useState<any | null>(
    null
  );
  const { setRegion, setRegionalData, regionalData } = useContext(Context);

  // Fetch carbon intensity data on component mount
  useEffect(() => {
    const fetchCarbonIntensity = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `https://api.carbonintensity.org.uk/regional`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch carbon intensity");
        }
        const data = await response.json();
        setRegionalData(data);

        // Set forecast and actual intensity values
        const forecast = data?.data[0]?.regions[0]?.intensity?.forecast || null;
        const actualIntensity =
          data?.data[0]?.regions[0]?.intensity?.actual || null;

        // Set both the forecast and actual intensity
        setIntensityForecast(forecast);
        setCarbonIntensity(actualIntensity);
      } catch (error) {
        console.error("Error fetching carbon intensity:", error);
      }
    };

    fetchCarbonIntensity();
  }, [setRegionalData]);

  // Fetch past week carbon intensity data
  useEffect(() => {
    const fetchPastWeekData = async () => {
      if (selectedRegionId != null) {
        try {
          const currentDate = new Date(Date.now());
          const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days worth of milliseconds
          const formattedPastDate =
            pastDate.toISOString().substring(0, 16) + "Z";
          const formattedCurrentDate =
            currentDate.toISOString().substring(0, 16) + "Z";
          setPastData(null);
          const response = await fetch(
            `https://api.carbonintensity.org.uk/regional/intensity/${formattedPastDate}/${formattedCurrentDate}/regionid/${selectedRegionId}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch past week's carbon intensity data`
            );
          }
          const data = await response.json();
          setPastData(data);
        } catch (error) {
          console.error(
            "Error fetching past week's carbon intensity data:",
            error
          );
        }
      }
    };
    fetchPastWeekData();
  }, [selectedRegionId]);

  // Fetch past month data
  useEffect(() => {
    const fetchPastMonthData = async () => {
      if (selectedRegionId != null) {
        try {
          const currentDate = new Date(Date.now());
          const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Subtract 30 days worth of milliseconds
          const formattedPastDate =
            pastDate.toISOString().substring(0, 16) + "Z";
          const formattedCurrentDate =
            currentDate.toISOString().substring(0, 16) + "Z";
          setPastMonthData(null);
          const response = await fetch(
            `https://api.carbonintensity.org.uk/regional/intensity/${formattedPastDate}/${formattedCurrentDate}/regionid/${selectedRegionId}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch past month's carbon intensity data`
            );
          }
          const data = await response.json();
          setPastMonthData(data);
        } catch (error) {
          console.error(
            "Error fetching past month's carbon intensity data:",
            error
          );
        }
      }
    };
    fetchPastMonthData();
  }, [selectedRegionId]);

  // Handle region change
  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionId = parseInt(event.target.value);
    setSelectedRegionId(selectedRegionId);
  };

  // Set selected region data
  useEffect(() => {
    if (regionalData) {
      setSelectedRegionData(
        regionalData.data[0].regions.find(
          (element: any) => element.regionid === selectedRegionId
        )
      );
    }
  }, [selectedRegionId, regionalData]);

  return (
    <div className="container">
      <div className="content">
        <h1>Today's Carbon Intensity Forecast</h1>
        <p>Forecast for UK: {intensityForecast} gCO2/kWh</p>
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
              <td>{carbonIntensity ? carbonIntensity : "N/A"} gCO2/kWh</td>
              <td>{intensityForecast ? intensityForecast : "N/A"} gCO2/kWh</td>
            </tr>
          </tbody>
        </table>

        <h2>Select a region:</h2>
        <RegionDropdown onChange={handleRegionChange} />
      </div>

      {selectedRegionData && (
        <div className="content">
          <h2>Regional Data</h2>
          <p>Forecast: {selectedRegionData?.intensity.forecast} gCO2/kWh</p>

          <div className="inline-headings-container">
            <h3>Past Week Intensity:</h3>
            <h3>Past Month Intensity:</h3>
          </div>

          <div className="side-panel">
            <RegionDataTable data={pastData} />
            <RegionDataTable data={pastMonthData} />
          </div>
          <Link to={`/region/${selectedRegionId}`}>Go to region</Link>
        </div>
      )}
    </div>
  );
};

export default CarbonIntensity;
