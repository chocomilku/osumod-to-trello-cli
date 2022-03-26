/**
    osumod-to-trello: scrapes osumod cards and sends it to trello
    Copyright (C) 2022  chocomilku

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Scraper } from "./scraper";
import { osumodCards } from "./process";
import { TrelloHandler } from "./trelloThing";
import { configType, dataAny, reqTypeType } from "./utils/exports";
import { TechnicalError } from "./utils/error";
import { osuMapsetData, osuAPI } from "./osuAPI";
import fs from "fs";
const { prompt } = require("enquirer");

(() => {
	const envKeys = [
		"KEY",
		"TOKEN",
		"IDLIST",
		"IDLABEL",
		"OSU_CLIENTID",
		"OSU_CLIENTSECRET",
	];
	envKeys.forEach((key) => {
		if (!(key in process.env)) {
			throw new TechnicalError(
				`.env Key: ${key} is not found.`,
				true,
				"Make sure to check your .env file if it has been filled up"
			);
		} else {
			console.log(`.env key ${key} has been found.`);
		}
	});
})();

// anonymous function to run
(async () => {
	try {
		// prompts user their choice of request type
		const reqType = await prompt({
			type: "select",
			name: "request",
			message: "Request Method: (osumod or Self Pick)",
			choices: ["osumod Request", "Self Pick"],
		});

		const configChecker = (): boolean => {
			if (fs.existsSync(`${process.cwd()}/config.json`)) {
				return true;
			} else {
				return false;
			}
		};

		const config = (): configType | undefined => {
			if (configChecker()) {
				const data = fs.readFileSync(`${process.cwd()}/config.json`, {
					encoding: "utf8",
				});
				return JSON.parse(data);
			} else {
				return undefined;
			}
		};

		// get the user input with types
		// [RANT] the f**king `enquirer` package doesn't have any types on them aaaaaaaaaaaarghhhh
		// now i have to use my other eye on the documentation that is non existent aaaaaaaaaaaaaaaaaaaaa
		// need to max out my brain
		// somehow using require doesn't show any types. :hmm:
		const reqChoice: reqTypeType = await reqType.request;

		// procedure if "self pick" is picked
		if (reqChoice == "Self Pick") {
			// asks user for the map link
			const mapLink = await prompt({
				type: "input",
				name: "link",
				message: "Enter map link:",
			});

			// get beatmapset data from osu api v2
			const osuApiThing = new osuAPI(new URL(mapLink.link));
			const osuData = osuMapsetData(
				osuApiThing.getBeatmapsetData(),
				osuApiThing.fullLink
			);

			// extract data
			const data = await osuData;

			// send to trello
			const trelloThing = new TrelloHandler([data]);

			await trelloThing.start("Any");
		}
		// procedure if "osumod Request" is picked
		else if (reqChoice == "osumod Request") {
			// asks user their username
			// const user = await prompt({
			// 	type: "input",
			// 	name: "username",
			// 	message: "osu! Username:",
			// });

			const userCondition = async (): Promise<string | undefined> => {
				if (config()) {
					console.log("config.json found\nUser: %s", config()?.username);
					return config()?.username;
				} else {
					const ask = await prompt({
						type: "input",
						name: "username",
						message: "osu! Username:",
					});

					return ask.username;
				}
			};

			const user = await userCondition();

			console.log("Please wait...");

			// scrape osumod html
			const scraper = new Scraper(user as string).html();

			// scrape the cards from the scraper
			const cards = osumodCards(scraper);

			// extract the data from the promise
			const data = await cards;

			// send the cards to trello
			const trelloThing = new TrelloHandler(data);

			await trelloThing.start("Pending");
		}
		// procedure if not of any of the two options is picked
		// time to panic
		else {
			// throw new TechnicalError("Unexpected Error", true, "send help");
		}
	} catch (error: any) {
		console.error(error);
	}
})();
