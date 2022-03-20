import "dotenv/config";
import fetch from "axios";
import { cardsType, status } from "./utils/exports";

class TrelloHandler {
	protected readonly data: cardsType[];
	public readonly baseUrl: string = "https://api.trello.com/1";
	constructor(data: cardsType[]) {
		this.data = data;
		this.currentCards = data;
	}
	private currentCards: cardsType[];

	getCurrentCards() {
		return this.currentCards;
	}

	/**
	 * Only cards with the status that is pass in this method will be left on `getCurrentCards` property
	 * @param filter either `"Pending"`, `"Rejected"`, `"Accepted"`, `"Finished"` or `"Nominated"`
	 */
	filter(filter: status) {
		console.log(filter);
		// TODO
	}

	sendCards(): void {
		try {
			this.currentCards.forEach(async (card) => {
				const name = `(${card.mapper.replace("Mapset by ", "")}) ${
					card.artist
				} - ${card.title}`;
				const description = `Mod: ${card.modType}\nBPM: ${card.bpm}\nLength: ${card.time}`;
				console.log(name);
				const res = await fetch(
					`${this.baseUrl}/cards?key=${process.env.KEY}&token=${process.env.TOKEN}&idList=${process.env.IDLIST}&name=${name}&idLabels=${process.env.IDLABEL}&pos=top&urlSource=${card.url}&desc=${description}`,
					{
						method: "POST",
						headers: {
							Accept: "application/json",
						},
					}
				);
				const cardID = res.data.id;
				await fetch(
					`${this.baseUrl}/cards/${cardID}/attachments?key=${process.env.KEY}&token=${process.env.TOKEN}&url=${card.img}&setCover=true`,
					{
						method: "POST",
						headers: {
							Accept: "application/json",
						},
					}
				);
			});

			console.log("done owo");
		} catch (error) {
			console.error(error);
		}
	}
}
