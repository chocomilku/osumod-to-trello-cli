import { configType } from "./exports";
import fs from "fs";

// access config file
export const config: configType = JSON.parse(
	fs.readFileSync(`${process.cwd()}/config.json`, {
		encoding: "utf8",
	})
);
