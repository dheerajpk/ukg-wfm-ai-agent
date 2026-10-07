/// <reference types="node" />

import dotenv from "dotenv";

dotenv.config();

export const env = {
  AI_PROVIDER: process.env.AI_PROVIDER,

  // UKG Configuration
  UKG_CLIENT_ID: process.env.UKG_CLIENT_ID,
  UKG_CLIENT_SECRET: process.env.UKG_CLIENT_SECRET,
  UKG_AUDIENCE: process.env.UKG_AUDIENCE,
  UKG_GRANT_TYPE: process.env.UKG_GRANT_TYPE,
  UKG_ORGANIZATION: process.env.UKG_ORGANIZATION,
  UKG_AUTH_URL: process.env.UKG_AUTH_URL,
  UKG_API_BASE_URL: process.env.UKG_API_BASE_URL,

  //AI Model
  AI_DEFAULT_MODEL: "gemini-2.5-flash-lite",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",

  //AI Key
  AI_LOCAL_API_KEY: process.env.AI_LOCAL_API_KEY || "",
  // Use 127.0.0.1 instead of localhost: Node resolves localhost to ::1 first, which Ollama doesn't bind to
  AI_LOCAL_BASE_URL:
    process.env.AI_LOCAL_BASE_URL || "http://127.0.0.1:11434/v1",

  //GCP Configuration
  GCP_PROJECT: process.env.GCP_PROJECT,
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  VERTEX_LOCATION: process.env.VERTEX_LOCATION || "global"
};
