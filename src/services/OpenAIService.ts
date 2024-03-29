import { Injectable } from "@tsed/di";
import OpenAI from "openai";
import fs from "fs";

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

    const messages: any = await openAi.beta.threads.messages.list(threadId);

    return {
      messages: messages,
      lastMessage: {
        message: messages.body.data[0].content[0].text.value.replace(/\n/g, "<br>"),
        type: messages.body.data[0].role == "assistant" ? "BOT" : "USER",
        thread: threadId
      },
      thread: threadId
    };    
  }

  async processImage(imagePath: string, thread: string | null) {
    const image = fs.readFileSync(imagePath);
    const base64Img = `data:image/jpeg;base64,${new Buffer(image).toString('base64')}`
    
    const openAi = new OpenAI({
      apiKey: this.apiKey,
    });

    const response = await openAi.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: 'Você será um especialista chamado "IA.GRO" e seu papel é identificação de problemas de pragas em lavouras e retornar uma possível solução. Se o usuário pedir qualquer coisa diferente desse assunto retorne sempre. "Desculpe, não entendo sobre esse assunto. Sou especialista em agronegócio direcionado a identificação de pragas.". Indique sempre 3 sugestões de produto com destaque do principio ativo, inclua o principio ativo na resposta junto a cada produto. Não inclua imagens nas respostas. Retorne a reposta no formato HTML sem markdown e somente com as tags <p> e onde for sugestão retorne uma lista enumerada, sem utilizar tag <ol> <li> separe com <br> com a sugestão em negrito.'
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

    // Cria a thread
    let threadId = thread;
    if (!threadId) {
      const thread = await openAi.beta.threads.create();
      threadId = thread.id;
    }

    // Adiciona mensagem à thread
   await openAi.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: `Vou te mandar uma informação de uma imagem que recebi de uma outra inteligência, só pra você manter o contexto, não precisa responder essa mensagem com nada. ${response.choices[0].message.content}`
      }
    );

    // Executa o assistente
    const threadRun = await openAi.beta.threads.runs.create(threadId, {
      assistant_id: this.assistant
    })
    
    return { content: response.choices[0].message.content?.replace(/\n/g, "<br>").replace("<br><br>", "<br>").replace("<br><p><br>", "<br><p>"), thread: threadId }
  }

  async sendAudio(filePath: string) {
    const openAi = new OpenAI({
      apiKey: this.apiKey
    });
    
    const transcription = await openAi.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });

    return transcription;
  }
}
