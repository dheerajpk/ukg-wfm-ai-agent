import express, {Application, NextFunction, Request, Response} from "express";

import routes from "./api/routes";

const app: Application = express();

/**
 * Basic security/header hardening.
 * If you use helmet, you can replace this with helmet().
 */
app.disable("x-powered-by");

/**
 * Request body parsing.
 * Adjust limit based on your needs.
 */
app.use(
  express.json({
    limit: "2mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb"
  })
);

/**
 * Basic request ID middleware.
 * Useful for logs, tracing, and debugging.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId =
    req.headers["x-request-id"]?.toString() ||
    `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  res.setHeader("x-request-id", requestId);

  /**
   * Attach requestId to request object.
   * For strict typing, you can extend Express.Request later.
   */
  (req as any).requestId = requestId;

  next();
});

/**
 * Simple request logging.
 * Replace with pino/winston later if needed.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;

    console.log(
      JSON.stringify({
        requestId: (req as any).requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs
      })
    );
  });

  next();
});

/**
 * Register public routes.
 *
 * Exposes:
 * GET  /health
 * POST /v1/chat/completions
 */
app.use("/", routes);

/**
 * 404 handler.
 */
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      type: "not_found_error",
      code: "route_not_found"
    }
  });
});

/**
 * Global error handler.
 */
app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).requestId;

  console.error(
    JSON.stringify({
      requestId,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
  );

  return res.status(500).json({
    error: {
      message: "Internal server error.",
      type: "server_error",
      code: "internal_server_error",
      request_id: requestId
    }
  });
});

export default app;
