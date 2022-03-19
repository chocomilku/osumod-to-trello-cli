import PromptSync from "prompt-sync";
import { Scraper } from "./scraper";

import * as cheerio from "cheerio";

const prompt = PromptSync({ sigint: true });

const user = prompt("osu! Username: ");

const scraper = new Scraper(user).html();

(async () => {
	const data = await scraper;
	if (!data) throw new Error("help");
	const $ = cheerio.load(data);

	$(".RequestList-container").each((i, e) => {
		console.log("index index %d", i);
		console.log(e);
		$(e)
			.children()
			.each((index, el) => {
				const d = $(el).text();

				console.log(index);
				console.log(d);
			});
	});
})();
