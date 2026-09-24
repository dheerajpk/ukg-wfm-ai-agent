// Add Logger configuration and local logs and production logs settings

const isProduction = process.env.NODE_ENV === "production";

export const loggerConfig = {
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  format: process.env.LOG_FORMAT || (isProduction ? "json" : "pretty"),
  timestamp: true,
  console: {
    enabled: true,
    colorize: !isProduction
  },
  file: {
    enabled: false,
    directory: process.env.LOG_DIRECTORY || "logs",
    filename: process.env.LOG_FILE || "application.log",
    errorFilename: process.env.LOG_ERROR_FILE || "error.log",
    maxSize: Number(process.env.LOG_MAX_SIZE || "10485760"), // 10 MB in bytes
    maxFiles: Number(process.env.LOG_MAX_FILES || 5)
  }
};
