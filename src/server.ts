import app from "./app";

const port = Number(process.env.PORT || 5858);
const host = process.env.HOST || "0.0.0.0";

const server = app.listen(port, host, () => {
  console.log(
    JSON.stringify({
      message: "UKG WFM AI Agent server started",
      host,
      port,
      health: `http://localhost:${port}/health`,
      chatCompletions: `http://localhost:${port}/v1/chat/completions`
    })
  );
});

/**
 * Graceful shutdown handler.
 */
function shutdown(signal: string) {
  console.log(
    JSON.stringify({
      message: "Shutdown signal received",
      signal
    })
  );

  server.close((error?: Error) => {
    if (error) {
      console.error(
        JSON.stringify({
          message: "Error during server shutdown",
          error: error.message
        })
      );

      process.exit(1);
    }

    console.log(
      JSON.stringify({
        message: "Server shutdown completed"
      })
    );

    process.exit(0);
  });

  /**
   * Force shutdown if graceful shutdown takes too long.
   */
  setTimeout(() => {
    console.error(
      JSON.stringify({
        message: "Forced shutdown after timeout"
      })
    );

    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

/**
 * Catch unexpected process-level errors.
 */
process.on("uncaughtException", (error: Error) => {
  console.error(
    JSON.stringify({
      message: "Uncaught exception",
      error: error.message,
      stack: error.stack
    })
  );

  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error(
    JSON.stringify({
      message: "Unhandled promise rejection",
      reason
    })
  );

  process.exit(1);
});
