// API types
export type ItemPrice = {
	source: string;
	price: number;
	currency: string;
	requirements: {
		type: string;
		value: number;
	}[]
};

export type Item = {
	id: string;
	name: string;
	shortName: string;
	types: ItemType[];
	lastLowPrice: number;
	low24hPrice: number;
	avg24hPrice: number;
	buyFor: ItemPrice[]
	sellFor: ItemPrice[]
}

export enum ItemType {
	any = 'any',
	meds = 'meds',
	injectors = 'injectors',
	provisions = 'provisions',
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

export type ProcessedItem = {
	id: string;
	name: string;
	shortName: string;
	types: ItemType[];
	buyValue: number;
	sellValue: number;
};

export type ProcessedRecipe = Recipe & {
	productId: string;
	productName: string;
	fleaSell: number;
	fleaSellFee: number;
	fleaCost: number;
	traderSell: number;
	traderName: string;
};

export type MedConfig = {
	name: string;
	maxPoints: number;
	healsHealth: boolean;
	healsLightBleed: boolean;
	lightBleedPoints: number;
	healsHeavyBleed: boolean;
	heavyBleedPoints: number;
	healsFracture: boolean;
	fracturePoints: number;
};