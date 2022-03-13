import { Item, ProcessedItem, ProcessedRecipe } from "../types";
import { cacheAllItemCosts, ensureStaticDataLoaded, getItem, getRecipes } from "./tarkov-tools.service";
import { getCompletedHideout } from "./tarkov-tracker.service";

let completedHideout: string[];

const processedItems: Record<string, ProcessedItem> = {};

export async function buildCache() {
  ensureStaticDataLoaded();
  cacheAllItemCosts();
  completedHideout = await getCompletedHideout();
}

export async function getCraftsByHideoutModule(): Promise<Record<string, ProcessedRecipe[]>> {
	const crafts = getRecipes().filter(r => r.isCraft && completedHideout.includes(r.source));
	const craftsByHideout: Record<string, ProcessedRecipe[]> = {};
	crafts.forEach((craft) => {
		const processed: ProcessedRecipe = {
			...craft,
			productName: getItem(craft.rewardItems[0].item.id).name,
			fleaCost: craft.requiredItems.reduce(
        (acc, ri) => acc + getAndProcessItem(ri.item.id).buyValue * ri.quantity, 0),
			fleaSell: craft.rewardItems.reduce(
        (acc, ri) => acc + getAndProcessItem(ri.item.id).sellValue * ri.quantity, 0),
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

export function getAndProcessItem(id: string): ProcessedItem {
  return processItem(getItem(id));
}

export function processItem(item: Item):ProcessedItem {
  if (processedItems[item.id]) {
    return processedItems[item.id];
  }

  const processed = {
    ...item,
    buyValue: 0,
    sellValue: 0,
  };
  const buyValues = item.buyFor
    .filter((buyFor) => buyFor.source != 'fleaMarket' && (buyFor.currency === 'RUB' || buyFor.currency === null))
    .map(p => p.price);
  buyValues.push((item.avg24hPrice + item.lastLowPrice)/2);
  processed.buyValue = buyValues.sort((a, b) => a - b)[0];

  const sellValues = [];
  /* *
  const sellValues = item.sellFor
    .filter((sellFor) => sellFor.source != 'fleaMarket' && (sellFor.currency === 'RUB' || sellFor.currency === null))
    .map(p => p.price);
  /* */
  sellValues.push((item.avg24hPrice + item.lastLowPrice)/2);
  processed.sellValue = sellValues.sort((a, b) => b - a)[0];

  processedItems[item.id] = processed;
  return processed;
};