import PromptSync from "prompt-sync";
import { Scraper } from "./scraper";
import { OsumodCards } from "./process";
import { TrelloHandler } from "./trelloThing";

const prompt = PromptSync({ sigint: true });

const user = prompt("osu! Username: ");

const scraper = new Scraper(user).html();

async () => {
	try {
		if (!scraper) throw new Error("help");
		const cards = OsumodCards(scraper);
		const data = await cards;
		const trelloThing = new TrelloHandler(data);
	} catch (error) {
		console.error(error);
	}
};
