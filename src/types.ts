export type Item = {
	id: string;
	name: string;
	shortName: string;
	types: ItemType[];
}

export enum ItemType {
	any = 'any',
	meds = 'meds',
	injectors = 'injectors',
};