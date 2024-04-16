import React, { FC } from "react";

import "./RegionDataTable.css";

const RegionDataTable: FC<{
  data: any;
}> = ({ data }) => {
  const renderPastDataByHour = () => {
    if (!data || !data.data.data) return null;
    return data.data.data.map((entry: any, index: number) => (
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

  return (
    <>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
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
          {data != null ? (
            <tbody>{renderPastDataByHour()}</tbody>
          ) : (
            <div className="loader" />
          )}
        </table>
      </div>
    </>
  );
};

export default RegionDataTable;
