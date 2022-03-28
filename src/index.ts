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
import { reqTypeType } from "./utils/exports";
import { TechnicalError } from "./utils/error";
import { osuMapsetData, osuAPI } from "./osuAPI";
import fs from "fs";
import { config } from "./utils/config";
const { prompt } = require("enquirer");

// checking for required files
(() => {
	// checks if .env file exists
	if (!fs.existsSync(`${process.cwd()}/.env`)) {
		throw new TechnicalError(
			".env not found",
			true,
			"Make sure the .env file exists. please create one that follows the format"
		);
	}

	// list of .env keys to find
	const envKeys = [
		"KEY",
		"TOKEN",
		"IDLIST",
		"OSU_CLIENTID",
		"OSU_CLIENTSECRET",
	];

	// check each .env key
	envKeys.forEach((key) => {
		if (!(key in process.env)) {
			throw new TechnicalError(
				`.env Key: ${key} is not found.`,
				true,
				"Make sure to check your .env file if it has been filled up"
			);
		}
	});

	// checks if config.json file exists
	if (!fs.existsSync(`${process.cwd()}/config.json`)) {
		throw new TechnicalError(
			"config.json not found",
			true,
			"config.json doesn't exist. please create one that follows the format"
		);
	}

	// list of config.json keys to find
	const configKeys = [
		config.username,
		config.trello.m4m,
		config.trello.request,
		config.trello.self_pick,
	];

	// checks each config.json key
	configKeys.forEach((key) => {
		if (!key) {
			throw new TechnicalError(
				`config.json has a missing property/properties`,
				true,
				"Make sure to check your config.json file if it has been filled up properly"
			);
		}
	});
})();

// main program proper
(async () => {
	try {
		// prompts user their choice of request type
		const reqType = await prompt({
			type: "select",
			name: "request",
			message: "Request Method: (osumod or Self Pick)",
			choices: ["osumod Request", "Self Pick"],
		});

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
			const user = config.username;

			console.log("Please wait...");

			// scrape osumod html
			const scraper = new Scraper(user).html();

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
