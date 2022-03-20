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
