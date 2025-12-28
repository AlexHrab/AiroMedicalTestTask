import axios from "axios";

axios.defaults.baseURL = "https://api.openbrewerydb.org/v1";

const END_POINT_FOR_LIST = "/breweries/";
const PER_PAGE = 15;
const PAGE = 1;

export async function getBreweriesList(perPage = PER_PAGE, page = PAGE) {
  try {
    const options = {
      params: {
        per_page: perPage,
        page: page,
      },
    };

    const result = await axios.get(END_POINT_FOR_LIST, options);
    return result.data;
  } catch (error) {
    console.error("Error getting list of breweries:", error);
    throw error;
  }
}

export async function getBrewerieDetails(id) {
  try {
    const result = await axios.get(`${END_POINT_FOR_LIST}${id}`);
    return result.data;
  } catch (error) {
    console.error("Error brewerie details:", error);
    throw error;
  }
}
