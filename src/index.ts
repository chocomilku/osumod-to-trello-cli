import puppeteer from "puppeteer";

class Scraper {
	private readonly username: string;
	private _html: string | undefined = "";
	private readonly startUrl: string;

	constructor(username: string) {
		this.username = username;
		this.startUrl = `https://osumod.com/${this.username}`;
	}

	private async scrape() {
		try {
			const browser = await puppeteer.launch({ headless: false });
			const page = await browser.newPage();
			await page.goto(this.startUrl, {
				waitUntil: "networkidle0",
			});
			const data = await page.evaluate(
				() => document.querySelector(".RequestList-container")?.innerHTML
			);
			if (page.url() != this.startUrl) {
				await browser.close();
				throw new Error("User not found.");
			}

			this._html = data;

			await browser.close();
		} catch (err) {
			console.error(err);
		}
	}

	public async html() {
		await this.scrape();
		return this._html;
	}
}

const a = new Scraper("chocomilku-");

console.log(a.html());
