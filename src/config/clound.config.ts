import {env} from "./env";

export const cloudConfig = {
  gcpProject: env.GCP_PROJECT,
  googleCloudProject: env.GOOGLE_CLOUD_PROJECT,
  vertexLocation: env.VERTEX_LOCATION || "europe-west1",
  defaultGeminiModel: env.GEMINI_MODEL
};
