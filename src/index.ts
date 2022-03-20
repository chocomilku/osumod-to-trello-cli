import PromptSync from "prompt-sync";
import { Scraper } from "./scraper";
import { osumodCards } from "./process";
import { TrelloHandler } from "./trelloThing";

const prompt = PromptSync({ sigint: true });

const user = prompt("osu! Username: ");

const scraper = new Scraper(user).html();

// anonymous function to run
(async () => {
	try {
		// checks if the data none. if none, panic
		if (!scraper) throw new Error("help");

		// scrape the cards from the scraper
		const cards = osumodCards(scraper);

		// extract the data from the promise
		const data = await cards;

		// send the cards to trello
		const trelloThing = new TrelloHandler(data);
		trelloThing.filter("Rejected");
		console.log(trelloThing.getCurrentCards());

		// trelloThing.sendCards();
	} catch (error) {
		console.error(error);
	}
})();
