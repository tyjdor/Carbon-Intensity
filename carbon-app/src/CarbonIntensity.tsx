import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Context";
import "./CarbonIntensity.css"; // Import CSS file
import RegionDropdown from "./RegionDropdown";
import { getRegionalIntensityTimeRange } from "./Api";
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
      } catch (error) {
        console.error("Error fetching carbon intensity:", error);
      }
    };

    fetchCarbonIntensity();
  }, []);
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

          const response = await fetch(
            `https://api.carbonintensity.org.uk/regional/intensity/${formattedPastDate}/${formattedCurrentDate}/regionid/${selectedRegionId}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch past weeks carbon intensity data`);
          }
          const data = await response.json();
          setPastData(data);

          return data.data[0]?.intensity.forecast;
        } catch (error) {
          console.error(
            "error fetching past weeks carbon intensity data:",
            error
          );
          return null;
        }
      }
    };
    fetchPastWeekData();
  }, [selectedRegionId]);
  const renderPastDataByHour = () => {
    if (!pastData || !pastData.data.data) return null;
    return pastData.data.data.map((entry: any, index: number) => (
      <tr key={index}>
        <td>
          {new Date(entry.from).toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td>{entry.intensity.forecast}gCO2/kWh</td>
      </tr>
    ));
  };
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

          const response = await fetch(
            `https://api.carbonintensity.org.uk/regional/intensity/${formattedPastDate}/${formattedCurrentDate}/regionid/${selectedRegionId}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch past weeks carbon intensity data`);
          }
          const data = await response.json();
          setPastMonthData(data);

          return data.data[0]?.intensity.forecast;
        } catch (error) {
          console.error(
            "error fetching past weeks carbon intensity data:",
            error
          );
          return null;
        }
      }
    };
    fetchPastMonthData();
  }, [selectedRegionId]);
  useEffect(() => {
    const fetchPastWeekData = async () => {
      if (selectedRegionId != null) {
        const currentDate = new Date(Date.now());
        const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days worth of milliseconds
        const data = await getRegionalIntensityTimeRange(
          selectedRegionId,
          pastDate,
          currentDate
        );
        setPastData(data);
      }
    };
    fetchPastWeekData();
  }, [selectedRegionId]);
  const renderPastMonthByHour = () => {
    if (!pastMonthData || !pastMonthData.data.data) return null;
    return pastMonthData.data.data.map((entry: any, index: number) => (
      <tr key={index}>
        <td>
          {new Date(entry.from).toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td>{entry.intensity.forecast}gCO2/kWh</td>
      </tr>
    ));
  };
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
        const intensityForecast = data.data[0].intensity.forecast;
        setCarbonIntensity(intensityValue);
        setIntensityForecast(intensityForecast);
      } catch (error) {
        console.error("Error fetching carbon intensity:", error);
      }
    };

    fetchCarbonIntensity();
  }, []);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionId = parseInt(event.target.value);
    setSelectedRegionId(selectedRegionId);
  };
  useEffect(() => {
    if (regionalData) {
      setSelectedRegionData(
        regionalData.data[0].regions.find(
          (element: any) => element.regionid === selectedRegionId
        )
      );
    }
  }, [selectedRegionId]);
  // useEffect(() => {
  //   setRegion(selectedRegionData);
  // }, [selectedRegionData]);
  return (
    <>
      <div className="container">
        <div
          className="content"
          style={{ flex: "1 1 50%", paddingRight: "10px" }}
        >
          <h1>Today's Carbon Intensity Forecast</h1>
          <p>Forecast for UK: {intensityForecast} gCO2/kWh</p>
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
                  <td>{carbonIntensity} gCO2/kWh</td>
                  <td>{intensityForecast} gCO2/kWh</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h2>Select a region:</h2>
          <RegionDropdown onChange={handleRegionChange}></RegionDropdown>
          {/* <select value={selectedRegionId || ""} onChange={handleRegionChange}>
            <option value="">Choose Region</option>
            {regionSelectList?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select> */}
        </div>
        <div className="content" style={{ flex: "1 1 50%" }}>
          {selectedRegionData && (
            <div>
              <h2>Regional Data</h2>
              <p>Forecast: {selectedRegionData?.intensity.forecast} gCO2/kWh</p>
              <h3>Generation Mix:</h3>
              <ul>
                {selectedRegionData?.generationmix?.map(
                  (fuel: any, index: number) => (
                    <li key={index}>
                      {fuel.fuel}: {fuel.perc}%
                    </li>
                  )
                )}
              </ul>
              <h3>Past Week Intensity:</h3>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid black",
                  }}
                >
                  <thead>
                    <tr>
                      <th>time</th>
                      <th>Forecast Intensity</th>
                    </tr>
                  </thead>
                  <tbody>{renderPastDataByHour()}</tbody>
                </table>
              </div>
              <h3>Past Month Intensity:</h3>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid black",
                  }}
                >
                  <thead>
                    <tr>
                      <th>time</th>
                      <th>Forecast Intensity</th>
                    </tr>
                  </thead>
                  <tbody>{renderPastMonthByHour()}</tbody>
                </table>
              </div>

              <Link to={`/region/${selectedRegionId}`}>go to region</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CarbonIntensity;
