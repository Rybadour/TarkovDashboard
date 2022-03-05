// API types
export type Item = {
	id: string;
	name: string;
	shortName: string;
	types: ItemType[];
	buyFor: {
		source: string;
		price: number;
	}[]
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

export type Barter = {
	source: string;
	requiredItems: ContainedItem[];
	rewardItems: ContainedItem[];
};

// Dashboard specific types
export type Recipe = Craft & {
	isCraft: boolean;
	lowestCost: number;
};

export type ProcessedItem = Item & {
	lowestValue: number;
	lowestValueRecipe: Recipe;
};