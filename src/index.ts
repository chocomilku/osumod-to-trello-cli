import PromptSync from "prompt-sync";
import { Scraper } from "./scraper";

import * as cheerio from "cheerio";

const prompt = PromptSync({ sigint: true });

const user = prompt("osu! Username: ");

const scraper = new Scraper(user).html();

// cards type structure
interface cardsType {
	index: number;
	title: string;
	artist: string;
	mapper: string;
	time: string;
	bpm: string;
	status: string;
	modType: string;
}

/**
 * scrapes the data from osumod
 * @returns array of objects containing osumod cards
 */
const osumodCards = async (): Promise<cardsType[]> => {
	// extract html from scraper class
	const data = await scraper;

	// check if there's no data
	if (!data) throw new Error("help");

	// load the data to cheerio
	const $ = cheerio.load(data);

	// final array to be returned
	const cards = [];

	// get the total number of cards present at osumod
	const totalCards = $(".RequestList-container").children().length;

	// iterate through each cards and get the specific data
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

		// final structure of osumod cards
		const final: cardsType = {
			index: i,
			title,
			artist,
			mapper,
			time,
			bpm,
			status,
			modType,
		};

		// push the data to the `cards` array
		cards.push(final);
	}

	console.log(cards);
	return cards;
};
