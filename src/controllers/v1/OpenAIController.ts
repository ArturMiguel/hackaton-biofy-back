import { Controller, Inject, Injectable } from "@tsed/di";
import { MulterOptions, MultipartFile, PlatformMulterFile } from "@tsed/common";
import { BodyParams, HeaderParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import { OpenAiService } from "src/services/OpenAIService";
import fs from "fs";

@Controller("/ia-models")
export class OpenAIController {
  @Inject() openAiService: OpenAiService;

  constructor() { }

  @Post("/texts")
  async getTextModel(@BodyParams() body: any) {
    const { messages, thread, lastMessage } = await this.openAiService.sendMessage(body.message, body.thread);

    return {
      message: messages,
      thread: thread,
      lastMessage
    };
  }

  @Post("/audios")
  @MulterOptions({
    limits: {
      fileSize: 25000000 // 25 mb em bytes
    },
    dest: "./tmp-audios",
  })
  async getAudioModel(@HeaderParams("thread") thread: string, @MultipartFile("file") file: PlatformMulterFile) {
    const filePath = `${file.path}.mp3`;

    fs.renameSync(file.path, filePath);
    
    const transcription = await this.openAiService.sendAudio(filePath).finally(() => {
      fs.unlinkSync(filePath);
    });

    const { messages, thread: threadId, lastMessage }= await this.openAiService.sendMessage(transcription.text, thread);
    
    return {
      transcription: {
        message: transcription.text,
        type: "USER",
        thread: threadId
      },
      messages,
      threadId,
      lastMessage
    }
  }

  @Post("/images")
  async getImageModel(@BodyParams() body: any) {
    return this.openAiService.processImage(body.image)
  }
}
