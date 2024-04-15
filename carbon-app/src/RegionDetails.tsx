import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "./Context";

const RegionDetails = () => {
  let { id } = useParams();
  const { region } = useContext(Context);

  return (
    <>
      <div>ID: {id}</div>
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
    </>
  );
};

export default RegionDetails;
