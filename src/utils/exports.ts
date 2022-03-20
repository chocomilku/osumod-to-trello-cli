// dedicated file for interfaces that are used anywhere and some constants that will be used

export interface cardsType {
	index: number;
	title: string;
	artist: string;
	mapper: string;
	time: string;
	bpm: string;
	status: string;
	modType: string;
	url: string | undefined;
	img: string | undefined;
}

export type status =
	| "Pending"
	| "Rejected"
	| "Accepted"
	| "Finished"
	| "Nominated";
