import { Injectable } from "@tsed/di";
import OpenAI from "openai";

@Injectable()
export class OpenAiService {
  private apiKey = process.env.OPENAI_API_KEY as string;
  private assistant = process.env.OPENAI_ASSISTANT as string;

  async sendMessage(message: string, thread: string | null) {
    const openAi = new OpenAI({
      apiKey: this.apiKey
    });

    // Cria a thread
    let threadId = thread;
    if (!threadId) {
      const thread = await openAi.beta.threads.create();
      threadId = thread.id;
    }

    // Adiciona mensagem à thread
    await openAi.beta.threads.messages.create(threadId, { role: "user", content: message });

    // Executa o assistente
    const threadRun = await openAi.beta.threads.runs.create(threadId, {
      assistant_id: this.assistant
    })

    let assistanceRun = await openAi.beta.threads.runs.retrieve(threadId, threadRun.id);
    while (assistanceRun.status == "in_progress" || assistanceRun.status == "queued") {
      assistanceRun = await openAi.beta.threads.runs.retrieve(threadId, threadRun.id);

      if (assistanceRun.status != "queued" && assistanceRun.status != "in_progress") {
        break;
      }

      await new Promise((resolve) => { // Aguarda a IA processar a resposta
        setTimeout(() => {
          resolve(1);
        }, 2000)
      })
    }

    const messages = await openAi.beta.threads.messages.list(threadId);

    return {
      messages: messages,
      thread: threadId
    };    
  }

  async processImage(base64Img: string) { 
    const openAi = new OpenAI({
      apiKey: this.apiKey
    });

    const response = await openAi.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Você é um assistente agricula para identificar problemas de saude e peste em imagens"
        },
        {
          role: "user",
          content:  [
            { type: "text", text: "Quais problemas você identifica nessa imagem" },
            {
              type: "image_url",
              image_url: {
                "url": base64Img
              }
            }
          ]
        }
      ]
    })

    return response;
  }
}
