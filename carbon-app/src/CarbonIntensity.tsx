import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "./Context";

const CarbonIntensity = () => {
  const [intensityForecast, setIntensityForecast] = useState<number | null>(
    null
  );
  const [carbonIntensity, setCarbonIntensity] = useState<number | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [regionalData, setRegionalData] = useState<any | null>(null);
  const [regionSelectList, setRegionSelectList] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedRegionData, setSelectedRegionData] = useState<any | null>(
    null
  );
  const { setRegion } = useContext(Context);

  // console.log(regionalData);
  // console.log(regionSelectList);
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
        // console.log(data);
        setRegionalData(data);
      } catch (error) {
        console.error("Error fetching carbon intensity:", error);
      }
    };

    fetchCarbonIntensity();
  }, []);

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

  // const fetchRegionalIntensity = async (regionId: number) => {
  //   try {
  //     const response = await fetch(
  //       `https://api.carbonintensity.org.uk/regional/regionid/${regionId}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch regional carbon intensity data");
  //     }
  //     const data = await response.json();

  //     const forecast = data.data[0]?.data[0]?.intensity?.forecast;
  //     const generationMix = data.data[0]?.data[0]?.generationmix;
  //     // Fetch past week and past month data
  //     const pastWeek = await fetchPastData(regionId, "week");
  //     const pastMonth = await fetchPastData(regionId, "month");
  //     return { forecast, generationMix, pastWeek, pastMonth };
  //   } catch (error) {
  //     console.error("Error fetching regional carbon intensity data:", error);
  //     return null;
  //   }
  // };

  // const fetchPastData = async (regionId: number, period: string) => {
  //   try {
  //     const response = await fetch(
  //       `https://api.carbonintensity.org.uk/regional/intensity/${regionId}/${period}`
  //     );
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch ${period} carbon intensity data`);
  //     }
  //     const data = await response.json();
  //     return data.data[0]?.intensity?.forecast;
  //   } catch (error) {
  //     console.error(`Error fetching ${period} carbon intensity data:`, error);
  //     return null;
  //   }
  // };

  useEffect(() => {
    console.log(regionalData);
    if (regionalData != null && regionalData.data[0] != null) {
      setRegionSelectList(
        regionalData.data[0].regions.map((r: any) => ({
          id: r.regionid,
          name: r.shortname,
        }))
      );
    }
  }, [regionalData]);
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
  useEffect(() => {
    setRegion(selectedRegionData);
  }, [selectedRegionData]);
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "1 1 50%", paddingRight: "10px" }}>
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

          <select value={selectedRegionId || ""} onChange={handleRegionChange}>
            <option value="">Choose Region</option>
            {regionSelectList?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 50%" }}>
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
              <h3>
                Past Week Intensity: {selectedRegionData.pastWeek} gCO2/kWh
              </h3>
              <h3>
                Past Month Intensity: {selectedRegionData.pastMonth} gCO2/kWh
              </h3>

              <Link to={`/region/${selectedRegionId}`}>go to region</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CarbonIntensity;
