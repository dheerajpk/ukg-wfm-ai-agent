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
    logger.info(
      `Executing UKG request to endpoint: ${endpoint} with options: ${JSON.stringify(options)}`
    );
    const response = await fetch(`${UKGConfig.apiBaseUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`UKG API error: ${response.status}`);
    }
    const data = (await response.json()) as Promise<T>;
    logger.info(
      `UKG request to endpoint: ${endpoint} succeeded with response: ${JSON.stringify(data)}`
    );
    return data;
  } catch (error) {
    logger.error("Error executing UKG request", error);
    throw error;
  }
};
