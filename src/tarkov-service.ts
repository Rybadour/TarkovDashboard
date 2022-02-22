import axios from "axios";
import { Item, ItemType } from "./types";

const API = 'https://tarkov-tools.com/graphql';
const itemFields = "id name shortName iconLink wikiLink types avg24hPrice lastLowPrice"

export function getItemsByType(itemType: ItemType): Promise<Item[]> {
	return getData(`{
		itemsByType(type:${itemType}) {
			${itemFields}
		}
	}`)
	.then((response) => {
		return response.data.data.itemsByType;
	})
}

export function getCrafts() {
	return getData(`{
		crafts {
			source duration
		}
	}`)
	.then((response) => {
		return response.data.data.crafts;
	});
}

function getData(query: string) {
	const url = API + '?query=' + encodeURI(query);
	return axios.get(url, {
		headers: {
			"Content-Type": 'application/json'
		}
	})
}