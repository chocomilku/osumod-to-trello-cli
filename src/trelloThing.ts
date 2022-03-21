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

import "dotenv/config";
import fetch from "axios";
import { cardsType, status } from "./utils/exports";
import { SiteError, TechnicalError } from "./utils/error";

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
			return card.status == filter;
		});
	}

	// send cards currently in currentCards to trello
	sendCards(): void {
		if (!this.currentCards[0])
			throw new SiteError(
				"No Results",
				false,
				`No cards match with the current filter`
			);
		// iterate to each card
		this.currentCards.forEach((card, i) => {
			// delay every request by the number specified at the top
			setTimeout(async () => {
				// name that will be shown
				// removing "Mapset by" on the mapper's name
				const name = `(${card.mapper.replace("Mapset by ", "")}) ${
					card.artist
				} - ${card.title}`;

				// details that might be useful
				// conditional on mod type. if the mod type is missing, omit the line
				// cases this might happen is if the queue is a nomination queue
				const description = `${
					card.modType == "" ? "" : `**Mod:** ${card.modType}\n`
				}${card.bpm == "" ? "" : `**BPM:** ${card.bpm}\n`}${
					card.time == "" ? "" : `**Length:** ${card.time}\n`
				}${card.comments
					.map((comment) => {
						let str = comment;
						str = str?.replace("Mapper's Comment:", "**Mapper's Comment:**");
						str = str?.replace("Feedback:", "**Feedback:**");
						return `${str}\n`;
					})
					.join("")}`;

				console.log("Sending %s", name);

				// path to be fetched
				const path = `${this.baseUrl}/cards?key=${process.env.KEY}&token=${process.env.TOKEN}&idList=${process.env.IDLIST}&name=${name}&idLabels=${process.env.IDLABEL}&pos=top&urlSource=${card.url}&desc=${description}`;

				// encode the path to a valid URI
				const encodedURL = encodeURI(path);

				// sending cards to trello with POST as the method
				const res = await fetch(encodedURL, {
					method: "POST",
					headers: {
						Accept: "application/json",
					},
				});

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
	}
}
