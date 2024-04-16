import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "./Context";
import RegionDropdown from "./RegionDropdown";

const RegionDetails = () => {
  let { id } = useParams();
  const { region, regionalData } = useContext(Context);

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
    </>
  );
};

export default RegionDetails;
