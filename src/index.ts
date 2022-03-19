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

	const cards = [];

	const totalCards = $(".RequestList-container").children().length;

	for (let i = 0; i < totalCards; i++) {
		const path = `.RequestList-container > .ant-card:nth-child(${i + 1})`;

		const title = $(`${path} > .ant-card-body > .MapCard-primary`).text();

		const artist = $(
			`${path} > .ant-card-body > .MapCard-row:nth-child(2)`
		).text();

		const mapper = $(
			`${path} > .ant-card-body > .MapCard-row:nth-child(3)`
		).text();

		const time = $(
			`${path} > .ant-card-body > .MapCard-attr-list > .MapCard-attr:nth-child(1)`
		).text();
		const bpm = $(
			`${path} > .ant-card-body > .MapCard-attr-list > .MapCard-attr:nth-child(2)`
		).text();

		const status = $(
			`${path} > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title > .MapCard-title > div:nth-child(1) > span:nth-child(2)`
		).text();

		const modType = $(
			`${path} > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title > .MapCard-title > .MapCard-mod-type`
		).text();

		const final = {
			index: i,
			title,
			artist,
			mapper,
			time,
			bpm,
			status,
			modType,
		};
		cards.push(final);
	}
	console.log(cards);
})();
