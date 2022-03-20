import "dotenv/config";
import { Scraper } from "./scraper";
import fetch from "axios";
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

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

class ProcessData {
	constructor(data: string) {
		this.$ = cheerio.load(data);
	}

	protected readonly $;
	public allCards: cardsType[] = this.getData();

	public totalCards(): number {
		return this.$(".RequestList-container").children().length;
	}

	private getData(): cardsType[] {
		const cards: cardsType[] = [];
		for (let i = 0; i < this.totalCards(); i++) {
			const path = `.RequestList-container > .ant-card:nth-child(${i + 1})`;

			const title = this.$(
				`${path} > .ant-card-body > .MapCard-primary`
			).text();

			const artist = this.$(
				`${path} > .ant-card-body > .MapCard-row:nth-child(2)`
			).text();

			const mapper = this.$(
				`${path} > .ant-card-body > .MapCard-row:nth-child(3)`
			).text();

			const time = this.$(
				`${path} > .ant-card-body > .MapCard-attr-list > .MapCard-attr:nth-child(1)`
			).text();
			const bpm = this.$(
				`${path} > .ant-card-body > .MapCard-attr-list > .MapCard-attr:nth-child(2)`
			).text();

			const status = this.$(
				`${path} > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title > .MapCard-title > div:nth-child(1) > span:nth-child(2)`
			).text();

			const modType = this.$(
				`${path} > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title > .MapCard-title > .MapCard-mod-type`
			).text();

			const urlB = this.$(`${path} > .ant-card-cover > a`).attr("href");

			const url = urlB?.replace(`/s`, `/beatmapsets`);

			const img = this.$(`${path} > .ant-card-cover > a > img`).attr("src");

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

			cards.push(final);
		}
		return cards;
	}
}

(async () => {
	const yes = new Scraper("chocomilku-").html();
	const data = await yes;

	if (!data) throw new Error("help");

	const test = new ProcessData(data);
	console.log(test.totalCards);
	console.log(test.allCards);
})();
