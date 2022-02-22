export type Item = {
	id: string;
	name: string;
	shortName: string;
	types: ItemType[];
}

export enum ItemType {
	meds = 'meds',
	injectors = 'injectors',
};