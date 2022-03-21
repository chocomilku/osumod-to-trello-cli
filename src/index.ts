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

const prompt = PromptSync({ sigint: true });

const user = prompt("osu! Username: ");

// anonymous function to run
(async () => {
	try {
		// scrape osumod html
		const scraper = new Scraper(user).html();

		// scrape the cards from the scraper
		const cards = osumodCards(scraper);

		// extract the data from the promise
		const data = await cards;

		// send the cards to trello
		const trelloThing = new TrelloHandler(data);

		trelloThing.start("Pending");
	} catch (error: any) {
		if (error.danger) {
			console.error(error.message);
			console.error(error.description);
			console.error(error.stack);
			process.exit(1);
		} else if (!error.danger) {
			console.log(error.message);
			console.log(error.description);
			process.exit(0);
		} else {
			console.error(error);
			process.exit(1);
		}
	}
})();
