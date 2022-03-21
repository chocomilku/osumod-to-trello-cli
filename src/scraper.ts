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

import puppeteer from "puppeteer";
import { SiteError } from "./utils/error";
import { scraperOptions } from "./utils/exports";

/**
 * Scrapes a specific class that contains the targeted data
 */
export class Scraper {
	// properties that will be used are declared here
	public readonly username: string;
	private _html: string = "";
	private readonly startUrl: string;

	// the parameters required when creating this new class
	constructor(username: string, options: scraperOptions = { archive: false }) {
		this.username = username;
		if (options.archive) {
			this.startUrl = `https://osumod.com/${this.username}/archives`;
		} else {
			this.startUrl = `https://osumod.com/${this.username}`;
		}
	}

	/**
	 * the main method
	 * Scrapes the data from osumod.
	 * @returns string containing the scraped data of a div class
	 */
	private async scrape() {
		// launches a chrome instance
		const browser = await puppeteer.launch({ headless: false });

		// creates a new tab
		const page = await browser.newPage();
		// goes to the specific url and waits until the page stops requesting to its api
		await page.goto(this.startUrl, {
			waitUntil: "networkidle0",
		});

		// scrape the data from the specific class
		const data = await page.evaluate(
			() => document.querySelector("*")?.innerHTML
		);

		// checks if the url has changed. if it is, throw an error saying that the user is not found
		if (page.url() != this.startUrl) {
			await browser.close();
			throw new SiteError(
				"No User Found.",
				true,
				`User ${this.username} is not found on the site. Maybe the spelling is incorrect, The user does not started a modding queue, The user's username is different on the site, or The user does not exist at all.`
			);
		}

		// updates the content of the string declared above
		if (data) {
			this._html = data;
		}

		// closes the browser
		await browser.close();
	}

	/**
	 * calls the scrape method to do its process
	 * @returns data from the declared variable above that is hopefully now changed by the scrape method
	 */
	public async html(): Promise<string> {
		await this.scrape();
		return this._html;
	}
}
