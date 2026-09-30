import {AiService} from "./ai.service";
import {createAiProvider} from "./providers/provider.factory";

const aiProvider = createAiProvider();

export const aiService = new AiService(aiProvider);
