import "dotenv/config";
import fetch from "axios";
import { cardsType, status } from "./utils/exports";

/**
 * Handling posting cards to trello
 * @param data must be an array with the structure of `cardsType`
 */
export class TrelloHandler {
	// data is basically a duplicate for comparison purposes
	protected readonly data: cardsType[];

	// interval for each request
	public interval: number = 750;

	// base url for the requests
	public readonly baseUrl: string = "https://api.trello.com/1";

	constructor(data: cardsType[]) {
		this.data = data;
		this.currentCards = data;
	}

	// cards that will be sent to trello
	private currentCards: cardsType[];

	public getCurrentCards() {
		return this.currentCards;
	}

	/**
	 * Only cards with the status that is pass in this method will be left on `getCurrentCards` property
	 * @param filter either `"Pending"`, `"Rejected"`, `"Accepted"`, `"Finished"` or `"Nominated"`
	 */
	filter(filter: status) {
		this.currentCards = this.currentCards.filter((card) => {
			return card.status.trim() == filter;
		});
	}

	// send cards currently in currentCards to trello
	sendCards(): void {
		try {
			if (!this.currentCards[0]) throw new Error("No Results");
			// iterate to each card
			this.currentCards.forEach((card, i) => {
				// delay every request by the number specified at the top
				setTimeout(async () => {
					// name that will be shown
					// removing "Mapset by" on the mapper's name
					const name = `(${card.mapper.replace(
						"Mapset by ",
						""
					)}) ${card.artist.replaceAll("#", "%23")} - ${card.title.replaceAll(
						"#",
						"%23"
					)}`;

					// details that might be useful
					// conditional on mod type. if the mod type is missing, omit the line
					// cases this might happen is if the queue is a nomination queue
					const description = `${
						card.modType == " " ? "" : `Mod: ${card.modType}\n`
					}BPM: ${card.bpm}\nLength: ${card.time}`;

					console.log("Sending %s", name);

					// sending cards to trello with POST as the method
					const res = await fetch(
						`${this.baseUrl}/cards?key=${process.env.KEY}&token=${process.env.TOKEN}&idList=${process.env.IDLIST}&name=${name}&idLabels=${process.env.IDLABEL}&pos=top&urlSource=${card.url}&desc=${description}`,
						{
							method: "POST",
							headers: {
								Accept: "application/json",
							},
						}
					);

					// after the first request has been made, the server will respond back with the cards details
					// extract the id from the response
					const cardID = await res.data.id;

					// then update the card's cover image using POST method again with a specific image.
					await fetch(
						`${this.baseUrl}/cards/${cardID}/attachments?key=${process.env.KEY}&token=${process.env.TOKEN}&url=${card.img}&setCover=true`,
						{
							method: "POST",
							headers: {
								Accept: "application/json",
							},
						}
					);
				}, i * this.interval);
			});
			console.log("done owo");
		} catch (error) {
			console.error(error);
		}
	}
}