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
import fetch, { AxiosRequestHeaders } from "axios";

export class osuAPI {
	public readonly link: string;
	private readonly id: number;
	protected readonly baseUrl: URL = new URL("https://osu.ppy.sh/api/v2");
	protected readonly tokenBaseUrl: URL = new URL(
		"https://osu.ppy.sh/oauth/token"
	);
	protected readonly headers: AxiosRequestHeaders = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

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

	public async getOsuToken() {
		try {
			interface osuApiTokenType {
				client_id: number | string | undefined;
				client_secret: string | undefined;
				grant_type: "client_credentials";
				scope: "public";
			}

			const body: osuApiTokenType = {
				client_id: process.env.OSU_CLIENTID,
				client_secret: process.env.OSU_CLIENTSECRET,
				grant_type: "client_credentials",
				scope: "public",
			};
			const request = await fetch(this.tokenBaseUrl.href, {
				method: "POST",
				headers: this.headers,
				data: JSON.stringify(body),
			});

			const response = await request.data;
			console.log(response);
		} catch (e) {
			console.error(e);
		}
	}

	async getBeatmapData() {
		try {
			const request = await fetch(`${this.baseUrl.href}/beatmaps/${this.id}`, {
				method: "GET",
				headers: this.headers,
			});

			console.log(request.data);
		} catch (e) {
			console.error(e);
		}
	}
}

const test = new osuAPI(
	new URL("https://osu.ppy.sh/beatmapsets/1619724#mania/3307091")
);

test.getOsuToken();
