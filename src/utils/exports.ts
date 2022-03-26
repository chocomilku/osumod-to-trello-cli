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

// dedicated file for interfaces that are used anywhere and some constants that will be used

/**
 * cards from osumod
 */
export interface cardsType {
	index?: number;
	title: string;
	artist: string;
	mapper: string;
	time: string;
	bpm: string;
	status?: string;
	modType?: string;
	url: string | undefined;
	img: string | undefined;
	comments?: Array<String | undefined>;
}

/**
 * statuses from osumod
 */
export type status =
	| "Pending"
	| "Rejected"
	| "Accepted"
	| "Finished"
	| "Nominated"
	| "Any";

export interface scraperOptions {
	archive?: boolean;
}

export type reqTypeType = "osumod Request" | "Self Pick";

export interface dataAny {
	[key: string]: any;
}

export interface configType {
	username: string;
	trello: {
		request: string;
		m4m: string;
		self_pick: string;
	};
}
