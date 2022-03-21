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

import PromptSync from "prompt-sync";
import { Scraper } from "./scraper";
import { osumodCards } from "./process";
import { TrelloHandler } from "./trelloThing";
import { TechnicalError } from "./utils/error";

const prompt = PromptSync({ sigint: true });

const user = prompt("osu! Username: ");

// anonymous function to run
(async () => {
	try {
		const scraper = new Scraper(user, { archive: true }).html();
		// checks if the data none. if none, panic
		if (!scraper) {
			throw new TechnicalError("Unexpected Error happened.", true, "send help");
		}

		// scrape the cards from the scraper
		const cards = osumodCards(scraper);

		// extract the data from the promise
		const data = await cards;

		// send the cards to trello
		const trelloThing = new TrelloHandler(data);
		// trelloThing.filter("Finished");
		console.log(trelloThing.getCurrentCards());

		trelloThing.sendCards();
	} catch (error: any) {
		if (error.danger) {
			console.error(error.message);
			console.error(error.description);
			console.error(error.stack);
			process.exit(1);
		} else {
			console.log(error.message);
			console.log(error.description);
			process.exit(0);
		}
	}
})();
