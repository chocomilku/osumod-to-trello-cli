import puppeteer from "puppeteer";
import { SiteError } from "./utils/error";

/**
 * Scrapes a specific class that contains the targeted data
 */
export class Scraper {
	// properties that will be used are declared here
	public readonly username: string;
	private _html: string = "";
	private readonly startUrl: string;

	// the parameters required when creating this new class
	constructor(username: string) {
		this.username = username;
		this.startUrl = `https://osumod.com/${this.username}`;
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
