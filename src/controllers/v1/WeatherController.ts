import { Controller } from "@tsed/di";
import { InternalServerError } from "@tsed/exceptions";
import { QueryParams } from "@tsed/platform-params";
import { Get } from "@tsed/schema";
import axios from "axios";

@Controller("/weathers")
export class WeatherController {
  @Get("/")
  async getWeather(@QueryParams("latitude") latitude: string,  @QueryParams("longitude") longitude: string) {
    try {
      const url = `https://api.hgbrasil.com/weather?lat=${latitude}&lon=${longitude}&key=${process.env.API_WEATHER_KEY}`;
      const response = await axios.get(url)
      const { results } = response.data;
      return {
        city: results.city,
        temperature: results.temp,
        condition: results.description,
        condition_image: results.condition_slug,
        date: results.date,
        time: results.time
      }
    } catch (error) {
      throw new InternalServerError(`Falha ao obter condições climáticas: ${error.message}`);
    }
  }
}
