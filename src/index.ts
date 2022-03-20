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
		const scraper = new Scraper(user).html();
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
		trelloThing.filter("Finished");
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
