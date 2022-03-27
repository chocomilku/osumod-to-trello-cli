/**
    osumod-to-trello: scrapes osumod cards and sends it to trello
    Copyright (C) 2022  chocomilku

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as cheerio from "cheerio";
import { cardsType } from "./utils/exports";
import { SiteError, TechnicalError } from "./utils/error";

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
		)
			.text()
			.trim();
		const bpm = $(
			`${path} > .ant-card-body > .MapCard-attr-list > .MapCard-attr:nth-child(2)`
		)
			.text()
			.trim();

		const status = $(
			`${path} > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title > .MapCard-title > div:nth-child(1) > span:nth-child(2)`
		)
			.text()
			.trim();

		const modType = $(
			`${path} > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title > .MapCard-title > .MapCard-mod-type`
		).text();

		const urlB = $(`${path} > .ant-card-cover > a`).attr("href");

		const url = urlB?.replace(`/s`, `/beatmapsets`);

		const img = $(`${path} > .ant-card-cover > a > img`).attr("src");

		const comments: Array<string | undefined> = [];

		$(`${path} > .ant-card-body > .MapCard-comment`).each((_i, e) => {
			comments.push($(e).text());
		});

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
			comments,
			request_type: "osumod Request",
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
