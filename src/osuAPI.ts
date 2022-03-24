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
import { TechnicalError } from "./utils/error";

/**
 * Class that fetches oauth token and beatmapset data from osu api v2
 */
export class osuAPI {
	public readonly link: string;
	private readonly id: number;
	protected readonly baseUrl: URL = new URL("https://osu.ppy.sh/api/v2");
	protected readonly tokenBaseUrl: URL = new URL(
		"https://osu.ppy.sh/oauth/token"
	);

	constructor(link: URL) {
		this.link = link.pathname;
		const mapLinkArr = this.link.split("/");
		this.id = this.findNum(mapLinkArr);
	}

	/**
	 * finds the first number in an array
	 * @param arr array that includes string and numbers
	 * @returns the extracted the first number in number type
	 */
	protected findNum(arr: Array<string>): number {
		const checker = arr.filter((key) => {
			if (parseFloat(key)) return key;
			return;
		});
		return ~~checker[0];
	}

	/**
	 * fetches oauth token from osu api v2
	 * @returns access token for authentication
	 */
	protected async getOsuToken(): Promise<string | void> {
		try {
			// type of the data to be sent as a body
			interface osuApiTokenType {
				client_id: number | string | undefined;
				client_secret: string | undefined;
				grant_type: "client_credentials";
				scope: "public";
			}

			// body/data to be post fetched containing some very sensitive data stuff
			const body: osuApiTokenType = {
				client_id: process.env.OSU_CLIENTID,
				client_secret: process.env.OSU_CLIENTSECRET,
				grant_type: "client_credentials",
				scope: "public",
			};

			// fetches a post request
			const request = await fetch(this.tokenBaseUrl.href, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				data: JSON.stringify(body),
			});

			// type of the response from the fetch request earlier
			interface osuApiTokenResponseType {
				token_type: string;
				expires_in: number;
				access_token: string;
			}

			// gets the json response
			const response: osuApiTokenResponseType = await request.data;

			// returns only the access token from the api
			return response.access_token;
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * fetches beatmapset data from the osu api v2
	 * @returns json response from the api
	 */
	public async getBeatmapsetData(): Promise<any> {
		try {
			// awaits the token for authentication
			const auth = await this.getOsuToken();

			// panics if auth returned nothing
			if (!auth) {
				throw new TechnicalError("No token received.", true, "send help");
			}

			// fetch the beatmapset data from the osu api v2 containing the bearer authentication fetched earlier
			const request = await fetch(
				`${this.baseUrl.href}/beatmapsets/${this.id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${auth}`,
					},
				}
			);

			// return the full json result from the api
			return await request.data;
		} catch (e) {
			console.error(e);
		}
	}
}

const test = new osuAPI(
	new URL("https://osu.ppy.sh/beatmapsets/1619724#mania/3307091")
);

test.getBeatmapsetData();
