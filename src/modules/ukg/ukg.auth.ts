import {LRUCache} from "lru-cache";
import {UKGConfig} from "../../config/ukg.config";

const cache = new LRUCache({max: 10});
const CACHE_KEY = "ukg_access_token";
//Get UKG access token
export const getAccessToken = async () => {
  const cachedToken = cache.get(CACHE_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  // Here you would typically use the UKGConfig to request an access token from the UKG auth server.
  const response = await fetch(UKGConfig.authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: UKGConfig.clientId,
      client_secret: UKGConfig.clientSecret,
      audience: UKGConfig.audience,
      grant_type: UKGConfig.grantType,
      organization: UKGConfig.organization
    })
  });
  const data: any = await response.json();
  const ttl = Math.max(1, data.expires_in - 30) * 1000;
  cache.set(CACHE_KEY, data.access_token, {ttl});
  return data.access_token;
};
