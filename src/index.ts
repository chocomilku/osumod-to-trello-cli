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
const { prompt } = require("enquirer");

(() => {
	const envKeys = ["KEY", "TOKEN", "IDLIST", "IDLABEL"];
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

		// get the user input with types
		// [RANT] the f**king `enquirer` package doesn't have any types on them aaaaaaaaaaaarghhhh
		// now i have to use my other eye on the documentation that is non existent aaaaaaaaaaaaaaaaaaaaa
		// need to use my brain to max
		const reqChoice: reqTypeType = await reqType.request;

		// procedure if "self pick" is picked
		if (reqChoice == "Self Pick") {
			throw new TechnicalError(
				"Feature not implemented yet",
				true,
				"Feature not implemented yet. Come back again later"
			);

			// procedure if "osumod Request" is picked
		} else if (reqChoice == "osumod Request") {
			// asks user their username
			const user = await prompt({
				type: "input",
				name: "username",
				message: "osu! Username:",
			});

			console.log("Please wait...");

			// scrape osumod html
			const scraper = new Scraper(user.username).html();

			// scrape the cards from the scraper
			const cards = osumodCards(scraper);

			// extract the data from the promise
			const data = await cards;

			// send the cards to trello
			const trelloThing = new TrelloHandler(data);

			await trelloThing.start("Pending");
			console.log("done owo");

			// procedure if not of any of the two options is picked
			// time to panic
		} else {
			throw new TechnicalError("Unexpected Error", true, "send help");
		}
	} catch (error: any) {
		console.error(error);
	}
})();
