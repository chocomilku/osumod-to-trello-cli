import puppeteer from "puppeteer";

const scrape = async () => {
	try {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto("https://osumod.com/chocomilku-", {
			waitUntil: "networkidle0",
		});
		const data = await page.evaluate(
			() => document.querySelector(".RequestList-container")?.innerHTML
		);

		console.log(data);

		await browser.close();
	} catch (err) {
		console.error(err);
	}
};

scrape();
