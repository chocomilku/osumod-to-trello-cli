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

/**
 * custom error class for site related errors
 * @param message main message of the error
 * @param danger is it a real error that will break things?
 * @param description description of the error
 */
export class SiteError extends Error {
	public readonly message: string;
	public readonly danger: boolean;
	public readonly description: string | undefined;

	constructor(message: string, danger: boolean, description?: string) {
		super(message);
		this.message = message;
		this.danger = danger;
		this.description = description;
	}
}

export class TechnicalError extends SiteError {
	public readonly message: string;
	public readonly danger: boolean;
	public readonly description: string | undefined;

	constructor(message: string, danger: boolean, description?: string) {
		super(message, danger, description);
		this.message = message;
		this.danger = danger;
		this.description = description;
	}
}
