import axios from "axios";
import { last } from "iter-ops";
import { rootCertificates } from "tls";
import { Barter, Craft, Item, ItemType, ProcessedItem, ProcessedRecipe, Recipe } from "../types";

const API = 'https://tarkov-tools.com/graphql';
const containedItemQuery = `{
	item {
		id
	}
	count
	quantity
}`;
let recipes: Recipe[] = [];
let recipesByItemId: Record<string, Recipe[]> = {};
let itemsById: Record<string, Item> = {};

export function getItemsByType(itemType: ItemType): Promise<Item[]> {
	return getData('itemsByType', [
		'id', 'name', 'shortName', 'iconLink', 'wikiLink', 'types', 'low24hPrice',
		'avg24hPrice', 'lastLowPrice', 'buyFor { source price }', 'sellFor { source price }'
	], 'type: ' + itemType);
}

export function refreshCache() {
	localStorage.removeItem('allItems');
	cacheAllItemCosts();
}

export async function cacheAllItemCosts() {
	itemsById = await ensureData('allItems', async () => {
		const items = await getItemsByType(ItemType.any);
		return processAllItems(items);
	});
};

export async function getCraftsByHideoutModule(completedHideout: string[]): Promise<Record<string, ProcessedRecipe[]>> {
	const crafts = recipes.filter(r => r.isCraft && completedHideout.includes(r.source));
	const craftsByHideout: Record<string, ProcessedRecipe[]> = {};
	crafts.forEach((craft) => {
		const processed: ProcessedRecipe = {
			...craft,
			productName: itemsById[craft.rewardItems[0].item.id].name,
			fleaCost: craft.requiredItems.reduce((acc, ri) => acc + itemsById[ri.item.id].avg24hPrice * ri.quantity, 0),
			fleaSell: craft.rewardItems.reduce((acc, ri) => acc + itemsById[ri.item.id].avg24hPrice * ri.quantity, 0),
			fleaSellFee: 0,
			traderSell: 0,
			traderName: "",
		};

		const hideoutMod = craft.source.replace(/ level \d/, '');
		if (!craftsByHideout[hideoutMod]) {
			craftsByHideout[hideoutMod] = [];
		}
		craftsByHideout[hideoutMod].push(processed);
	});
	return craftsByHideout;
};

export async function ensureStaticDataLoaded() {
	recipes = await ensureData('recipes', async () => {
		const crafts: Craft[] = await getData('crafts', ['source', 'duration', `requiredItems ${containedItemQuery}`, `rewardItems ${containedItemQuery}`]);
		const barters:Barter[] = await getData('barters', ['source', `requiredItems ${containedItemQuery}`, `rewardItems ${containedItemQuery}`]);

		return crafts.map((c) => ({
			...c,
			isCraft: true,
			lowestCost: 0,
		}))
		.concat(barters.map(b => ({
			...b,
			duration: 0,
			isCraft: false,
			lowestCost: 0,
		})));
	});

	recipesByItemId = await ensureData('recipesByItemId', async () => {
		const recipesByItemId: Record<string, Recipe[]> = {};
		recipes.forEach((r, i) => {
			r.rewardItems.forEach((ri) => {
				if (!recipesByItemId.hasOwnProperty(ri.item.id)) {
					recipesByItemId[ri.item.id] = [];
				}

				recipesByItemId[ri.item.id].push(r);
			})
		});
		return recipesByItemId; 
	});
}

function processAllItems(items: Item[]) {
	//let unprocessedItems = items;
	const itemsById: Record<string, ProcessedItem> = {};
	items.forEach(i => {
		itemsById[i.id] = {...i, lowestValue: 0};
	})

	/* *
	let lastCount = 0;
	while (unprocessedItems.length > 0 && lastCount != unprocessedItems.length)
	{
		lastCount = unprocessedItems.length;
		unprocessedItems = unprocessedItems.filter(ui => {
			let lowestCost = 0;
			let lowestRecipe = null;
			if (recipesByItemId.hasOwnProperty(ui.id)) {
				recipesByItemId[ui.id].forEach(recipe => {
					if (recipe.lowestCost == 0) {
						
					}
				});
			}

		});
	}
	/* */

	return itemsById;
}

async function ensureData<T>(storageKey: string, dataRetrieval: () => Promise<T>): Promise<T> {
	const cachedJson = localStorage.getItem(storageKey);
	if (cachedJson) {
		try {
			return JSON.parse(cachedJson);
		} catch (err) {
			//noop
		}
	}

	const data = await dataRetrieval();
	localStorage.setItem(storageKey, JSON.stringify(data));
	return data;
}

function getData(operation: string, fields: string[], queryParams: string = '') {
	const paramSection = queryParams === '' ? '' : `(${queryParams})`;
	const query = `{
		${operation}${paramSection} {
			${fields.join(' ')}
		}
	}`;
	const url = API + '?query=' + encodeURI(query);
	return axios.get(url, {
		headers: {
			"Content-Type": 'application/json'
		}
	}).then((response) => {
		return response.data.data[operation]
	});
}