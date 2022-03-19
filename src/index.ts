import puppeteer from "puppeteer";

class Scraper {
	private readonly username: string;
	private _html: string | undefined = "";

	constructor(username: string) {
		this.username = username;
	}

	private async scrape() {
		try {
			const browser = await puppeteer.launch({ headless: false });
			const page = await browser.newPage();
			await page.goto(`https://osumod.com/${this.username}`, {
				waitUntil: "networkidle0",
			});
			const data = await page.evaluate(
				() => document.querySelector(".RequestList-container")?.innerHTML
			);

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

const a = new Scraper("chocomilku").html();

console.log(a);
