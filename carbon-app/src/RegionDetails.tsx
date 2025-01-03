import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Context } from "./Context";
import RegionDropdown from "./RegionDropdown";
import { getRegionalIntensityTimeRange } from "./Api";
import "./RegionDetail.css"; // Import the CSS file

const RegionDetails = () => {
  let { id } = useParams();
  const { region, regionalData } = useContext(Context);
  const [showDailyIntensities, setShowDailyIntensities] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [pastData, setPastData] = useState<any>();
  useEffect(() => {
    const fetchPastWeekData = async () => {
      if (id) {
        const data = await getRegionalIntensityTimeRange(
          +id,
          startDate,
          endDate
        );
        setPastData(data);
      }
    };
    fetchPastWeekData();
  }, [id, startDate, endDate]);

  // Function to calculate overall carbon intensity for the selected time range
  const calculateOverallIntensity = () => {
    if (!pastData || !pastData.data.data) return null;
    const overallIntensity =
      pastData.data.data.reduce(
        (acc: number, entry: any) => acc + entry.intensity.forecast,
        0
      ) / pastData.data.data.length;
    console.log(pastData);
    return overallIntensity.toFixed(2);
  };

  // Function to group data by day and store intensity values for each day
  const calculateDailyIntensities = () => {
    if (!pastData || !pastData.data.data) return null;
    const dailyIntensities: { [key: string]: number[] } = {};
    pastData.data.data.forEach((entry: any) => {
      const date = new Date(entry.from).toLocaleDateString();
      if (!dailyIntensities[date]) {
        dailyIntensities[date] = [];
      }
      dailyIntensities[date].push(entry.intensity.forecast);
    });
    return dailyIntensities;
  };

  // Function to display carbon intensity for each day within the time range
  const renderDailyIntensities = () => {
    const dailyIntensities = calculateDailyIntensities();
    if (!dailyIntensities) return null;

    const formatNumber = (number: number) => {
      return number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    return (
      <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Date
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Intensity (gCO2/kWh) per Half Hour
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dailyIntensities).map(
              ([date, intensities], index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {date}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                      {intensities.map((intensity, subIndex) => (
                        <li
                          key={subIndex}
                          style={{ fontSize: "1rem", color: "#333" }}
                        >
                          {formatNumber(intensity)} gCO2/kWh
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const navigate = useNavigate();
  const goToRegion = (id: number) => navigate(`/region/${id}`);
  return (
    <div className="region-detail-container">
      <Link to={`/`}>Home</Link>
      <p>{region.shortname}</p>

      <h2>Regional Data</h2>
      <p>Forecast: {region?.intensity.forecast} gCO2/kWh</p>
      <p>Forecast: {region?.intensity.index}</p>

      <div>
        <h3 className="generation-mix">Generation Mix:</h3>
        <ul>
          {region?.generationmix?.map((fuel: any, index: number) => (
            <li key={index}>
              {fuel.fuel}: {fuel.perc}%
            </li>
          ))}
        </ul>
      </div>
      <div className="date-container">
        <div className="dropdown">
          <RegionDropdown onChange={(e: any) => goToRegion(e.target.value)} />
        </div>
        <DatePicker
          className="date-picker"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <DatePicker
          className="date-picker"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
        />
      </div>
      {/* <RegionDataTable data={overallIntensity}/> */}

      <p className="overall-intensity">
        Overall Carbon Intensity for the selected time range:{" "}
        {calculateOverallIntensity()} gCO2/kWh
      </p>

      <h3 className="daily-intensities">Daily Carbon Intensity</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="">{renderDailyIntensities()}</div>
      </div>
    </div>
  );
};

export default RegionDetails;
