import {Request, Response, Router} from "express";

import {ChatCompletionRequest} from "../modules/ai/chat/chat-completion.types";
import {UkgAgent} from "../agents/ukg.agent";

const router = Router();

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const input = (typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body) as ChatCompletionRequest;

    /**
     * Optional:
     * If you do not support streaming yet, reject stream=true.
     */
    if (input.stream === true) {
      res.status(400).json({
        error: {
          message: "Streaming is not supported yet.",
          type: "invalid_request_error",
          param: "stream",
          code: "streaming_not_supported"
        }
      });
      next();
      return Promise.resolve();
    }

    const agent = new UkgAgent();

    const result = await agent.createChatCompletion(input);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
