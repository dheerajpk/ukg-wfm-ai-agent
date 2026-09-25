import {UKGConfig} from "../../config/ukg.config";
import {getAccessToken} from "./ukg.auth";
import {logger} from "../../common/logger";

//Base function to execute HTTP requests with UKG access token authorization
export const fetchRequest = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    const token = await getAccessToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    const response = await fetch(`${UKGConfig.apiBaseUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`UKG API error: ${response.status}`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    logger.error("Error executing UKG request", error);
    throw error;
  }
};
