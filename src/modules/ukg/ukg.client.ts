import {UKGConfig} from "../../config/ukg.config";
import {getAccessToken} from "./ukg.auth";
import {logger} from "../../common/logger";

//Base function to execute HTTP requests with UKG access token authorization
export const fetchRequest = async (endpoint: string, options: RequestInit) => {
  try {
    const token = await getAccessToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    const response = await fetch(`${UKGConfig.apiBaseUrl}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error executing UKG request", error);
    throw error;
  }
};
