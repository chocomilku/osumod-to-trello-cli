import * as cheerio from "cheerio";
import { cardsType } from "./utils/exports";
import { SiteError } from "./utils/error";

/**
 * scrapes the data from osumod
 * @returns array of objects containing osumod cards
 */
export const osumodCards = async (
	scraper: Promise<string>
): Promise<cardsType[]> => {
	// extract html from scraper class
	const data = await scraper;

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

		const urlB = $(`${path} > .ant-card-cover > a`).attr("href");

		const url = urlB?.replace(`/s`, `/beatmapsets`);

		const img = $(`${path} > .ant-card-cover > a > img`).attr("src");

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
			url,
			img,
		};

		// push the data to the cards array
		cards.push(final);
	}
	// throw an error if no data is found
	if (!cards[0]) {
		throw new SiteError("No Data", false, "No requests at the moment.");
	}

	return cards;
};
