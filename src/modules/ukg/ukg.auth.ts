import {UKGConfig} from "../../config/ukg.config";

//Get UKG access token
export const getAccessToken = async () => {
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
  //TODO: Handle refresh token and error response from the auth server.
  return data.access_token;
};
