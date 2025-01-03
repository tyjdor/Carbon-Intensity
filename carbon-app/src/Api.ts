export const getRegionalIntensityTimeRange = async (
  id: number,
  timeStart: Date,
  timeEnd: Date
): Promise<any | null> => {
  try {
    // Convert dates to ISO strings (UTC format)
    const startISO = timeStart.toISOString().slice(0, 16);
    const endISO = timeEnd.toISOString().slice(0, 16);

    const url = `https://api.carbonintensity.org.uk/regional/intensity/${startISO}/${endISO}/regionid/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch regional carbon intensity data: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching regional carbon intensity data:", error);
    return null;
  }
};
