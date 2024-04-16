import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Context } from "./Context";
import RegionDropdown from "./RegionDropdown";
import { getRegionalIntensityTimeRange } from "./Api";

const RegionDetails = () => {
  let { id } = useParams();
  const { region, regionalData } = useContext(Context);
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
    const overallIntensity = pastData.data.data.reduce(
      (acc: number, entry: any) => acc + entry.intensity.forecast,
      0
    );
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
    return Object.entries(dailyIntensities).map(
      ([date, intensities], index) => (
        <div key={index}>
          <p>{date}:</p>
          <ul>
            {intensities.map((intensity, subIndex) => (
              <li key={subIndex}>{intensity} gCO2/kWh</li>
            ))}
          </ul>
        </div>
      )
    );
  };

  const navigate = useNavigate();
  const goToRegion = (id: number) => navigate(`/region/${id}`);
  return (
    <>
      <p>{region.shortname}</p>
      <h2>Regional Data</h2>
      <p>Forecast: {region?.intensity.forecast} gCO2/kWh</p>
      <p>Forecast: {region?.intensity.index}</p>
      <h3>Generation Mix:</h3>
      <ul>
        {region?.generationmix?.map((fuel: any, index: number) => (
          <li key={index}>
            {fuel.fuel}: {fuel.perc}%
          </li>
        ))}
      </ul>
      <RegionDropdown
        onChange={(e: any) => goToRegion(e.target.value)}
      ></RegionDropdown>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      {/* <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            border: "1px solid black",
          }}
        >
          <thead>
            <tr>
              <th>Time</th>
              <th>Forecast Intensity</th>
            </tr>
          </thead>
          <tbody>{renderPastData()}</tbody>
        </table>
      </div> */}
      <p>
        Overall Carbon Intensity for the selected time range:{" "}
        {calculateOverallIntensity()} gCO2/kWh
      </p>
      <h3>Daily Carbon Intensity</h3>
      {renderDailyIntensities()}
    </>
  );
};

export default RegionDetails;
