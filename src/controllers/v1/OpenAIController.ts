import { Controller, Inject, Injectable } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Get } from "@tsed/schema";
import OpenAI from "openai";
import { OpenAiService } from "src/services/OpenAIService";

@Controller("/ia-models")
export class OpenAIController {
  @Inject() openAiService: OpenAiService;

  constructor() { }

  @Get("/texts")
  async getTextModel(@BodyParams() body: any) {
    const { messages, thread } = await this.openAiService.sendMessage(body.message, body.thread_id);

    return {
      message: messages,
      thread: thread
    };
  }

  @Get("/audios")
  async getAudioModel() {

  }
}