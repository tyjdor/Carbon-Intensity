import React, { FC } from "react";
import "./RegionDataTable.css";

// Define types for the data prop
interface RegionData {
  from: string;
  intensity: {
    forecast: number;
  };
}

interface RegionDataTableProps {
  data: {
    data: {
      data: RegionData[];
    };
  } | null;
}

const RegionDataTable: FC<RegionDataTableProps> = ({ data }) => {
  // Function to render data for past hours
  const renderPastDataByHour = () => {
    if (!data || !data.data || !data.data.data) return null;

    return data.data.data.map((entry, index) => (
      <tr key={index}>
        <td>
          {new Date(entry.from).toLocaleDateString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td>{entry.intensity.forecast} gCO2/kWh</td>
      </tr>
    ));
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Forecast Intensity</th>
          </tr>
        </thead>
        {data ? (
          <tbody>{renderPastDataByHour()}</tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="loader-container">
                  <div className="loader" />
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default RegionDataTable;
