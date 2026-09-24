//add logger using winston

import {loggerConfig} from "../config/logger.config";
import winston from "winston";

const transports = [];
if (loggerConfig.console.enabled) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({all: loggerConfig.console.colorize}),
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        winston.format.printf(
          ({timestamp, level, message}: winston.Logform.TransformableInfo) =>
            `${timestamp} [${level}]: ${message}`
        )
      )
    })
  );
}
if (loggerConfig.file.enabled) {
  transports.push(
    new winston.transports.File({
      filename: `${loggerConfig.file.directory}/${loggerConfig.file.filename}`,
      level: "info",
      maxsize: loggerConfig.file.maxSize,
      maxFiles: loggerConfig.file.maxFiles
    })
  );
  transports.push(
    new winston.transports.File({
      filename: `${loggerConfig.file.directory}/${loggerConfig.file.errorFilename}`,
      level: "error",
      maxsize: loggerConfig.file.maxSize,
      maxFiles: loggerConfig.file.maxFiles
    })
  );
}

export const logger = winston.createLogger({
  level: loggerConfig.level,
  format: winston.format.combine(
    winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    winston.format.json()
  ),
  transports
});
