import {readFileSync} from "fs";
import {envs} from "./envs/index";
import loggerConfig from "./logger/index";
const pkg = JSON.parse(readFileSync("./package.json", {encoding: "utf8"}));
import { config } from 'dotenv';
import { resolve } from 'path';

export const configApi: Partial<TsED.Configuration> = {
  version: pkg.version,
  envs,
  logger: loggerConfig,
  // additional shared configuration
};

config({
  path: resolve(process.cwd(), '.env')
});
