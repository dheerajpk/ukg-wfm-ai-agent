import {env} from "./env";

export const UKGConfig = {
  clientId: env.UKG_CLIENT_ID,
  clientSecret: env.UKG_CLIENT_SECRET,
  audience: env.UKG_AUDIENCE,
  grantType: env.UKG_GRANT_TYPE,
  organization: env.UKG_ORGANIZATION,
  authUrl: env.UKG_AUTH_URL || "",
  apiBaseUrl: env.UKG_API_BASE_URL || ""
};
