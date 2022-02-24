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

export type ContainedItem = {
	item: Item;
	count: number;
	quantity: number;
};

export type Craft = {
	source: string;
	duration: number;
	requiredItems: ContainedItem[];
	rewardItems: ContainedItem[];
};