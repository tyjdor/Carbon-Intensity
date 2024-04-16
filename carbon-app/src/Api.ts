export const getRegionalIntensityTimeRange = async (
  id: number,
  timeStart: Date,
  timeEnd: Date
) => {
  try {
    const formattedPastDate = timeStart.toISOString().substring(0, 16) + "Z";
    const formattedCurrentDate = timeEnd.toISOString().substring(0, 16) + "Z";

    const response = await fetch(
      `https://api.carbonintensity.org.uk/regional/intensity/${formattedPastDate}/${formattedCurrentDate}/regionid/${id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch past weeks carbon intensity data`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("error fetching past weeks carbon intensity data:", error);
    return null;
  }
};
