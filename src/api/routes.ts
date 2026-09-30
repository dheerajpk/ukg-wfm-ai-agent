import {Router} from "express";
import chatCompletionsRoutes from "./chat.routes";
import healthRoutes from "./health.routes";
import modelsRoutes from "./models.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/v1/chat/completions", chatCompletionsRoutes);
router.use("/v1/models", modelsRoutes);

export default router;
