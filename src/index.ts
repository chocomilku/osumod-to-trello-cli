import puppeteer from "puppeteer";

const scrape = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://osumod.com/chocomilku-");
	const element = await page.waitForSelector(
		"div.ant-card:nth-child(1) > div:nth-child(3) > div:nth-child(7)"
	);
	const text = await page.evaluate((element) => element.textContent, element);
	console.log(text);

	await browser.close();
};

scrape();
