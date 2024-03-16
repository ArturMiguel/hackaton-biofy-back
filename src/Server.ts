import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import { configApi } from "./config/index";
import * as v1 from "./controllers/v1/index";


@Configuration({
  ...configApi,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 3000,
  disableComponentsScan: true,
  mount: {
    "/v1": [
      ...Object.values(v1)
    ]
  },
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    { use: "urlencoded-parser", options: { extended: true } }
  ],
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;
}
