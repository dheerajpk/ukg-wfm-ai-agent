import {Request, Response, Router} from "express";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "ukg-wfm-ai-agent",
    timestamp: new Date().toISOString()
  });
});

export default router;
