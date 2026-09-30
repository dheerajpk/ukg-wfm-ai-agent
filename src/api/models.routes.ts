import {Request, Response, Router} from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    object: "list",
    data: [
      {
        id: "UKG-WFM-AI-AGENT",
        object: "model",
        created: Math.floor(Date.now() / 1000),
        owned_by: "local"
      }
    ]
  });
});

export default router;
