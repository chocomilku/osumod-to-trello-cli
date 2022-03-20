import * as cheerio from "cheerio";

export interface cardsType {
	index: number;
	title: string;
	artist: string;
	mapper: string;
	time: string;
	bpm: string;
	status: string;
	modType: string;
	url: string | undefined;
	img: string | undefined;
}

export const osumodCards = async (
	scraper: Promise<string | undefined>
): Promise<cardsType[] | void> => {
	try {
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
		console.log(cards);
		return cards;
	} catch (err) {
		console.error(err);
	}
};
