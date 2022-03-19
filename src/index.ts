import PromptSync from "prompt-sync";
import { Scraper } from "./scraper";

const prompt = PromptSync({ sigint: true });

const user = prompt("osu! Username: ");

const scraper = new Scraper(user);

console.log(
	scraper
		.html()
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.error(err);
		})
);
