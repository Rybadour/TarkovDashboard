import axios from "axios";
import { Item, ItemType } from "./types";

const API = 'https://tarkov-tools.com/graphql';

export function getItemsByType(itemType: ItemType): Promise<Item[]> {
	return getData('itemsByType', [
		'id', 'name', 'shortName', 'iconLink', 'wikiLink', 'types',
		'avg24hPrice', 'lastLowPrice'
	]);
}

export function refreshCache() {
	localStorage.removeItem('allItems');
	cacheAllItemCosts();
}

export async function cacheAllItemCosts() {
	if (localStorage.getItem('allItems')) return;

	const items = await getItemsByType(ItemType.any);
	localStorage.setItem('allItems', JSON.stringify(
		items
	));
};

export async function ensureStaticDataLoaded() {
	if (localStorage.getItem('recipes')) return;

	const crafts = await getData('crafts', ['source', 'duration', 'requiredItems', 'rewardItems']);
	const barters = await getData('barters', ['source', 'requiredItems', 'rewardItems']);

	const recipes = {};
}

function getData(operation: string, fields: string[]) {
	const query = `{
		${operation} {
			${fields.join(' ')}
		}
	}`;
	const url = API + '?query=' + encodeURI(query);
	return axios.get(url, {
		headers: {
			"Content-Type": 'application/json'
		}
	}).then((response) => response.data.data[operation]);
}